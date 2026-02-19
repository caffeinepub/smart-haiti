import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Video {
    id: string;
    url: string;
    title: string;
    thumbnail?: ExternalBlob;
    description: string;
}
export interface BlogPost {
    id: string;
    title: string;
    content: string;
    date: string;
    featuredImage?: ExternalBlob;
    tags: Array<string>;
    author: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ContactSubmission {
    id: string;
    subject: string;
    date: string;
    name: string;
    email: string;
    message: string;
}
export interface Sponsor {
    id: string;
    logo?: ExternalBlob;
    name: string;
    description: string;
    website: string;
}
export interface Event {
    id: string;
    title: string;
    date: string;
    time: string;
    description: string;
    image?: ExternalBlob;
    location: string;
}
export interface AboutSection {
    id: string;
    title: string;
    content: string;
    image?: ExternalBlob;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface SiteSettings {
    logo?: ExternalBlob;
    whatsappNumber: string;
    heroBackground?: ExternalBlob;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface PublicSiteSettings {
    logo?: ExternalBlob;
    heroBackground?: ExternalBlob;
}
export interface GalleryImage {
    id: string;
    title: string;
    school: string;
    description: string;
    category: string;
    image: ExternalBlob;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface TeamMember {
    id: string;
    bio: string;
    name: string;
    role: string;
    photo?: ExternalBlob;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface UserProfile {
    name: string;
    email?: string;
    organization?: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAboutSection(section: AboutSection): Promise<void>;
    addBlogPost(post: BlogPost): Promise<void>;
    addContactSubmission(submission: ContactSubmission): Promise<void>;
    addEvent(event: Event): Promise<void>;
    addGalleryImage(image: GalleryImage): Promise<void>;
    addSponsor(sponsor: Sponsor): Promise<void>;
    addTeamMember(member: TeamMember): Promise<void>;
    addVideo(video: Video): Promise<void>;
    adminLogin(username: string, password: string): Promise<string>;
    adminLogout(sessionToken: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    deleteAboutSection(sectionId: string): Promise<void>;
    deleteBlogPost(postId: string): Promise<void>;
    deleteContactSubmission(submissionId: string): Promise<void>;
    deleteEvent(eventId: string): Promise<void>;
    deleteGalleryImage(imageId: string): Promise<void>;
    deleteSponsor(sponsorId: string): Promise<void>;
    deleteTeamMember(memberId: string): Promise<void>;
    deleteVideo(videoId: string): Promise<void>;
    getAllAboutSections(): Promise<Array<AboutSection>>;
    getBlogPosts(): Promise<Array<BlogPost>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactSubmissions(): Promise<Array<ContactSubmission>>;
    getEvents(): Promise<Array<Event>>;
    getGalleryImages(): Promise<Array<GalleryImage>>;
    getPublicSiteSettings(): Promise<PublicSiteSettings>;
    getSiteSettings(): Promise<SiteSettings>;
    getSponsors(): Promise<Array<Sponsor>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getTeamMembers(): Promise<Array<TeamMember>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVideos(): Promise<Array<Video>>;
    getWhatsAppLink(): Promise<string>;
    isAdminConfigured(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setAdminCredentials(username: string, password: string): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateAboutSection(section: AboutSection): Promise<void>;
    updateBlogPost(post: BlogPost): Promise<void>;
    updateEvent(event: Event): Promise<void>;
    updateGalleryImage(image: GalleryImage): Promise<void>;
    updateSiteSettings(settings: SiteSettings): Promise<void>;
    updateSponsor(sponsor: Sponsor): Promise<void>;
    updateTeamMember(member: TeamMember): Promise<void>;
    updateVideo(video: Video): Promise<void>;
    verifyAdminSession(sessionToken: string): Promise<boolean>;
}
