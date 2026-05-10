# Fast Lost & Found

Next.js/Vercel Lost & Found app for reporting lost or found items, matching them by tags, and verifying claims through an admin dashboard.

Project Report: Fast Lost & Found
Purpose
This report describes Fast Lost & Found, a web application for reporting lost and found property, surfacing likely matches, and managing ownership claims through an administrator workflow. The system is intended for campuses, offices, or similar environments where many people share the same spaces and need a simple, accountable way to reconnect people with items.

Background and problem
Traditional lost-and-found processes often rely on physical bins, informal messaging, or scattered spreadsheets. That makes it hard to search consistently, to prove who should receive an item, and to keep a clear record of what was returned. The project addresses these gaps with a single place to list items, automated hints for possible matches, and a controlled path from claim to handover.

Project objectives
The main goals are to let users submit structured reports (title, category, color, location, description), browse and filter listings, and see suggested pairings between lost and found entries. A second objective is to support secure sign-up and sign-in, role separation between regular users and administrators, and password recovery flows. Administrators need tools to review claims, approve or reject them, and manage user accounts where the product supports that.

Functional overview
Visitors and signed-in users can explore the catalog from the home page, which summarizes activity such as active reports and verified recoveries. Users can file new reports through a dedicated reporting flow. Each item can be viewed in detail; the application derives tags from the text fields and uses them together with category, color, and location to score compatibility with opposite-status items (lost versus found). Claims can be submitted against items; admins use a dashboard to verify those claims before an item is treated as recovered. Supporting pages cover information about the service, contact, authentication (login, signup, forgot and reset password), and an admin-only area.

Technical approach
The application is built with Next.js (App Router) and React, using TypeScript for type safety. Server components and route handlers implement data loading and API-style operations. Styling and layout follow the project’s existing component structure (navigation, footer, forms, cards). Icons use lucide-react. Data access is centralized in a store module that can persist state in MongoDB Atlas when configured, fall back to Vercel KV / Upstash when those environment variables are present, or use a local JSON file during development—giving flexibility from laptop demos to cloud deployment.

Security and trust
Passwords are handled with hashing rather than plain storage. Sessions rely on a configured secret. Admin identity can be constrained via environment variables in production. Validation and dedicated security helpers reduce the risk of obviously unsafe input. The design assumes that final handover of physical items still depends on human judgment; the software provides structure and an audit trail through claim status rather than replacing real-world verification.

Deployment and operations
The stack aligns with Vercel-style hosting: build with next build, run with next start, and supply environment variables for the database, session secret, and optional admin bootstrap credentials. Without a remote database, behavior may be suitable for demos only, with data that does not persist reliably across deploys.

Outcomes and limitations
The project delivers an end-to-end lost-and-found experience with matching assistance and admin oversight. Match quality depends on how completely users describe items; the scoring model is rule-based and transparent rather than a machine-learning system. Scale and compliance needs (for example, formal records retention or institutional single sign-on) would be follow-on work outside the current scope.

Conclusion
Fast Lost & Found is a focused web product that combines public listings, tag-based matching, authenticated users, and administrative claim review. Its technology choices support quick iteration, clear deployment paths, and optional persistence backends, while keeping the user journey easy to explain to non-technical stakeholders.