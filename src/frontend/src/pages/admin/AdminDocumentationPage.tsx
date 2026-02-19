import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDocumentationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Admin Documentation</h1>
      <p className="text-muted-foreground mb-8">
        Complete guide to managing your SMART HAITI website
      </p>

      <Card>
        <CardHeader>
          <CardTitle>How to Use the Admin Panel</CardTitle>
          <CardDescription>
            Learn how to manage all aspects of your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="authentication">
              <AccordionTrigger>Admin Authentication</AccordionTrigger>
              <AccordionContent className="space-y-3 text-sm">
                <p>
                  The SMART HAITI website uses a secure username and password authentication system for administrators.
                </p>
                <div className="space-y-2">
                  <p className="font-semibold">First Time Setup:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>When you first access the admin login page, you'll be prompted to create your admin credentials</li>
                    <li>Choose a username (minimum 3 characters) and a strong password (minimum 8 characters)</li>
                    <li>After creating your credentials, you can log in immediately</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold">Logging In:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Click the "Admin Login" button in the website header</li>
                    <li>Enter your username and password</li>
                    <li>Your session will remain active until you log out or close your browser</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold">Changing Credentials:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Go to Settings in the admin panel</li>
                    <li>Use the "Admin Credentials" section to update your username and password</li>
                    <li>You'll need to log in again after changing your credentials</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="gallery">
              <AccordionTrigger>Managing Gallery Images</AccordionTrigger>
              <AccordionContent className="space-y-3 text-sm">
                <p>
                  The Gallery section displays photos from your organization's activities and events.
                </p>
                <div className="space-y-2">
                  <p className="font-semibold">Adding Images:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Navigate to Gallery in the admin panel</li>
                    <li>Fill in the title, description, school name, and category</li>
                    <li>Select an image file from your computer</li>
                    <li>Click "Add Image" to upload</li>
                    <li>Large images are automatically optimized for web display</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold">Deleting Images:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Find the image you want to remove in the gallery list</li>
                    <li>Click the "Delete" button</li>
                    <li>Confirm the deletion when prompted</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="videos">
              <AccordionTrigger>Managing Videos</AccordionTrigger>
              <AccordionContent className="space-y-3 text-sm">
                <p>
                  Add YouTube or Vimeo videos to showcase your organization's work and impact.
                </p>
                <div className="space-y-2">
                  <p className="font-semibold">Adding Videos:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Go to Videos in the admin panel</li>
                    <li>Enter the video title and description</li>
                    <li>Paste the full YouTube or Vimeo URL (e.g., https://www.youtube.com/watch?v=...)</li>
                    <li>Optionally upload a custom thumbnail image</li>
                    <li>Click "Add Video" to save</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold">Supported Platforms:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>YouTube (standard and shortened youtu.be links)</li>
                    <li>Vimeo</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="blog">
              <AccordionTrigger>Managing Blog Posts</AccordionTrigger>
              <AccordionContent className="space-y-3 text-sm">
                <p>
                  Share news, updates, and stories through your blog.
                </p>
                <div className="space-y-2">
                  <p className="font-semibold">Creating Posts:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Navigate to Blog in the admin panel</li>
                    <li>Enter the post title, author name, and date</li>
                    <li>Write your content using the rich text editor</li>
                    <li>Add tags to categorize your post (comma-separated)</li>
                    <li>Upload a featured image to appear at the top of the post</li>
                    <li>Click "Add Blog Post" to publish</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold">Editing and Deleting:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Find the post in your blog list</li>
                    <li>Click "Delete" to remove a post permanently</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="events">
              <AccordionTrigger>Managing Events</AccordionTrigger>
              <AccordionContent className="space-y-3 text-sm">
                <p>
                  Keep your community informed about upcoming conferences, workshops, and activities.
                </p>
                <div className="space-y-2">
                  <p className="font-semibold">Adding Events:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Go to Events in the admin panel</li>
                    <li>Enter the event title, date, time, and location</li>
                    <li>Write a detailed description of the event</li>
                    <li>Upload an event image or poster</li>
                    <li>Click "Add Event" to publish</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold">Best Practices:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Include clear date and time information</li>
                    <li>Provide specific location details</li>
                    <li>Update or remove past events regularly</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="team">
              <AccordionTrigger>Managing Team Members</AccordionTrigger>
              <AccordionContent className="space-y-3 text-sm">
                <p>
                  Showcase your mentors, staff, and volunteers who make your organization successful.
                </p>
                <div className="space-y-2">
                  <p className="font-semibold">Adding Team Members:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Navigate to Team in the admin panel</li>
                    <li>Enter the person's name and role</li>
                    <li>Write a brief bio highlighting their experience and contributions</li>
                    <li>Upload a professional photo</li>
                    <li>Click "Add Team Member" to save</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="sponsors">
              <AccordionTrigger>Managing Sponsors and Partners</AccordionTrigger>
              <AccordionContent className="space-y-3 text-sm">
                <p>
                  Recognize organizations and individuals who support your mission.
                </p>
                <div className="space-y-2">
                  <p className="font-semibold">Adding Sponsors:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Go to Sponsors in the admin panel</li>
                    <li>Enter the sponsor's name and description</li>
                    <li>Add their website URL</li>
                    <li>Upload their logo</li>
                    <li>Click "Add Sponsor" to save</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="about">
              <AccordionTrigger>Managing About Sections</AccordionTrigger>
              <AccordionContent className="space-y-3 text-sm">
                <p>
                  Create multiple sections to tell your organization's story on the About page.
                </p>
                <div className="space-y-2">
                  <p className="font-semibold">Adding Sections:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Navigate to About in the admin panel</li>
                    <li>Enter a section title (e.g., "Our Mission", "Our History")</li>
                    <li>Write the content for that section</li>
                    <li>Optionally add an image to accompany the text</li>
                    <li>Click "Add Section" to save</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="contact">
              <AccordionTrigger>Viewing Contact Submissions</AccordionTrigger>
              <AccordionContent className="space-y-3 text-sm">
                <p>
                  Review messages submitted through your website's contact form.
                </p>
                <div className="space-y-2">
                  <p className="font-semibold">Managing Submissions:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Go to Contact Submissions in the admin panel</li>
                    <li>View all messages with sender details, subject, and message content</li>
                    <li>Delete messages after you've responded or archived them</li>
                    <li>Check regularly to ensure timely responses to inquiries</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="settings">
              <AccordionTrigger>Site Settings</AccordionTrigger>
              <AccordionContent className="space-y-3 text-sm">
                <p>
                  Customize your website's appearance and contact information.
                </p>
                <div className="space-y-2">
                  <p className="font-semibold">WhatsApp Contact:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Enter your WhatsApp number with country code (digits only, no + symbol)</li>
                    <li>Example: 15095551234 for a US number</li>
                    <li>A floating WhatsApp button will appear on all pages</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold">Logo and Hero Background:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Upload a custom logo to replace the default SMART HAITI logo</li>
                    <li>Upload a hero background image for the homepage</li>
                    <li>Images are automatically optimized for fast loading</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="deployment">
              <AccordionTrigger>Deploying Your Website</AccordionTrigger>
              <AccordionContent className="space-y-4 text-sm">
                <p className="font-semibold text-base">Free Deployment on Internet Computer Blockchain</p>
                <p>
                  Your SMART HAITI website is already hosted on the Internet Computer blockchain, which provides free, decentralized hosting with no monthly fees!
                </p>

                <div className="space-y-2">
                  <p className="font-semibold">What is Internet Computer?</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>A blockchain network that hosts websites and applications</li>
                    <li>Provides free hosting with minimal maintenance costs</li>
                    <li>Offers high security and reliability</li>
                    <li>No traditional web hosting fees required</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold">Your Website is Already Live!</p>
                  <p>
                    The website you're managing right now is deployed on the Internet Computer. You can access it through:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>The default .icp.page domain provided by Internet Computer</li>
                    <li>A custom domain that you can configure (see below)</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold">Getting a Free .icp Domain:</p>
                  <ol className="list-decimal pl-6 space-y-1">
                    <li>Visit the Internet Computer naming service</li>
                    <li>Search for an available .icp domain name (e.g., smarthaiti.icp)</li>
                    <li>Register the domain (requires a small one-time fee in ICP tokens)</li>
                    <li>Link the domain to your canister ID</li>
                    <li>Your website will be accessible at yourname.icp</li>
                  </ol>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold">Using a Custom Domain (smarthaiti.org, etc.):</p>
                  <ol className="list-decimal pl-6 space-y-1">
                    <li>Purchase a domain from any domain registrar (GoDaddy, Namecheap, etc.)</li>
                    <li>In your domain's DNS settings, add a CNAME record pointing to your canister's .icp.page URL</li>
                    <li>Configure the custom domain in your canister settings</li>
                    <li>Wait for DNS propagation (usually 24-48 hours)</li>
                    <li>Your website will be accessible at your custom domain</li>
                  </ol>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold">Deployment Costs:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Hosting:</strong> FREE on Internet Computer (no monthly fees)</li>
                    <li><strong>Maintenance:</strong> Minimal "cycles" cost (pennies per month)</li>
                    <li><strong>.icp domain:</strong> Small one-time registration fee</li>
                    <li><strong>Custom domain:</strong> Annual fee from domain registrar (typically $10-15/year)</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold">Updating Your Website:</p>
                  <p>
                    All changes you make through this admin panel are automatically saved and immediately visible on your live website. No manual deployment needed!
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold">Technical Details (for developers):</p>
                  <div className="bg-muted p-3 rounded-lg font-mono text-xs space-y-2">
                    <p># Check your canister ID</p>
                    <p>dfx canister id frontend</p>
                    <p className="mt-2"># Deploy updates (if needed)</p>
                    <p>dfx deploy</p>
                    <p className="mt-2"># Your website URL format:</p>
                    <p>https://[canister-id].icp0.io</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold">Troubleshooting:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>If your website is not loading, check your canister's cycle balance</li>
                    <li>Ensure your canister is running: <code className="bg-muted px-1 rounded">dfx canister status frontend</code></li>
                    <li>For custom domain issues, verify DNS settings are correct</li>
                    <li>Contact Internet Computer support for technical assistance</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="seo">
              <AccordionTrigger>SEO Optimization Guide</AccordionTrigger>
              <AccordionContent className="space-y-4 text-sm">
                <p className="font-semibold text-base">Making Your Website Visible on Search Engines</p>
                <p>
                  Search Engine Optimization (SEO) helps people find your website when they search for "Smart Haiti" or related terms on Google and other search engines.
                </p>

                <div className="space-y-2">
                  <p className="font-semibold">What is SEO?</p>
                  <p>
                    SEO is the practice of optimizing your website so search engines can understand and rank it higher in search results. When someone types "Smart Haiti" or "Haiti education NGO" into Google, good SEO helps your website appear at the top of the results.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold">Your Website Already Has SEO Optimization!</p>
                  <p>
                    The SMART HAITI website includes optimized meta tags and structured data that help search engines understand your content:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Title tag optimized for "SMART HAITI" searches</li>
                    <li>Meta description explaining your organization's mission</li>
                    <li>Keywords including "Smart Haiti", "Haiti education", "Haiti NGO"</li>
                    <li>Open Graph tags for social media sharing</li>
                    <li>Mobile-friendly responsive design</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold">How to Improve Your Search Rankings:</p>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>
                      <strong>Create Quality Content Regularly:</strong>
                      <ul className="list-disc pl-6 mt-1">
                        <li>Post blog articles about your programs and impact</li>
                        <li>Update your events calendar frequently</li>
                        <li>Add new photos and videos regularly</li>
                        <li>Fresh content signals to search engines that your site is active</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Use Relevant Keywords Naturally:</strong>
                      <ul className="list-disc pl-6 mt-1">
                        <li>Include "SMART HAITI" in your blog posts and page content</li>
                        <li>Use related terms like "Haiti education", "student mentorship", "Haiti NGO"</li>
                        <li>Don't overuse keywords - write naturally for human readers</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Get Quality Backlinks:</strong>
                      <ul className="list-disc pl-6 mt-1">
                        <li>Ask partner organizations to link to your website</li>
                        <li>Submit your website to NGO directories</li>
                        <li>Share your website on social media platforms</li>
                        <li>Links from reputable sites boost your search ranking</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Optimize Images:</strong>
                      <ul className="list-disc pl-6 mt-1">
                        <li>Use descriptive file names (e.g., "smart-haiti-conference-2024.jpg")</li>
                        <li>Add descriptive titles and descriptions to gallery images</li>
                        <li>Keep image file sizes reasonable for fast loading</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Maintain Fast Page Load Times:</strong>
                      <ul className="list-disc pl-6 mt-1">
                        <li>Your website is already optimized for speed</li>
                        <li>Avoid uploading extremely large image files</li>
                        <li>Fast websites rank higher in search results</li>
                      </ul>
                    </li>
                  </ol>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold">Social Media and SEO:</p>
                  <p>
                    Your website includes Open Graph tags that make links look great when shared on social media:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Share your website on Facebook, Twitter, LinkedIn, and Instagram</li>
                    <li>Links will display with your logo and description</li>
                    <li>Social signals can indirectly improve search rankings</li>
                    <li>More visitors = better search engine visibility</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold">Monitoring Your Search Performance:</p>
                  <ol className="list-decimal pl-6 space-y-1">
                    <li>Set up Google Search Console (free tool from Google)</li>
                    <li>Submit your website's sitemap</li>
                    <li>Monitor which search terms bring visitors to your site</li>
                    <li>Track your search ranking improvements over time</li>
                    <li>Identify and fix any technical issues Google finds</li>
                  </ol>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold">Common SEO Mistakes to Avoid:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Keyword stuffing:</strong> Don't repeat "Smart Haiti" unnaturally in every sentence</li>
                    <li><strong>Duplicate content:</strong> Write unique descriptions for each page and blog post</li>
                    <li><strong>Ignoring mobile users:</strong> Your site is mobile-friendly, keep it that way</li>
                    <li><strong>Slow loading times:</strong> Optimize large images before uploading</li>
                    <li><strong>Broken links:</strong> Regularly check that all links work correctly</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold">Timeline for SEO Results:</p>
                  <p>
                    SEO is a long-term strategy. You may see initial improvements in 2-3 months, but significant results typically take 6-12 months of consistent effort. Be patient and keep creating quality content!
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold">Free SEO Tools:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Google Search Console:</strong> Monitor search performance</li>
                    <li><strong>Google Analytics:</strong> Track website visitors and behavior</li>
                    <li><strong>Google My Business:</strong> Appear in local search results</li>
                    <li><strong>Bing Webmaster Tools:</strong> Optimize for Bing search engine</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
