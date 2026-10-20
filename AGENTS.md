# Workspace Rules & Quality Guidelines
Read, Analyze, Remember, Think, Understand, Build Reason, Build Logic, Think UI, Think UX, Apply, Analyze, Evaluate, Create, Strategize, Plan, and Execute. Think with the end user in mind and always prioritize security, accuracy, and efficiency in your code. 

# Dev environment tips, a sample of rules for you to Optimize for our own use case, then adapt it

- Use `pnpm dlx turbo run where <project_name>` to jump to a package instead of scanning with `ls`.
- Run `pnpm install --filter <project_name>` to add the package to your workspace so Vite, ESLint, and TypeScript can see it.
- Use `pnpm create vite@latest <project_name> -- --template react-ts` to spin up a new React + Vite package with TypeScript checks ready.
- Check the name field inside each package's package.json to confirm the right name—skip the top-level one.

## Testing instructions
- Find the CI plan in the .github/workflows folder.
- Run `pnpm turbo run test --filter <project_name>` to run every check defined for that package.
- From the package root you can just call `pnpm test`. The commit should pass all tests before you merge.
- To focus on one step, add the Vitest pattern: `pnpm vitest run -t "<test name>"`.
- Fix any test or type errors until the whole suite is green.
- After moving files or changing imports, run `pnpm lint --filter <project_name>` to be sure ESLint and TypeScript rules still pass.
- Add or update tests for the code you change, even if nobody asked.

## PR instructions
- Title format: [<project_name>] <Title>
- Always run `pnpm lint` and `pnpm test` before committing.

## Accessibility & Text Contrast Rules (MANDATORY)

All screens, pages, modals, tables, and components across the FingerMobile platform must strictly adhere to the high-contrast color hierarchy on light/white backgrounds:

1. **Titles & Primary Headings**: Always use `text-slate-900` or `text-gray-900` (`#0f172a`, 15.9:1 AAA contrast). Never use blanket `text-black`.
2. **Table Cells, Labels & Core Data**: Use `text-slate-800` or `text-gray-800` (`#1e293b`, 8.8:1 AAA contrast).
3. **Descriptions, Captions & Notes**: Use `text-slate-700` or `text-gray-700` (`#334155`, >7:1 AAA contrast). NEVER use `text-gray-400`, `text-slate-400`, or raw `text-muted-foreground` directly on white cards or light backgrounds.
4. **Separators & Inactive Icons**: Use `text-slate-500` (4.6:1 AA contrast).
5. **Form Inputs**: Every input/textarea/select on white backgrounds must have explicit `text-slate-900 font-bold border border-slate-300 bg-white`.
6. **Card & Table Borders**: Use `border-slate-300` or `border-slate-200` to prevent cards and tables from dissolving into white canvas.
7. **Badges on Light Tints**: Use deep 950 text shades on `*-100` backgrounds (e.g. `bg-emerald-100 text-emerald-950 border border-emerald-400`).

