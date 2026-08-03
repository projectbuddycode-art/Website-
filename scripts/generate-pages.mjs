import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const siteUrl = 'https://www.projectbuddy.co.in';

const services = [
  {
    slug: 'custom-software-development',
    title: 'Custom Software Development',
    description: 'Project Buddy develops custom software for businesses that need software designed around their specific workflows, teams and operational requirements.',
    builds: ['Internal business platforms', 'Customer portals', 'Workflow software', 'Operational dashboards'],
    suitable: 'Teams replacing spreadsheets, disconnected tools or manual processes with purpose-built software.',
    problems: ['Manual handoffs', 'Duplicate data entry', 'Limited visibility', 'Tools that do not match the operation'],
    integrations: ['CRM systems', 'Payment systems', 'ERP data', 'Messaging and notification tools'],
    projects: ['Diamond Capture System', 'InstituteOS', 'Fusion']
  },
  {
    slug: 'enterprise-software-development',
    title: 'Enterprise Software Development',
    description: 'Project Buddy builds enterprise applications that connect departments, workflows, permissions, data and reporting into reliable operating systems.',
    builds: ['Role-based applications', 'Department workflows', 'Data management systems', 'Approval and audit flows'],
    suitable: 'Organizations with complex operations that need dependable software across teams.',
    problems: ['Fragmented systems', 'Slow approvals', 'Unclear process ownership', 'Operational reporting gaps'],
    integrations: ['Identity providers', 'Databases', 'Finance systems', 'Third-party APIs'],
    projects: ['InstituteOS', 'ATLAS', 'EduSphere AI']
  },
  {
    slug: 'ai-automation',
    title: 'AI Automation',
    description: 'Project Buddy designs AI automation for business processes where software can classify, route, summarize or assist operational work.',
    builds: ['AI assistants', 'Lead routing systems', 'Document workflows', 'Operational copilots'],
    suitable: 'Businesses that want AI connected to real workflows rather than isolated experiments.',
    problems: ['Repetitive service tasks', 'Slow lead response', 'Manual summaries', 'Unstructured operational information'],
    integrations: ['OpenAI', 'CRMs', 'Knowledge bases', 'Support and messaging channels'],
    projects: ['AI Receptionist', 'ATLAS', 'EduSphere AI']
  },
  {
    slug: 'business-process-automation',
    title: 'Business Process Automation',
    description: 'Project Buddy automates business processes by mapping how work moves, then engineering workflows that reduce manual coordination.',
    builds: ['Workflow engines', 'Notification flows', 'Task routing', 'Approval automation'],
    suitable: 'Operations teams that need fewer manual steps and clearer ownership.',
    problems: ['Missed handoffs', 'Manual tracking', 'Slow approvals', 'Repeated administrative work'],
    integrations: ['Email', 'CRM', 'Databases', 'Internal tools'],
    projects: ['AI Receptionist', 'InstituteOS', 'Fusion']
  },
  {
    slug: 'mobile-app-development',
    title: 'Mobile App Development',
    description: 'Project Buddy develops mobile applications for customer, team and hardware-connected workflows that need reliable interfaces on the move.',
    builds: ['Flutter applications', 'Mobile portals', 'Camera and hardware apps', 'Field workflow tools'],
    suitable: 'Products and operations where users need mobile access, capture, communication or control.',
    problems: ['Desktop-only workflows', 'Slow field updates', 'Disconnected capture processes', 'Poor customer access'],
    integrations: ['Camera APIs', 'Hardware controllers', 'Backend APIs', 'Push notifications'],
    projects: ['Diamond Capture System', 'EduSphere AI']
  },
  {
    slug: 'web-application-development',
    title: 'Web Application Development',
    description: 'Project Buddy builds web applications for SaaS products, internal systems, portals and operational platforms.',
    builds: ['SaaS applications', 'Admin panels', 'Customer portals', 'Analytics interfaces'],
    suitable: 'Businesses launching new products or moving workflows into browser-based software.',
    problems: ['Manual portals', 'Weak internal tooling', 'No shared operating view', 'Disconnected customer journeys'],
    integrations: ['APIs', 'Authentication', 'Payments', 'Analytics'],
    projects: ['InstituteOS', 'ATLAS', 'Fusion']
  },
  {
    slug: 'software-modernization',
    title: 'Software Modernization',
    description: 'Project Buddy modernizes legacy systems by improving architecture, interfaces, integrations and automation without ignoring the operation behind them.',
    builds: ['Modern interfaces', 'API layers', 'Data migrations', 'Replacement platforms'],
    suitable: 'Businesses with older tools that still matter but slow down teams or block scale.',
    problems: ['Outdated interfaces', 'Manual exports', 'Limited integration', 'Maintenance risk'],
    integrations: ['Legacy databases', 'Modern APIs', 'Cloud services', 'Reporting tools'],
    projects: ['InstituteOS', 'ATLAS']
  },
  {
    slug: 'system-integration',
    title: 'System Integration',
    description: 'Project Buddy integrates software systems so data, workflows and actions can move across the business without manual copying.',
    builds: ['API integrations', 'Data sync services', 'Automation bridges', 'Operational middleware'],
    suitable: 'Teams using multiple tools that need to behave like one working system.',
    problems: ['Siloed data', 'Manual re-entry', 'Inconsistent records', 'Broken handoffs'],
    integrations: ['CRMs', 'ERPs', 'Payment systems', 'Messaging platforms', 'Databases'],
    projects: ['AI Receptionist', 'Diamond Capture System', 'ATLAS']
  }
];

