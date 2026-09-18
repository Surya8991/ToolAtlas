
window.initTools = async function() {

  const DATA = await DataLoader.loadData('data/tools-data.js', '__TOOLS_DATA__');
  const categories = DATA.categories;
  const tools = DATA.tools;
  // Normalize optional arrays once so incomplete records cannot break rendering/search.
  tools.forEach(function(t){
    t.tags = Array.isArray(t.tags) ? t.tags : [];
    t.placements = Array.isArray(t.placements) ? t.placements : [];
    t.platforms = Array.isArray(t.platforms) ? t.platforms : [];
    t.keyFeatures = Array.isArray(t.keyFeatures) ? t.keyFeatures : [];
    t.integrations = Array.isArray(t.integrations) ? t.integrations : [];
    t.alternativeIds = Array.isArray(t.alternativeIds) ? t.alternativeIds : [];
  });
  // Pre-compute search haystacks once at init - avoids rebuilding on every keystroke
  tools.forEach(function(t){
    t._haystack = [t.name, t.domain, t.description||'', t.pricing||'', t.tags.join(' '), t.placements.map(function(p){return p.category||'';}).join(' ')].join(' ').toLowerCase();
  });
  // Pre-compute similarity graph once at init - avoids O(n^2) on every detail open
  const similarityMap = new Map();
  (function(){
    tools.forEach(function(tool){
      var tTags = new Set(tool.tags);
      var tCats = new Set(tool.placements.map(function(p){return p.tabId;}).filter(function(id){return id!=='tab-0';}));
      var scored = tools
        .filter(function(t){return t.id!==tool.id;})
        .map(function(t){return {id:t.id,score:t.tags.filter(function(tag){return tTags.has(tag);}).length*2+t.placements.filter(function(p){return tCats.has(p.tabId);}).length};})
        .filter(function(x){return x.score>0;})
        .sort(function(a,b){return b.score-a.score;})
        .slice(0,6);
      similarityMap.set(tool.id, scored.map(function(x){return x.id;}));
    });
  })();

  function getSimilarTools(tool, limit) {
    const ids = similarityMap.get(tool.id) || [];
    return ids.map(id => tools.find(t => t.id === id)).filter(Boolean).slice(0, limit || 6);
  }


  const els = {
    tabs: document.getElementById('tools-tabs'),
    content: document.getElementById('tools-content'),
    resetFilters: document.getElementById('tools-resetFilters'),
    categorySearch: document.getElementById('tools-categorySearch'),
    categorySummary: document.getElementById('tools-categorySummary'),
    clearSaved: document.getElementById('tools-clearSaved'),
    categoryTitle: document.getElementById('tools-categoryTitle'),
    categorySubtitle: document.getElementById('tools-categorySubtitle'),
    exportCsv: document.getElementById('tools-exportCsv'),
    exportSaved: document.getElementById('tools-exportSaved'),
    compareBar: document.getElementById('tools-compareBar'),
    compareItems: document.getElementById('tools-compareItems'),
    compareAction: document.getElementById('tools-compareAction'),
    compareClear: document.getElementById('tools-compareClear'),
    compareModal: document.getElementById('tools-compareModal'),
    compareModalContent: document.getElementById('tools-compareModalContent'),
    modalClose: document.getElementById('tools-modalClose'),
    toolDetailModal: document.getElementById('tools-toolDetailModal'),
    tdClose: document.getElementById('tools-tdClose'),
    tdFavicon: document.getElementById('tools-tdFavicon'),
    tdName: document.getElementById('tools-tdName'),
    tdUrlLink: document.getElementById('tools-tdUrlLink'),
    tdBody: document.getElementById('tools-tdBody'),

    recentStrip: document.getElementById('tools-recentStrip'),
    shareToast: document.getElementById('tools-shareToast'),
  };

  // If core elements are missing from the DOM, the hub route has unmounted. Abort early.
  if (!els.tabs || !els.content) {
    console.warn("[hub] Tools elements missing from DOM. Aborting initialization.");
    return;
  }

  const FAVORITES_KEY    = 'master_tools_favorites_v2';
  const RECENT_KEY       = 'master_tools_recent_v1';
  const DENSITY_KEY      = 'master_tools_density_v1';

  const CARD_PAGE_SIZE      = 60;
  let activeTab = 'tab-0';
  let categoryQuery = '';
  let activeGroup = 'all';
  let activePreset = 'all';
  let presetQuery = '';
  let sortMode = 'recommended';
  let advancedOpen = false;
  // Collapsed by default so the "Recommended views" panel doesn't push real
  // results down on every visit -- opens automatically once a preset is
  // actually chosen (applyToolPreset), and freely toggleable after that.
  let recommendedOpen = false;
  let advFilters = {pricing:'all', platform:'all', user:'all', availability:'all', status:'all'};
  let renderedTools = [];
  let visibleCount = CARD_PAGE_SIZE;
  let lastRenderKey = '';
  let searchQuery = '';
  let selectedCompare = new Set();
  let lastToolFocus = null;
  let lastCompareFocus = null;
  let currentDensity = 'default';
  try { currentDensity = localStorage.getItem(DENSITY_KEY) || 'default'; } catch(e) {}

  function getRecent(){ try{ return JSON.parse(localStorage.getItem(RECENT_KEY)||'[]'); }catch(e){ return []; } }
  function addRecent(id){ let r=getRecent().filter(x=>x!==id); r.unshift(id); localStorage.setItem(RECENT_KEY,JSON.stringify(r.slice(0,8))); }

  function renderRecentStrip(){
    const ids = getRecent();
    const rt  = ids.map(id=>tools.find(t=>t.id===id)).filter(Boolean);
    if(!rt.length){ els.recentStrip.classList.add('hidden'); return; }
    els.recentStrip.classList.remove('hidden');
    els.recentStrip.innerHTML =
      "<span class='recent-label'>Recently viewed</span>" +
      "<div class='recent-chips'>" +
        rt.map(t=>"<button class='recent-chip' data-id='"+escapeHtml(t.id)+"' type='button'>"+escapeHtml(t.name)+"</button>").join('') +
      "</div>" +
      "<button class='recent-clear' type='button'>✕ Clear</button>";
      }

  function applyDensity(d){
    currentDensity=d;
    localStorage.setItem(DENSITY_KEY,d);
    document.querySelectorAll('.tool-grid').forEach(g=>{ g.classList.remove('density-compact','density-comfortable'); if(d!=='default') g.classList.add('density-'+d); });
    document.querySelectorAll('.density-btn').forEach(b=>b.classList.toggle('active',b.dataset.density===d));
  }

  function showToast(msg){ els.shareToast.textContent=msg; els.shareToast.classList.add('show'); setTimeout(()=>els.shareToast.classList.remove('show'),2000); }

  function scrollSectionTop(){
    const sec = document.getElementById('tools-section');
    if (sec) sec.scrollTo({top: 0, behavior: 'smooth'});
  }


  function fallbackCopy(text, cb){
    try{
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly','');
      ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      if (cb) cb();
    } catch(e) { /* swallow */ }
  }

  function escapeHtml(value){
    return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }
  function normalize(value){ return String(value ?? '').toLowerCase().trim(); }
  function getFavorites(){
    try { return new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')); }
    catch(e) { return new Set(); }
  }
  function saveFavorites(set){ localStorage.setItem(FAVORITES_KEY, JSON.stringify([...set])); }
  let favorites = getFavorites();

  function getToolCategories(tool){
    return [...new Set(tool.placements.map(p => p.category).filter(Boolean))];
  }
    function searchHaystack(tool){ return tool._haystack || ''; }
  function toolInTab(tool, tabId){
    if(tabId === 'tab-0') return true;
    return tool.placements.some(p => p.tabId === tabId);
  }
  function getPrimaryGroup(tool, tabId){
    if(tabId === 'tab-0'){
      const nonMaster = tool.placements.find(p => p.category && p.category !== 'Master List');
      return nonMaster ? nonMaster.category : 'General';
    }
    const p = tool.placements.find(p => p.tabId === tabId);
    return p?.group || 'General';
  }
  function getCurrentCategory(){
    return categories.find(c => c.id === activeTab) || categories[0];
  }

  function getItemType(tool){
    const v = String(tool.itemType || tool.item_type || tool.tool_type || '').toLowerCase();
    return /website/.test(v) ? 'Website' : 'Tool';
  }

  function findCategoryByLabel(pattern){
    const rx = pattern instanceof RegExp ? pattern : new RegExp(String(pattern), 'i');
    const found = categories.find(c => c.id !== 'tab-0' && rx.test(c.label || ''));
    return found ? found.id : 'tab-0';
  }

  const TOOL_PRESETS = [
    {key:'ai-coding', label:'AI Coding Toolkit', tab:/AI Coding|Dev Tools/i, query:'ai coding developer', sort:'recommended'},
    {key:'cybersecurity', label:'Cybersecurity Toolkit', tab:/Cybersecurity|Privacy/i, query:'security privacy', sort:'developer'},
    {key:'marketing', label:'Marketing Growth Stack', tab:'tab-0', query:'marketing growth seo social ads email content crm analytics', sort:'popular'},
    {key:'startup', label:'Startup Founder Stack', tab:'tab-0', query:'startup founder product launch', sort:'recommended'},
    {key:'research', label:'Research Stack', tab:/Research|Knowledge/i, query:'research papers knowledge', sort:'recommended'},
    {key:'remote-jobs', label:'Remote Jobs Stack', tab:/HR|Recruiting/i, query:'remote jobs freelance career', sort:'website'},
    {key:'free', label:'Free Tools', tab:'tab-0', query:'', sort:'free'},
    {key:'open-source', label:'Open Source', tab:'tab-0', query:'', sort:'open_source'},
    {key:'websites', label:'Websites Only', tab:'tab-0', query:'', sort:'website'},
    {key:'tools', label:'Tools Only', tab:'tab-0', query:'', sort:'tool'}
  ];

  function renderRecommendedViews(){
    const activeChoice = TOOL_PRESETS.find(p => p.key === activePreset);
    return `<div class="recommended-panel ${recommendedOpen ? 'open' : ''}" aria-label="Recommended views">
      <button type="button" class="recommended-toggle" id="tools-recommendedToggle" aria-expanded="${recommendedOpen ? 'true' : 'false'}" aria-controls="tools-recommendedBody">
        <span class="filter-kicker">Start here</span>
        <strong>Recommended views</strong>
        ${activeChoice ? `<span class="recommended-active-pill">${escapeHtml(activeChoice.label)}</span>` : `<span class="recommended-hint">Ready-made lenses instead of browsing ${tools.length.toLocaleString()} cards</span>`}
        <svg class="recommended-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      <div class="recommended-body" id="tools-recommendedBody" ${recommendedOpen ? '' : 'hidden'}>
        <div class="preset-grid">${TOOL_PRESETS.map(p=>`<button type="button" class="preset-chip ${activePreset===p.key?'active':''}" data-preset="${escapeHtml(p.key)}">${escapeHtml(p.label)}</button>`).join('')}</div>
      </div>
    </div>`;
  }

  function applyToolPreset(key){
    const preset = TOOL_PRESETS.find(p => p.key === key);
    if(!preset) return;
    activePreset = key;
    activeTab = preset.tab instanceof RegExp ? findCategoryByLabel(preset.tab) : (preset.tab || 'tab-0');
    activeGroup = 'all';
    searchQuery = '';
    presetQuery = preset.query || '';
    sortMode = preset.sort || 'recommended';
    advancedOpen = false;
    advFilters = {pricing:'all', platform:'all', user:'all', availability:'all', status:'all'};
    if(sortMode === 'free') advFilters.availability = 'free';
    if(sortMode === 'open_source') advFilters.availability = 'open_source';
    recommendedOpen = true;
    renderTabs();
    renderContent();
    scrollSectionTop();
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

  function getChoiceKind(tool){
    if(tool.choiceLabel || tool.choice_label) return String(tool.choiceLabel || tool.choice_label).toLowerCase();
    const name = String(tool.name || '').toLowerCase();
    const cat = String(tool.primary_category || (tool.placements && tool.placements[1] && tool.placements[1].category) || '').toLowerCase();
    const group = String(tool.primary_group || (tool.placements && tool.placements[1] && tool.placements[1].group) || '').toLowerCase();
    const hay = [name, cat, group, (tool.tags||[]).join(' ')].join(' ').toLowerCase();
    const editorNames = new Set(['chatgpt','claude','perplexity','cursor','figma','canva ai','notebooklm','linear','raycast','tailscale','semgrep','obsidian','readwise','product hunt','github copilot','supabase','vercel','posthog','sentry','1password','bitwarden','fireflies','fathom','elevenlabs','midjourney','runway','zapier','n8n','notion','airtable','slack','hubspot','semrush','ahrefs','clay','apollo.io','intercom','zendesk','shopify','stripe','resend','railway','cloudflare zero trust']);
    const developerNames = new Set(['langgraph','crewai','microsoft autogen','openai agents sdk','dify','flowise','langsmith','langfuse','braintrust','arize phoenix','helicone','promptfoo','deepeval','ragas','vercel ai sdk','supabase','clerk','resend','railway','render','neon','convex','cloudflare workers','sentry','posthog','github','gitlab','docker','kubernetes','playwright','storybook','openapi generator','mintlify','scalar','semgrep','snyk','trivy','gitleaks','trufflehog','gitguardian','wiz','orcas security','orca security','burp suite','owasp zap']);
    if(editorNames.has(name)) return 'editor';
    if(developerNames.has(name) || /developer|coding|api|infrastructure|model ops|cybersecurity|privacy|dev tools|llmops|observability|security/.test(cat + ' ' + group) || /developer|open source|api|sdk|security|devops/.test(hay)) return 'developer';
    if((Number(tool.popularity_score)||0) >= 76 || (Number(tool.final_rank_score)||0) >= 78 || /popular tools|market leader|enterprise/.test(hay)) return 'popular';
    return '';
  }


  function getCurrentGroups(items){
    if(activeTab === 'tab-0') return [];
    const groups = new Map();
    items.forEach(tool => {
      const g = getPrimaryGroup(tool, activeTab);
      if(!g || g === 'General') return;
      groups.set(g, (groups.get(g) || 0) + 1);
    });
    return [...groups.entries()].sort((a,b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }

  function getToolDisplayTags(tool){
    const nonMaster = tool.placements.find(p => p.tabId !== 'tab-0') || {};
    const candidates = [];
    if(tool.pricing && !/^unknown$/i.test(String(tool.pricing))) candidates.push({label: tool.pricing, cls: 'pricing-' + String(tool.pricing).replace(/\s+/g,'-')});
    (tool.tags || []).forEach(tag => candidates.push({label: tag, cls: 'tool-tag'}));
    (tool.platforms || []).filter(p => !/^web$/i.test(p)).slice(0,2).forEach(p => candidates.push({label: p, cls: 'platform-tag'}));
    const seen = new Set();
    return candidates.filter(item => {
      const key = String(item.label || '').toLowerCase();
      if(!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0,5);
  }

  function uniqueValues(items, getter, limit){
    const counts = new Map();
    items.forEach(item => {
      const vals = getter(item) || [];
      vals.forEach(v => { if(v) counts.set(v, (counts.get(v)||0)+1); });
    });
    return [...counts.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).slice(0, limit || 12).map(x=>x[0]);
  }

  function renderFilterControls(baseItems){
    const groups = getCurrentGroups(baseItems);
    const hasGroups = activeTab !== 'tab-0' && groups.length > 1;
    const platforms = uniqueValues(baseItems, t => (t.platforms || []).filter(p => !/^web$/i.test(p)), 10);
    const users = uniqueValues(baseItems, t => t.target_user || [], 10);
    const groupHtml = hasGroups ? `
      <div class="filter-row group-filter-row" aria-label="Groups">
        <button class="group-chip ${activeGroup === 'all' ? 'active' : ''}" data-group="all" type="button">All groups</button>
        ${groups.map(([g,count]) => `<button class="group-chip ${activeGroup === g ? 'active' : ''}" data-group="${escapeHtml(g)}" type="button">${escapeHtml(g)} <span>${count}</span></button>`).join('')}
      </div>` : '';
    return `
      <div class="category-filter-panel">
        <div class="filter-main-row">
          <div class="filter-title-block">
            <span class="filter-kicker">Browse</span>
            <strong>${escapeHtml(getCurrentCategory().label)}</strong>
          </div>
          <label class="compact-select-label">Sort
            <select class="compact-select" data-control="sort">
              <option value="recommended" ${sortMode==='recommended'?'selected':''}>Recommended</option>
              <option value="editor" ${sortMode==='editor'?'selected':''}>Editor's choice first</option>
              <option value="developer" ${sortMode==='developer'?'selected':''}>Developer picks first</option>
              <option value="popular" ${sortMode==='popular'?'selected':''}>Popular</option>
              <option value="verified" ${sortMode==='verified'?'selected':''}>Recently verified</option>
              <option value="az" ${sortMode==='az'?'selected':''}>A-Z</option>
            </select>
          </label>
          <button class="more-filters-toggle" type="button" aria-expanded="${advancedOpen?'true':'false'}">More filters</button>
        </div>
        ${groupHtml}
        <div class="advanced-filter-panel ${advancedOpen ? 'active' : ''}">
          <label>Pricing<select data-filter="pricing"><option value="all">All</option>${['Free','Freemium','Paid','Enterprise','Open Source'].map(v=>`<option value="${v}" ${advFilters.pricing===v?'selected':''}>${v}</option>`).join('')}</select></label>
          <label>Platform<select data-filter="platform"><option value="all">All</option>${platforms.map(v=>`<option value="${escapeHtml(v)}" ${advFilters.platform===v?'selected':''}>${escapeHtml(v)}</option>`).join('')}</select></label>
          <label>User<select data-filter="user"><option value="all">All</option>${users.map(v=>`<option value="${escapeHtml(v)}" ${advFilters.user===v?'selected':''}>${escapeHtml(v)}</option>`).join('')}</select></label>
          <label>Availability<select data-filter="availability"><option value="all">All</option><option value="free" ${advFilters.availability==='free'?'selected':''}>Has free plan</option><option value="open_source" ${advFilters.availability==='open_source'?'selected':''}>Open source</option><option value="api" ${advFilters.availability==='api'?'selected':''}>API available</option></select></label>
          <label>Status<select data-filter="status"><option value="all">All</option>${['active','unknown','deprecated','acquired','closed'].map(v=>`<option value="${v}" ${advFilters.status===v?'selected':''}>${v}</option>`).join('')}</select></label>
          <button class="filter-clear-btn" type="button">Clear filters</button>
        </div>
      </div>`;
  }

  function passAdvancedFilters(tool){
    if(advFilters.pricing !== 'all' && tool.pricing !== advFilters.pricing) return false;
    if(advFilters.platform !== 'all' && !(tool.platforms || []).includes(advFilters.platform)) return false;
    if(advFilters.user !== 'all' && !(tool.target_user || []).includes(advFilters.user)) return false;
    if(advFilters.status !== 'all' && tool.status !== advFilters.status) return false;
    if(advFilters.availability === 'free' && tool.has_free_plan !== true) return false;
    if(advFilters.availability === 'open_source' && !(tool.open_source === true || tool.openSource === true)) return false;
    if(advFilters.availability === 'api' && tool.api_available !== true) return false;
    return true;
  }


  function resetFilters(){
    activePreset = 'all';
    activeTab = 'tab-0';
    activeGroup = 'all';
    searchQuery = '';
    presetQuery = '';
    categoryQuery = '';
    sortMode = 'recommended';
    advancedOpen = false;
    recommendedOpen = false;
    advFilters = {pricing:'all', platform:'all', user:'all', availability:'all', status:'all'};
    if(els.categorySearch) els.categorySearch.value = '';
    renderTabs();
    renderContent();
    scrollSectionTop();
  }

  // Declutter: at most ONE department's subcategories are ever open at a
  // time, as a floating dropdown rather than an inline block that pushes
  // the rest of the sidebar down. Master List + 9 department rows is the
  // whole resting sidebar -- 10 rows, always, browsing or not.
  let openDept = null;
  // While actively searching the category box, matches can live in several
  // departments at once, so search results render inline (not as a single
  // dropdown) -- the one case where showing more, not less, is correct.
  const searchExpandedDepts = new Set();

  function ensureActiveDeptOpen(){
    const active = categories.find(c => c.id === activeTab);
    if(active && active.parentId) openDept = active.parentId;
  }

  function closeDeptDropdown(){
    if(!openDept) return;
    openDept = null;
    renderTabs();
  }

  function renderTabs(){
    const q = normalize(categoryQuery);
    const matches = cat => {
      if(!q) return true;
      const label = normalize(cat.label || '');
      return label.includes(q) || String(cat.count || '').includes(q);
    };

    const master = categories.find(c => c.id === 'tab-0');
    const departments = categories.filter(c => c.parentId === null && c.id !== 'tab-0');
    const childrenOf = deptId => categories.filter(c => c.parentId === deptId);

    // Searching the category box should surface matches wherever they live,
    // rendering inline for every department that has one.
    const visibleDepts = departments.filter(dept => {
      if(!q) return true;
      return matches(dept) || childrenOf(dept.id).some(matches);
    });
    searchExpandedDepts.clear();
    if(q){
      visibleDepts.forEach(dept => {
        if(childrenOf(dept.id).some(matches)) searchExpandedDepts.add(dept.id);
      });
    }

    const totalCats = categories.filter(c => c.id !== 'tab-0').length;
    const shownCats = visibleDepts.reduce((n, d) => n + 1 + childrenOf(d.id).filter(matches).length, 0);
    if(els.categorySummary){
      els.categorySummary.innerHTML = '<span>'+shownCats+' of '+totalCats+' categories</span><span>'+tools.length.toLocaleString()+' tools</span>';
    }
    if(!visibleDepts.length && (!master || !matches(master))){
      els.tabs.innerHTML = '<div class="category-empty">No matching categories.</div>';
      return;
    }

    function tabButtonHtml(cat, extraClass){
      const active = cat.id === activeTab;
      return `<button class="tab-btn ${extraClass||''} ${active ? 'active' : ''}" data-tab="${escapeHtml(cat.id)}" role="tab" aria-selected="${active ? 'true' : 'false'}" title="${escapeHtml(cat.label)}">
        <span class="tab-btn-label">${escapeHtml(cat.label)}</span> <span class="tab-count">${cat.count}</span>
      </button>`;
    }

    const showMaster = master && matches(master);
    const masterHtml = showMaster ? `<div class="tab-group tab-group-master">${tabButtonHtml(master)}</div>` : '';

    const deptsHtml = visibleDepts.map(dept => {
      const kids = childrenOf(dept.id).filter(matches);
      const isSearchMode = !!q;
      const open = isSearchMode ? searchExpandedDepts.has(dept.id) : openDept === dept.id;
      const childrenId = 'tab-children-' + dept.id;
      return `
        <div class="tab-group ${isSearchMode ? 'is-search' : ''}" data-dept="${escapeHtml(dept.id)}">
          <div class="tab-row">
            ${tabButtonHtml(dept, 'tab-btn-dept')}
            <button type="button" class="tab-disclosure ${open ? 'expanded' : ''}" data-disclosure="${escapeHtml(dept.id)}" aria-expanded="${open ? 'true' : 'false'}" aria-controls="${childrenId}" aria-haspopup="${isSearchMode ? 'false' : 'true'}" aria-label="${open ? 'Close' : 'Open'} ${escapeHtml(dept.label)} categories">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>
            </button>
          </div>
          <div class="tab-children ${isSearchMode ? 'tab-children-inline' : 'tab-children-dropdown'}" id="${childrenId}" ${open ? '' : 'hidden'}>
            ${kids.map(k => tabButtonHtml(k, 'tab-btn-child')).join('')}
          </div>
        </div>
      `;
    }).join('');

    els.tabs.innerHTML = masterHtml + deptsHtml;

    els.tabs.querySelectorAll('.tab-disclosure').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        if(normalize(categoryQuery)) return; // search mode: nothing to toggle, everything relevant is already open
        const deptId = btn.dataset.disclosure;
        openDept = (openDept === deptId) ? null : deptId;
        renderTabs();
      });
    });

    // Also open a department's dropdown by clicking its row (not just the
    // chevron) when it isn't already the active category -- the whole row
    // is the affordance, the chevron is just its visible indicator.
    els.tabs.querySelectorAll('.tab-btn-dept').forEach(btn => {
      btn.addEventListener('click', e => {
        if(normalize(categoryQuery)) return;
        const group = btn.closest('.tab-group');
        const deptId = group && group.dataset.dept;
        if(!deptId) return;
        // Let the existing tab-click handler apply the filter; just also
        // make sure this department's dropdown is the one left open.
        if(openDept !== deptId){ openDept = deptId; }
      }, {capture: true});
    });
  }

  // Close whichever dropdown is open when the user clicks anywhere outside
  // the sidebar's category tree. Uses composedPath() (the propagation path
  // captured at dispatch time), not els.tabs.contains(e.target): clicking a
  // department re-renders els.tabs's innerHTML while this same click is
  // still bubbling, which detaches the original target node -- contains()
  // on a detached node returns false even for a click that started inside
  // the sidebar, which was closing the dropdown the same click had just opened.
  document.addEventListener('click', e => {
    if(!openDept) return;
    const path = typeof e.composedPath === 'function' ? e.composedPath() : [];
    if(path.includes(els.tabs)) return;
    closeDeptDropdown();
  });
  document.addEventListener('keydown', e => {
    if(e.key === 'Escape' && openDept) closeDeptDropdown();
  });

  function filterTools(){
    let filtered = tools.filter(tool => toolInTab(tool, activeTab));

    if(activeGroup !== 'all' && activeTab !== 'tab-0') {
      filtered = filtered.filter(tool => getPrimaryGroup(tool, activeTab) === activeGroup);
    }

    filtered = filtered.filter(passAdvancedFilters);

    if(sortMode === 'website') filtered = filtered.filter(t => getItemType(t) === 'Website' || t.url || t.domain);
    if(sortMode === 'tool') filtered = filtered.filter(t => getItemType(t) === 'Tool');

    if(searchQuery){
      const q = normalize(searchQuery);
      const words = q.split(/\s+/).filter(Boolean);
      if(words.length){
        filtered = filtered.filter(t => {
          const hay = [t.name, t.domain, t.best_for, t.description, (t.tags||[]).join(' '), t.primary_category, t.primary_group].join(' ').toLowerCase();
          return words.every(w => hay.includes(w));
        });
      }
    }

    if(presetQuery && !searchQuery){
      const words = normalize(presetQuery).split(/\s+/).filter(Boolean);
      if(words.length){
        const presetFiltered = filtered.filter(t => {
          const hay = [t.name, t.domain, t.best_for, t.description, (t.tags||[]).join(' '), t.primary_category, t.primary_group, (t.platforms||[]).join(' ')].join(' ').toLowerCase();
          return words.some(w => hay.includes(w));
        });
        if(presetFiltered.length) filtered = presetFiltered;
      }
    }

    filtered.sort((a,b) => {
      if(sortMode === 'az') return a.name.localeCompare(b.name);
      if(sortMode === 'editor') return (getChoiceKind(b)==='editor') - (getChoiceKind(a)==='editor') || (Number(b.final_rank_score)||0) - (Number(a.final_rank_score)||0) || a.name.localeCompare(b.name);
      if(sortMode === 'developer') return (getChoiceKind(b)==='developer') - (getChoiceKind(a)==='developer') || (Number(b.final_rank_score)||0) - (Number(a.final_rank_score)||0) || a.name.localeCompare(b.name);
      if(sortMode === 'popular') return (Number(b.popularity_score)||0) - (Number(a.popularity_score)||0) || a.name.localeCompare(b.name);
      if(sortMode === 'free') return (Number(b.has_free_plan===true) - Number(a.has_free_plan===true)) || a.name.localeCompare(b.name);
      if(sortMode === 'open_source') return (Number(b.open_source===true || b.openSource===true) - Number(a.open_source===true || a.openSource===true)) || a.name.localeCompare(b.name);
      if(sortMode === 'verified') return String(b.last_verified||'').localeCompare(String(a.last_verified||'')) || a.name.localeCompare(b.name);
      const rankDiff = (Number(b.final_rank_score) || 0) - (Number(a.final_rank_score) || 0);
      return rankDiff || a.name.localeCompare(b.name);
    });

    return filtered;
  }

  function faviconUrl(domain, sz){
    if(!domain) return '';
    try{
      var u = new URL('https://www.google.com/s2/favicons');
      u.searchParams.set('domain', domain);
      u.searchParams.set('sz', String(sz || 64));
      u.searchParams.set('default', '404');
      return u.href;
    } catch(e) { return ''; }
  }
  function ddgFaviconUrl(domain){
    return 'https://icons.duckduckgo.com/ip3/'+encodeURIComponent(domain)+'.ico';
  }
  function getShortDesc(desc){
    if(!desc) return '';
    var dot = desc.indexOf('. ');
    if(dot > 0 && dot < 120) return desc.slice(0, dot + 1);
    return desc.length > 110 ? desc.slice(0, 110).trimEnd() + '…' : desc;
  }

  function renderCard(tool){
    const isFav = favorites.has(tool.id);
    const isSelected = selectedCompare.has(tool.id);
    const domain = tool.domain || '';
    const itemType = getItemType(tool);
    const imgSrc = tool.logoUrl || faviconUrl(domain, 64);
    const imgFallback = ddgFaviconUrl(domain);
    const displayTags = getToolDisplayTags(tool);
    const displayDesc = tool.tagline || getShortDesc(tool.description) || 'No description available.';
    return `
      <article class="tool-card" tabindex="0" data-tool-id="${escapeHtml(tool.id)}">
        ${choiceBadgeHtml(getChoiceKind(tool))}
        <div class="compare-wrap">
          <input type="checkbox" class="compare-check" aria-label="Compare ${escapeHtml(tool.name)}" title="Add to comparison" ${isSelected ? 'checked' : ''}>
        </div>
        <div class="tool-header">
          <div class="tool-title-row">
            <img class="tool-favicon" width="24" height="24" src="${escapeHtml(imgSrc)}" alt="" loading="lazy" data-fallback="${escapeHtml(imgFallback)}">
            <div>
              <a class="tool-name" href="${escapeHtml(tool.url || '#')}" target="_blank" rel="noopener">${escapeHtml(tool.name)}</a>
              <span class="tool-type-inline ${itemType.toLowerCase()}">${escapeHtml(itemType)}${domain ? ' · ' + escapeHtml(domain) : ''}</span>
            </div>
          </div>
          <div class="tool-meta">
            <span class="tool-domain" title="${escapeHtml(domain)}">${escapeHtml(domain)}</span>
            ${tool.openSource ? '<span class="oss-badge">Open Source</span>' : ''}
            <button class="favorite-btn ${isFav ? 'active' : ''}" type="button" aria-label="Save ${escapeHtml(tool.name)}"></button>
          </div>
        </div>
        <div class="tool-uc">${escapeHtml(displayDesc)}</div>
        <div class="tool-tags">
          ${displayTags.slice(0, 3).map(item => `<span class="tool-tag ${escapeHtml(item.cls)}">${escapeHtml(item.label)}</span>`).join('')}
          ${displayTags.length > 3 ? `<span class="tool-tag tool-tag-more" title="${escapeHtml(displayTags.slice(3).map(t => t.label).join(', '))}">+${displayTags.length - 3}</span>` : ''}
        </div>
      </article>
    `;
  }

  function renderContent(){
    const baseTools = tools.filter(tool => toolInTab(tool, activeTab));
    if(activeTab !== 'tab-0' && activeGroup !== 'all') {
      const validGroups = new Set(getCurrentGroups(baseTools).map(x => x[0]));
      if(!validGroups.has(activeGroup)) activeGroup = 'all';
    }
    renderedTools = filterTools();

    // Reset how many cards are revealed whenever the actual result set changes
    // (new tab/category/search/sort/filter) -- but not when re-rendering just
    // because "Show more" was clicked with the same result set.
    const renderKey = [activeTab, activeGroup, searchQuery, sortMode, activePreset, JSON.stringify(advFilters)].join('|');
    if (renderKey !== lastRenderKey) { visibleCount = CARD_PAGE_SIZE; lastRenderKey = renderKey; }

    const cat = getCurrentCategory();
    if (els.categoryTitle) els.categoryTitle.textContent = cat.label;
    if (els.categorySubtitle) els.categorySubtitle.textContent = '';
    const isFiltered = renderedTools.length !== tools.length;
    if (window.hubSetResultChip) {
      const sec = document.getElementById('tools-section');
      if (sec && sec.classList.contains('active')) {
        window.hubSetResultChip(isFiltered ? `${renderedTools.length} of ${tools.length} tools` : `${tools.length} AI tools`);
      }
    }

    const controlsHtml = renderRecommendedViews() + renderFilterControls(baseTools);

    if(!renderedTools.length){
      els.content.innerHTML = controlsHtml + `<div class="no-results"><strong>No matching tools found</strong><span>Try a broader search, reset filters, or switch categories.</span></div>`;
      return;
    }

    // Render only the first `visibleCount` results at a time instead of every
    // matched tool at once -- Master List alone is 2,324 cards, which used to
    // paint ~43k DOM nodes on every visit regardless of what the user asked for.
    const visibleTools = renderedTools.slice(0, visibleCount);
    const remaining = renderedTools.length - visibleTools.length;

    // Group headers still report each group's TRUE total across the full
    // filtered set, not just how many of it happen to be visible so far.
    const trueGroupCounts = new Map();
    renderedTools.forEach(tool => {
      const group = getPrimaryGroup(tool, activeTab);
      trueGroupCounts.set(group, (trueGroupCounts.get(group) || 0) + 1);
    });

    const groups = new Map();
    visibleTools.forEach(tool => {
      const group = getPrimaryGroup(tool, activeTab);
      if(!groups.has(group)) groups.set(group, []);
      groups.get(group).push(tool);
    });

    const loadMoreHtml = remaining > 0 ? `
      <div class="load-more-row">
        <button type="button" class="load-more-btn" id="tools-loadMore">
          Show ${Math.min(CARD_PAGE_SIZE, remaining)} more <span class="load-more-remaining">(${remaining} left)</span>
        </button>
      </div>
    ` : '';

    els.content.innerHTML = controlsHtml + [...groups.entries()].map(([group, groupTools]) => {
      const trueCount = trueGroupCounts.get(group);
      const countLabel = groupTools.length === trueCount ? String(trueCount) : `${groupTools.length} of ${trueCount}`;
      return `
      <section class="group-block">
        <h3 class="group-heading">${escapeHtml(group)} <span class="group-count">${countLabel}</span></h3>
        <div class="tool-grid">
          ${groupTools.map(renderCard).join('')}
        </div>
      </section>
    `;
    }).join('') + loadMoreHtml;

    const loadMoreBtn = document.getElementById('tools-loadMore');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        visibleCount += CARD_PAGE_SIZE;
        renderContent();
      });
    }
  }

  function updateCompareBar(){
    const selected = tools.filter(t => selectedCompare.has(t.id)).slice(0,4);
    if(selected.length){
      els.compareBar.classList.add('active');
      els.compareItems.innerHTML = selected.map(t => `<span class="compare-chip">${escapeHtml(t.name)}</span>`).join('');
    } else {
      els.compareBar.classList.remove('active');
      els.compareItems.innerHTML = '';
    }
  }

  function openCompare(){
    const selected = tools.filter(t => selectedCompare.has(t.id)).slice(0,4);
    if(selected.length < 2){
      alert('Select at least 2 tools to compare.');
      return;
    }
    els.compareModalContent.innerHTML = `
      <table class="compare-table">
        <thead><tr><th>Field</th>${selected.map(t => `<th>${escapeHtml(t.name)}</th>`).join('')}</tr></thead>
        <tbody>
          ${[
            {label:'Website',raw:true,vals:selected.map(t=>'<a href="'+escapeHtml(t.url)+'\" target="_blank\" rel="noopener">'+escapeHtml(t.domain||t.url)+'</a>')},
            {label:'Pricing',vals:selected.map(t=>escapeHtml(t.pricing))},
            {label:'Description',vals:selected.map(t=>escapeHtml(t.description))},
            {label:'Tags',vals:selected.map(t=>escapeHtml(t.tags.join(', ')))},
            {label:'Categories',vals:selected.map(t=>escapeHtml(getToolCategories(t).filter(c=>c!=='Master List').join(', ')))}
          ].map(row=>{
            const allSame=row.vals.every((v,_,a)=>v===a[0]);
            const cls=allSame?'cell-match':'cell-diff';
            return `<tr><th>${row.label}</th>${row.vals.map(v=>`<td class="${cls}">`+v+`</td>`).join('')}</tr>`;
          }).join('')}
        </tbody>
      </table>
    `;
    lastCompareFocus = document.activeElement;
    els.compareModal.classList.add('active');
    if(els.modalClose) els.modalClose.focus();
  }

  function closeCompare(){
    if(!els.compareModal.classList.contains('active')) return;
    els.compareModal.classList.remove('active');
    if(lastCompareFocus && typeof lastCompareFocus.focus === 'function' && document.contains(lastCompareFocus)){
      try{ lastCompareFocus.focus({preventScroll:true}); }catch(e){ try{ lastCompareFocus.focus(); }catch(_){} }
    }
    lastCompareFocus = null;
  }


  function exportToolRows(rows, filename){
    const csvCell = value => {
      let str = String(value ?? '');
      // Prevent CSV-formula injection in Excel/Sheets
      if (/^[=+\-@\t\r]/.test(str)) str = "'" + str;
      return '"' + str.replace(/"/g, '""') + '"';
    };
    const csv = rows.map(row => row.map(csvCell).join(',')).join('\r\n');
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 0);
  }

  function getExportRows(list){
    const rows = [['Tool','URL','Domain','Description','Pricing','Tags','Categories','Best For','Status','Score']];
    list.forEach(t => rows.push([
      t.name,
      t.url,
      t.domain,
      t.description,
      t.pricing,
      (t.tags || []).join('|'),
      getToolCategories(t).join('|'),
      t.best_for || t.tagline || '',
      t.status || '',
      t.final_rank_score || ''
    ]));
    return rows;
  }

  function exportCsv(){
    exportToolRows(getExportRows(renderedTools), 'toolatlas-tools-current-view.csv');
  }

  function exportSaved(){
    const savedTools = [...favorites]
      .map(id => tools.find(t => t.id === id))
      .filter(Boolean)
      .sort((a,b) => a.name.localeCompare(b.name));
    if(!savedTools.length){
      showToast('No saved tools to export');
      return;
    }
    exportToolRows(getExportRows(savedTools), 'toolatlas-saved-tools.csv');
  }

  function inferToolGuidance(tool, similar){
    const cats = getToolCategories(tool).join(', ') || tool.primary_category || 'general workflows';
    const best = tool.best_for || tool.tagline || (tool.description ? getShortDesc(tool.description) : '') || `${tool.name} workflows`;
    const audience = (tool.target_user || []).slice(0,3).join(', ') || ((tool.tags||[]).join(' ').match(/developer|marketer|creator|student|founder|enterprise/i) || ['Teams'])[0];
    const itemType = getItemType(tool).toLowerCase();
    const useWhen = `Use when you need ${best.replace(/\.$/, '')} in ${cats}.`;
    const avoidWhen = itemType === 'website'
      ? 'Avoid relying on it as your only source; verify details before making buying, hiring, or security decisions.'
      : 'Avoid when pricing, data privacy, integrations, or vendor lock-in do not match your workflow.';
    return {best, audience, useWhen, avoidWhen, alternatives: (similar || []).slice(0,4)};
  }

  function renderToolDecisionGuide(tool, similar){
    const g = inferToolGuidance(tool, similar);
    return `<div class="td-section td-guide-section">
      <span class="td-section-label">Decision guide</span>
      <div class="td-guide-grid">
        <div class="td-guide-card"><strong>Best for</strong><span>${escapeHtml(g.best)}</span></div>
        <div class="td-guide-card"><strong>Primary user</strong><span>${escapeHtml(g.audience)}</span></div>
        <div class="td-guide-card td-wide"><strong>Use when</strong><span>${escapeHtml(g.useWhen)}</span></div>
        <div class="td-guide-card td-wide"><strong>Avoid when</strong><span>${escapeHtml(g.avoidWhen)}</span></div>
      </div>
    </div>`;
  }

  function openToolDetail(tool, opts){
    opts = opts || {};
    if(!opts.preserveFocus) lastToolFocus = document.activeElement;
    const domain = tool.domain || '';
    let faviconHost = domain;
    if(!faviconHost && tool.url){
      try{ faviconHost = new URL(tool.url).hostname; }catch(e){ faviconHost = ''; }
    }

    // Header
    if (els.tdFavicon) {
      els.tdFavicon.src = faviconUrl(faviconHost, 128);
      els.tdFavicon.dataset.fallback = ddgFaviconUrl(faviconHost);
      els.tdFavicon.dataset.tried = '';
    }
    if (els.tdName) els.tdName.textContent = tool.name;
    if (els.tdUrlLink) {
      els.tdUrlLink.href = tool.url || '#';
      els.tdUrlLink.textContent = domain || tool.url || '';
    }

    // Categories (excluding Master List)
    const cats = tool.placements
      .filter(p => p.category && p.category !== 'Master List')
      .reduce((acc, p) => {
        const key = p.category;
        if(!acc.find(x => x.category === key)){
          acc.push({category: p.category, group: p.group || ''});
        }
        return acc;
      }, []);

    const allTags = [...new Set(tool.tags)].filter(t => t && !/^unknown$/i.test(String(t)));
    const isFav = favorites.has(tool.id);

    const altIds = tool.alternativeIds && tool.alternativeIds.length ? tool.alternativeIds : [];
    const altTools = altIds.map(id => tools.find(t => t.id === id)).filter(Boolean).slice(0,6);
    const similar = altTools.length ? altTools : getSimilarTools(tool, 6);

    if (els.tdBody) {
      els.tdBody.innerHTML = `
        <div class="td-actions">
          <a class="td-visit-btn" href="${escapeHtml(tool.url || '#')}" target="_blank" rel="noopener">Visit website ↗</a>
          <button class="td-fav-btn ${isFav ? 'active' : ''}" id="tdFavBtn" type="button"
            aria-label="${isFav ? 'Remove from saved' : 'Save tool'}"></button>
        </div>

        <div class="td-stats-bar">
          ${tool.pricing && !/^unknown$/i.test(String(tool.pricing)) ? `<span class="td-stat-chip">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1.5"/><path d="M6 4v2.5L7.5 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            ${escapeHtml(tool.pricing)}
          </span>` : ''}
          ${cats.length ? `<span class="td-stat-chip">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><rect x="1" y="2" width="10" height="2" rx="1" fill="currentColor"/><rect x="1" y="5" width="7" height="2" rx="1" fill="currentColor"/><rect x="1" y="8" width="8" height="2" rx="1" fill="currentColor"/></svg>
            ${cats.length} ${cats.length === 1 ? 'category' : 'categories'}
          </span>` : ''}
          ${allTags.length ? `<span class="td-stat-chip">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M1.5 6.5 5 10l5.5-8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            ${allTags.length} tag${allTags.length !== 1 ? 's' : ''}
          </span>` : ''}
          ${domain ? `<span class="td-stat-chip">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1.5"/><path d="M6 1c0 0-2 2-2 5s2 5 2 5M6 1c0 0 2 2 2 5s-2 5-2 5M1 6h10" stroke="currentColor" stroke-width="1.2"/></svg>
            ${escapeHtml(domain)}
          </span>` : ''}
          ${(tool.platforms||[]).length ? (tool.platforms||[]).map(p=>`<span class="td-stat-chip">`+escapeHtml(p)+`</span>`).join('') : ''}
          ${tool.openSource ? `<span class="td-stat-chip td-oss-chip">Open Source</span>` : ''}      </div>

        ${tool.description ? `
        <div class="td-section">
          <span class="td-section-label">About</span>
          <p class="td-description">${escapeHtml(tool.description)}</p>
        </div>` : ''}

        ${allTags.length ? `
        <div class="td-section">
          <span class="td-section-label">Tags &amp; Capabilities</span>
          <div class="td-tags-wrap">
            ${tool.pricing && !/^unknown$/i.test(String(tool.pricing)) ? `<span class="td-tag pricing-${escapeHtml(tool.pricing)}">${escapeHtml(tool.pricing)}</span>` : ''}
            ${allTags.map(t => `<span class="td-tag">${escapeHtml(t)}</span>`).join('')}
          </div>
        </div>` : ''}

        ${(tool.keyFeatures||[]).length ? `
        <div class="td-section">
          <span class="td-section-label">Key Features</span>
          <div class="td-tags-wrap">
            ${(tool.keyFeatures||[]).map(f=>`<span class="td-tag td-feature-tag">${escapeHtml(f)}</span>`).join('')}
          </div>
        </div>` : ''}

        ${(tool.integrations||[]).length ? `
        <div class="td-section">
          <span class="td-section-label">Integrations</span>
          <div class="td-tags-wrap">
            ${(tool.integrations||[]).map(i=>`<span class="td-tag td-integration-tag">${escapeHtml(i)}</span>`).join('')}
          </div>
        </div>` : ''}

        ${renderToolDecisionGuide(tool, similar)}

        ${cats.length ? `
        <div class="td-section">
          <span class="td-section-label">Appears in ${cats.length} ${cats.length === 1 ? 'category' : 'categories'}</span>
          <div class="td-categories">
            ${cats.map(c => `
              <div class="td-category-row">
                <span class="td-category-name">${escapeHtml(c.category)}</span>
                ${c.group && c.group !== c.category ? `<span class="td-group-badge">· ${escapeHtml(c.group)}</span>` : ''}
              </div>
            `).join('')}
          </div>
        </div>` : ''}

        ${similar.length ? `
        <div class="td-section">
          <span class="td-section-label">Similar tools (${similar.length})</span>
          <div class="td-similar-grid">
            ${similar.map(s => {
              let simHost = s.domain || '';
              if(!simHost && s.url){ try{ simHost = new URL(s.url).hostname; }catch(e){} }
              const simFav = encodeURIComponent(simHost);
              const simFallback = `https://icons.duckduckgo.com/ip3/${simFav}.ico`;
              return `
              <button class="td-similar-card" type="button" data-sim-id="${escapeHtml(s.id)}">
                <img class="td-sim-favicon" width="20" height="20" src="https://www.google.com/s2/favicons?domain=${simFav}&sz=32" alt=""
                  data-fallback="${simFallback}">
                <span class="td-sim-info">
                  <span class="td-sim-name">${escapeHtml(s.name)}</span>
                  ${s.pricing && !/^unknown$/i.test(String(s.pricing)) ? `<span class="td-sim-pricing">${escapeHtml(s.pricing)}</span>` : ''}
                </span>
              </button>`;
            }).join('')}
          </div>
        </div>` : ''}
      `;

      document.getElementById('tools-tdFavBtn')?.addEventListener('click', () => {
        if(favorites.has(tool.id)) favorites.delete(tool.id); else favorites.add(tool.id);
        saveFavorites(favorites);
        renderContent();
        openToolDetail(tool);
      });

      els.tdBody.querySelectorAll('[data-sim-id]').forEach(btn => {
        btn.addEventListener('click', () => {
          const simTool = tools.find(t => t.id === btn.dataset.simId);
          if(simTool) openToolDetail(simTool);
        });
      });
    }

    addRecent(tool.id);
    if(!opts.fromPopstate){
      const sp = new URLSearchParams(location.search);
      sp.set('tool', tool.id);
      history.pushState({tool: tool.id}, '', location.pathname + '?' + sp.toString() + location.hash);
    }
    renderRecentStrip();

    const shareBtn = document.createElement('button');
    shareBtn.className = 'td-share-btn';
    shareBtn.type = 'button';
    shareBtn.setAttribute('aria-label', 'Copy link');
    shareBtn.title = 'Copy link to this tool';
    shareBtn.textContent = 'Share';
    shareBtn.addEventListener('click', () => {
      const url = location.href;
      const done = () => showToast('Link copied!');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done).catch(() => fallbackCopy(url, done));
      } else {
        fallbackCopy(url, done);
      }
    });
    const actionsDiv = els.tdBody ? els.tdBody.querySelector('.td-actions') : null;
    if(actionsDiv) actionsDiv.appendChild(shareBtn);

    if (els.toolDetailModal) {
      els.toolDetailModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    if (els.tdClose) els.tdClose.focus();
  }

  function closeToolDetail(opts){
    opts = opts || {};
    const wasOpen = els.toolDetailModal.classList.contains('active');
    els.toolDetailModal.classList.remove('active');
    document.body.style.overflow = '';
    if(!opts.fromPopstate){
      const sp = new URLSearchParams(location.search);
      sp.delete('tool');
      const qs = sp.toString();
      history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
    }
    if(wasOpen && lastToolFocus && typeof lastToolFocus.focus === 'function' && document.contains(lastToolFocus)){
      try{ lastToolFocus.focus({preventScroll:true}); }catch(e){ try{ lastToolFocus.focus(); }catch(_){} }
    }
    if(!opts.keepFocus) lastToolFocus = null;
  }

  // Delegated card action handlers (replaces per-card binding)
  els.content.addEventListener('click', e => {
    const recToggle = e.target.closest('.recommended-toggle');
    if(recToggle){
      recommendedOpen = !recommendedOpen;
      renderContent();
      return;
    }
    const presetBtn = e.target.closest('.preset-chip');
    if(presetBtn){
      applyToolPreset(presetBtn.dataset.preset);
      return;
    }
    const groupBtn = e.target.closest('.group-chip');
    if(groupBtn){
      activePreset = 'custom';
      activeGroup = groupBtn.dataset.group || 'all';
      renderContent();
      return;
    }
    const moreBtn = e.target.closest('.more-filters-toggle');
    if(moreBtn){
      advancedOpen = !advancedOpen;
      renderContent();
      return;
    }
    if(e.target.closest('.filter-clear-btn')){
      activePreset = 'custom';
      presetQuery = '';
      searchQuery = '';
      advFilters = {pricing:'all', platform:'all', user:'all', availability:'all', status:'all'};
      activeGroup = 'all';
      sortMode = 'recommended';
      renderContent();
      return;
    }
    const favBtn = e.target.closest('.favorite-btn');
    if(favBtn){
      e.preventDefault();
      e.stopPropagation();
      const id = favBtn.closest('.tool-card')?.dataset.toolId;
      if(!id) return;
      if(favorites.has(id)) favorites.delete(id); else favorites.add(id);
      saveFavorites(favorites);
      renderContent();
      return;
    }
    // Open detail panel when clicking a card body (not on the tool-name link or compare checkbox)
    if(!e.target.closest('.tool-name') && !e.target.closest('.compare-wrap')){
      const card = e.target.closest('.tool-card');
      if(card){
        const tool = tools.find(t => t.id === card.dataset.toolId);
        if(tool) openToolDetail(tool);
      }
    }
  });
  els.content.addEventListener('change', e => {
    const sort = e.target.closest('[data-control="sort"]');
    if(sort){ activePreset = 'custom'; sortMode = sort.value || 'recommended'; renderContent(); return; }
    const filter = e.target.closest('[data-filter]');
    if(filter){ activePreset = 'custom'; advFilters[filter.dataset.filter] = filter.value || 'all'; renderContent(); return; }
    const compareCheck = e.target.closest('.compare-check');
    if(compareCheck){
      const id = compareCheck.closest('.tool-card')?.dataset.toolId;
      if(!id) return;
      if(e.target.checked) selectedCompare.add(id); else selectedCompare.delete(id);
      updateCompareBar();
    }
  });

  // Events
  els.tabs.addEventListener('click', e => {
    const btn = e.target.closest('.tab-btn');
    if(!btn) return;
    // Picking a leaf category closes its dropdown (the choice is made);
    // picking a department keeps it open so its children stay one click
    // away for further refinement.
    if(btn.classList.contains('tab-btn-child')) openDept = null;
    activePreset = 'custom';
    activeTab = btn.dataset.tab;
    activeGroup = 'all';
    searchQuery = '';
    presetQuery = '';
    advFilters = {pricing:'all', platform:'all', user:'all', availability:'all', status:'all'};
    renderTabs();
    renderContent();
    scrollSectionTop();
    // Keep the URL in sync with the selected category -- previously the
    // hash only reflected whatever category the page loaded with, so
    // clicking around left the address bar pointing at a stale view and
    // Back exited the hub entirely instead of undoing a category change.
    try{ history.replaceState(null, '', location.pathname + location.search + '#tools/' + activeTab); }catch(e){}
  });

  if(els.categorySearch){
    els.categorySearch.addEventListener('input', function(){
      categoryQuery = els.categorySearch.value || '';
      renderTabs();
    });
  }
  els.resetFilters.addEventListener('click', resetFilters);
  els.clearSaved.addEventListener('click', () => {
    if(confirm('Clear all saved tools?')) {
      favorites.clear();
      saveFavorites(favorites);
      renderContent();
    }
  });
  if(els.exportSaved) els.exportSaved.addEventListener('click', exportSaved);
  els.exportCsv.addEventListener('click', exportCsv);

  document.addEventListener('keydown', e => {
    // Ctrl/Cmd+K now focuses the global nav search instead of the old palette
    if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      const navSearch = document.getElementById('hub-global-search');
      if (navSearch) { e.preventDefault(); navSearch.focus(); navSearch.select(); }
    }
    if(e.key === 'Escape') {
      closeCompare();
      closeToolDetail();
    }
  });

  els.compareAction.addEventListener('click', openCompare);
  els.compareClear.addEventListener('click', () => {
    selectedCompare.clear();
    updateCompareBar();
    renderContent();
  });
  els.modalClose.addEventListener('click', closeCompare);
  els.tdClose.addEventListener('click', closeToolDetail);
  els.toolDetailModal.addEventListener('click', e => { if(e.target === els.toolDetailModal) closeToolDetail(); });
  els.compareModal.addEventListener('click', e => { if(e.target === els.compareModal) closeCompare(); });

  

  // Density
  document.querySelectorAll('.density-btn').forEach(btn =>
    btn.addEventListener('click', ()=> applyDensity(btn.dataset.density))
  );
  applyDensity(currentDensity);

  // Search history