Reference component: [EnterpriseFinancialEcosystemConsole.tsx](file:///Users/user/Documents/FingerMobile%20Protocol%20Communication/FingerMobile%20Protocol/apps/frontend-main/src/components/dashboard/EnterpriseFinancialEcosystemConsole.tsx)
Detailed rule: [.agents/rules/text-contrast-hierarchy.md](file:///Users/user/Documents/FingerMobile%20Protocol%20Communication/.agents/rules/text-contrast-hierarchy.md)


Screen/Page Builds: Summarize recent activity on my assigned Linear issues. Highlight decisions, blockers, changed priorities, and anything waiting for your input then you decide the next action to take., or i ask for clarification or suggestion,.

A modern website serves as the digital foundation for your brand, acting as your company’s 24/7 salesperson and its most valuable marketing asset. In an era of high digital expectations, a site must be strategically planned to turn visitors into paying customers. Our article will help you build a structured website design checklist, from strategic architecture to conversion optimization. It’s time to make sure your online presence is fast, secure, and optimized to guide visitors toward taking action.

Strategic structure and information architecture
Every element of your website must work together. So, what basics should you know to communicate value and lead users smoothly?

Clear value proposition placement
Visitors make snap judgments about whether your site is relevant to their needs. If they can’t understand your offering, they may switch to a rival that explains things better. The website should immediately demonstrate your role, your offerings, and the audience you target.

Your unique value proposition (UVP) should get noticed right away through visual communication. The headline is a key element here. It must clarify the question visitors are silently asking: “Why should I care?” Position this message above the fold where it’s impossible to miss, and support it with a brief subheading that adds context without overwhelming the reader.

Intent-driven page hierarchy
If you organize pages into a logical hierarchy that moves users through the stages of Awareness, Consideration, and Decision, you can guide their eyes naturally from the main headline to supporting content and finally to a call-to-action.

Think about how customers discover and evaluate your offering. A person at the awareness stage requires educational content that frames their problem. During consideration, the user needs detailed product information and comparisons. At the decision stage, a person requires clear pricing, testimonials, and an easy path to purchase.

Scalable navigation models
Modern navigation should allow users to access the information they want in no more than three clicks. To keep cognitive effort low, limit your primary menu to 5–7 main items, each with a descriptive label. For international growth, consider scalable models like subdirectories or subdomains, as they accommodate multiple languages and regional variations.

Mega-menus work well for large e-commerce or content-heavy sites by displaying many subpages at once. Vertical sidebars suit B2B, healthcare, and SaaS platforms because they make adding new categories easy. Hybrid and hub-and-spoke structures support growing content while keeping navigation organized and easy to follow. All in all, your navigation should answer “what can I do here?” at a glance, without requiring visitors to guess or explore randomly.

User experience fundamentals that reduce friction
Great user experience isn’t about reinventing the web — it’s about making interactions simple, familiar, and easy to follow. Let’s take a look at how exactly you can do that.

Predictable interaction patterns
Users feel most comfortable when a website follows familiar interaction patterns and employs plain, recognizable language for labels like “Shop,” “Products,” or “Support.” Business website UX should be built around how customers search rather than how an internal business team organizes its inventory.

When links don’t look like links, when clicking a logo doesn’t return visitors to the homepage, or when shopping cart icons lead somewhere unexpected, you’re creating friction that drives people away. Predictability builds confidence. Visitors shouldn’t have to learn your unique system — they should be able to apply knowledge from thousands of other websites they’ve used successfully.

Feedback and system response clarity
Incorporating tools such as heatmaps and session recordings allows you to see exactly where users hesitate or drop off, providing the data needed to fix friction points. If you monitor site performance from day one (including uptime and error tracking), it ensures that technical issues are addressed before they frustrate real customers.

Website usability improves dramatically when you understand actual user behavior rather than assuming how people interact with your site. Incorporating website feedback tools alongside heatmaps and session recordings gives you direct input from users, helping you validate design decisions.

Cognitive load management
Cramming everything above the fold or filling every pixel with content creates visual chaos that exhausts visitors. White space, or negative space, is a powerful design tool that prevents a site from feeling cluttered. What’s more, it can increase text comprehension by up to 20%. Effective layouts use this breathing room to create visual separation between sections, which directs attention to the most important details while keeping things simple.

Visual design systems that signal credibility
Strong visual design helps visitors understand and trust your website at a glance. Whether you use professional website design services or handle it yourself, these are the elements that matter most:

Typography and readability standards
To maintain professional credibility, limit your site to two or three typefaces — one for headings and one for body text. Consistent typography creates a clear content hierarchy, while ensuring body text is at least 16px guarantees readability across all device types.

Font choices communicate brand personality before users read a single word. For example, a law firm using playful, rounded fonts sends the wrong signal, just as a children’s toy company with harsh, angular typefaces creates cognitive dissonance.

Color usage with functional intent
Visual choices should be guided by color psychology. For example, blue is often used in tech and finance to communicate reliability and expertise. High-contrast colors should be reserved for functional intent, such as making primary calls-to-action stand out from the rest of the page.

Color is about communication. Your palette should include brand colors that reinforce identity, neutral colors that provide visual rest, and accent colors that drive action. Using ten different colors creates visual noise, so restrain your palette to 3–5 options. Save your brightest, most saturated color for the actions you want users to take, ensuring those buttons and links immediately capture attention.

Component consistency across pages
A cohesive design system, including uniform button styles, hover effects, and icon usage, builds brand recognition and trust. Inconsistency in these elements can make a company appear amateurish or untrustworthy.

When buttons look different on every page, when icons switch styles randomly, or when spacing and alignment vary wildly, users consciously or unconsciously feel that something’s off. Consistency signals competence and attention to detail. It suggests that if you’re meticulous about your website’s presentation, you’re likely equally careful about product quality and customer service.

Conversion-oriented design elements
Turning visitors into customers requires more than good design — it requires clear direction and trust. Below you’ll find ways to reach these things.

Clear primary and secondary CTAs
Every page should be built to lead the user toward a specific action, with primary CTAs placed strategically above the fold. Use action-oriented language, such as “Book a Call,” and repeat these prompts at logical intervals as the user scrolls.

Conversion optimization starts with understanding that not everyone is ready to engage in the same way. Primary CTAs represent your ideal action — schedule a demo, start a trial, or make a purchase. Secondary CTAs offer lower-commitment alternatives for those not ready to convert, for example, download a guide, subscribe to a newsletter, or browse case studies. Once you provide multiple pathways, they can meet visitors’ needs depending on their readiness.

Pro tip: Placement matters as much as copy. Users should encounter a CTA when they’ve consumed enough information to make a decision. After explaining a key benefit, offer the CTA. After presenting social proof, offer visitors the opportunity to experience the same results.

Trust signals at decision points
Social proof should be included where users are most likely to make a decision, such as client logos, star ratings, and verified reviews. Place security indicators, including SSL certificates and trust badges, near forms and checkout areas to reassure visitors that their data is safe.

Asking strangers to trust you online requires overcoming significant psychological barriers. Trust signals reduce this friction by showing that others have made the move with positive outcomes. Logos of recognizable clients leverage transferred authority, and users think: “If Google trusts you, maybe I can too.” Besides, reviews and testimonials provide peer validation, while security badges address specific anxieties about data safety and transaction legitimacy.

Pro tip: Context determines which trust signals matter most. You should match your trust signals to the specific concerns your audience brings to the decision. For instance, e-commerce sites need prominent indicators of payment security. B2B service providers benefit from client logos and case study links. SaaS platforms should highlight user counts and uptime guarantees.

Form design that maximizes completion
To encourage more users to finish the process, simplify your contact and checkout forms by minimizing distractions and removing unnecessary steps. Ensure every form has properly associated labels and provides clear error messages so users can quickly correct mistakes and finish their interaction. Adding fields to a form decreases completion rates. Thus, ask yourself whether each piece of information is truly necessary at this stage. Can you collect it later, after conversion?

Pro tip: Multi-step forms with progress indicators feel less overwhelming than single-page forms with twenty fields. Inline validation shows errors while users type, so they can fix mistakes right away instead of finding them after finishing the whole form.

Accessibility and inclusivity essentials
In website design, as in any other sphere of our lives, accessibility and inclusivity create a better experience for everyone. Here is how it’s achieved.

Visual and contrast accessibility
Modern website accessibility standards require a minimum color contrast ratio of 4.5:1 for normal text and 3:1 for large text to ensure content is legible for users with visual impairments. Using high-contrast colors for essential information not only aids accessibility but also enhances overall website usability.

Accessibility is fundamental to good design that benefits everyone. High contrast helps people with low vision, but it also helps everyone reading on a bright sunny day or on a dim laptop screen. Color-blind users often can’t tell red from green, so pairing colors with text labels helps them and prevents others from missing small visual cues.

Keyboard and assistive technology support
Websites must be fully keyboard-navigable and use a proper heading hierarchy (H1, H2, H3) to support screen readers and other assistive technologies. Proper heading hierarchy isn’t just for screen readers. It creates a logical document structure that improves SEO and helps all users scan content efficiently.

Additionally, alt text serves dual purposes. For visually impaired users relying on screen readers, it describes what images show. For SEO, it provides context that search engines use for ranking and image search results. Decorative images should have empty alt attributes rather than descriptions, preventing screen readers from announcing irrelevant information.

Finally, many users can’t or don’t use a mouse. Keyboard navigation serves people with motor disabilities, power users who prefer keyboard shortcuts, and anyone whose pointing device isn’t working.

Inclusive content and language design
Inclusivity starts with using plain, jargon-free language. Writing for comprehension means choosing simple words over complex ones when both communicate the same idea. Short sentences beat long, complex ones. Bullet points clarify lists better than paragraph-embedded items. This isn’t dumbing down content, but respecting that users are scanning quickly and may not share your industry background or native language.

For international businesses, this also means cultural adaptation — adjusting colors, date formats, and imagery. Just take left-to-right languages that require different layouts than right-to-left ones. Or consider that dates, money, and measurements should match regional expectations. Lastly, images should reflect the diversity of your actual audience.

Performance, reliability, and technical readiness
In today’s digital landscape, speed, stability, and consistency aren’t just nice-to-haves; they’re make-or-break factors for your website. How can you optimize performance and keep visitors engaged, satisfied, and coming back?

Core performance benchmarks
Speed is a key element for keeping users and boosting SEO. Studies consistently show that even a one-second delay in page load time significantly reduces conversions. Mobile users on slower connections abandon slow sites without hesitation. Google’s algorithms also explicitly penalize slow-loading sites in search rankings. So, poor website performance costs you both direct conversions and organic traffic.

Sites should aim to load in under 3 seconds on mobile devices. Technical optimization should target Core Web Vitals, specifically maintaining a Largest Contentful Paint (LCP) of under 2.5 seconds and an Interaction to Next Paint (INP) under 200 milliseconds. Another vital Google metric is Cumulative Layout Shift (CLS). It quantifies visual stability, whether elements jump around during loading, causing users to click the wrong thing. Improving these metrics requires technical efforts, such as image compression, code streamlining, and faster server response times.

Cross-device and environment stability
A mobile-first responsive framework is mandatory, as Google prioritizes mobile versions for indexing. This includes using fluid grids and making sure buttons and links are at least 44×44 pixels for easy tapping. Buttons spaced too closely together result in mis-taps and frustration, while tiny links are nearly impossible to tap accurately.

Responsive design isn’t optional — it’s fundamental. Text should resize appropriately, images should scale without breaking layouts, and navigation should work smoothly whether someone’s using a thumb on a phone or a cursor on a desktop.

Ongoing maintenance and design governance
A website requires regular Content Management System (CMS) and plugin updates to close security vulnerabilities and maintain performance. Implementing a design system or style guide ensures that even as the site grows, all new pages and features remain consistent with the original brand standards.

Design systems document decisions about typography, colors, spacing, and component behavior. With this system in your toolkit, even when you add new sections or pages months later, they match existing design patterns rather than introducing inconsistencies. For teams with multiple contributors, a style guide prevents conflicting design choices.

Our website is a revenue driver
A high-performing business website is a strategic tool that requires continuous monitoring and improvement. Its success depends on strong UX, a commitment to accessibility, a focus on conversion optimization, careful attention to performance, and ongoing dedication to usability. When all these elements work together, the site becomes a growth engine that produces real outcomes.