const projects = [
  {
    slug: 'diamond-capture-system',
    name: 'Diamond Capture System',
    type: 'Hardware x Software x Automation',
    summary: 'An automated product imaging and hardware control platform connecting a mobile application with camera systems, precision motor control and programmable lighting hardware.',
    problem: 'Product imaging needed coordinated camera capture, lighting and movement without slow manual setup.',
    system: 'Project Buddy designed software that coordinates mobile capture, hardware control and repeatable imaging workflows.',
    architecture: ['Flutter mobile interface', 'CameraX capture layer', 'ESP32 hardware control', 'Lighting and motor coordination'],
    capabilities: ['Guided capture', 'Camera control', 'Motor movement', 'Programmable lighting'],
    technology: ['Flutter', 'CameraX', 'ESP32', 'Hardware Control'],
    workflow: 'An operator starts a capture session, the app coordinates camera and hardware states, and the system produces a repeatable image workflow.',
    engineering: 'The meaningful challenge was coordinating software timing with physical hardware behavior.',
    outcome: 'The system created a more controlled and repeatable product imaging process.'
  },
  {
    slug: 'instituteos',
    name: 'InstituteOS',
    type: 'Education Operations Platform',
    summary: 'A connected institute management platform for admissions, academics, finance, scheduling and operational workflows.',
    problem: 'Institutes often manage critical workflows across disconnected files, messages and manual tracking.',
    system: 'InstituteOS centralizes academic and administrative workflows into one operating platform.',
    architecture: ['Admissions module', 'Academic workflow layer', 'Finance records', 'Scheduling system'],
    capabilities: ['Admissions tracking', 'Student operations', 'Finance workflows', 'Scheduling'],
    technology: ['Web Application', 'Database', 'Workflow Automation'],
    workflow: 'Teams manage admissions, schedules and finance records through a shared operating interface.',
    engineering: 'The platform needs clear data ownership across academic and operational departments.',
    outcome: 'InstituteOS gives institute teams a clearer operating system for daily work.'
  },
  {
    slug: 'ai-receptionist',
    name: 'AI Receptionist',
    type: 'AI x CRM x Workflow Automation',
    summary: 'An AI-powered customer communication system that routes requests, updates CRM records and triggers operational workflows.',
    problem: 'Incoming inquiries can be missed or delayed when routing depends on manual handoffs.',
    system: 'The AI Receptionist captures intent, updates records and routes the next operational action.',
    architecture: ['AI conversation layer', 'CRM integration', 'Workflow routing', 'Notification logic'],
    capabilities: ['Lead capture', 'Request routing', 'CRM updates', 'Workflow triggers'],
    technology: ['AI Integration', 'CRM APIs', 'Workflow Automation'],
    workflow: 'A customer request enters the system, AI interprets the need, and the software routes the next action.',
    engineering: 'The key challenge is connecting AI output to deterministic business actions safely.',
    outcome: 'The system reduces manual intake and helps teams respond with more consistency.'
  },
  {
    slug: 'atlas',
    name: 'ATLAS',
    type: 'AI-Powered Financial Operating System',
    summary: 'An AI-powered financial operating system that consolidates operational data, prioritizes decisions and supports clearer planning.',
    problem: 'Financial and operational decisions become slower when data is fragmented across systems.',
    system: 'ATLAS brings financial signals and operational context into a shared decision environment.',
    architecture: ['Financial data layer', 'Decision prioritization', 'Analytics interface', 'Automation support'],
    capabilities: ['Financial data views', 'Planning support', 'Operational insights', 'AI assistance'],
    technology: ['AI Integration', 'Data Systems', 'Web Application'],
    workflow: 'Teams review consolidated financial context, inspect priorities and use AI assistance to move planning forward.',
    engineering: 'The challenge is making financial context understandable without inventing certainty or hiding assumptions.',
    outcome: 'ATLAS helps teams reason through financial operations with more clarity.'
  },
  {
    slug: 'edusphere-ai',
    name: 'EduSphere AI',
    type: 'School ERP x Parent Platform',
    summary: 'A school management platform combining administration, student information, academics and parent communication.',
    problem: 'Schools need parent communication and administration to connect with student and academic records.',
    system: 'EduSphere AI centralizes school operations and creates a clearer parent-facing experience.',
    architecture: ['School ERP', 'Parent platform', 'Student information', 'Communication workflows'],
    capabilities: ['Student management', 'Attendance', 'Parent communication', 'Academic workflows'],
    technology: ['Web Application', 'Mobile Experience', 'AI Assistance'],
    workflow: 'Administrators manage records and communication while parents access relevant school information.',
    engineering: 'The platform must keep operational data organized while serving different user roles.',
    outcome: 'EduSphere AI gives schools a more connected foundation for administration and communication.'
  },
  {
    slug: 'fusion',
    name: 'Fusion',
    type: 'Founder x Builder Network',
    summary: 'A builder network for founders, operators and collaborators to connect ideas, workflows and execution challenges.',
    problem: 'Early ideas and execution needs often live in fragmented notes and conversations.',
    system: 'Fusion organizes founder collaboration into a software environment for idea capture and project flow.',
    architecture: ['Profile layer', 'Idea capture', 'Collaboration workflows', 'Project flow'],
    capabilities: ['Founder discovery', 'Idea capture', 'Collaboration', 'Execution tracking'],
    technology: ['Web Application', 'Workflow Systems', 'Network Platform'],
    workflow: 'Founders and builders capture ideas, align around needs and move collaboration into project flow.',
    engineering: 'The challenge is balancing network discovery with practical project execution.',
    outcome: 'Fusion creates a more structured environment for founder-builder collaboration.'
  }
];

