function getPathPrefix() {
  const path = window.location.pathname;
  if (path.includes('/pages/') || path.includes('/posts/') || path.includes('/kavitas/')) {
    return '../';
  }
  return '';
}

async function loadPreview(jsonFile, listId, emptyId, limit, isDevanagari) {
  const list = document.getElementById(listId);
  const empty = document.getElementById(emptyId);
  if (!list) return;

  try {
    const response = await fetch(jsonFile);
    if (!response.ok) throw new Error('Failed to load');

    const posts = await response.json();

    if (posts.length === 0) {
      list.style.display = 'none';
      if (empty) empty.style.display = 'block';
      return;
    }

    // Sort by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    const items = posts.slice(0, limit);
    list.innerHTML = items.map(post => `
      <a class="post-item" href="${getPathPrefix() + post.url}">
        <span class="post-item-title ${isDevanagari ? 'devanagari' : ''}">${post.title}</span>
        <span class="post-item-dash">—</span>
        <span class="post-item-date">${formatDate(post.date)}</span>
      </a>
    `).join('');

  } catch (e) {
    if (list) list.style.display = 'none';
    if (empty) empty.style.display = 'block';
  }
}

async function loadPosts(jsonFile, containerId, emptyId, isDevanagari) {
  const container = document.getElementById(containerId);
  const empty = document.getElementById(emptyId);
  if (!container) return;

  try {
    const response = await fetch(jsonFile);
    if (!response.ok) throw new Error('Failed to load');

    const posts = await response.json();

    if (posts.length === 0) {
      container.style.display = 'none';
      if (empty) empty.style.display = 'block';
      return;
    }

    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    container.innerHTML = posts.map((post, i) => `
      <a class="post-card animate-in ${isDevanagari ? 'devanagari' : ''}" href="${getPathPrefix() + post.url}" style="animation-delay: ${i * 0.05}s">
        <h2 class="${isDevanagari ? 'devanagari' : ''}">${post.title}</h2>
        <div class="post-card-meta">${formatDate(post.date)}</div>
        <p>${post.description || ''}</p>
        ${post.tags ? `
          <div class="post-card-tags">
            ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
        ` : ''}
      </a>
    `).join('');

  } catch (e) {
    if (container) container.style.display = 'none';
    if (empty) empty.style.display = 'block';
  }
}

async function loadProjects(fallbackJsonFile, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    // dynamic fetch from github pinned proxy
    const response = await fetch("https://pinned.berrysauce.dev/get/prathampt");
    if (!response.ok) throw new Error("API failed");

    const pinnedRepos = await response.json();
    if (!pinnedRepos || pinnedRepos.length === 0) throw new Error("Empty repos");

    container.innerHTML = pinnedRepos.map((repo, i) => {
      const nameLower = repo.name.toLowerCase();
      const repoUrl = `https://github.com/${repo.author}/${repo.name}`;
      const desc = repo.description || "No description provided.";
      const tagsHtml = [];
      if (repo.language) {
        tagsHtml.push(`<span class="tag">${repo.language}</span>`);
      }
      if (repo.stars) {
        tagsHtml.push(`<span class="tag"><svg class="tag-icon" viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><use href="#icon-star"></use></svg>${repo.stars}</span>`);
      }
      if (repo.forks) {
        tagsHtml.push(`<span class="tag"><svg class="tag-icon" viewBox="0 0 640 640" width="16" height="16" fill="currentColor"><use href="#icon-fork"></use></svg>${repo.forks}</span>`);
      }

      return `
        <a class="project-card animate-in" href="${repoUrl}" target="_blank" rel="noopener" style="animation-delay: ${i * 0.05}s">
          <div class="project-card-header">
            <h3>${repo.name}</h3>
            <span class="project-card-arrow">→</span>
          </div>
          <p>${desc}</p>
          <div class="project-card-tags">
            ${tagsHtml.join('')}
          </div>
        </a>
      `;
    }).join('');

  } catch (e) {
    console.warn("GitHub pinned projects API failed. Falling back to local projects.json.", e);
    // Fallback
    try {
      const response = await fetch(fallbackJsonFile);
      if (!response.ok) throw new Error('Fallback failed');
      const projects = await response.json();

      container.innerHTML = projects.map((repo, i) => {
        const repoUrl = `https://github.com/${repo.author}/${repo.name}`;

        const desc = repo.description || "No description provided.";
        const tagsHtml = [];
        if (repo.language) {
          tagsHtml.push(`<span class="tag">${repo.language}</span>`);
        }
        if (repo.stars) {
          tagsHtml.push(`<span class="tag"><svg class="tag-icon" viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><use href="#icon-star"></use></svg>${repo.stars}</span>`);
        }
        if (repo.forks) {
          tagsHtml.push(`<span class="tag"><svg class="tag-icon" viewBox="0 0 640 640" width="16" height="16" fill="currentColor"><use href="#icon-fork"></use></svg>${repo.forks}</span>`);
        }

        return `
          <a class="project-card animate-in" href="${repoUrl}" target="_blank" rel="noopener" style="animation-delay: ${i * 0.05}s">
            <div class="project-card-header">
              <h3>${repo.name}</h3>
              <span class="project-card-arrow">→</span>
            </div>
            <p>${desc}</p>
            <div class="project-card-tags">
              ${tagsHtml.join('')}
            </div>
          </a>
        `;
      }).join('');
    } catch (err) {
      container.innerHTML = '<p class="empty-state">Projects could not be loaded.</p>';
    }
  }
}

