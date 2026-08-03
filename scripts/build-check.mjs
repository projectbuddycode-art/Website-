import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const required = [
  'index.html',
  'styles.css',
  'script.js',
  'api/project-inquiry.js',
  'robots.txt',
  'sitemap.xml',
  'services/index.html',
  'work/index.html',
  'company/index.html',
  'contact/index.html'
];

const missing = required.filter((file) => !existsSync(join(process.cwd(), file)));
if (missing.length) {
  console.error(`Missing required production files:\n${missing.join('\n')}`);
  process.exit(1);
}

const sitemap = readFileSync(join(process.cwd(), 'sitemap.xml'), 'utf8');
for (const route of ['/services/custom-software-development', '/work/atlas', '/contact']) {
  if (!sitemap.includes(`https://www.projectbuddy.co.in${route}`)) {
    console.error(`Sitemap missing ${route}`);
    process.exit(1);
  }
}

console.log('Build check passed.');