function pageHead({ title, description, path, schema }) {
  const canonical = `${siteUrl}${path}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta name="robots" content="index,follow" />
  <link rel="canonical" href="${canonical}" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="manifest" href="/site.webmanifest" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${siteUrl}/logo.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Inter+Tight:wght@500;600&family=Geist+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/styles.css" />
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>`;
}

function nav() {
  return `<nav class="site-nav nav-scrolled" aria-label="Primary navigation">
  <a class="brand" href="/" aria-label="Project Buddy home"><img class="brand-mark" src="/logo.jpg" alt="Project Buddy logo" /><span class="brand-name">Project Buddy</span></a>
  <div class="nav-links"><a href="/services">Services</a><a href="/#systems">Systems</a><a href="/work">Work</a><a href="/company">Company</a><a href="/privacy-policy">Privacy Policy</a><a href="/terms">Terms</a></div>
  <a class="nav-cta" href="#projectBriefModal" data-project-trigger>Start a Project →</a>
</nav>`;
}

function modal() {
  return `<div class="project-brief-modal" id="projectBriefModal" role="dialog" aria-modal="true" aria-labelledby="project-brief-title" hidden>
  <div class="project-brief-backdrop" data-project-close></div>
  <div class="project-brief-shell" role="document">
    <button class="project-brief-close" type="button" aria-label="Close project brief" data-project-close>&times;</button>
    <div class="project-brief-aside" aria-hidden="true"><p>PROJECT BUDDY / START A PROJECT</p><div class="brief-system-animation"><span>REQUEST</span><i></i><span>RECEIVED</span><i></i><span>REVIEW</span></div></div>
    <form class="project-brief-form" id="projectBriefForm" novalidate>
      <input type="text" name="websiteUrl" class="brief-honeypot" tabindex="-1" autocomplete="off" aria-hidden="true" />
      ${['submittedAt','sourcePage','landingPage','referrer','utmSource','utmMedium','utmCampaign','utmContent','utmTerm'].map((name) => `<input type="hidden" name="${name}" />`).join('')}
      <header class="brief-header"><p>PROJECT BUDDY / START A PROJECT</p><h2 id="project-brief-title">Tell us what<br />you're building.</h2><span>Share the problem, product or operation you're working on. We'll review the requirements and determine the right next step.</span></header>
      <div class="brief-progress" aria-label="Project brief progress"><span class="active">01</span><i></i><span>02</span><i></i><span>03</span><i></i><span>04</span><i></i><span>05</span></div><div class="brief-status" role="status" aria-live="polite"></div>
      <section class="brief-step active" data-step="0"><p class="brief-step-label">01 / ABOUT YOU</p><div class="brief-field-grid"><label>Full Name *<input type="text" name="name" autocomplete="name" required maxlength="100" /></label><label>Work Email *<input type="email" name="email" autocomplete="email" required maxlength="254" /></label><label>Company / Organization<input type="text" name="company" autocomplete="organization" maxlength="150" /></label><label>Phone / WhatsApp<input type="tel" name="phone" autocomplete="tel" inputmode="tel" maxlength="40" /></label><label class="wide">Website<input type="url" name="website" autocomplete="url" inputmode="url" maxlength="300" placeholder="https://" /></label></div></section>
      <section class="brief-step" data-step="1"><p class="brief-step-label">02 / WHAT ARE YOU BUILDING?</p><fieldset class="brief-choice-group"><legend>What can we help you build?</legend>${['Custom Software','Enterprise Application','Web Application','Mobile Application','AI Automation','Business Process Automation','System Integration','Software Modernization','SaaS Product','AI Integration','Other'].map((type) => `<label><input type="checkbox" name="projectTypes" value="${type}" /> ${type}</label>`).join('')}</fieldset><label class="brief-textarea">Tell us a little about the project *<small>Share the idea, workflow or problem you want to solve.</small><textarea name="description" required maxlength="5000" placeholder="Describe the product, workflow, operation or automation you're building."></textarea></label></section>
      <section class="brief-step" data-step="2"><p class="brief-step-label">03 / THE PROJECT</p><label class="brief-textarea">What is the biggest operational or technical challenge?<textarea name="challenge" maxlength="3000"></textarea></label></section>
      <section class="brief-step" data-step="3"><p class="brief-step-label">04 / PROJECT CONTEXT</p><div class="brief-field-grid"><label>Project Stage<select name="stage" required><option value="">Select stage</option>${['Idea / Planning','Existing System','MVP','In Development','Production System','Modernization / Replacement'].map((item) => `<option>${item}</option>`).join('')}</select></label><label>Timeline<select name="timeline" required><option value="">Select timeline</option>${['As soon as possible','Within 1 month','1-3 months','3-6 months','Flexible'].map((item) => `<option>${item}</option>`).join('')}</select></label><label class="wide">Budget Range<select name="budget" required><option value="">Select budget range</option>${['Prefer to discuss','Under $5,000','$5,000-$15,000','$15,000-$30,000','$30,000-$75,000','$75,000+'].map((item) => `<option>${item}</option>`).join('')}</select></label></div></section>
      <section class="brief-step" data-step="4"><p class="brief-step-label">05 / SEND BRIEF</p><div class="brief-summary" aria-live="polite"></div><p class="brief-privacy">Your project details are used only to review and respond to your inquiry. <a href="/privacy-policy">Privacy Policy</a></p></section>
      <section class="brief-success" hidden><p class="brief-step-label">BRIEF / RECEIVED</p><p class="brief-check">Project brief received</p><h2>Your project is<br />in our system.</h2><p>We've received the details and will review the requirements.</p><div class="brief-system-animation success"><span>REQUEST</span><i></i><span>RECEIVED</span><i></i><span>REVIEW</span></div><button class="button primary" type="button" data-project-close>Return to Project Buddy →</button></section>
      <footer class="brief-actions"><button class="button secondary" type="button" data-brief-prev>Back</button><button class="button primary" type="button" data-brief-next>Next →</button><button class="button primary" type="submit" data-brief-submit hidden>Send Project Brief →</button></footer>
    </form>
  </div>
</div>`;
}

