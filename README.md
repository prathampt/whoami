# Pratham Tandale — Personal Website

> _Feet on ground, eyes on stars_ ⭐

A simple, aesthetic personal website built with pure HTML, CSS, and JavaScript. No frameworks, no build steps — just open `index.html` and you're live.

## 🚀 Quick Start

### View Locally

Just open `index.html` in your browser. That's it!

Or use a local server (recommended for blog/kavita listings to work):

```bash
# Python
python3 -m http.server 8000

# Node.js
npx serve .
```

### Deploy

This site works with **any static hosting**:

- **GitHub Pages**: Push to a `gh-pages` branch or enable Pages in repo settings
- **Netlify**: Drag and drop the folder, or connect your repo
- **Vercel**: Import the repo and deploy
- **Any web server**: Just upload the files

---

## 📝 How to Add a Blog Post

1. **Copy the template**:

   ```bash
   cp posts/template.html posts/my-new-post.html
   ```

2. **Edit the new file** — look for the `✏️ EDIT` comments:
   - Change the `<title>` and `<meta description>`
   - Change the `<h1>` title and date
   - Write your content in the `post-page-content` div

3. **Add an entry to `blog_posts.json`**:

   ```json
   {
     "title": "My New Post Title",
     "date": "2026-08-15",
     "description": "A short description that appears on the listing page.",
     "url": "posts/my-new-post.html",
     "tags": ["topic1", "topic2"]
   }
   ```

4. **Done!** The post will automatically appear on the blog page and the home page.

---

## 🪷 How to Add a Kavita (कविता)

1. **Copy the template**:

   ```bash
   cp kavitas/template.html kavitas/my-kavita.html
   ```

2. **Edit the new file** — look for the `✏️ EDIT` comments:
   - Change the `<title>` (in Marathi)
   - Change the `<h1>` title and date
   - Write your poem using `<div class="stanza">` and `<br>` for line breaks
   - Use `<span class="stanza-divider">· · ·</span>` between stanzas

3. **Add an entry to `kavitas.json`**:

   ```json
   {
     "title": "कवितेचे नाव",
     "date": "2026-08-15",
     "description": "कवितेबद्दल थोडक्यात.",
     "url": "kavitas/my-kavita.html",
     "tags": ["विषय"]
   }
   ```

4. **Done!** The kavita will automatically appear on the kavita page and the home page.

---

## 📁 File Structure

```
my_website/
├── index.html          ← Home page
├── blog.html           ← Blog listing page
├── kavita.html         ← Kavita listing page
├── style.css           ← All styles (edit colors, fonts here)
├── script.js           ← Blog/kavita listing logic
├── blog_posts.json     ← Blog post index (add entries here)
├── kavitas.json        ← Kavita index (add entries here)
├── posts/              ← Blog post HTML files
│   ├── template.html   ← Copy this for new posts
│   └── *.html          ← Your blog posts
├── kavitas/            ← Kavita HTML files
│   ├── template.html   ← Copy this for new kavitas
│   └── *.html          ← Your kavitas
└── README.md           ← This file
```

## 🎨 Customization

### Colors

Edit the CSS custom properties at the top of `style.css`:

```css
:root {
  --bg-primary: #fff9f0; /* Page background */
  --accent: #e07a2f; /* Accent color (orange) */
  --text-primary: #2d2a26; /* Main text color */
  /* ... more variables */
}
```

### Fonts

The site uses Google Fonts. Change them in the `@import` at the top of `style.css`.

### Content

- Edit `index.html` to update your bio, projects, and social links
- Edit `blog_posts.json` and `kavitas.json` to manage your posts

---

## 📄 License

This is my personal website. Feel free to use the code as inspiration for your own!

---

Made with ♥ by Pratham Tandale
