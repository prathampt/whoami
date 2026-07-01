/* ============================================
   PRATHAM TANDALE — Shared JavaScript
   Blog & Kavita listing logic
   ============================================ */

/**
 * Load a preview of posts (used on the home page).
 * Fetches a JSON file, renders the first `limit` items as a compact list.
 *
 * @param {string} jsonFile - Path to the JSON file (e.g., 'blog-posts.json')
 * @param {string} listId - ID of the container element
 * @param {string} emptyId - ID of the empty-state element
 * @param {number} limit - Max number of items to show
 * @param {boolean} isDevanagari - Whether to apply Devanagari styling
 */
async function loadPreview(jsonFile, listId, emptyId, limit, isDevanagari) {
  const list = document.getElementById(listId);
  const empty = document.getElementById(emptyId);

  try {
    const response = await fetch(jsonFile);
    if (!response.ok) throw new Error('Failed to load');

    const posts = await response.json();

    if (posts.length === 0) {
      list.style.display = 'none';
      empty.style.display = 'block';
      return;
    }

    // Sort by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    const items = posts.slice(0, limit);
    list.innerHTML = items.map(post => `
      <a class="post-item" href="${post.url}">
        <span class="post-item-title ${isDevanagari ? 'devanagari' : ''}">${post.title}</span>
        <span class="post-item-dash">—</span>
        <span class="post-item-date">${formatDate(post.date)}</span>
      </a>
    `).join('');

  } catch (e) {
    // If JSON file doesn't exist yet, show empty state
    list.style.display = 'none';
    empty.style.display = 'block';
  }
}

/**
 * Load full post listings (used on blog.html and kavita.html).
 * Fetches a JSON file and renders all items as cards.
 *
 * @param {string} jsonFile - Path to the JSON file
 * @param {string} containerId - ID of the container element
 * @param {string} emptyId - ID of the empty-state element
 * @param {boolean} isDevanagari - Whether to apply Devanagari styling
 */
async function loadPosts(jsonFile, containerId, emptyId, isDevanagari) {
  const container = document.getElementById(containerId);
  const empty = document.getElementById(emptyId);

  try {
    const response = await fetch(jsonFile);
    if (!response.ok) throw new Error('Failed to load');

    const posts = await response.json();

    if (posts.length === 0) {
      container.style.display = 'none';
      empty.style.display = 'block';
      return;
    }

    // Sort by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    container.innerHTML = posts.map((post, i) => `
      <a class="post-card animate-in" href="${post.url}" style="animation-delay: ${i * 0.05}s">
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
    container.style.display = 'none';
    empty.style.display = 'block';
  }
}

/**
 * Format a date string into a human-readable format.
 * @param {string} dateStr - ISO date string (e.g., '2026-07-01')
 * @returns {string} Formatted date (e.g., 'Jul 2026')
 */
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * Simple scroll-based reveal animation.
 * Adds 'animate-in' class when elements enter the viewport.
 */
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

// Initialize animations on DOM ready
document.addEventListener('DOMContentLoaded', initScrollAnimations);