function list(items) {
  return `<ul>${items.map((item) => `<li>${item}</li>`).join('')}</ul>`;
}

function layout({ title, description, path, schema, body }) {
  return `${pageHead({ title, description, path, schema })}
<body class="inner-page">
  <div class="page-shell">${nav()}<main>${body}</main>${modal()}</div>
  <script src="/script.js"></script>
</body>
</html>`;
}

function writeRoute(path, html) {
  const target = join(root, path, 'index.html');
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, html, 'utf8');
}

function breadcrumb(path, name) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Project Buddy', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name, item: `${siteUrl}${path}` }
    ]
  };
}

writeRoute('services', layout({
  title: 'Services | Project Buddy',
  description: 'Explore Project Buddy services for custom software development, enterprise applications, AI automation, business process automation, web apps, mobile apps and system integration.',
  path: '/services',
  schema: breadcrumb('/services', 'Services'),
  body: `<section class="inner-hero"><p class="section-label">PROJECT BUDDY / SERVICES</p><h1>Software engineering services for working business systems.</h1><p>Project Buddy designs and develops custom software, enterprise applications, AI automation and integrated digital platforms for businesses building new products or modernizing operations.</p></section><section class="inner-grid">${services.map((service) => `<article class="inner-card"><p>${service.title}</p><h2><a href="/services/${service.slug}">${service.title}</a></h2><p>${service.description}</p></article>`).join('')}</section>`
}));

