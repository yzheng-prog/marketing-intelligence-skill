#!/usr/bin/env node
/**
 * fetch-contentful.js
 * Fetches published Insight Articles from Contentful and generates HTML files
 * into the /insights/ directory, then rebuilds the index.
 *
 * Required env vars (set as GitHub Secrets):
 *   CONTENTFUL_SPACE_ID
 *   CONTENTFUL_ACCESS_TOKEN
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;

if (!SPACE_ID || !ACCESS_TOKEN) {
  console.error('Missing CONTENTFUL_SPACE_ID or CONTENTFUL_ACCESS_TOKEN');
  process.exit(1);
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { Authorization: `Bearer ${ACCESS_TOKEN}` } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function richTextToHtml(node) {
  if (!node) return '';
  if (node.nodeType === 'text') {
    let text = node.value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    if (node.marks) {
      node.marks.forEach(mark => {
        if (mark.type === 'bold') text = `<strong>${text}</strong>`;
        if (mark.type === 'italic') text = `<em>${text}</em>`;
        if (mark.type === 'code') text = `<code>${text}</code>`;
      });
    }
    return text;
  }
  const children = (node.content || []).map(richTextToHtml).join('');
  switch (node.nodeType) {
    case 'document': return children;
    case 'paragraph': return `<p>${children}</p>\n`;
    case 'heading-1': return `<h1>${children}</h1>\n`;
    case 'heading-2': return `<h2>${children}</h2>\n`;
    case 'heading-3': return `<h3>${children}</h3>\n`;
    case 'heading-4': return `<h4>${children}</h4>\n`;
    case 'unordered-list': return `<ul>\n${children}</ul>\n`;
    case 'ordered-list': return `<ol>\n${children}</ol>\n`;
    case 'list-item': return `<li>${children}</li>\n`;
    case 'blockquote': return `<blockquote>${children}</blockquote>\n`;
    case 'hr': return `<hr>\n`;
    case 'hyperlink':
      const uri = node.data?.uri || '#';
      return `<a href="${uri}" target="_blank" rel="noopener">${children}</a>`;
    default: return children;
  }
}

function formatDate(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function slugToIssueNumber(slug) {
  const match = slug.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

// ─── HTML Article Template ───────────────────────────────────────────────────

function generateArticleHtml(article) {
  const { title, slug, publishDate, category, summary, body, metaDescription, tags } = article;
  const bodyHtml = richTextToHtml(body);
  const dateFormatted = formatDate(publishDate);
  const issueNum = slugToIssueNumber(slug);
  const tagsArray = Array.isArray(tags) ? tags : [];
  const tagsHtml = tagsArray.map(t => `<span class="tag">${t}</span>`).join(' ');
  const metaDesc = metaDescription || summary || '';

  // Frontmatter comment for the index builder (backward compatible)
  const frontmatter = `<!--FRONTMATTER
issue: "${issueNum}"
title: "${title.replace(/"/g, '\\"')}"
summary: "${(summary || '').replace(/"/g, '\\"')}"
date: "${dateFormatted}"
category: "${category || ''}"
tags: [${tagsArray.map(t => `"${t}"`).join(', ')}]
FRONTMATTER-->`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Ye Zheng Marketing Insights</title>
  <meta name="description" content="${metaDesc.replace(/"/g, '&quot;')}">
  <meta name="author" content="Ye Zheng">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${metaDesc.replace(/"/g, '&quot;')}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://yezhengmarketing.com/insights/${slug}.html">
  <link rel="icon" type="image/png" href="../favicon-32x32.png">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${title.replace(/"/g, '\\"')}",
    "description": "${metaDesc.replace(/"/g, '\\"')}",
    "datePublished": "${publishDate || ''}",
    "author": {
      "@type": "Person",
      "name": "Ye Zheng",
      "url": "https://yezhengmarketing.com"
    }
  }
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../insights-styles.css">
</head>
<body>
  ${frontmatter}

  <nav class="navbar">
    <div class="nav-inner">
      <a href="../index.html" class="nav-logo">YZ</a>
      <div class="nav-links">
        <a href="../index.html#about">About</a>
        <a href="../index.html#projects">Projects</a>
        <a href="../index.html#skills">Skills</a>
        <a href="index.html" class="active">Insights</a>
        <a href="https://linkedin.com/in/echozhengmba" target="_blank">Contact</a>
      </div>
    </div>
  </nav>

  <article class="insight-article">
    <header class="article-header">
      <div class="article-meta-top">
        <span class="article-issue">Issue #${issueNum}</span>
        <span class="article-category">${category || ''}</span>
      </div>
      <h1 class="article-title">${title}</h1>
      <p class="article-summary">${summary || ''}</p>
      <div class="article-meta-bottom">
        <span class="article-date">${dateFormatted}</span>
        <div class="article-tags">${tagsHtml}</div>
      </div>
    </header>

    <div class="article-body">
      ${bodyHtml}
    </div>

    <footer class="article-footer">
      <a href="index.html" class="back-link">&larr; All Insights</a>
    </footer>
  </article>

  <footer>
    <div class="footer-inner">
      <p>&copy; <span id="year"></span> Ye Zheng. Marketing intelligence grounded in real account data.</p>
      <a href="../index.html" class="footer-back">&larr; Back to Portfolio</a>
    </div>
  </footer>

  <script>document.getElementById('year').textContent = new Date().getFullYear();</script>
</body>
</html>`;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const url = `https://cdn.contentful.com/spaces/${SPACE_ID}/entries?content_type=insightArticle&order=-fields.publishDate&limit=100`;

  console.log('Fetching articles from Contentful...');
  const data = await fetchJSON(url);

  if (!data.items || data.items.length === 0) {
    console.log('No published articles found in Contentful.');
    return;
  }

  console.log(`Found ${data.items.length} article(s).`);

  const insightsDir = path.join(process.cwd(), 'insights');
  if (!fs.existsSync(insightsDir)) fs.mkdirSync(insightsDir, { recursive: true });

  for (const item of data.items) {
    const fields = item.fields;
    const slug = fields.slug;
    if (!slug) {
      console.warn(`Skipping article with no slug: ${fields.title}`);
      continue;
    }

    const html = generateArticleHtml(fields);
    const outputPath = path.join(insightsDir, `${slug}.html`);
    fs.writeFileSync(outputPath, html, 'utf8');
    console.log(`  ✓ Written: insights/${slug}.html`);
  }

  console.log('Done. GitHub Actions will now rebuild the index.');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
