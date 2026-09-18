/* Loaded as a classic script by the Next.js /hub route after dataLoader.js,
   tools.js, and tech.js have already defined window.DataLoader / initTools / initTech. */
(function(){
  // Global delegated favicon fallback. It must exist before any section data loads,
  // because global search can render favicon images before Tools is initialized.
  document.addEventListener('error', function(e){
    const img = e.target;
    if (!img || img.tagName !== 'IMG') return;
    
    // Catch tool directory favicons and similar tool favicons
    if (img.classList.contains('tool-favicon') || img.classList.contains('td-favicon-lg') || img.classList.contains('td-sim-favicon')) {
      // First try the DuckDuckGo/Google fallback if we haven't already
      if (img.dataset && 'fallback' in img.dataset && !img.dataset.tried) {
        img.dataset.tried = '1';
        img.src = img.dataset.fallback;
        return;
      }
      
      // Fallback failed or wasn't provided: Render a premium, beautiful CSS gradient letter avatar!
      let name = '';
      const card = img.closest('.tool-card') || img.closest('.td-similar-card') || img.closest('.td-head');
      if (card) {
        const nameEl = card.querySelector('.tool-name') || card.querySelector('.td-sim-name') || card.querySelector('.td-title');
        if (nameEl) name = nameEl.textContent;
      }
      if (!name) name = img.alt || 'T';
      
      const letter = name.trim().charAt(0).toUpperCase() || 'T';
      
      // Calculate a beautiful premium gradient based on the first letter's character code
      const charCode = letter.charCodeAt(0);
      const hue1 = (charCode * 23) % 360;
      const hue2 = (hue1 + 45) % 360;
      const gradient = `linear-gradient(135deg, hsl(${hue1}, 80%, 55%) 0%, hsl(${hue2}, 85%, 42%) 100%)`;
      
      // Create the replacement div styled exactly like the original favicon size
      const avatar = document.createElement('div');
      avatar.className = img.className + ' premium-avatar-fallback';
      avatar.style.background = gradient;
      avatar.style.display = 'inline-flex';
      avatar.style.alignItems = 'center';
      avatar.style.justifyContent = 'center';
      avatar.style.color = '#ffffff';
      avatar.style.fontWeight = '800';
      avatar.style.textShadow = '0 1px 2px rgba(0,0,0,0.2)';
      avatar.style.fontFamily = 'Inter, system-ui, sans-serif';
      avatar.textContent = letter;
      
      // Size responsive configuration mapping the original CSS dimensions
      const isLarge = img.classList.contains('td-favicon-lg');
      const isSim = img.classList.contains('td-sim-favicon');
      
      avatar.style.width = isLarge ? '44px' : (isSim ? '20px' : '24px');
      avatar.style.height = isLarge ? '44px' : (isSim ? '20px' : '24px');
      avatar.style.borderRadius = isLarge ? '12px' : (isSim ? '5px' : '7px');
      avatar.style.fontSize = isLarge ? '18px' : (isSim ? '10px' : '11px');
      avatar.style.flexShrink = '0';
      avatar.style.boxShadow = '0 4px 12px rgba(15,23,42,.08)';
      avatar.style.border = '1px solid rgba(255,255,255,0.15)';
      
      if (img.parentNode) {
        img.parentNode.replaceChild(avatar, img);
      }
    }
  }, true);

  const loaded = {tools:false, tech:false};

  const tabsList = Array.from(document.querySelectorAll('.hub-nav .hub-nav-btn'));
  const sections = {
    tools: document.getElementById('tools-section'),
    tech: document.getElementById('tech-section')
  };
  const loading = document.getElementById('hub-loading');
  const resultChip = document.getElementById('hub-result-chip');
  const helpBtn = document.getElementById('hub-help-btn');
  const helpPop = document.getElementById('hub-help-popover');
  const countEls = {
    tools: document.getElementById('hub-count-tools'),
    tech: document.getElementById('hub-count-tech')
  };

  function setResultChip(text){
    if (!resultChip) return;
    if (text) { resultChip.textContent = text; resultChip.hidden = false; }
    else { resultChip.textContent = ''; resultChip.hidden = true; }
  }
  window.hubSetResultChip = setResultChip;

  const hubTotalMeta = document.getElementById('hub-total-meta');

  function updateCount(section) {
    const el = countEls[section];
    if (!el) return;
    let n = 0;
    if (section === 'tools' && window.__TOOLS_DATA__ && Array.isArray(window.__TOOLS_DATA__.tools)) {
      n = window.__TOOLS_DATA__.tools.length;
    } else if (section === 'tech' && Array.isArray(window.__TECH_DATA__)) {
      n = window.__TECH_DATA__.length;
    }
    if (n > 0) el.textContent = n.toLocaleString();
    updateTotalMeta();
  }

  function updateTotalMeta(){
    if (!hubTotalMeta) return;
    const toolsN = window.__TOOLS_DATA__ && Array.isArray(window.__TOOLS_DATA__.tools) ? window.__TOOLS_DATA__.tools.length : 0;
    const techN = Array.isArray(window.__TECH_DATA__) ? window.__TECH_DATA__.length : 0;
    const total = toolsN + techN;
    // Only overwrite once BOTH datasets are counted -- otherwise this briefly
    // shows a partial total (e.g. tools-only) as if it were the grand total.
    if (toolsN > 0 && techN > 0) {
      const updated = hubTotalMeta.dataset.updated || '';
      hubTotalMeta.textContent = total.toLocaleString() + ' items' + (updated ? ' · Updated ' + updated : '');
    }
  }

  async function activate(section, push) {
    if (!sections[section]) section = 'tools';

    // If both sections are missing from DOM, the component has unmounted. Abort early.
    if (!sections.tools && !sections.tech) return;

    tabsList.forEach(t => {
      if (!t) return;
      const on = t.dataset.target === section;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.setAttribute('tabindex', on ? '0' : '-1');
    });

    Object.keys(sections).forEach(k => {
      const el = sections[k];
      if (!el) return;
      const on = k === section;
      el.classList.toggle('active', on);
      if (on) el.removeAttribute('hidden'); else el.setAttribute('hidden', '');
    });

    if (!loaded[section]) {
      if (loading) loading.classList.remove('hidden');
      try {
        if (section === 'tech' && window.initTech) {
          await window.initTech();
          loaded.tech = true;
        } else if (section === 'tools' && window.initTools) {
          await window.initTools();
          loaded.tools = true;
        }
      } catch (e) {
        console.error('Error loading section:', e);
      } finally {
        if (loading) loading.classList.add('hidden');
      }
    }
    updateCount(section);
    // Try to fill the other side too (cheap if loaded; no-op if not)
    updateCount(section === 'tools' ? 'tech' : 'tools');

    // Ask the active section to refresh its result-chip text
    window.dispatchEvent(new CustomEvent('hub-message', {detail: {type:'refreshChip'}}));
    document.title = section === 'tech' ? 'Tech Stack | ToolAtlas' : 'AI Tools | ToolAtlas';

    if (push) {
      try { history.replaceState(null, '', '#' + section); } catch(e) {}
      try { localStorage.setItem('hubSection', section); } catch(e) {}
    }
  }

  function msgSection(section, msg, delay) {
    setTimeout(function() {
      window.dispatchEvent(new CustomEvent('hub-message', { detail: msg }));
    }, delay != null ? delay : (loaded[section] ? 80 : 900));
  }

  function applyHash(hash, push) {
    const parts = (hash || '').replace(/^#/, '').split('/');
    const section = parts[0].toLowerCase();
    if (section !== 'tools' && section !== 'tech') return false;
    activate(section, push);
    const cat  = parts[1] || '';
    const item = parts[2] || '';
    if (item) {
      msgSection(section, {type:'scrollToItem', id:item, category:cat});
    } else if (cat) {
      msgSection(section, {type:'selectCategory', id:cat});
    }
    return true;
  }

  // Click + keyboard tablist nav (WAI-ARIA roving tabindex)
  tabsList.forEach((t, idx) => {
    t.addEventListener('click', () => activate(t.dataset.target, true));
    t.addEventListener('keydown', e => {
      let target = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') target = (idx + 1) % tabsList.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') target = (idx - 1 + tabsList.length) % tabsList.length;
      else if (e.key === 'Home') target = 0;
      else if (e.key === 'End') target = tabsList.length - 1;
      else return;
      e.preventDefault();
      const next = tabsList[target];
      next.focus();
      activate(next.dataset.target, true);
    });
  });

  window.addEventListener('hashchange', () => applyHash(location.hash, false));

  const hubSearchEl = document.getElementById('hub-global-search');
  const hubResultsEl = document.getElementById('hub-global-search-results');
  const hubSearchClearEl = document.getElementById('hub-global-search-clear');
  const hubSearchWrap = hubSearchEl ? hubSearchEl.closest('.hub-search') : null;
  const hubSearchTrigger = document.getElementById('hub-search-trigger');
  const hubSearchLive = document.getElementById('hub-search-live');

  function announceResults(count) {
    if (!hubSearchLive) return;
    hubSearchLive.textContent = count
      ? count + ' result' + (count === 1 ? '' : 's') + ' available'
      : 'No results';
  }

  // Assign unique ids to every result option so aria-activedescendant can reference them.
  function assignResultOptionIds() {
    if (!hubResultsEl) return;
    hubResultsEl.querySelectorAll('.hub-result').forEach((el, i) => {
      if (!el.id) el.id = 'hub-result-opt-' + i;
    });
  }

  const HUB_RECENT_KEY = 'hub_global_search_recent_v1';
  const SUGGESTED = ['AI coding', 'SEO', 'WordPress', 'database', 'meeting notes', 'image generation', 'Docker', 'Figma'];

  function getHubRecent(){ try { return JSON.parse(localStorage.getItem(HUB_RECENT_KEY) || '[]'); } catch(e) { return []; } }
  function addHubRecent(query, sec, id){
    if (!query || query.length < 2) return;
    let r = getHubRecent().filter(x => x.q.toLowerCase() !== query.toLowerCase());
    r.unshift({q: query, s: sec, id: id, t: Date.now()});
    try { localStorage.setItem(HUB_RECENT_KEY, JSON.stringify(r.slice(0, 6))); } catch(e) {}
  }

  document.addEventListener('keydown', e => {
    // Ctrl/Cmd+K — always focuses global search, even from inside input fields
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      if (hubSearchEl) { e.preventDefault(); if (hubSearchWrap) { hubSearchWrap.hidden = false; hubSearchEl.setAttribute('aria-expanded','true'); } hubSearchEl.focus(); hubSearchEl.select(); }
      return;
    }
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (e.key === '1') { e.preventDefault(); activate('tools', true); }
    if (e.key === '2') { e.preventDefault(); activate('tech',  true); }
    if (e.key === '/') { e.preventDefault(); if (hubSearchWrap) { hubSearchWrap.hidden = false; hubSearchEl.setAttribute('aria-expanded','true'); } if (hubSearchEl) hubSearchEl.focus(); }
  });

  if (hubSearchTrigger && hubSearchWrap && hubSearchEl) {
    hubSearchTrigger.addEventListener('click', () => {
      hubSearchWrap.hidden = false;
      hubSearchEl.setAttribute('aria-expanded', 'true');
      requestAnimationFrame(() => { hubSearchEl.focus(); hubSearchEl.select(); });
    });
  }

  document.addEventListener('click', e => {
    if (!hubSearchWrap || hubSearchWrap.hidden) return;
    if (hubSearchWrap.contains(e.target) || (hubSearchTrigger && hubSearchTrigger.contains(e.target))) return;
    hubSearchWrap.hidden = true;
    hubSearchEl.setAttribute('aria-expanded','false');
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && hubSearchWrap && !hubSearchWrap.hidden && (!hubResultsEl || hubResultsEl.hidden)) {
      hubSearchWrap.hidden = true;
      hubSearchEl.setAttribute('aria-expanded','false');
      if (hubSearchTrigger) hubSearchTrigger.focus();
    }
  });

  let searchLoaded = false;
  let searchLoading = false;
  let searchTimer = null;
  let lastQuery = '';
  let searchMode = 'all';

  function loadSearchIndex(cb) {
    if (searchLoaded) { cb(); return; }
    searchLoading = true;
    const tasks = [DataLoader.loadData('data/search-index.js', '__SEARCH_INDEX__')];
    if (!window.__TOOLS_DATA__) tasks.push(DataLoader.loadData('data/tools-data.js', '__TOOLS_DATA__').catch(() => null));
    if (!window.__TECH_DATA__) tasks.push(DataLoader.loadData('data/tech-data.js', '__TECH_DATA__').catch(() => null));
    Promise.all(tasks).then(() => {
      searchLoaded = true; searchLoading = false;
      cb();
    }).catch(() => { searchLoading = false; cb(); });
  }

  // Preload tools + tech data so global search can show proper icons and
  // sub-lines even before the user opens either section.
  function preloadDataForSearch() {
    const tasks = [];
    if (!window.__TOOLS_DATA__) tasks.push(DataLoader.loadData('data/tools-data.js', '__TOOLS_DATA__').catch(() => {}));
    if (!window.__TECH_DATA__) tasks.push(DataLoader.loadData('data/tech-data.js', '__TECH_DATA__').catch(() => {}));
    // Once whichever dataset the active tab didn't already load resolves, refresh
    // both nav counts and the combined total -- otherwise the header keeps showing
    // only the first-loaded dataset's count even after the second one arrives.
    if (tasks.length) {
      Promise.all(tasks).then(() => {
        updateCount('tools');
        updateCount('tech');
      });
    }
  }
  if ('requestIdleCallback' in window) {
    requestIdleCallback(preloadDataForSearch, {timeout: 2000});
  } else {
    setTimeout(preloadDataForSearch, 600);
  }

  function esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function highlight(text, words) {
    let out = esc(text);
    words.forEach(w => {
      if (!w) return;
      const re = new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig');
      out = out.replace(re, '<mark>$1</mark>');
    });
    return out;
  }

  function lookupToolDomain(id) {
    if (window.__TOOLS_DATA__ && Array.isArray(window.__TOOLS_DATA__.tools)) {
      const t = window.__TOOLS_DATA__.tools.find(x => x.id === id);
      if (t) return {domain: t.domain || '', desc: t.tagline || t.description || '', pricing: t.pricing || ''};
    }
    return null;
  }

  function lookupTechSub(id) {
    if (Array.isArray(window.__TECH_DATA__)) {
      const t = window.__TECH_DATA__.find(x => x.id === id);
      if (t) return {sub: t.sub || '', desc: t.desc || '', icon: t.icon || '', github: t.github || '', url: t.url || ''};
    }
    return null;
  }

  function setSearchWrapExpanded(open) {
    if (hubSearchEl) hubSearchEl.setAttribute('aria-expanded', open ? 'true' : 'false');
  }


  const SEARCH_SYNONYMS = {
    ai: ['artificial intelligence', 'llm', 'chatbot', 'agent'],
    llm: ['ai', 'large language model', 'chatbot', 'agents'],
    chatbot: ['ai assistant', 'chatgpt', 'llm'],
    agent: ['automation', 'workflow', 'autonomous'],
    agents: ['automation', 'workflow', 'autonomous'],
    seo: ['search engine optimization', 'keyword', 'content optimization'],
    writing: ['copywriting', 'content', 'blog', 'editor'],
    meeting: ['call', 'notes', 'transcription', 'summary'],
    meetings: ['call', 'notes', 'transcription', 'summary'],
    database: ['db', 'sql', 'postgres', 'mysql', 'storage'],
    databases: ['db', 'sql', 'postgres', 'mysql', 'storage'],
    postgres: ['postgresql', 'database', 'sql'],
    postgress: ['postgresql', 'postgres', 'database'],
    javascript: ['js', 'typescript', 'node'],
    javasript: ['javascript', 'js'],
    typescript: ['ts', 'javascript'],
    figmma: ['figma', 'design'],
    figma: ['design', 'prototype'],
    copliot: ['copilot', 'coding'],
    copilot: ['coding', 'assistant'],
    chrome: ['browser', 'extension', 'plugin'],
    plugin: ['extension', 'addon'],
    addon: ['plugin', 'extension'],
    wordpress: ['wp', 'cms', 'plugin'],
    docker: ['container', 'image', 'devops'],
    kubernetes: ['k8s', 'containers', 'orchestration'],
    k8s: ['kubernetes'],
    auth: ['authentication', 'identity', 'login'],
    payment: ['billing', 'stripe', 'checkout'],
    payments: ['billing', 'stripe', 'checkout'],
    video: ['editing', 'generation', 'avatar'],
    image: ['photo', 'design', 'generation'],
    voice: ['audio', 'speech', 'tts'],
    audio: ['voice', 'speech', 'music']
  };

  function normalizeSearch(s){
    return String(s || '').toLowerCase().replace(/[^a-z0-9+#.\s-]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function expandQueryWords(query){
    const base = normalizeSearch(query).split(/\s+/).filter(Boolean);
    const expanded = new Set(base);
    base.forEach(w => (SEARCH_SYNONYMS[w] || []).forEach(x => normalizeSearch(x).split(/\s+/).filter(Boolean).forEach(t => expanded.add(t))));
    const phrase = normalizeSearch(query);
    if (SEARCH_SYNONYMS[phrase]) SEARCH_SYNONYMS[phrase].forEach(x => normalizeSearch(x).split(/\s+/).filter(Boolean).forEach(t => expanded.add(t)));
    return {base, expanded:[...expanded].filter(Boolean)};
  }

  function editDistance(a,b,max){
    if (!a || !b) return Math.max((a||'').length, (b||'').length);
    if (Math.abs(a.length-b.length) > max) return max + 1;
    const prev = Array.from({length:b.length+1}, (_,i)=>i);
    const curr = new Array(b.length+1);
    for(let i=1;i<=a.length;i++){
      curr[0]=i;
      let rowMin=curr[0];
      for(let j=1;j<=b.length;j++){
        const cost = a[i-1] === b[j-1] ? 0 : 1;
        curr[j] = Math.min(prev[j]+1, curr[j-1]+1, prev[j-1]+cost);
        rowMin = Math.min(rowMin, curr[j]);
      }
      if(rowMin > max) return max + 1;
      for(let j=0;j<=b.length;j++) prev[j]=curr[j];
    }
    return prev[b.length];
  }

  function wordMatchScore(word, hay, tokens){
    if (!word) return 0;
    if (hay.includes(word)) return 18;
    if (word.length >= 4) {
      for (const t of tokens) {
        if (!t || Math.abs(t.length - word.length) > 2) continue;
        const d = editDistance(word, t, word.length > 6 ? 2 : 1);
        if (d <= (word.length > 6 ? 2 : 1)) return 8;
      }
    }
    return 0;
  }

  function categoryItems(){
    const cats = [];
    if (window.__TOOLS_DATA__ && Array.isArray(window.__TOOLS_DATA__.categories)) {
      window.__TOOLS_DATA__.categories.forEach(c => cats.push({s:'category', section:'tools', id:c.id, n:c.label, c:'AI Tools', count:c.count || 0, k:[c.label, 'AI Tools', 'tools category'].join(' ')}));
    }
    if (Array.isArray(window.__TECH_DATA__)) {
      const byId = new Map();
      window.__TECH_DATA__.forEach(t => {
        if (!t.category || t.category === 'all') return;
        const label = t.category_label || t.category;
        const cur = byId.get(t.category) || {s:'category', section:'tech', id:t.category, n:label, c:'Tech Stack', count:0, k:[label, 'Tech Stack', 'technology category'].join(' ')};
        cur.count += 1;
        byId.set(t.category, cur);
      });
      byId.forEach(v => cats.push(v));
    }
    return cats;
  }

  function searchScore(rawItem, queryInfo, phrase){
    const name = normalizeSearch(rawItem.n || '');
    const hay = normalizeSearch([rawItem.n, rawItem.c, rawItem.k, rawItem.sub, rawItem.count].join(' '));
    const tokens = hay.split(/\s+/).filter(Boolean);
    let score = Number(rawItem.rank || 0) / 20;
    if (name === phrase) score += 160;
    else if (name.startsWith(phrase)) score += 110;
    else if (name.includes(phrase)) score += 70;
    else if (hay.includes(phrase)) score += 35;
    let requiredHit = !queryInfo.base.length;
    queryInfo.base.forEach(w => { const s = wordMatchScore(w, hay, tokens); if (s) requiredHit = true; score += s; });
    queryInfo.expanded.forEach(w => {
      if (queryInfo.base.includes(w)) return;
      const s = wordMatchScore(w, hay, tokens);
      if (s) requiredHit = true;
      score += Math.min(8, s / 2);
    });
    if (!requiredHit) return 0;
    if (rawItem.s === 'category') score += 12;
    return score;
  }

  function renderSearchTabs(active, counts){
    const tabs = [
      ['all','All', (counts.tools||0)+(counts.tech||0)+(counts.category||0)],
      ['tools','Tools', counts.tools||0],
      ['tech','Tech', counts.tech||0],
      ['categories','Categories', counts.category||0]
    ];
    // A row of filter toggles over one shared results list, not a tablist
    // owning separate tabpanels -- role="group" + aria-pressed is the
    // correct pattern here (role="tab" with no matching tabpanel is invalid).
    return '<div class="hub-search-tabs" role="group" aria-label="Filter search results by type">' + tabs.map(([id,label,count]) =>
      '<button type="button" class="hub-search-tab ' + (active===id?'active':'') + '" data-search-tab="' + id + '" aria-pressed="' + (active===id?'true':'false') + '">' + label + ' <span>' + count + '</span></button>'
    ).join('') + '</div>';
  }

  function openResults() {
    if (hubResultsEl) { hubResultsEl.hidden = false; setSearchWrapExpanded(true); }
  }
  function closeResults() {
    if (hubResultsEl) { hubResultsEl.hidden = true; setSearchWrapExpanded(false); }
    if (hubSearchEl) hubSearchEl.removeAttribute('aria-activedescendant');
  }

  function renderEmpty() {
    if (!hubResultsEl) return;
    const recents = getHubRecent();
    let html = renderSearchTabs(searchMode, {tools:0, tech:0, category:0});
    if (recents.length) {
      html += '<div class="hub-results-section" role="group">';
      html += '<div class="hub-result-group"><span class="hub-result-group-icon">⌚</span> Recent searches <span class="hub-result-group-count">' + recents.length + '</span></div>';
      recents.forEach(r => {
        html += '<div class="hub-result" role="option" data-recent="1" data-q="' + esc(r.q) + '"' +
          (r.id ? ' data-section="' + esc(r.s) + '" data-id="' + esc(r.id) + '"' : '') + '>' +
          '<span class="hub-result-favicon">⌚</span>' +
          '<span class="hub-result-body"><span class="hub-result-name">' + esc(r.q) + '</span><span class="hub-result-sub">Recent search</span></span>' +
          '<span class="hub-result-side"><span class="hub-result-enter">↵</span></span></div>';
      });
      html += '</div>';
    }
    html += '<div class="hub-results-section" role="group">';
    html += '<div class="hub-result-group"><span class="hub-result-group-icon">✨</span> Try searching for</div>';
    html += '<div class="hub-suggest-row">' + SUGGESTED.map(s => '<button type="button" class="hub-suggest-pill" data-suggest="' + esc(s) + '">' + esc(s) + '</button>').join('') + '</div>';
    html += '</div>';
    html += renderFooter(0);
    hubResultsEl.innerHTML = html;
    bindResultRows();
    assignResultOptionIds();
    if (hubSearchEl) hubSearchEl.removeAttribute('aria-activedescendant');
    openResults();
  }

  function renderFooter(count) {
    return '<div class="hub-results-footer">' +
      '<span>' + (count ? count + ' result' + (count===1?'':'s') : 'Press <kbd>esc</kbd> to close') + '</span>' +
      '<span class="hub-results-footer-keys">' +
        '<span class="hub-results-footer-key"><kbd>↑</kbd><kbd>↓</kbd> navigate</span>' +
        '<span class="hub-results-footer-key"><kbd>↵</kbd> open</span>' +
      '</span></div>';
  }

  function renderLoading() {
    if (!hubResultsEl) return;
    hubResultsEl.innerHTML = '<div class="hub-results-loading">Loading search index…</div>';
    openResults();
  }

  function runSearch(query) {
    if (!hubResultsEl) return;
    const q = query.trim();
    lastQuery = q;
    if (!q) { renderEmpty(); return; }
    if (!searchLoaded && !searchLoading) renderLoading();
    loadSearchIndex(() => {
      if (lastQuery !== q) return; // stale
      const queryInfo = expandQueryWords(q);
      const phrase = normalizeSearch(q);
      const idx = window.__SEARCH_INDEX__ || [];
      const cats = categoryItems();
      const allItems = idx.concat(cats);
      const scored = allItems
        .map(item => ({item, score: searchScore(item, queryInfo, phrase)}))
        .filter(x => x.score > 0)
        .sort((a, b) => b.score - a.score || String(a.item.n||'').localeCompare(String(b.item.n||'')));

      const counts = {tools:0, tech:0, category:0};
      scored.forEach(x => { if (x.item.s === 'tools') counts.tools++; else if (x.item.s === 'tech') counts.tech++; else if (x.item.s === 'category') counts.category++; });
      const active = searchMode || 'all';
      const filtered = scored.filter(x => {
        if (active === 'all') return true;
        if (active === 'categories') return x.item.s === 'category';
        return x.item.s === active;
      }).slice(0, 30).map(x => x.item);

      if (!filtered.length) {
        hubResultsEl.innerHTML = renderSearchTabs(active, counts) +
          '<div class="hub-no-results"><strong>No matches for "' + esc(q) + '"</strong><span>Try a broader term, a synonym, or one of these popular searches.</span><div class="hub-suggest-row">' +
          SUGGESTED.map(s => '<button type="button" class="hub-suggest-pill" data-suggest="' + esc(s) + '">' + esc(s) + '</button>').join('') +
          '</div></div>' + renderFooter(0);
        bindResultRows();
        assignResultOptionIds();
        announceResults(0);
        if (hubSearchEl) hubSearchEl.removeAttribute('aria-activedescendant');
        openResults();
        return;
      }

      const bySection = {category: [], tools: [], tech: []};
      filtered.forEach(h => { if (bySection[h.s]) bySection[h.s].push(h); });

      let html = renderSearchTabs(active, counts);
      [
        ['category', 'Categories', '▦'],
        ['tools', 'AI Tools', '🧰'],
        ['tech', 'Tech Stack', '🛠️']
      ].forEach(([sec, label, icon]) => {
        const grp = bySection[sec];
        if (!grp.length) return;
        html += '<div class="hub-results-section" role="group">';
        html += '<div class="hub-result-group"><span class="hub-result-group-icon">' + icon + '</span>' + label + '<span class="hub-result-group-count">' + grp.length + '</span></div>';
        grp.forEach(h => {
          let sub = '';
          let faviconCell = '<span class="hub-result-favicon">' + icon + '</span>';
          let badgeLabel = label;
          let badgeClass = sec;
          if (sec === 'category') {
            sub = (h.section === 'tools' ? 'AI Tools category' : 'Tech Stack category') + (h.count ? ' · ' + h.count.toLocaleString() + ' items' : '');
            badgeLabel = 'Category';
          } else if (sec === 'tools') {
            const meta = lookupToolDomain(h.id);
            if (meta) {
              const parts = [];
              if (h.c) parts.push(h.c);
              if (meta.domain) parts.push(meta.domain);
              if (meta.pricing && !/^unknown$/i.test(meta.pricing)) parts.push(meta.pricing);
              sub = parts.join(' · ');
              if (meta.domain) {
                faviconCell = '<span class="hub-result-favicon"><img width="20" height="20" loading="lazy" alt="" src="https://www.google.com/s2/favicons?domain=' + encodeURIComponent(meta.domain) + '&sz=32" data-fallback="https://icons.duckduckgo.com/ip3/' + encodeURIComponent(meta.domain) + '.ico"></span>';
              }
            }
          } else {
            const meta = lookupTechSub(h.id);
            if (meta) {
              sub = [h.c, meta.sub || ''].filter(Boolean).join(' · ');
              if (meta.icon) {
                faviconCell = '<span class="hub-result-favicon hub-result-favicon-emoji">' + esc(meta.icon) + '</span>';
              } else if (meta.github) {
                const owner = String(meta.github).split('/')[0];
                if (owner) faviconCell = '<span class="hub-result-favicon"><img width="20" height="20" loading="lazy" alt="" src="https://github.com/' + encodeURIComponent(owner) + '.png?size=32"></span>';
              }
            }
          }
          html += '<div class="hub-result" role="option" data-section="' + sec + '" data-target-section="' + esc(h.section || '') + '" data-id="' + esc(h.id) + '" data-cat="' + esc(h.c || h.id) + '">' +
            faviconCell +
            '<span class="hub-result-body">' +
              '<span class="hub-result-name">' + highlight(h.n, queryInfo.base) + '</span>' +
              (sub ? '<span class="hub-result-sub">' + esc(sub) + '</span>' : '') +
            '</span>' +
            '<span class="hub-result-side">' +
              '<span class="hub-result-badge ' + badgeClass + '">' + badgeLabel + '</span>' +
              '<span class="hub-result-enter">↵</span>' +
            '</span></div>';
        });
        html += '</div>';
      });
      html += renderFooter(filtered.length);

      hubResultsEl.innerHTML = html;
      bindResultRows();
      assignResultOptionIds();
      announceResults(filtered.length);
      const first = hubResultsEl.querySelector('.hub-result');
      if (first) setActiveResult(first);
      openResults();
    });
  }

  function bindResultRows() {
    hubResultsEl.querySelectorAll('[data-search-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        searchMode = btn.dataset.searchTab || 'all';
        runSearch(hubSearchEl.value || '');
        hubSearchEl.focus();
      });
    });
    hubResultsEl.querySelectorAll('.hub-result, .hub-suggest-pill').forEach(el => {
      el.addEventListener('click', () => {
        if (el.classList.contains('hub-suggest-pill')) {
          hubSearchEl.value = el.dataset.suggest;
          runSearch(hubSearchEl.value);
          hubSearchEl.focus();
          updateClearButton();
          return;
        }
        if (el.dataset.recent === '1' && !el.dataset.id) {
          hubSearchEl.value = el.dataset.q;
          runSearch(hubSearchEl.value);
          hubSearchEl.focus();
          updateClearButton();
          return;
        }
        activateResult(el);
      });
      if (el.classList.contains('hub-result')) {
        el.addEventListener('mouseenter', () => setActiveResult(el));
      }
    });
  }

  async function activateResult(el) {
    if (!el) return;
    const sec = el.dataset.section;
    if (!sec) return;
    if (sec === 'category') {
      const targetSection = el.dataset.targetSection || 'tools';
      await activate(targetSection, true);
      msgSection(targetSection, {type:'selectCategory', id:el.dataset.id}, 0);
      addHubRecent(hubSearchEl.value.trim() || el.querySelector('.hub-result-name')?.textContent || '', targetSection, el.dataset.id);
      closeResults();
      hubSearchEl.value = '';
      updateClearButton();
      return;
    }
    await activate(sec, true);
    if (sec === 'tools') {
      msgSection(sec, {type:'openTool', id:el.dataset.id}, 0);
    } else {
      msgSection(sec, {type:'scrollToItem', id:el.dataset.id, category:el.dataset.cat}, 0);
    }
    addHubRecent(hubSearchEl.value.trim() || el.querySelector('.hub-result-name')?.textContent || '', sec, el.dataset.id);
    closeResults();
    hubSearchEl.value = '';
    updateClearButton();
  }

  function setActiveResult(el) {
    if (!hubResultsEl) return;
    hubResultsEl.querySelectorAll('.hub-result.is-active').forEach(n => { n.classList.remove('is-active'); n.removeAttribute('aria-selected'); });
    if (el) {
      el.classList.add('is-active');
      if (!el.id) assignResultOptionIds();
      el.setAttribute('aria-selected', 'true');
      if (hubSearchEl && el.id) hubSearchEl.setAttribute('aria-activedescendant', el.id);
      el.scrollIntoView({block: 'nearest'});
    } else if (hubSearchEl) {
      hubSearchEl.removeAttribute('aria-activedescendant');
    }
  }

  function moveActiveResult(direction) {
    if (!hubResultsEl || hubResultsEl.hidden) return;
    const all = Array.from(hubResultsEl.querySelectorAll('.hub-result'));
    if (!all.length) return;
    const current = hubResultsEl.querySelector('.hub-result.is-active');
    let idx = current ? all.indexOf(current) : -1;
    idx = (idx + direction + all.length) % all.length;
    setActiveResult(all[idx]);
  }

  function updateClearButton() {
    if (!hubSearchClearEl) return;
    if (hubSearchEl.value) hubSearchClearEl.removeAttribute('hidden');
    else hubSearchClearEl.setAttribute('hidden', '');
  }

  function broadcastSearch(query) {
    window.dispatchEvent(new CustomEvent('hub-message', {detail: {type: 'search', query: query || ''}}));
  }

  if (hubSearchEl && hubResultsEl) {
    hubSearchEl.addEventListener('input', () => {
      updateClearButton();
      clearTimeout(searchTimer);
      const v = hubSearchEl.value;
      searchTimer = setTimeout(() => { runSearch(v); broadcastSearch(v); }, 140);
    });
    hubSearchEl.addEventListener('focus', () => {
      if (!hubSearchEl.value.trim()) renderEmpty();
      else openResults();
    });
    hubSearchEl.addEventListener('keydown', e => {
      if (e.key === 'Escape') { closeResults(); hubSearchEl.blur(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); moveActiveResult(1); return; }
      if (e.key === 'ArrowUp')   { e.preventDefault(); moveActiveResult(-1); return; }
      if (e.key === 'Enter') {
        e.preventDefault();
        const active = hubResultsEl.querySelector('.hub-result.is-active') || hubResultsEl.querySelector('.hub-result');
        if (active) {
          if (active.dataset.recent === '1' && !active.dataset.id) {
            hubSearchEl.value = active.dataset.q;
            runSearch(hubSearchEl.value);
          } else {
            activateResult(active);
          }
        }
      }
    });
    if (hubSearchClearEl) {
      hubSearchClearEl.addEventListener('click', () => {
        hubSearchEl.value = '';
        updateClearButton();
        hubSearchEl.focus();
        renderEmpty();
        broadcastSearch('');
      });
    }
    document.addEventListener('click', e => {
      if (!hubSearchEl.contains(e.target) && !hubResultsEl.contains(e.target) && (!hubSearchClearEl || !hubSearchClearEl.contains(e.target))) {
        closeResults();
      }
    });
  }

  if (helpBtn && helpPop) {
    helpBtn.addEventListener('click', () => {
      const open = helpPop.hasAttribute('hidden') ? false : true;
      if (open) { helpPop.setAttribute('hidden',''); helpBtn.setAttribute('aria-expanded','false'); }
      else { helpPop.removeAttribute('hidden'); helpBtn.setAttribute('aria-expanded','true'); }
    });
    document.addEventListener('click', e => {
      if (!helpPop.contains(e.target) && !helpBtn.contains(e.target)) {
        helpPop.setAttribute('hidden',''); helpBtn.setAttribute('aria-expanded','false');
      }
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') { helpPop.setAttribute('hidden',''); helpBtn.setAttribute('aria-expanded','false'); }
    });
  }

  let saved = '';
  try { saved = localStorage.getItem('hubSection') || ''; } catch(e) {}
  if (!applyHash(location.hash, false)) {
    activate((saved === 'tools' || saved === 'tech') ? saved : 'tools', false);
  }
})();