for (const service of services) {
  writeRoute(`services/${service.slug}`, layout({
    title: `${service.title} | Project Buddy`,
    description: service.description,
    path: `/services/${service.slug}`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service.title,
      provider: { '@type': 'Organization', name: 'Project Buddy', url: siteUrl },
      description: service.description
    },
    body: `<section class="inner-hero"><p class="section-label">SERVICE / ${service.title.toUpperCase()}</p><h1>${service.title}</h1><p>${service.description}</p><a class="button primary" href="#projectBriefModal" data-project-trigger>Start a Project →</a></section>
    <section class="answer-section"><h2>What does Project Buddy build?</h2>${list(service.builds)}<h2>Who is it suitable for?</h2><p>${service.suitable}</p><h2>Operational problems this can address</h2>${list(service.problems)}<h2>Systems Project Buddy can integrate</h2>${list(service.integrations)}<h2>How Project Buddy approaches the project</h2><p>We begin with business understanding and process mapping, define the system architecture, engineer the software, connect required integrations, deploy the system and optimize it around real usage.</p><h2>Relevant Project Buddy projects</h2>${list(service.projects.map((name) => `<a href="/work/${projects.find((project) => project.name === name)?.slug || ''}">${name}</a>`))}</section>`
  }));
}

writeRoute('work', layout({
  title: 'Work | Project Buddy',
  description: 'Project Buddy project portfolio including Diamond Capture System, InstituteOS, AI Receptionist, ATLAS, EduSphere AI and Fusion.',
  path: '/work',
  schema: breadcrumb('/work', 'Work'),
  body: `<section class="inner-hero"><p class="section-label">PROJECT BUDDY / WORK</p><h1>Systems engineered for real operations.</h1><p>These Project Buddy systems demonstrate custom software development, AI automation, mobile application development, system integration and operational software design.</p></section><section class="inner-grid">${projects.map((project) => `<article class="inner-card"><p>${project.type}</p><h2><a href="/work/${project.slug}">${project.name}</a></h2><p>${project.summary}</p></article>`).join('')}</section>`
}));

