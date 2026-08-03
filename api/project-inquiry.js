import { Resend } from 'resend';

const MAX_BODY_BYTES = 32 * 1024;
const ALLOWED_TYPES = new Set([
  'Custom Software',
  'Enterprise Application',
  'Web Application',
  'Mobile Application',
  'AI Automation',
  'Business Process Automation',
  'System Integration',
  'Software Modernization',
  'SaaS Product',
  'AI Integration',
  'Other'
]);
const ALLOWED_STAGES = new Set([
  'Idea / Planning',
  'Existing System',
  'MVP',
  'In Development',
  'Production System',
  'Modernization / Replacement'
]);
const ALLOWED_TIMELINES = new Set([
  'As soon as possible',
  'Within 1 month',
  '1-3 months',
  '3-6 months',
  'Flexible'
]);
const ALLOWED_BUDGETS = new Set([
  'Prefer to discuss',
  'Under $5,000',
  '$5,000-$15,000',
  '$15,000-$30,000',
  '$30,000-$75,000',
  '$75,000+'
]);

const rateLimit = new Map();

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function trim(value, limit) {
  return typeof value === 'string' ? value.trim().slice(0, limit) : '';
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function textBlock(value) {
  return escapeHtml(value || 'Not provided').replace(/\n/g, '<br>');
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

function isValidUrl(value) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) && value.length <= 300;
  } catch {
    return false;
  }
}

function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  return Array.isArray(forwarded) ? forwarded[0] : String(forwarded || req.socket.remoteAddress || 'unknown').split(',')[0].trim();
}

function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const maxRequests = 5;
  const current = rateLimit.get(ip) || [];
  const recent = current.filter((time) => now - time < windowMs);
  recent.push(now);
  rateLimit.set(ip, recent);
  return recent.length <= maxRequests;
}

async function readBody(req) {
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      throw new Error('Payload too large');
    }
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

function validate(payload) {
  const errors = {};
  const submittedAt = Number(payload.submittedAt || 0);
  const elapsed = Date.now() - submittedAt;

  const data = {
    name: trim(payload.name, 100),
    email: trim(payload.email, 254).toLowerCase(),
    company: trim(payload.company, 150),
    phone: trim(payload.phone, 40),
    website: trim(payload.website, 300),
    projectTypes: Array.isArray(payload.projectTypes) ? payload.projectTypes.map((item) => trim(item, 80)).filter(Boolean) : [],
    description: trim(payload.description, 5000),
    challenge: trim(payload.challenge, 3000),
    stage: trim(payload.stage, 80),
    timeline: trim(payload.timeline, 80),
    budget: trim(payload.budget, 80),
    sourcePage: trim(payload.sourcePage, 300),
    referrer: trim(payload.referrer, 300),
    landingPage: trim(payload.landingPage, 300),
    utmSource: trim(payload.utmSource, 120),
    utmMedium: trim(payload.utmMedium, 120),
    utmCampaign: trim(payload.utmCampaign, 120),
    utmContent: trim(payload.utmContent, 120),
    utmTerm: trim(payload.utmTerm, 120)
  };

  if (trim(payload.websiteUrl, 200)) errors.spam = 'Invalid submission.';
  if (!submittedAt || elapsed < 2500) errors.timing = 'Please review the brief before sending.';
  if (!data.name) errors.name = 'Full name is required.';
  if (!isEmail(data.email)) errors.email = 'A valid work email is required.';
  if (data.website && !isValidUrl(data.website)) errors.website = 'Enter a valid website URL.';
  if (!data.projectTypes.length || data.projectTypes.some((type) => !ALLOWED_TYPES.has(type))) errors.projectTypes = 'Choose at least one valid project type.';
  if (!data.description || data.description.length < 20) errors.description = 'Tell us a little more about the project.';
  if (!ALLOWED_STAGES.has(data.stage)) errors.stage = 'Choose a valid project stage.';
  if (!ALLOWED_TIMELINES.has(data.timeline)) errors.timeline = 'Choose a valid timeline.';
  if (!ALLOWED_BUDGETS.has(data.budget)) errors.budget = 'Choose a valid budget range.';

  return { data, errors };
}

function row(label, value) {
  return `<tr><td style="padding:6px 14px 6px 0;color:#536074">${label}</td><td style="padding:6px 0;color:#10213b;font-weight:600">${escapeHtml(value || 'Not provided')}</td></tr>`;
}

