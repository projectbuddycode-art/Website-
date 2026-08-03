import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const errors = [];

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (['node_modules', '.vercel', '.git'].includes(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

const files = walk(root);
const htmlFiles = files.filter((file) => file.endsWith('.html'));
const textFiles = files.filter((file) => /\.(html|css|js|json|xml|txt|svg|webmanifest)$/.test(file));

for (const file of textFiles) {
  const content = readFileSync(file, 'utf8');
  if (/127\.0\.0\.1|localhost/i.test(content) && !file.endsWith('package-lock.json')) {
    errors.push(`${file}: contains localhost reference`);
  }
  if (/RESEND_API_KEY\s*=\s*[^ \n\r]/.test(content) && !file.endsWith('.env.example')) {
    errors.push(`${file}: appears to contain a Resend secret`);
  }
}

for (const file of htmlFiles) {
  const content = readFileSync(file, 'utf8');
  const h1Count = (content.match(/<h1[\s>]/g) || []).length;
  if (h1Count !== 1) errors.push(`${file}: expected exactly one h1, found ${h1Count}`);
  if (!/<link rel="canonical" href="https:\/\/www\.projectbuddy\.co\.in/.test(content)) {
    errors.push(`${file}: missing production canonical`);
  }
  if (!/<meta\s+[^>]*name="description"/s.test(content)) {
    errors.push(`${file}: missing meta description`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Site lint passed for ${htmlFiles.length} HTML files.`);