for (const project of projects) {
  writeRoute(`work/${project.slug}`, layout({
    title: `${project.name} | Project Buddy Work`,
    description: project.summary,
    path: `/work/${project.slug}`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.name,
      creator: { '@type': 'Organization', name: 'Project Buddy', url: siteUrl },
      description: project.summary
    },
    body: `<section class="inner-hero"><p class="section-label">PROJECT / ${project.type.toUpperCase()}</p><h1>${project.name}</h1><p>${project.summary}</p><a class="button primary" href="#projectBriefModal" data-project-trigger>Start a Similar Project →</a></section>
    <section class="answer-section"><h2>The Problem</h2><p>${project.problem}</p><h2>The System</h2><p>${project.system}</p><h2>Architecture</h2>${list(project.architecture)}<h2>Capabilities</h2>${list(project.capabilities)}<h2>Technology</h2>${list(project.technology)}<h2>How It Works</h2><p>${project.workflow}</p><h2>Engineering</h2><p>${project.engineering}</p><h2>Outcome</h2><p>${project.outcome}</p></section>`
  }));
}

writeRoute('company', layout({
  title: 'Company | Project Buddy',
  description: 'Project Buddy is a software engineering company that starts with business operations before designing custom software, automation and integrated systems.',
  path: '/company',
  schema: breadcrumb('/company', 'Company'),
  body: `<section class="inner-hero"><p class="section-label">PROJECT BUDDY / COMPANY</p><h1>We start with the operation, then engineer the system.</h1><p>Project Buddy is a software engineering and custom software development company. We help businesses turn operational problems, product ideas and disconnected workflows into practical software systems.</p></section><section class="answer-section"><h2>How Project Buddy works</h2><p>We understand the business, map the process, architect the system, engineer the software, integrate the required services, deploy the product and continue optimizing the operating layer.</p><h2>What Project Buddy builds</h2>${list(['Custom Software','Enterprise Applications','Web Applications','Mobile Applications','AI Automation','Business Process Automation','Operational Platforms','Integrated Digital Systems','SaaS Products'])}</section>`
}));

writeRoute('contact', layout({
  title: 'Start a Project | Project Buddy',
  description: 'Start a software, automation or digital platform project with Project Buddy.',
  path: '/contact',
  schema: breadcrumb('/contact', 'Contact'),
  body: `<section class="inner-hero"><p class="section-label">PROJECT BUDDY / START A PROJECT</p><h1>Tell us what you're building.</h1><p>Share the problem, product or operation you're working on. We'll review the requirements and determine the right next step.</p><a class="button primary" href="#projectBriefModal" data-project-trigger>Open Project Brief →</a></section><section class="answer-section"><h2>How do I start a software project with Project Buddy?</h2><p>Open the project brief, describe the system you need, select the relevant software or automation categories and send the details. Project Buddy will review the requirements and respond through the contact information you provide.</p></section>`
}));

