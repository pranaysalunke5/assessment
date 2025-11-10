const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const handlebars = require('handlebars');

handlebars.registerHelper('eq', function (a, b, options) {
if (!options || typeof options.fn !== 'function' || typeof options.inverse !== 'function') {
    console.error("Handlebars 'eq' helper called incorrectly. Missing fn/inverse.");
    return ''; 
}
  
  if (a === b) {
    return options.fn(this); 
  }
  return options.inverse(this); 
});


async function renderHtmlFromTemplate(templateName, data = {}) {
  const templatePath = path.join(process.cwd(), 'src', 'templates', `${templateName}.hbs`);
  const source = fs.readFileSync(templatePath, 'utf8');
  const template = handlebars.compile(source);
  return template(data);
}

async function generatePdfBuffer(html) {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const buffer = await page.pdf({ format: 'A4', printBackground: true });
  await browser.close();
  return buffer;
}

module.exports = { renderHtmlFromTemplate, generatePdfBuffer };