async function loadBooks(fallbackJsonFile, containerId, emptyId) {
  const container = document.getElementById(containerId);
  const empty = document.getElementById(emptyId);
  if (!container) return;

  // this key is not a secret key :)
  const rssUrl = "https://www.goodreads.com/review/list_rss/194940068?key=nD5ufFTf6PtweUq2lCOycE7za3xVkcDvgfdxJIp0QJTZiUIo&shelf=read";
  const apiEndpoint = `https://x2j.dev/rss?url=${encodeURIComponent(rssUrl)}`;

  try {
    const response = await fetch(apiEndpoint);
    if (!response.ok) throw new Error("RSS Parser API failed");

    const resp = await response.json();
    if (!resp.rss.channel) throw new Error("Bad feed data");
    const data = resp.rss.channel;
    if (!data.item || data.item.length === 0) throw new Error("Bad feed data");

    const books = data.item.map(book => {
      let cover = book.book_large_image_url;

      let author = book.author_name || "";

      return {
        title: book.title,
        author: author,
        cover: cover,
        url: book.link
      };
    }).filter(book => book.cover); // only show books with covers

    renderBookCovers(books.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value), container);

  } catch (e) {
    console.warn("Goodreads dynamic fetch failed. Falling back to local books.json.", e);
    // Fallback
    try {
      const response = await fetch(fallbackJsonFile);
      if (!response.ok) throw new Error("Fallback load failed");
      const books = await response.json();
      renderBookCovers(books, container);
    } catch (err) {
      if (container) container.style.display = 'none';
      if (empty) empty.style.display = 'block';
    }
  }
}

function renderBookCovers(books, container) {
  container.innerHTML = books.map((book, i) => `
    <div class="book-cover animate-in" style="animation-delay: ${i * 0.03}s"
         data-title="${escapeAttr(book.title)}"
         data-author="${escapeAttr(book.author)}"
         data-cover="${escapeAttr(book.cover)}"
         data-url="${escapeAttr(book.url)}"
         tabindex="0"
         role="button"
         aria-label="${escapeAttr(book.title)} by ${escapeAttr(book.author)}">
      <img src="${book.cover}" alt="${escapeAttr(book.title)}" loading="lazy">
    </div>
  `).join('');

  container.querySelectorAll('.book-cover').forEach(cover => {
    cover.addEventListener('click', () => openBookLightbox(cover));
    cover.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openBookLightbox(cover);
      }
    });
  });
}

function openBookLightbox(coverEl) {
  const lightbox = document.getElementById('book-lightbox');
  const img = document.getElementById('lightbox-img');
  const title = document.getElementById('lightbox-title');

  if (!lightbox || !img) return;

  const bookTitle = coverEl.dataset.title;
  const bookAuthor = coverEl.dataset.author;
  const bookCover = coverEl.dataset.cover;

  img.src = bookCover;
  img.alt = bookTitle;
  if (title) {
    title.textContent = `${bookTitle}${bookAuthor ? ' — ' + bookAuthor : ''}`;
  }

  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';

  const close = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  document.getElementById('lightbox-backdrop').onclick = close;
  document.getElementById('lightbox-close').onclick = close;
  document.onkeydown = (e) => {
    if (e.key === 'Escape') close();
  };
}

async function loadDances(jsonFile, containerId, emptyId) {
  const container = document.getElementById(containerId);
  const empty = document.getElementById(emptyId);
  if (!container) return;

  try {
    const response = await fetch(jsonFile);
    if (!response.ok) throw new Error('Failed to load');

    const dances = await response.json();

    if (!dances || dances.length === 0) {
      container.style.display = 'none';
      if (empty) empty.style.display = 'block';
      return;
    }

    container.innerHTML = dances.map((dance, i) => `
      <a class="dance-card animate-in" href="${dance.instagram_url}" target="_blank" rel="noopener"
         style="animation-delay: ${i * 0.05}s">
        <div class="dance-card-thumb">
          <img src="${getPathPrefix() + dance.thumbnail}" alt="${escapeAttr(dance.title)}" loading="lazy">
          <div class="dance-card-play">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
        <div class="dance-card-info">
          <span class="dance-card-title">${dance.title}</span>
          ${dance.song ? `<span class="dance-card-song">${dance.song}</span>` : ''}
        </div>
      </a>
    `).join('');

  } catch (e) {
    if (container) container.style.display = 'none';
    if (empty) empty.style.display = 'block';
  }
}

async function loadHobbyCounts() {
  const prefix = getPathPrefix();
  try {
    const booksRes = await fetch(prefix + 'data/books.json');
    if (booksRes.ok) {
      const books = await booksRes.json();
      const el = document.getElementById('books-count');
      if (el) el.textContent = `${books.length} read`;
    }
  } catch (e) { }

  try {
    const danceRes = await fetch(prefix + 'data/dances.json');
    if (danceRes.ok) {
      const dances = await danceRes.json();
      const el = document.getElementById('dance-count');
      if (el) el.textContent = `${dances.length} videos`;
    }
  } catch (e) { }

  try {
    const kavitaRes = await fetch(prefix + 'data/kavitas.json');
    if (kavitaRes.ok) {
      const kavitas = await kavitaRes.json();
      const el = document.getElementById('kavita-count');
      if (el) el.textContent = `${kavitas.length} poems`;
    }
  } catch (e) { }

  try {
    const blogRes = await fetch(prefix + 'data/blog_posts.json');
    if (blogRes.ok) {
      const posts = await blogRes.json();
      const el = document.getElementById('blog-count');
      if (el) el.textContent = `${posts.length} posts`;
    }
  } catch (e) { }
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

function escapeAttr(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
  });
}

document.addEventListener('DOMContentLoaded', initScrollAnimations);