writeRoute('privacy-policy', layout({
  title: 'Privacy Policy | Project Buddy',
  description: 'Project Buddy privacy policy for project inquiries, website use, and data handling.',
  path: '/privacy-policy',
  schema: breadcrumb('/privacy-policy', 'Privacy Policy'),
  body: `<section class="inner-hero"><p class="section-label">PROJECT BUDDY / PRIVACY POLICY</p><h1>Privacy Policy</h1><p>Project Buddy collects and uses information from visitors to review project inquiries, communicate with prospects, and operate the website.</p></section><section class="answer-section"><h2>Information we collect</h2><p>We may collect the information you provide directly in the project inquiry brief, including your name, work email, company, phone, website, project details, budget, timeline, stage and operational or technical challenge.</p><h2>Technical information</h2><p>We may also collect basic technical data automatically such as browser details, device type, page requests, referrer and UTM attribution data.</p><h2>Why we use information</h2><p>We use this information to respond to inquiries, evaluate project needs, communicate with prospects, and keep the website operating securely.</p><h2>Service providers</h2><p>We use service providers for hosting, transactional email and website delivery. If the project inquiry form sends email, that is handled through our email provider.</p><h2>Cookies and similar technologies</h2><p>The site may use cookies or browser storage only for functional and attribution purposes. We do not use cookies for marketing unless those services are explicitly installed.</p><h2>Data retention</h2><p>We retain inquiry data as needed to respond, operate the service and maintain records of communications.</p><h2>Security</h2><p>We follow reasonable security practices to protect information, but no system is completely secure.</p><h2>International processing</h2><p>Project inquiry data may be processed by service providers outside your country if needed to operate the website or send email.</p><h2>Your choices</h2><p>You can contact Project Buddy to request corrections or updates to your inquiry information.</p><h2>Children</h2><p>The site is not intended for children under 13.</p><h2>Third-party links</h2><p>The site may link to other websites. We are not responsible for their privacy practices.</p><h2>Changes to this policy</h2><p>We may update this policy and will post the revised version on this page.</p></section>`
}));

writeRoute('terms', layout({
  title: 'Terms | Project Buddy',
  description: 'Project Buddy website terms of use for information, project inquiries and content use.',
  path: '/terms',
  schema: breadcrumb('/terms', 'Terms'),
  body: `<section class="inner-hero"><p class="section-label">PROJECT BUDDY / TERMS</p><h1>Terms of Use</h1><p>These terms govern your use of the Project Buddy website and project inquiry tools.</p></section><section class="answer-section"><h2>Website use</h2><p>The website is provided for informational purposes and to submit project inquiries. We do not guarantee any specific result from using the site.</p><h2>Content</h2><p>All content on this site is the property of Project Buddy or its licensors. You may not copy or reuse it without permission.</p><h2>Project inquiries</h2><p>Submitting a project inquiry does not create a contract. Project Buddy may respond or decline inquiries at its discretion.</p><h2>Links</h2><p>The site may include links to other websites. Project Buddy is not responsible for their content or practices.</p><h2>Availability</h2><p>We aim to keep the site available but do not guarantee uninterrupted service.</p><h2>Disclaimer</h2><p>The site is provided as-is and Project Buddy is not liable for indirect damages arising from use.</p><h2>Changes</h2><p>We may update these terms at any time. Continued use of the site constitutes acceptance of revisions.</p><h2>Contact</h2><p>If you have questions, use the contact page to reach Project Buddy.</p></section>`
}));

writeRoute('404', layout({
  title: 'Page Not Found | Project Buddy',
  description: 'The requested Project Buddy page could not be found.',
  path: '/404',
  schema: breadcrumb('/404', 'Page Not Found'),
  body: `<section class="inner-hero"><p class="section-label">PROJECT BUDDY / 404</p><h1>This page is outside the system map.</h1><p>The route you requested could not be found. Return to the homepage or explore Project Buddy services and work.</p><a class="button primary" href="/">Return Home →</a></section>`
}));

const routes = ['/', '/services', ...services.map((service) => `/services/${service.slug}`), '/work', ...projects.map((project) => `/work/${project.slug}`), '/company', '/contact', '/privacy-policy', '/terms'];
writeFileSync(join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((route) => `  <url><loc>${siteUrl}${route}</loc></url>`).join('\n')}
</urlset>
`, 'utf8');