els.recentStrip.addEventListener('click', function(e){
    const chip = e.target.closest('.recent-chip');
    if(chip){ const t=tools.find(function(x){return x.id===chip.dataset.id;}); if(t) openToolDetail(t); return; }
    if(e.target.closest('.recent-clear')){ localStorage.removeItem(RECENT_KEY); renderRecentStrip(); }
  });
  // Keyboard nav on cards
  els.content.addEventListener('keydown', e=>{
    const card = e.target.closest('.tool-card');
    if(!card) return;
    if(e.key==='Enter'||e.key===' '){
      e.preventDefault();
      const tool=tools.find(t=>t.id===card.dataset.toolId);
      if(tool) openToolDetail(tool);
      return;
    }
    if(e.key==='ArrowRight'||e.key==='ArrowDown'){
      e.preventDefault();
      const cards=[...els.content.querySelectorAll('.tool-card')];
      const i=cards.indexOf(card);
      if(i<cards.length-1) cards[i+1].focus();
    }
    if(e.key==='ArrowLeft'||e.key==='ArrowUp'){
      e.preventDefault();
      const cards=[...els.content.querySelectorAll('.tool-card')];
      const i=cards.indexOf(card);
      if(i>0) cards[i-1].focus();
    }
  });

  // Deep-link on load
  const initToolId = new URLSearchParams(location.search).get('tool');
  if(initToolId){ const initTool=tools.find(t=>t.id===initToolId); if(initTool) setTimeout(function(){ openToolDetail(initTool, {fromPopstate:true, preserveFocus:true}); },80); }

  window.addEventListener('popstate', function(){
    const toolId = new URLSearchParams(location.search).get('tool');
    if(toolId){
      const tool = tools.find(function(t){ return t.id === toolId; });
      if(tool) openToolDetail(tool, {fromPopstate:true, preserveFocus:true});
      return;
    }
    if(els.toolDetailModal.classList.contains('active')) closeToolDetail({fromPopstate:true});
  });



  document.addEventListener('click', function(e){
    var action = e.target.closest('[data-footer-action]');
    if(!action) return;
    var type = action.getAttribute('data-footer-action');
    if(type === 'search'){
      var trigger = document.getElementById('hub-search-trigger');
      if(trigger) trigger.click();
      else {
        var search = document.getElementById('hub-global-search');
        if(search) search.focus();
      }
    }
    if(type === 'top'){
      var section = document.getElementById('tools-section') || document.getElementById('tech-section');
      var active = document.querySelector('.hub-section.active') || section;
      if(active && active.scrollTo) active.scrollTo({top:0, behavior:'smooth'});
    }
  });

  renderRecentStrip();
  ensureActiveDeptOpen();
  renderTabs();
  renderContent();



  const bttBtn = document.getElementById('tools-backToTop');
  const toolsSectionEl = document.getElementById('tools-section');
  if (bttBtn && toolsSectionEl) {
    toolsSectionEl.addEventListener('scroll', function(){
      bttBtn.classList.toggle('visible', toolsSectionEl.scrollTop > 400);
    }, {passive: true});
    bttBtn.addEventListener('click', scrollSectionTop);
  }

  var footerSummary = document.getElementById('tools-footer-summary');
  if (footerSummary) {
    var categoryCount = categories.filter(function(c){ return c.id !== 'tab-0'; }).length;
    footerSummary.textContent = tools.length.toLocaleString() + ' unique tools across ' + categoryCount + ' curated categories. Category placements are preserved for discovery.';
  }


