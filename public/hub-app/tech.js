window.initTech = async function() {
  try {
    const raw = await DataLoader.loadData('data/tech-data.js', '__TECH_DATA__');
    raw.forEach(function(t){
      t.tags = Array.isArray(t.tags) ? t.tags : [];
      t.badges = Array.isArray(t.badges) ? t.badges : [];
      t.platforms = Array.isArray(t.platforms) ? t.platforms : [];
      t.target_user = Array.isArray(t.target_user) ? t.target_user : [];
    });

    const CATEGORIES = [{"id":"all","label":"All Technologies","icon":"🌐"},{"id":"programming_languages","label":"Programming Languages","icon":"📝"},{"id":"runtimes_edge_wasm","label":"Runtimes, Edge & WebAssembly","icon":"🌍"},{"id":"js_ts_packages","label":"JavaScript & TypeScript Packages","icon":"📦"},{"id":"python_packages","label":"Python Packages","icon":"🐍"},{"id":"frontend_ui","label":"Frontend Frameworks & UI","icon":"🎨"},{"id":"fullstack_web","label":"Full-Stack Web Frameworks","icon":"🔄"},{"id":"backend_servers","label":"Backend Frameworks & Servers","icon":"⚙️"},{"id":"mobile_desktop","label":"Mobile & Desktop Development","icon":"📱"},{"id":"databases_storage_search","label":"Databases, Storage & Search","icon":"🗄️"},{"id":"ai_ml_data_science","label":"AI, ML & Data Science","icon":"🤖"},{"id":"data_eng_analytics","label":"Data Engineering & Analytics","icon":"📊"},{"id":"apis_sdks_dev_platforms","label":"APIs, SDKs & Developer Platforms","icon":"🔌"},{"id":"cloud_hosting","label":"Cloud Platforms & Hosting","icon":"☁️"},{"id":"devops_infra","label":"DevOps, Containers & Infrastructure","icon":"🐳"},{"id":"build_package_release","label":"Build, Package & Release Tools","icon":"📦"},{"id":"testing_qa","label":"Testing & Quality Assurance","icon":"🧪"},{"id":"monitoring_observability","label":"Monitoring & Observability","icon":"📈"},{"id":"security_auth_identity","label":"Security, Auth & Identity","icon":"🔐"},{"id":"messaging_queues_workflows","label":"Messaging, Queues & Workflows","icon":"📬"},{"id":"cms_wordpress_commerce","label":"CMS, WordPress & Commerce","icon":"🟦"},{"id":"browser_ide_extensions","label":"Browser & IDE Extensions","icon":"🧩"},{"id":"design_figma_creative","label":"Design, Figma & Creative Tools","icon":"🎨"},{"id":"docs_knowledge_collab","label":"Docs, Knowledge & Collaboration","icon":"📚"},{"id":"payments_billing","label":"Payments & Billing","icon":"💳"},{"id":"blockchain_web3_crypto","label":"Blockchain, Web3 & Crypto","icon":"⛓️"},{"id":"iot_embedded_hardware","label":"IoT, Embedded & Hardware","icon":"🔌"},{"id":"game_development","label":"Game Development","icon":"🎮"},{"id":"lowcode_nocode_baas","label":"Low-Code, No-Code & BaaS","icon":"🧱"},{"id":"self_hosted_open_source","label":"Self-Hosted & Open-Source Tools","icon":"🏠"}];

    const CARD_PAGE_SIZE = 60;
    let activeTab = 'all';
    let activeGroup = 'all';
    let activePreset = 'all';
    let presetQuery = '';
    let searchQuery = '';
    let categoryQuery = '';
    let sortMode = 'recommended';
    let advancedOpen = false;
    let advFilters = {type:'all', ecosystem:'all', platform:'all', open_source:'all', use_case:'all'};
    let visibleCount = CARD_PAGE_SIZE;
    let lastRenderKey = '';

    const els = {
      tabs: document.getElementById('tech-tabs'),
      content: document.getElementById('tech-content'),
      categorySearch: document.getElementById('tech-categorySearch'),
      categorySummary: document.getElementById('tech-categorySummary'),
      detailModal: document.getElementById('tech-techDetailModal'),
      tdIcon: document.getElementById('tech-tdIcon'),
      tdName: document.getElementById('tech-tdName'),
      tdUrlLink: document.getElementById('tech-tdUrlLink'),
      tdBody: document.getElementById('tech-tdBody'),
      tdClose: document.getElementById('tech-tdClose')
    };

    // If core elements are missing from the DOM, the hub route has unmounted. Abort early.
    if (!els.tabs || !els.content) {
      console.warn("[hub] Tech elements missing from DOM. Aborting initialization.");
      return;
    }

    function scrollSectionTop(){ const sec = document.getElementById('tech-section'); if (sec) sec.scrollTo({top: 0, behavior: 'smooth'}); }
    function escapeHtml(value){ return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
    function normalize(s){ return String(s || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' '); }
    function categoryLabel(id){ return (CATEGORIES.find(c => c.id === id) || {}).label || id; }
    function categoryIcon(id){ return (CATEGORIES.find(c => c.id === id) || {}).icon || '•'; }
    function asArray(value){ return Array.isArray(value) ? value : []; }
    function compact(values){ return [...new Set(values.filter(Boolean).map(v => String(v)).filter(v => v && !/^unknown$/i.test(v)))]; }

    function getBaseItems(){ return raw.filter(t => activeTab === 'all' || t.category === activeTab); }
    function getGroup(t){ return t.group || t.sub || categoryLabel(t.category) || 'General'; }
    function getGroups(items){
      if(activeTab === 'all') return [];
      const counts = new Map();
      items.forEach(t => { const g = getGroup(t); if(g) counts.set(g, (counts.get(g) || 0) + 1); });
      return [...counts.entries()].sort((a,b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    }
    function uniqueValues(items, getter, limit){
      const counts = new Map();
      items.forEach(item => (getter(item) || []).forEach(v => { if(v) counts.set(v, (counts.get(v) || 0) + 1); }));
      return [...counts.entries()].sort((a,b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, limit || 14).map(x => x[0]);
    }
    function passAdvanced(t){
      if(advFilters.type !== 'all' && t.tech_type !== advFilters.type) return false;
      if(advFilters.ecosystem !== 'all' && t.package_manager !== advFilters.ecosystem) return false;
      if(advFilters.platform !== 'all' && !(t.platforms || []).includes(advFilters.platform)) return false;
      if(advFilters.open_source === 'yes' && t.open_source !== true) return false;
      if(advFilters.open_source === 'no' && t.open_source === true) return false;
      if(advFilters.use_case !== 'all') {
        const hay = [t.category_label, t.group, t.sub, (t.tags || []).join(' '), (t.badges || []).join(' ')].join(' ').toLowerCase();
        if(!hay.includes(String(advFilters.use_case).toLowerCase())) return false;
      }
      return true;
    }
    function matches(t){
      if(activeTab !== 'all' && t.category !== activeTab) return false;
      if(activeGroup !== 'all' && getGroup(t) !== activeGroup) return false;
      if(!passAdvanced(t)) return false;
      if(searchQuery){
        const words = normalize(searchQuery).split(/\s+/).filter(Boolean);
        if(words.length){
          const hay = normalize([t.name, t.desc, t.description, t.sub, t.group, t.category_label, (t.tags || []).join(' '), (t.badges || []).join(' '), t.package_name, t.github].join(' '));
          if(!words.every(w => hay.includes(w))) return false;
        }
      }
      return true;
    }

    function findTechCategoryByLabel(pattern){
      const rx = pattern instanceof RegExp ? pattern : new RegExp(String(pattern), 'i');
      const found = CATEGORIES.find(c => c.id !== 'all' && rx.test(c.label || ''));
      return found ? found.id : 'all';
    }

    const TECH_PRESETS = [
      {key:'frontend', label:'Frontend Developer', cat:'frontend_ui', query:'react next vite tailwind ui', sort:'developer'},
      {key:'backend', label:'Backend Developer', cat:'backend_servers', query:'api database backend auth server', sort:'developer'},
      {key:'ai-engineer', label:'AI Engineer', cat:'ai_ml_data_science', query:'llm ai sdk agent vector model', sort:'developer'},
      {key:'devops', label:'DevOps / Platform', cat:'devops_infra', query:'kubernetes terraform observability platform docker', sort:'developer'},
      {key:'qa', label:'QA Automation', cat:'testing_qa', query:'playwright testing automation cypress vitest', sort:'developer'},
      {key:'security', label:'Security Engineer', cat:'security_auth_identity', query:'security auth scanning vulnerability', sort:'developer'},
      {key:'open-source', label:'Open Source', cat:'all', query:'', sort:'open_source'},
      {key:'popular', label:'Popular Tech', cat:'all', query:'', sort:'popular'}
    ];

    function renderTechRecommendedViews(){
      return `<div class="recommended-panel" aria-label="Role-based tech views">
        <div class="recommended-head"><span class="filter-kicker">Explore by role</span><strong>Tech stack shortcuts</strong><span>Jump to stacks by job role, ecosystem, or learning goal.</span></div>
        <div class="preset-grid">${TECH_PRESETS.map(p => `<button type="button" class="preset-chip ${activePreset===p.key?'active':''}" data-tech-preset="${escapeHtml(p.key)}">${escapeHtml(p.label)}</button>`).join('')}</div>
      </div>`;
    }

    function applyTechPreset(key){
      const p = TECH_PRESETS.find(x => x.key === key);
      if(!p) return;
      activePreset = key;
      activeTab = p.cat instanceof RegExp ? findTechCategoryByLabel(p.cat) : (p.cat || 'all');
      activeGroup = 'all';
      searchQuery = '';
      presetQuery = p.query || '';
      sortMode = p.sort || 'recommended';
      advancedOpen = false;
      advFilters = {type:'all', ecosystem:'all', platform:'all', open_source:'all', use_case:'all'};
      if(sortMode === 'open_source') advFilters.open_source = 'yes';
      renderAll();
      scrollSectionTop();
    }

    function renderTabs(){
      const counts = {};
      raw.forEach(t => { counts[t.category] = (counts[t.category] || 0) + 1; counts.all = (counts.all || 0) + 1; });
      const q = normalize(categoryQuery || '');
      const available = CATEGORIES.filter(c => c.id === 'all' || (counts[c.id] || 0) > 0);
      const visible = available.filter(c => !q || normalize(c.label || '').includes(q) || String(counts[c.id] || 0).includes(q));
      if(els.categorySummary){
        const totalCats = available.filter(c => c.id !== 'all').length;
        const shownCats = visible.filter(c => c.id !== 'all').length;
        els.categorySummary.innerHTML = '<span>'+shownCats+' of '+totalCats+' categories</span><span>'+raw.length.toLocaleString()+' techs</span>';
      }
      if(!visible.length){ els.tabs.innerHTML = '<div class="category-empty">No matching categories.</div>'; return; }
      els.tabs.innerHTML = visible.map(c => `<button class="tab-btn${activeTab===c.id?' active':''}" data-cat="${escapeHtml(c.id)}" title="${escapeHtml(c.label)}"><span class="tab-btn-label"><span class="tab-icon">${escapeHtml(c.icon)} </span>${escapeHtml(c.label)}</span><span class="tab-count">${counts[c.id]||0}</span></button>`).join('');
    }

    function renderControls(baseItems){
      const groups = getGroups(baseItems);
      const hasGroups = activeTab !== 'all' && groups.length > 1;
      const types = uniqueValues(baseItems, t => [t.tech_type], 12);
      const ecosystems = uniqueValues(baseItems, t => [t.package_manager].filter(v => v && !/^none$/i.test(v)), 12);
      const platforms = uniqueValues(baseItems, t => (t.platforms || []).filter(p => !/^github$/i.test(p)), 12);
      const useCases = uniqueValues(baseItems, t => [t.group, ...(t.badges || [])], 12);
      const groupHtml = hasGroups ? `<div class="filter-row group-filter-row" aria-label="Groups"><button class="group-chip ${activeGroup==='all'?'active':''}" data-group="all" type="button">All groups</button>${groups.map(([g,count]) => `<button class="group-chip ${activeGroup===g?'active':''}" data-group="${escapeHtml(g)}" type="button">${escapeHtml(g)} <span>${count}</span></button>`).join('')}</div>` : '';
      return `<div class="category-filter-panel"><div class="filter-main-row"><div class="filter-title-block"><span class="filter-kicker">Browse</span><strong>${escapeHtml(activeTab==='all'?'All Technologies':categoryLabel(activeTab))}</strong></div><label class="compact-select-label">Sort<select class="compact-select" data-control="sort"><option value="recommended" ${sortMode==='recommended'?'selected':''}>Recommended</option><option value="editor" ${sortMode==='editor'?'selected':''}>Editor's choice first</option><option value="developer" ${sortMode==='developer'?'selected':''}>Developer picks first</option><option value="popular" ${sortMode==='popular'?'selected':''}>Popular</option><option value="verified" ${sortMode==='verified'?'selected':''}>Recently verified</option><option value="az" ${sortMode==='az'?'selected':''}>A-Z</option></select></label><button class="more-filters-toggle" type="button" aria-expanded="${advancedOpen?'true':'false'}">More filters</button></div>${groupHtml}<div class="advanced-filter-panel ${advancedOpen?'active':''}"><label>Type<select data-filter="type"><option value="all">All</option>${types.map(v => `<option value="${escapeHtml(v)}" ${advFilters.type===v?'selected':''}>${escapeHtml(v)}</option>`).join('')}</select></label><label>Ecosystem<select data-filter="ecosystem"><option value="all">All</option>${ecosystems.map(v => `<option value="${escapeHtml(v)}" ${advFilters.ecosystem===v?'selected':''}>${escapeHtml(v)}</option>`).join('')}</select></label><label>Platform<select data-filter="platform"><option value="all">All</option>${platforms.map(v => `<option value="${escapeHtml(v)}" ${advFilters.platform===v?'selected':''}>${escapeHtml(v)}</option>`).join('')}</select></label><label>Open source<select data-filter="open_source"><option value="all">All</option><option value="yes" ${advFilters.open_source==='yes'?'selected':''}>Yes</option><option value="no" ${advFilters.open_source==='no'?'selected':''}>No</option></select></label><label>Use case<select data-filter="use_case"><option value="all">All</option>${useCases.map(v => `<option value="${escapeHtml(v)}" ${advFilters.use_case===v?'selected':''}>${escapeHtml(v)}</option>`).join('')}</select></label><button class="filter-clear-btn" type="button">Clear filters</button></div></div>`;
    }

    function choiceBadgeHtml(kind){
      const map = {
        editor: {cls:'choice-editor', label:"Editor's Choice"},
        developer: {cls:'choice-dev', label:'Developer Pick'},
        popular: {cls:'choice-popular', label:'Popular'}
      };
      const item = map[String(kind || '').toLowerCase()];
      return item ? `<span class="choice-badge ${item.cls}">${item.label}</span>` : '';
    }

    function getChoiceKind(t){
      if(t.choiceLabel || t.choice_label) return String(t.choiceLabel || t.choice_label).toLowerCase();
      const name = String(t.name || '').toLowerCase();
      const cat = String(t.category_label || categoryLabel(t.category) || '').toLowerCase();
      const group = String(t.group || t.sub || '').toLowerCase();
      const hay = [name, cat, group, (t.tags || []).join(' '), (t.badges || []).join(' ')].join(' ').toLowerCase();
      const editorNames = new Set(['react','next.js','typescript','python','node.js','postgresql','docker','kubernetes','tailwind css','vite','supabase','vercel','playwright','open telemetry','opentelemetry','sentry','grafana','prometheus','redis','sqlite','mongodb','github actions','terraform','storybook','prisma','drizzle orm','hono','astro']);
      const developerNames = new Set(['model context protocol','vercel ai sdk','pydantic ai','langgraph','crewai','autogen','fastmcp','lite llm','litellm','instructor','dspy','tanstack start','solidstart','qwik city','rolldown','oxlint','oxc','biome','rspack','bun','deno','hono','elysia','fastify','nestjs','drizzle orm','kysely','playwright','vitest','cypress','testcontainers','opentelemetry','grafana alloy','loki','tempo','mimir','crossplane','opentofu','pulumi','dagger','argo cd','flux cd','trivy','falco','kyverno','cilium','istio']);
      if(editorNames.has(name)) return 'editor';
      if(developerNames.has(name) || /ai|llm|agent|sdk|framework|runtime|database|devops|observability|testing|security|auth|api|backend|frontend|kubernetes|container/.test(cat + ' ' + group + ' ' + hay)) return 'developer';
      if((Number(t.popularity_score)||0) >= 76 || (Number(t.final_rank_score)||0) >= 78 || /popular|enterprise|stars/.test(hay)) return 'popular';
      return '';
    }

    function techTypeLabel(t){ return t.tech_type || t.type || 'Technology'; }
    function techMetaText(t){
      const typeText = techTypeLabel(t);
      const secondaryText = t.sub || t.group || '';
      return secondaryText && secondaryText !== typeText ? `${typeText} · ${secondaryText}` : typeText;
    }

    function getRelatedTech(t, limit){
      const tags = new Set([...(t.tags || []), ...(t.badges || []), t.group, t.sub].filter(Boolean).map(x => String(x).toLowerCase()));
      return raw
        .filter(x => x.id !== t.id)
        .map(x => {
          let score = 0;
          if(x.category === t.category) score += 2;
          if(getGroup(x) === getGroup(t)) score += 3;
          [...(x.tags || []), ...(x.badges || [])].forEach(tag => { if(tags.has(String(tag).toLowerCase())) score += 1; });
          return {item:x, score};
        })
        .filter(x => x.score > 0)
        .sort((a,b) => b.score - a.score || (a.item.name || '').localeCompare(b.item.name || ''))
        .slice(0, limit || 6)
        .map(x => x.item);
    }

    function inferDifficulty(t){
      const hay = [t.tech_type, t.group, t.sub, (t.tags || []).join(' '), (t.badges || []).join(' ')].join(' ').toLowerCase();
      if(/kubernetes|distributed|observability|security|compiler|rust|terraform|ml|llm|agent/.test(hay)) return 'Intermediate to advanced';
      if(/html|css|beginner|utility|ui|docs|cms/.test(hay)) return 'Beginner friendly';
      return 'Intermediate';
    }

    function sortItems(items){
      return items.sort(function(a,b){
        if(sortMode === 'az') return (a.name || '').localeCompare(b.name || '');
        if(sortMode === 'editor') return (getChoiceKind(b)==='editor') - (getChoiceKind(a)==='editor') || (Number(b.final_rank_score)||0) - (Number(a.final_rank_score)||0) || (a.name || '').localeCompare(b.name || '');
        if(sortMode === 'developer') return (getChoiceKind(b)==='developer') - (getChoiceKind(a)==='developer') || (Number(b.final_rank_score)||0) - (Number(a.final_rank_score)||0) || (a.name || '').localeCompare(b.name || '');
        if(sortMode === 'popular') return (Number(b.popularity_score)||0) - (Number(a.popularity_score)||0) || (a.name || '').localeCompare(b.name || '');
        if(sortMode === 'open_source') return Number(b.open_source===true) - Number(a.open_source===true) || (a.name || '').localeCompare(b.name || '');
        if(sortMode === 'verified') return String(b.last_verified || '').localeCompare(String(a.last_verified || '')) || (a.name || '').localeCompare(b.name || '');
        return (Number(b.final_rank_score)||0) - (Number(a.final_rank_score)||0) || (a.name || '').localeCompare(b.name || '');
      });
    }

    function techDisplayTags(t){
      const candidates = [...(t.tags || []), ...(t.badges || [])];
      const seen = new Set();
      return candidates.filter(x => {
        const k = String(x || '').toLowerCase();
        if(!k || k === 'unknown' || seen.has(k)) return false;
        seen.add(k);
        return true;
      }).slice(0, 6);
    }

    function openTechDetail(t){
      if(!t) return;
      const tags = compact([...(asArray(t.tags)), ...(asArray(t.badges))]);
      const platforms = compact(asArray(t.platforms));
      const targetUsers = compact(asArray(t.target_user));
      const cats = compact([categoryLabel(t.category), t.group, t.sub]);
      const links = [];
      if(t.url) links.push(`<a class="td-visit-btn" href="${escapeHtml(t.url)}" target="_blank" rel="noopener">Visit website ↗</a>`);
      if(t.github) links.push(`<a class="td-visit-btn" href="https://github.com/${escapeHtml(t.github)}" target="_blank" rel="noopener">GitHub ↗</a>`);
      const packageInfo = compact([t.package_name, t.package_manager, t.install, t.import_name]);
      const related = getRelatedTech(t, 6);
      const ecosystem = t.package_manager || (platforms[0] || categoryLabel(t.category));
      if(els.tdIcon) els.tdIcon.textContent = t.icon || '•';
      if(els.tdName) els.tdName.textContent = t.name || '';
      if(els.tdUrlLink){
        els.tdUrlLink.href = t.url || (t.github ? `https://github.com/${t.github}` : '#');
        els.tdUrlLink.textContent = t.url ? t.url.replace(/^https?:\/\//, '').replace(/\/$/, '') : (t.github || '');
      }
      if(els.tdBody){
        els.tdBody.innerHTML = `
          ${links.length ? `<div class="td-actions">${links.join('')}</div>` : ''}
          <div class="td-stats-bar">
            <span class="td-stat-chip">${escapeHtml(techTypeLabel(t))}</span>
            ${t.open_source ? '<span class="td-stat-chip td-oss-chip">Open Source</span>' : ''}
            ${t.stars ? `<span class="td-stat-chip">⭐ ${escapeHtml(t.stars)}</span>` : ''}
            ${t.license ? `<span class="td-stat-chip">${escapeHtml(t.license)}</span>` : ''}
            ${platforms.slice(0,5).map(p => `<span class="td-stat-chip">${escapeHtml(p)}</span>`).join('')}
          </div>
          <div class="td-section td-guide-section"><span class="td-section-label">Decision guide</span><div class="td-guide-grid"><div class="td-guide-card"><strong>Best for</strong><span>${escapeHtml(t.best_for || t.sub || t.group || techTypeLabel(t))}</span></div><div class="td-guide-card"><strong>Ecosystem</strong><span>${escapeHtml(ecosystem)}</span></div><div class="td-guide-card"><strong>Difficulty</strong><span>${escapeHtml(inferDifficulty(t))}</span></div><div class="td-guide-card"><strong>Commonly used with</strong><span>${escapeHtml(related.slice(0,4).map(x => x.name).join(', ') || 'Related tools in the same stack')}</span></div></div></div>
          ${cats.length ? `<div class="td-section"><span class="td-section-label">Category &amp; Group</span><div class="td-tags-wrap">${cats.map(c => `<span class="td-tag">${escapeHtml(c)}</span>`).join('')}</div></div>` : ''}
          ${packageInfo.length ? `<div class="td-section"><span class="td-section-label">Package / Setup</span><div class="td-tags-wrap">${packageInfo.map(c => `<span class="td-tag td-feature-tag">${escapeHtml(c)}</span>`).join('')}</div></div>` : ''}
          ${tags.length ? `<div class="td-section"><span class="td-section-label">Tags</span><div class="td-tags-wrap">${tags.map(c => `<span class="td-tag">${escapeHtml(c)}</span>`).join('')}</div></div>` : ''}
          ${targetUsers.length ? `<div class="td-section"><span class="td-section-label">Best For</span><div class="td-tags-wrap">${targetUsers.map(c => `<span class="td-tag td-integration-tag">${escapeHtml(c)}</span>`).join('')}</div></div>` : ''}
          ${related.length ? `<div class="td-section"><span class="td-section-label">Related tech</span><div class="td-tags-wrap">${related.map(c => `<button class="td-related-chip" type="button" data-related-id="${escapeHtml(c.id)}">${escapeHtml(c.name)}</button>`).join('')}</div></div>` : ''}`;
        els.tdBody.querySelectorAll('[data-related-id]').forEach(btn => btn.addEventListener('click', () => {
          const next = raw.find(x => x.id === btn.dataset.relatedId);
          if(next) openTechDetail(next);
        }));
      }
      if(els.detailModal){
        els.detailModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        if(els.tdClose) els.tdClose.focus();
      }
    }

    function closeTechDetail(){
      if(els.detailModal){
        els.detailModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    }

    function buildCard(t){
      const displayTags = techDisplayTags(t);
      const tagHtml = displayTags.map(tag => {
        const cls = /open source/i.test(tag) ? 'tag-oss' : 'tag-lang';
        return `<span class="tag ${cls}">${escapeHtml(tag)}</span>`;
      }).join('');
      const links = [];
      if(t.url) links.push(`<a class="card-link" href="${escapeHtml(t.url)}" target="_blank" rel="noopener">🌐 Website</a>`);
      if(t.github) links.push(`<a class="card-link" href="https://github.com/${escapeHtml(t.github)}" target="_blank" rel="noopener">GitHub${t.stars ? ` <span class="card-stars">⭐ ${escapeHtml(t.stars)}</span>` : ''}</a>`);
      const metaText = techMetaText(t);
      return `<article class="tech-card" id="tc-${escapeHtml(t.id)}" data-id="${escapeHtml(t.id)}" tabindex="0" role="button" aria-label="Open details for ${escapeHtml(t.name)}">${choiceBadgeHtml(getChoiceKind(t))}<div class="card-top"><div class="card-icon">${escapeHtml(t.icon || '•')}</div><div class="card-identity"><a class="card-name" href="${escapeHtml(t.url || '#')}" target="_blank" rel="noopener">${escapeHtml(t.name)}</a><span class="card-type-inline">${escapeHtml(metaText)}</span></div></div><div class="card-tags">${tagHtml}</div>${links.length ? `<div class="card-links">${links.join('')}</div>` : ''}</article>`;
    }

    function noResults(){ return `<div class="no-results"><strong>No results found</strong><span>Try a different search term, group, or category.</span></div>`; }

    function render(){
      const baseItems = getBaseItems();
      let filtered = raw.filter(matches);
      if(presetQuery && !searchQuery){
        const words = normalize(presetQuery).split(/\s+/).filter(Boolean);
        if(words.length){
          const presetFiltered = filtered.filter(t => {
            const hay = normalize([t.name, t.desc, t.description, t.sub, t.group, t.category_label, (t.tags || []).join(' '), (t.badges || []).join(' '), t.package_name, t.github, (t.platforms || []).join(' ')].join(' '));
            return words.some(w => hay.includes(w));
          });
          if(presetFiltered.length) filtered = presetFiltered;
        }
      }
      filtered = sortItems(filtered);

      const renderKey = [activeTab, activeGroup, searchQuery, sortMode, activePreset, JSON.stringify(advFilters)].join('|');
      if (renderKey !== lastRenderKey) { visibleCount = CARD_PAGE_SIZE; lastRenderKey = renderKey; }

      const controlsHtml = renderTechRecommendedViews() + renderControls(baseItems);
      const isFiltered = filtered.length !== raw.length;
      if(window.hubSetResultChip){
        const sec = document.getElementById('tech-section');
        if(sec && sec.classList.contains('active')) window.hubSetResultChip(isFiltered ? `${filtered.length} of ${raw.length} techs` : `${raw.length} technologies`);
      }
      if(filtered.length === 0){ els.content.innerHTML = controlsHtml + noResults(); return; }
      if(activeTab === 'all' && !searchQuery && activeGroup === 'all' && Object.values(advFilters).every(v => v === 'all')){
        const grouped = {};
        CATEGORIES.filter(c => c.id !== 'all').forEach(c => { grouped[c.id] = []; });
        filtered.forEach(t => { if(grouped[t.category]) grouped[t.category].push(t); });
        let html = controlsHtml;
        CATEGORIES.filter(c => c.id !== 'all').forEach(c => {
          const items = grouped[c.id];
          if(!items || !items.length) return;
          html += `<div class="section-meta"><h2 class="section-title">${escapeHtml(c.icon)} ${escapeHtml(c.label)}</h2><span class="section-count">${items.length}</span></div><div class="tech-grid">${items.slice(0,80).map(buildCard).join('')}</div>`;
        });
        els.content.innerHTML = html;
      } else {
        // A single active category (e.g. CMS/WordPress at 261 items, Browser &
        // IDE Extensions at 225) used to render every match at once. Reveal
        // incrementally instead, same pattern as the AI Tools grid.
        const visible = filtered.slice(0, visibleCount);
        const remaining = filtered.length - visible.length;
        const loadMoreHtml = remaining > 0 ? `
          <div class="load-more-row">
            <button type="button" class="load-more-btn" id="tech-loadMore">
              Show ${Math.min(CARD_PAGE_SIZE, remaining)} more <span class="load-more-remaining">(${remaining} left)</span>
            </button>
          </div>
        ` : '';
        els.content.innerHTML = controlsHtml + `<div class="tech-grid">${visible.map(buildCard).join('')}</div>` + loadMoreHtml;
        const loadMoreBtn = document.getElementById('tech-loadMore');
        if (loadMoreBtn) {
          loadMoreBtn.addEventListener('click', () => {
            visibleCount += CARD_PAGE_SIZE;
            render();
          });
        }
      }
    }

    function renderAll(){ renderTabs(); render(); }

    els.tabs.addEventListener('click', e => {
      const btn = e.target.closest('.tab-btn');
      if(!btn) return;
      activePreset = 'custom';
      activeTab = btn.dataset.cat;
      activeGroup = 'all';
      searchQuery = '';
      presetQuery = '';
      advFilters = {type:'all', ecosystem:'all', platform:'all', open_source:'all', use_case:'all'};
      renderAll();
      scrollSectionTop();
      // Keep the URL in sync with the selected category (see the matching
      // fix in tools.js) so a link to this view is actually shareable.
      try{ history.replaceState(null, '', location.pathname + location.search + '#tech/' + activeTab); }catch(e){}
    });

    els.content.addEventListener('click', e => {
      const presetBtn = e.target.closest('[data-tech-preset]');
      if(presetBtn){ applyTechPreset(presetBtn.dataset.techPreset); return; }
      const groupBtn = e.target.closest('.group-chip');
      if(groupBtn){ activePreset = 'custom'; activeGroup = groupBtn.dataset.group || 'all'; render(); return; }
      if(e.target.closest('.more-filters-toggle')){ advancedOpen = !advancedOpen; render(); return; }
      if(e.target.closest('.filter-clear-btn')){ activePreset = 'custom'; presetQuery = ''; searchQuery = ''; advFilters = {type:'all', ecosystem:'all', platform:'all', open_source:'all', use_case:'all'}; activeGroup = 'all'; sortMode = 'recommended'; render(); return; }
      if(e.target.closest('a')) return;
      const card = e.target.closest('.tech-card');
      if(card){
        const item = raw.find(t => t.id === card.dataset.id);
        if(item) openTechDetail(item);
      }
    });

    els.content.addEventListener('keydown', e => {
      const card = e.target.closest('.tech-card');
      if(!card) return;
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        const item = raw.find(t => t.id === card.dataset.id);
        if(item) openTechDetail(item);
      }
    });

    els.content.addEventListener('change', e => {
      const sort = e.target.closest('[data-control="sort"]');
      if(sort){ activePreset = 'custom'; sortMode = sort.value || 'recommended'; render(); return; }
      const filter = e.target.closest('[data-filter]');
      if(filter){ activePreset = 'custom'; advFilters[filter.dataset.filter] = filter.value || 'all'; render(); return; }
    });

    if(els.categorySearch) els.categorySearch.addEventListener('input', function(){ categoryQuery = els.categorySearch.value || ''; renderTabs(); });
    if(els.tdClose) els.tdClose.addEventListener('click', closeTechDetail);
    if(els.detailModal) els.detailModal.addEventListener('click', e => { if(e.target === els.detailModal) closeTechDetail(); });

    const btt = document.getElementById('tech-backToTop');
    const techSectionEl = document.getElementById('tech-section');
    if (btt && techSectionEl) {
      techSectionEl.addEventListener('scroll', () => { btt.classList.toggle('visible', techSectionEl.scrollTop > 400); }, {passive: true});
      btt.addEventListener('click', scrollSectionTop);
    }

    document.addEventListener('keydown', e => {
      if(e.key === 'Escape') closeTechDetail();
    });

    renderAll();

    window.addEventListener('hub-message', function(e){
      const msg = e.detail;
      if(!msg || !msg.type) return;
      if(msg.type === 'refreshChip'){
        const sec = document.getElementById('tech-section');
        if(sec && sec.classList.contains('active')) render();
        return;
      }
      if(msg.type === 'search'){
        const next = (msg.query || '').trim();
        if(next === searchQuery && !presetQuery) return;
        searchQuery = next;
        presetQuery = '';
        activePreset = next ? 'custom' : activePreset;
        render();
        return;
      }
      if(msg.type === 'selectCategory'){
        const btn = els.tabs.querySelector('.tab-btn[data-cat="'+CSS.escape(msg.id)+'"]');
        if(btn){ btn.click(); scrollSectionTop(); }
      }
      if(msg.type === 'scrollToItem'){
        const target = raw.find(t => t.id === msg.id);
        const targetCategory = msg.category || (target && target.category);
        if(targetCategory && targetCategory !== activeTab){ activeTab = targetCategory; activeGroup = 'all'; renderAll(); }
        else if(activeTab === 'all' && targetCategory){ activeTab = targetCategory; activeGroup = 'all'; renderAll(); }
        // The target item may sit past the incrementally-rendered page --
        // reveal however many cards are needed to include it first.
        if(!document.getElementById('tc-'+msg.id)){
          const idx = raw.filter(matches).findIndex(t => t.id === msg.id);
          if(idx > -1 && idx >= visibleCount){
            visibleCount = Math.ceil((idx + 1) / CARD_PAGE_SIZE) * CARD_PAGE_SIZE;
            render();
          }
        }
        requestAnimationFrame(function(){
          const el = document.getElementById('tc-'+msg.id);
          if(el){
            el.scrollIntoView({behavior:'smooth', block:'center'});
            el.style.outline = '2px solid #6366f1';
            el.style.borderRadius = '16px';
            setTimeout(function(){ el.style.outline = ''; }, 2000);
          }
        });
      }
    });
  } catch(e) {
    console.error('TECH INIT ERROR:', e);
  }
};