function internalEmail(data) {
  return `<!doctype html>
<html><body style="margin:0;background:#f7f9fc;font-family:Inter,Arial,sans-serif;color:#10213b">
  <div style="max-width:720px;margin:0 auto;padding:32px">
    <p style="margin:0 0 8px;color:#1265f3;letter-spacing:.18em;font-size:12px;font-weight:700">PROJECT BUDDY</p>
    <h1 style="margin:0 0 24px;font-size:28px;line-height:1.1">New Project Inquiry</h1>
    <div style="background:#fff;border:1px solid #dde6f2;border-radius:18px;padding:22px;margin-bottom:16px">
      <h2 style="font-size:14px;letter-spacing:.16em;color:#1265f3">CONTACT</h2>
      <table role="presentation" style="border-collapse:collapse;width:100%">
        ${row('Name', data.name)}
        ${row('Email', data.email)}
        ${row('Phone', data.phone)}
        ${row('Company', data.company)}
        ${row('Website', data.website)}
      </table>
    </div>
    <div style="background:#fff;border:1px solid #dde6f2;border-radius:18px;padding:22px;margin-bottom:16px">
      <h2 style="font-size:14px;letter-spacing:.16em;color:#1265f3">PROJECT</h2>
      <table role="presentation" style="border-collapse:collapse;width:100%">
        ${row('Type', data.projectTypes.join(', '))}
        ${row('Stage', data.stage)}
        ${row('Timeline', data.timeline)}
        ${row('Budget', data.budget)}
      </table>
    </div>
    <div style="background:#fff;border:1px solid #dde6f2;border-radius:18px;padding:22px;margin-bottom:16px">
      <h2 style="font-size:14px;letter-spacing:.16em;color:#1265f3">PROJECT DESCRIPTION</h2>
      <p style="line-height:1.65">${textBlock(data.description)}</p>
      <h2 style="font-size:14px;letter-spacing:.16em;color:#1265f3">KEY CHALLENGE</h2>
      <p style="line-height:1.65">${textBlock(data.challenge)}</p>
    </div>
    <div style="background:#fff;border:1px solid #dde6f2;border-radius:18px;padding:22px">
      <h2 style="font-size:14px;letter-spacing:.16em;color:#1265f3">SUBMITTED</h2>
      <table role="presentation" style="border-collapse:collapse;width:100%">
        ${row('Timestamp', new Date().toISOString())}
        ${row('Source page', data.sourcePage)}
        ${row('Landing page', data.landingPage)}
        ${row('Referrer', data.referrer)}
        ${row('UTM source', data.utmSource)}
        ${row('UTM medium', data.utmMedium)}
        ${row('UTM campaign', data.utmCampaign)}
        ${row('UTM content', data.utmContent)}
        ${row('UTM term', data.utmTerm)}
      </table>
    </div>
  </div>
</body></html>`;
}

function confirmationEmail(data) {
  const firstName = data.name.split(/\s+/)[0] || 'there';
  return `<!doctype html>
<html><body style="margin:0;background:#f7f9fc;font-family:Inter,Arial,sans-serif;color:#10213b">
  <div style="max-width:640px;margin:0 auto;padding:32px">
    <p style="margin:0 0 8px;color:#1265f3;letter-spacing:.18em;font-size:12px;font-weight:700">PROJECT BUDDY</p>
    <h1 style="margin:0 0 16px;font-size:28px;line-height:1.1">We've received your brief</h1>
    <p style="line-height:1.7">Hi ${escapeHtml(firstName)},</p>
    <p style="line-height:1.7">Thanks for sharing your project with Project Buddy. We've received your brief and will review the requirements.</p>
    <div style="background:#fff;border:1px solid #dde6f2;border-radius:18px;padding:22px;margin:22px 0">
      <p><strong>Project Type:</strong> ${escapeHtml(data.projectTypes.join(', '))}</p>
      <p><strong>Stage:</strong> ${escapeHtml(data.stage)}</p>
      <p><strong>Timeline:</strong> ${escapeHtml(data.timeline)}</p>
    </div>
    <p style="color:#1265f3;font-weight:700">Project Buddy</p>
    <p>Turn idea into reality.</p>
  </div>
</body></html>`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { ok: false, message: 'Method not allowed.' });
  }

  if (!checkRateLimit(clientIp(req))) {
    return json(res, 429, { ok: false, message: 'Please try again later.' });
  }

  let payload;
  try {
    payload = JSON.parse(await readBody(req));
  } catch {
    return json(res, 400, { ok: false, message: 'Invalid request payload.' });
  }

  const { data, errors } = validate(payload);
  if (Object.keys(errors).length) {
    return json(res, 422, { ok: false, message: 'Please review the highlighted fields.', errors });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.PROJECT_INQUIRY_TO_EMAIL?.split(',').map((email) => email.trim()).filter(Boolean);
  const from = process.env.PROJECT_INQUIRY_FROM_EMAIL;

  if (!apiKey || !to?.length || !from) {
    console.error('Project inquiry email environment variables are not configured.');
    return json(res, 500, { ok: false, message: "We couldn't send the project brief. Please try again." });
  }

  const resend = new Resend(apiKey);
  const subjectName = data.company || data.name;
  const primaryType = data.projectTypes[0] || 'Project';

  try {
    const internal = await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject: `New Project Inquiry - ${subjectName} - ${primaryType}`,
      html: internalEmail(data)
    });

    if (internal.error) {
      console.error('Resend internal notification failed:', internal.error);
      return json(res, 502, { ok: false, message: "We couldn't send the project brief. Please try again." });
    }

    const confirmation = await resend.emails.send({
      from,
      to: data.email,
      subject: "We've received your Project Buddy brief",
      html: confirmationEmail(data)
    });

    if (confirmation.error) {
      console.error('Resend confirmation failed:', confirmation.error);
    }

    return json(res, 200, { ok: true });
  } catch (error) {
    console.error('Project inquiry send failed:', error && error.message ? error.message : error);
    return json(res, 502, { ok: false, message: "We couldn't send the project brief. Please try again." });
  }
}
