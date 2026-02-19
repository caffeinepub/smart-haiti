import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Blob "mo:core/Blob";
import Time "mo:core/Time";
import OutCall "http-outcalls/outcall";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Stripe "stripe/stripe";

actor {
  // Access control for role management
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Username/Password Authentication System
  type AdminCredentials = {
    username : Text;
    passwordHash : Blob;
  };

  type SessionToken = {
    token : Text;
    principal : Principal;
    expiresAt : Int;
  };

  var adminCredentials : ?AdminCredentials = null;
  let activeSessions = Map.empty<Text, SessionToken>();

  // Simple hash function (in production, use proper cryptographic hashing)
  func hashPassword(password : Text) : Blob {
    password.encodeUtf8();
  };

  func verifyPassword(password : Text, hash : Blob) : Bool {
    let inputHash = hashPassword(password);
    Blob.equal(inputHash, hash);
  };

  func generateSessionToken(principal : Principal) : Text {
    let timestamp = Int.toText(Time.now());
    let principalText = principal.toText();
    principalText # "-" # timestamp;
  };

  public query ({ caller }) func isAdminConfigured() : async Bool {
    adminCredentials != null;
  };

  public shared ({ caller }) func setAdminCredentials(username : Text, password : Text) : async () {
    // Only allow setting credentials if none exist OR if caller is already an admin
    switch (adminCredentials) {
      case (null) {
        // First time setup - anyone can set initial admin
        if (username.size() < 3) {
          Runtime.trap("Username must be at least 3 characters");
        };
        if (password.size() < 8) {
          Runtime.trap("Password must be at least 8 characters");
        };
        adminCredentials := ?{
          username = username;
          passwordHash = hashPassword(password);
        };
        // Grant admin role to the caller
        AccessControl.assignRole(accessControlState, caller, caller, #admin);
      };
      case (?_) {
        // Credentials already exist - only admin can change
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
          Runtime.trap("Unauthorized: Only admins can change credentials");
        };
        if (username.size() < 3) {
          Runtime.trap("Username must be at least 3 characters");
        };
        if (password.size() < 8) {
          Runtime.trap("Password must be at least 8 characters");
        };
        adminCredentials := ?{
          username = username;
          passwordHash = hashPassword(password);
        };
      };
    };
  };

  public shared ({ caller }) func adminLogin(username : Text, password : Text) : async Text {
    switch (adminCredentials) {
      case (null) {
        Runtime.trap("Admin credentials not configured");
      };
      case (?creds) {
        if (creds.username != username) {
          Runtime.trap("Invalid username or password");
        };
        if (not verifyPassword(password, creds.passwordHash)) {
          Runtime.trap("Invalid username or password");
        };

        // Grant admin role if not already granted
        if (not AccessControl.isAdmin(accessControlState, caller)) {
          AccessControl.assignRole(accessControlState, caller, caller, #admin);
        };

        // Create session token
        let token = generateSessionToken(caller);
        let session : SessionToken = {
          token = token;
          principal = caller;
          expiresAt = Time.now() + 24 * 60 * 60 * 1_000_000_000;
        };
        activeSessions.add(token, session);

        return token;
      };
    };
  };

  public shared ({ caller }) func adminLogout(sessionToken : Text) : async () {
    switch (activeSessions.get(sessionToken)) {
      case (null) { /* Session doesn't exist, nothing to do */ };
      case (?session) {
        if (session.principal == caller) {
          activeSessions.remove(sessionToken);
        };
      };
    };
  };

  public query ({ caller }) func verifyAdminSession(sessionToken : Text) : async Bool {
    switch (activeSessions.get(sessionToken)) {
      case (null) { false };
      case (?session) {
        session.principal == caller and session.expiresAt > Time.now();
      };
    };
  };

  // Persistent storage for blobs and files.
  include MixinStorage();

  // Site-wide settings
  public type SiteSettings = {
    whatsappNumber : Text;
    logo : ?Storage.ExternalBlob;
    heroBackground : ?Storage.ExternalBlob;
  };

  public type PublicSiteSettings = {
    logo : ?Storage.ExternalBlob;
    heroBackground : ?Storage.ExternalBlob;
  };

  var siteSettings : SiteSettings = {
    whatsappNumber = "";
    logo = null;
    heroBackground = null;
  };

  public query func getPublicSiteSettings() : async PublicSiteSettings {
    {
      logo = siteSettings.logo;
      heroBackground = siteSettings.heroBackground;
    };
  };

  public query ({ caller }) func getSiteSettings() : async SiteSettings {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access site settings");
    };
    siteSettings;
  };

  public shared ({ caller }) func updateSiteSettings(settings : SiteSettings) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update site settings");
    };

    if (settings.whatsappNumber.size() < 11 or settings.whatsappNumber.size() > 15) {
      Runtime.trap("Invalid WhatsApp number, must be 11-15 digits");
    };

    let isDigitsOnly = settings.whatsappNumber.chars().all(
      func(c) {
        c.toNat32() >= 48 and c.toNat32() <= 57;
      }
    );

    if (not isDigitsOnly) {
      Runtime.trap("Invalid WhatsApp number, must be digits only, no + symbol");
    };

    siteSettings := settings;
  };

  public query func getWhatsAppLink() : async Text {
    "https://wa.me/" # siteSettings.whatsappNumber;
  };

  public type UserProfile = {
    name : Text;
    email : ?Text;
    organization : ?Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  type AboutSection = {
    id : Text;
    title : Text;
    content : Text;
    image : ?Storage.ExternalBlob;
  };

  let aboutSections = Map.empty<Text, AboutSection>();

  public query func getAllAboutSections() : async [AboutSection] {
    aboutSections.values().toArray();
  };

  public shared ({ caller }) func addAboutSection(section : AboutSection) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add about sections");
    };
    aboutSections.add(section.id, section);
  };

  public shared ({ caller }) func updateAboutSection(section : AboutSection) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update about sections");
    };
    aboutSections.add(section.id, section);
  };

  public shared ({ caller }) func deleteAboutSection(sectionId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete about sections");
    };
    aboutSections.remove(sectionId);
  };

  type TeamMember = {
    id : Text;
    name : Text;
    role : Text;
    bio : Text;
    photo : ?Storage.ExternalBlob;
  };

  let teamMembers = Map.empty<Text, TeamMember>();

  public query func getTeamMembers() : async [TeamMember] {
    teamMembers.values().toArray();
  };

  public shared ({ caller }) func addTeamMember(member : TeamMember) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add team members");
    };
    teamMembers.add(member.id, member);
  };

  public shared ({ caller }) func updateTeamMember(member : TeamMember) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update team members");
    };
    teamMembers.add(member.id, member);
  };

  public shared ({ caller }) func deleteTeamMember(memberId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete team members");
    };
    teamMembers.remove(memberId);
  };

  type Sponsor = {
    id : Text;
    name : Text;
    description : Text;
    logo : ?Storage.ExternalBlob;
    website : Text;
  };

  let sponsors = Map.empty<Text, Sponsor>();

  public query func getSponsors() : async [Sponsor] {
    sponsors.values().toArray();
  };

  public shared ({ caller }) func addSponsor(sponsor : Sponsor) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add sponsors");
    };
    sponsors.add(sponsor.id, sponsor);
  };

  public shared ({ caller }) func updateSponsor(sponsor : Sponsor) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update sponsors");
    };
    sponsors.add(sponsor.id, sponsor);
  };

  public shared ({ caller }) func deleteSponsor(sponsorId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete sponsors");
    };
    sponsors.remove(sponsorId);
  };

  type Event = {
    id : Text;
    title : Text;
    description : Text;
    date : Text;
    time : Text;
    location : Text;
    image : ?Storage.ExternalBlob;
  };

  let events = Map.empty<Text, Event>();

  public query func getEvents() : async [Event] {
    events.values().toArray();
  };

  public shared ({ caller }) func addEvent(event : Event) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add events");
    };
    events.add(event.id, event);
  };

  public shared ({ caller }) func updateEvent(event : Event) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update events");
    };
    events.add(event.id, event);
  };

  public shared ({ caller }) func deleteEvent(eventId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete events");
    };
    events.remove(eventId);
  };

  type BlogPost = {
    id : Text;
    title : Text;
    author : Text;
    date : Text;
    content : Text;
    featuredImage : ?Storage.ExternalBlob;
    tags : [Text];
  };

  let blogPosts = Map.empty<Text, BlogPost>();

  public query func getBlogPosts() : async [BlogPost] {
    blogPosts.values().toArray();
  };

  public shared ({ caller }) func addBlogPost(post : BlogPost) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add blog posts");
    };
    blogPosts.add(post.id, post);
  };

  public shared ({ caller }) func updateBlogPost(post : BlogPost) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update blog posts");
    };
    blogPosts.add(post.id, post);
  };

  public shared ({ caller }) func deleteBlogPost(postId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete blog posts");
    };
    blogPosts.remove(postId);
  };

  type ContactSubmission = {
    id : Text;
    name : Text;
    email : Text;
    subject : Text;
    message : Text;
    date : Text;
  };

  let contactSubmissions = Map.empty<Text, ContactSubmission>();

  public query ({ caller }) func getContactSubmissions() : async [ContactSubmission] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view contact submissions");
    };
    contactSubmissions.values().toArray();
  };

  public shared ({ caller }) func addContactSubmission(submission : ContactSubmission) : async () {
    // Public endpoint - anyone can submit contact forms
    // Validate input to prevent abuse
    if (submission.name.size() == 0 or submission.name.size() > 100) {
      Runtime.trap("Invalid name length");
    };
    if (submission.email.size() == 0 or submission.email.size() > 200) {
      Runtime.trap("Invalid email length");
    };
    if (submission.subject.size() == 0 or submission.subject.size() > 200) {
      Runtime.trap("Invalid subject length");
    };
    if (submission.message.size() == 0 or submission.message.size() > 5000) {
      Runtime.trap("Invalid message length");
    };
    contactSubmissions.add(submission.id, submission);
  };

  public shared ({ caller }) func deleteContactSubmission(submissionId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete contact submissions");
    };
    contactSubmissions.remove(submissionId);
  };

  type GalleryImage = {
    id : Text;
    title : Text;
    description : Text;
    school : Text;
    category : Text;
    image : Storage.ExternalBlob;
  };

  let galleryImages = Map.empty<Text, GalleryImage>();

  public query func getGalleryImages() : async [GalleryImage] {
    galleryImages.values().toArray();
  };

  public shared ({ caller }) func addGalleryImage(image : GalleryImage) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add gallery images");
    };
    galleryImages.add(image.id, image);
  };

  public shared ({ caller }) func updateGalleryImage(image : GalleryImage) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update gallery images");
    };
    galleryImages.add(image.id, image);
  };

  public shared ({ caller }) func deleteGalleryImage(imageId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete gallery images");
    };
    galleryImages.remove(imageId);
  };

  type Video = {
    id : Text;
    title : Text;
    description : Text;
    url : Text;
    thumbnail : ?Storage.ExternalBlob;
  };

  let videos = Map.empty<Text, Video>();

  public query func getVideos() : async [Video] {
    videos.values().toArray();
  };

  public shared ({ caller }) func addVideo(video : Video) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add videos");
    };
    videos.add(video.id, video);
  };

  public shared ({ caller }) func updateVideo(video : Video) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update videos");
    };
    videos.add(video.id, video);
  };

  public shared ({ caller }) func deleteVideo(videoId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete videos");
    };
    videos.remove(videoId);
  };

  // Stripe integration
  var stripeConfig : ?Stripe.StripeConfiguration = null;

  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    stripeConfig := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?config) { config };
    };
  };

  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check donation status");
    };
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create donations");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };
};