// postMessage API for hub integration
window.addEventListener('hub-message', function(e){
    const msg = e.detail;
    if(!msg||!msg.type) return;
    if(msg.type==='refreshChip'){
      const tabs = document.getElementById('tools-section');
      if (tabs && tabs.classList.contains('active')) renderContent();
      return;
    }
    if(msg.type==='search'){
      const next = (msg.query || '').trim();
      if (next === searchQuery && !presetQuery) return;
      searchQuery = next;
      presetQuery = '';
      activePreset = next ? 'custom' : activePreset;
      renderContent();
      return;
    }
    if(msg.type==='openTool'){
      const tool = tools.find(function(t){ return t.id === msg.id; });
      if (tool) openToolDetail(tool);
      return;
    }
    if(msg.type==='selectCategory'){
      var btn = els.tabs.querySelector('.tab-btn[data-tab="'+CSS.escape(msg.id)+'"]');
      if(btn){ btn.click(); scrollSectionTop(); }
    }
    if(msg.type==='scrollToItem'){
      if(msg.category){
        var tb = els.tabs.querySelector('.tab-btn[data-tab="'+CSS.escape(msg.category)+'"]');
        if(tb) tb.click();
      }
      // The target tool may sit past the incrementally-rendered page -- reveal
      // however many cards are needed to include it before trying to scroll.
      var targetIndex = renderedTools.findIndex(function(t){ return t.id === msg.id; });
      if(targetIndex > -1 && targetIndex >= visibleCount){
        visibleCount = Math.ceil((targetIndex + 1) / CARD_PAGE_SIZE) * CARD_PAGE_SIZE;
        renderContent();
      }
      requestAnimationFrame(function(){
        var el = els.content.querySelector('.tool-card[data-tool-id="'+CSS.escape(msg.id)+'"]');
        if(el){
          el.scrollIntoView({behavior:'smooth',block:'center'});
          el.style.outline='2px solid #6366f1';
          el.style.borderRadius='16px';
          setTimeout(function(){ el.style.outline=''; },2000);
        }
      });
    }
});


};
