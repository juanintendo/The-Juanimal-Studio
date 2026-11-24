// 缶全 KANZEN SUPPLY
// A hero you drag through and paint on, products as toys, a page per product, sections that repaint the page.
(() => {
  const INK = '#0e0e0d', WALL = '#e9e6df', ORANGE = '#ff4f1a', CHROME = '#c9ccd1', PINK = '#ff5fa2', ACID = '#d7f23a';
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s), $$ = (s, el = document) => [...el.querySelectorAll(s)];
  let detailOpen = false, pendingFrom = null;
  const L = (ja, en) => `<span lang="ja">${ja}</span><span lang="en">${en}</span>`;

  // ---------- catalogue ----------
  const CATS = [
    { id: 'spray', bg: 'wall', ja: '缶', en: 'Spray', subJa: 'スプレー塗料', subEn: 'Spray paint' },
    { id: 'caps', bg: 'ink', ja: 'キャップ', en: 'Caps', subJa: '交換ノズル', subEn: 'Swap-on nozzles' },
    { id: 'markers', bg: 'orange', ja: 'マーカー', en: 'Markers', subJa: 'ペンとモップ', subEn: 'Pens and mops' },
    { id: 'gear', bg: 'chrome', ja: '装備', en: 'Gear', subJa: '紙と肺のために', subEn: 'For paper and lungs' },
  ];
  const BG = { wall: [WALL, INK], ink: [INK, WALL], orange: [ORANGE, INK], chrome: [CHROME, INK] };
  const USE = { tag: ['タグ', 'Tags'], throw: ['スローアップ', 'Throw-ups'], piece: ['ピース', 'Pieces'], fill: ['塗りつぶし', 'Fills'],
    outline: ['アウトライン', 'Outlines'], detail: ['ディテール', 'Details'], hand: ['手書き', 'Handstyles'], bomb: ['ボミング', 'Bombing'],
    drip: ['垂れ', 'Drips'], sticker: ['ステッカー', 'Stickers'], sketch: ['スケッチ', 'Sketching'], safety: ['安全', 'Safety'] };
  const SURF = { wall: ['壁', 'Wall'], metal: ['金属', 'Metal'], paper: ['紙', 'Paper'], glass: ['ガラス', 'Glass'], canvas: ['キャンバス', 'Canvas'], sticker: ['ステッカー', 'Stickers'] };
  const S = (lj, le, vj, ve = vj) => [lj, le, vj, ve];
  const P = (o) => o;
  const PRODUCTS = [
    P({ id: 'matte', cat: 'spray', img: 'can-matte', color: ORANGE, name: '缶全 MATTE 400', kana: 'カンゼン マット400', series: ['缶全シリーズ', 'KANZEN series'],
      copy: ['一吹きで、壁が黙る。', 'One pass. The wall goes quiet.'],
      desc: ['コントロールしやすい低圧。速乾のマット仕上げで、次の層もきれいに乗る。', 'Low pressure for control. A flat matte finish that dries fast and takes the next layer clean.'],
      table: [S('容量', 'Volume', '400ml'), S('圧力', 'Pressure', '低圧', 'Low'), S('仕上げ', 'Finish', 'マット', 'Matte'), S('乾燥', 'Dry time', '約5分', '~5 min')],
      uses: { fill: 3, throw: 3, piece: 2, tag: 1 }, surf: ['wall', 'metal', 'canvas'] }),
    P({ id: 'chrome', cat: 'spray', img: 'can-chrome', color: CHROME, name: '缶全 CHROME', kana: 'カンゼン クローム', series: ['缶全シリーズ', 'KANZEN series'],
      copy: ['光るのは、夜だけでいい。', 'It only has to shine at night.'],
      desc: ['一度で下地を隠す高隠蔽シルバー。街灯の光をすべて拾う。', 'High-cover silver that hides what is underneath in one coat and catches every streetlight.'],
      table: [S('容量', 'Volume', '600ml'), S('圧力', 'Pressure', '中圧', 'Medium'), S('仕上げ', 'Finish', 'クローム', 'Chrome'), S('隠蔽', 'Cover', '高', 'High')],
      uses: { throw: 3, fill: 3, piece: 2, outline: 1 }, surf: ['wall', 'metal', 'canvas'] }),
    P({ id: 'fatfill', cat: 'spray', img: 'can-fat', color: INK, name: '缶全 FAT FILL', kana: 'カンゼン ファットフィル', series: ['缶全シリーズ', 'KANZEN series'],
      copy: ['太く、速く、一回で。', 'Fat, fast, one go.'],
      desc: ['高圧とワイドバルブ。コントロールより速さ。大きな塗りつぶしを一気に。', 'High pressure and a wide valve: big fills fast, at the cost of control.'],
      table: [S('容量', 'Volume', '750ml'), S('圧力', 'Pressure', '高圧', 'High'), S('仕上げ', 'Finish', 'セミグロス', 'Semi-gloss'), S('バルブ', 'Valve', 'ワイド', 'Wide')],
      uses: { fill: 3, bomb: 3, throw: 3, tag: 1 }, surf: ['wall', 'metal'] }),
    P({ id: 'pinkdot', cat: 'caps', img: 'cap-pinkdot', color: PINK, name: 'PINK DOT', kana: 'ピンクドット', series: ['線シリーズ', 'LINE series'],
      copy: ['点から、線が始まる。', 'Every line starts with a dot.'],
      desc: ['定番のスキニー。タグ、手書き、ピースの仕上げに。輪郭のはっきりした細い線。', 'The classic skinny. Tight, hard-edged lines for tags, handstyles and the last details of a piece.'],
      table: [S('線幅', 'Line', '1–2cm'), S('エッジ', 'Edge', 'シャープ', 'Sharp'), S('入数', 'Pack', '10個', '10')],
      uses: { tag: 3, detail: 3, outline: 2, hand: 2 }, surf: ['wall', 'metal', 'canvas'] }),
    P({ id: 'skinny', cat: 'caps', img: 'cap-skinny', color: WALL, name: 'SUPER SKINNY', kana: '極細キャップ', series: ['線シリーズ', 'LINE series'],
      copy: ['線は、細いほど嘘をつかない。', 'The thinner the line, the less it lies.'],
      desc: ['箱の中で一番細い線。ディテールとハイライトに。', 'The thinnest line in the box, for details and highlights.'],
      table: [S('線幅', 'Line', '0.5–1cm'), S('エッジ', 'Edge', '極シャープ', 'Razor'), S('入数', 'Pack', '10個', '10')],
      uses: { detail: 3, outline: 3, tag: 2 }, surf: ['wall', 'metal', 'canvas'] }),
    P({ id: 'outline', cat: 'caps', img: 'cap-outline', color: INK, name: 'OUTLINE', kana: 'アウトラインキャップ', series: ['線シリーズ', 'LINE series'],
      copy: ['縁が決まれば、全部決まる。', 'Nail the outline, nail the piece.'],
      desc: ['速く動いても崩れない、中くらいのシャープな線。アウトラインとスローアップの縁に。', 'A medium, crisp line that stays clean at speed. Made for outlines and the edge of a throw-up.'],
      table: [S('線幅', 'Line', '3–5cm'), S('エッジ', 'Edge', 'シャープ', 'Sharp'), S('入数', 'Pack', '10個', '10')],
      uses: { outline: 3, piece: 3, throw: 2, tag: 2 }, surf: ['wall', 'metal', 'canvas'] }),
    P({ id: 'nyfat', cat: 'caps', img: 'cap-nyfat', color: WALL, name: 'NY FAT', kana: 'NYファット', series: ['線シリーズ', 'LINE series'],
      copy: ['迷ったら、太く。', 'When in doubt, go fat.'],
      desc: ['大きなタグと速いスローアップの定番。一回で埋まる、太くて柔らかい線。', 'The street standard for big tags and fast throw-ups: a wide, soft-edged line that covers in one pass.'],
      table: [S('線幅', 'Line', '10–15cm'), S('エッジ', 'Edge', 'ソフト', 'Soft'), S('入数', 'Pack', '10個', '10')],
      uses: { tag: 3, throw: 3, fill: 2, bomb: 2 }, surf: ['wall', 'metal'] }),
    P({ id: 'astro', cat: 'caps', img: 'cap-fat', color: PINK, name: 'ASTRO FAT', kana: 'アストロファット', series: ['線シリーズ', 'LINE series'],
      copy: ['一曲終わる前に、塗りきる。', 'Fill it before the song ends.'],
      desc: ['うちで一番太いキャップ。塗りつぶしと背景に。柔らかい雲のような輪郭。', 'The widest cap we make. Fills and backgrounds, with an edge like a soft cloud.'],
      table: [S('線幅', 'Line', '20cm+'), S('エッジ', 'Edge', '雲', 'Cloud'), S('入数', 'Pack', '10個', '10')],
      uses: { fill: 3, bomb: 3, throw: 2 }, surf: ['wall', 'metal'] }),
    P({ id: 'calli', cat: 'caps', img: 'cap-calli', color: ACID, name: 'CALLIGRAPHY', kana: 'カリグラフィー', series: ['線シリーズ', 'LINE series'],
      copy: ['筆のように、スプレーで。', 'A brush, in a can.'],
      desc: ['斜めのスリットノズル。手首の角度で太く細く変わる、平筆のような線。手書きのスタイルに。', 'A diagonal slit nozzle: the line goes thick and thin with your wrist, like a flat brush. For handstyles.'],
      table: [S('線幅', 'Line', '1–6cm 可変', '1–6cm, variable'), S('エッジ', 'Edge', '平筆', 'Flat brush'), S('入数', 'Pack', '5個', '5')],
      uses: { hand: 3, tag: 3, piece: 1 }, surf: ['wall', 'metal', 'canvas'] }),
    P({ id: 'mop', cat: 'markers', img: 'mop', color: ACID, name: 'DRIP MOP', kana: '垂れモップ', series: ['垂シリーズ', 'DRIP series'],
      copy: ['垂れは失敗じゃない。署名だ。', "A drip isn't a mistake. It's a signature."],
      desc: ['わざと垂れるサラサラのインク。強く押せば、長く垂れる。', 'Thin ink that runs on purpose. Squeeze harder, longer drips.'],
      table: [S('容量', 'Volume', '200ml'), S('インク', 'Ink', 'アルコール', 'Alcohol'), S('チップ', 'Tip', 'フェルト 10mm', '10mm felt')],
      uses: { tag: 3, drip: 3, throw: 1 }, surf: ['wall', 'metal', 'glass', 'sticker'] }),
    P({ id: 'steel', cat: 'markers', img: 'marker', color: INK, name: 'STEEL MARKER', kana: '鉄マーカー', series: ['垂シリーズ', 'DRIP series'],
      copy: ['金属にも、ガラスにも。', "On metal. On glass. On anything you're allowed to."],
      desc: ['金属、ガラス、ステッカーに残る15mmの不透明ペイントマーカー。振って、押して、書く。', 'A 15mm opaque paint pen that stays on metal, glass and stickers. Shake, pump, write.'],
      table: [S('芯', 'Tip', '15mm'), S('塗料', 'Paint', '不透明', 'Opaque'), S('耐水', 'Water', '耐水', 'Waterproof')],
      uses: { tag: 3, sticker: 3, detail: 2 }, surf: ['metal', 'glass', 'sticker', 'wall', 'paper'] }),
    P({ id: 'book', cat: 'gear', img: 'book', color: INK, name: 'BLACKBOOK', kana: '黒本', series: ['備シリーズ', 'READY series'],
      copy: ['壁の前に、紙の上で。', 'Paper before walls.'],
      desc: ['マーカーが裏抜けしない180gのA4。すべてのピースはここから始まる。', 'A4, 180g paper that takes markers without bleeding. Where every piece starts.'],
      table: [S('サイズ', 'Size', 'A4'), S('紙', 'Paper', '180g'), S('ページ', 'Pages', '120')],
      uses: { sketch: 3, piece: 3, hand: 2 }, surf: ['paper'] }),
    P({ id: 'mask', cat: 'gear', img: 'mask', color: ORANGE, name: 'RESPIRATOR', kana: '防毒マスク', series: ['備シリーズ', 'READY series'],
      copy: ['肺は、替えがきかない。', "Lungs don't come in refills."],
      desc: ['有機ガス用フィルター付きのハーフマスク。塗料の煙は、カルチャーの一部じゃない。', 'A half-mask with organic vapour filters. Paint fumes are not part of the culture.'],
      table: [S('フィルター', 'Filter', '有機ガス用', 'Organic vapour'), S('交換', 'Refill', '交換式', 'Swappable'), S('サイズ', 'Size', 'M / L')],
      uses: { safety: 3 }, surf: ['all'] }),
  ];
  const byId = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));
  const IMG = p => `img/${p.img}.webp`;

  // ---------- products ----------
  const productsEl = $('#products');
  CATS.forEach(cat => {
    const sec = document.createElement('div');
    sec.className = 'cat'; sec.id = 'cat-' + cat.id; sec.dataset.bg = cat.bg; sec.dataset.cat = cat.id;
    sec.innerHTML = `<div class="cat-head rv"><h3>${L(cat.ja, cat.en)}</h3><p>${L(cat.subJa, cat.subEn)}</p></div><div class="grid"></div>`;
    const grid = $('.grid', sec);
    PRODUCTS.filter(p => p.cat === cat.id).forEach((p, i) => {
      const a = document.createElement('article');
      a.className = 'card rv'; a.tabIndex = 0; a.dataset.id = p.id; a.style.transitionDelay = (i % 2) * 120 + 'ms';
      a.setAttribute('role', 'link'); a.setAttribute('aria-label', p.name);
      a.innerHTML = `<div class="art"><img src="${IMG(p)}" alt="" loading="lazy" decoding="async" style="--fd:-${(Math.random() * 4).toFixed(2)}s"></div>
        <p class="copy">${L(p.copy[0], p.copy[1])}</p>
        <div class="info"><span class="series">${L(p.series[0], p.series[1])}</span>
          <h4>${p.name}<span class="kana">${p.kana}</span></h4>
          <span class="arrow" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 18 18"><path d="M2 9h13M10 4l5 5-5 5" fill="none" stroke="currentColor" stroke-width="2.4"/></svg></span>
          <ul class="specs">${p.table.slice(0, 3).map(s => `<li>${L(s[2], s[3])}</li>`).join('')}</ul></div>`;
      a.addEventListener('pointerenter', () => puff(a, p));
      a.addEventListener('click', () => go(p.id, $('img', a)));
      a.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(p.id, $('img', a)); } });
      grid.appendChild(a);
    });
    productsEl.appendChild(sec);
  });

  // a puff of paint from the nozzle when you meet a product
  function puff(card, p) {
    if (REDUCED) return;
    const art = $('.art', card), r = art.getBoundingClientRect();
    const col = p.color === INK ? ORANGE : p.color;
    for (let i = 0; i < 16; i++) {
      const d = document.createElement('i'); d.className = 'puff';
      const s = 6 + Math.random() * 16; d.style.cssText = `left:${r.width / 2 - s / 2}px;top:${r.height * .06}px;width:${s}px;height:${s}px;background:${col}`;
      art.appendChild(d);
      const ang = -Math.PI / 2 + (Math.random() - .5) * 1.8, dist = 50 + Math.random() * 100;
      d.animate([{ transform: 'translate(0,0) scale(.4)', opacity: .95 }, { transform: `translate(${Math.cos(ang) * dist}px,${Math.sin(ang) * dist}px) scale(1.7)`, opacity: 0 }],
        { duration: 650 + Math.random() * 500, easing: 'cubic-bezier(.16,1,.3,1)' }).onfinish = () => d.remove();
    }
  }

  // ---------- index, menu, safety list ----------
  $('.index').innerHTML = CATS.map(c => `<a href="#cat-${c.id}" data-cat="${c.id}">${L(c.ja, c.en)}</a>`).join('');
  $('.menu-products').innerHTML = CATS.map((c, k) => `<div class="menu-cat rv-m" style="--k:${k}"><h3>${L(c.ja, c.en)}<small>${c.id.toUpperCase()}</small></h3>
    <ul>${PRODUCTS.filter(p => p.cat === c.id).map(p => `<li><a href="#/p/${p.id}" data-close>${p.name}</a></li>`).join('')}</ul></div>`).join('');
  $$('.menu-side > *').forEach((el, k) => { el.classList.add('rv-m'); el.style.setProperty('--k', k + 4); });
  $('.sds').innerHTML = PRODUCTS.map((p, i) =>
    `<li><span class="n">SDS-${String(i + 1).padStart(2, '0')}</span><span class="t">${p.name}</span><span class="soon">${L('準備中', 'Coming soon')}</span></li>`).join('');

  const menu = $('#menu'), burger = $('.burger');
  function setMenu(open) {
    burger.setAttribute('aria-expanded', open);
    if (open) { menu.hidden = false; requestAnimationFrame(() => menu.classList.add('open')); document.documentElement.classList.add('locked'); setTimeout(() => $('a', menu)?.focus({ preventScroll: true }), 300); }
    else { menu.classList.remove('open'); if (!detailOpen) document.documentElement.classList.remove('locked'); setTimeout(() => { if (!menu.classList.contains('open')) menu.hidden = true; }, 800); }
  }
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', e => {
    const a = e.target.closest('[data-close]'); if (!a) return;
    setMenu(false);
    if (a.hasAttribute('data-studio')) { e.preventDefault(); if (detailOpen) location.hash = ''; scrollTo({ top: 0, behavior: 'smooth' }); setTimeout(() => studio(true), 500); }
    else if (detailOpen && !a.getAttribute('href').startsWith('#/p/')) location.hash = '';
  });

  // ---------- hero carousel: drag to browse, scroll stays the page's ----------
  const hero = $('.hero'), track = $('.track'), label = $('.hero-label'), series = $('.hero-series');
  const N = PRODUCTS.length;
  const slides = PRODUCTS.map(p => {
    const s = document.createElement('div'); s.className = 'slide';
    s.innerHTML = `<img src="${IMG(p)}" alt="" decoding="async" draggable="false" style="--fd:-${(Math.random() * 4).toFixed(2)}s">`;
    track.appendChild(s); return s;
  });
  let pos = 0, target = 0, sw = 0, spacing = 0, centre = -1, lastTouch = performance.now(), heroVisible = true, painting = false;
  function measure() {
    const phone = innerWidth <= 760;
    sw = phone ? innerWidth * .74 : Math.min(innerWidth * .44, innerHeight * .78);
    spacing = phone ? innerWidth * .74 : sw * .98;
    hero.style.setProperty('--sw', sw + 'px');
  }
  measure(); addEventListener('resize', measure);
  function layout() {
    slides.forEach((s, j) => {
      let d = j - pos; d = ((d % N) + N + N / 2) % N - N / 2;
      const a = Math.min(Math.abs(d), 1.4);
      s.style.transform = `translate3d(${d * spacing}px,${a * 2}vh,0) scale(${1 - a * .1})`;
      s.style.zIndex = 10 - Math.round(Math.abs(d));
    });
    const c = ((Math.round(pos) % N) + N) % N;
    if (c !== centre) {
      centre = c; const p = PRODUCTS[c];
      label.textContent = p.name; series.innerHTML = L(p.series[0], p.series[1]);
      if (!REDUCED) $('.hero-name').animate([{ opacity: 0, translate: '0 8px' }, { opacity: 1, translate: '0 0' }], { duration: 450, easing: 'cubic-bezier(.16,1,.3,1)' });
    }
  }
  let drag = null;
  hero.addEventListener('pointerdown', e => {
    if (painting || e.button > 0 || e.target.closest('button,a,.studio')) return;
    drag = { x: e.clientX, y: e.clientY, p: pos, t: performance.now(), v: 0, lx: e.clientX, lt: performance.now(), on: false, id: e.pointerId };
  });
  hero.addEventListener('pointermove', e => {
    if (!drag || painting) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.on) {
      if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) { drag.on = true; hero.classList.add('dragging'); hero.setPointerCapture(drag.id); }
      else if (Math.abs(dy) > 10) { drag = null; return; }
      else return;
    }
    const now = performance.now();
    drag.v = .8 * drag.v + .2 * ((e.clientX - drag.lx) / Math.max(1, now - drag.lt));
    drag.lx = e.clientX; drag.lt = now;
    pos = target = drag.p - dx / spacing; lastTouch = now;
  });
  const endDrag = e => {
    if (!drag) return;
    if (drag.on) { target = Math.round(pos - drag.v * 260 / spacing * 1.2); }
    else if (e && e.type === 'pointerup') {
      // a click on the toy in the frame opens its page
      const r = hero.getBoundingClientRect();
      if (Math.abs(e.clientX - (r.left + r.width / 2)) < sw * .4) go(PRODUCTS[centre].id, $('img', slides[centre]));
    }
    hero.classList.remove('dragging'); drag = null; lastTouch = performance.now();
  };
  hero.addEventListener('pointerup', endDrag); hero.addEventListener('pointercancel', endDrag);
  hero.addEventListener('keydown', e => { if (e.key === 'ArrowRight') { target = Math.round(target) + 1; lastTouch = performance.now(); } if (e.key === 'ArrowLeft') { target = Math.round(target) - 1; lastTouch = performance.now(); } });
  hero.tabIndex = 0;
  $('.hero-name').addEventListener('click', () => go(PRODUCTS[centre].id, $('img', slides[centre])));
  (function loop(now) {
    if (!drag?.on) {
      if (!REDUCED && heroVisible && !painting && !document.hidden && !detailOpen && now - lastTouch > 3400) { target = Math.round(target) + 1; lastTouch = now; }
      pos += (target - pos) * (REDUCED ? 1 : .085);
      if (Math.abs(target - pos) < .0005) pos = target;
    }
    layout();
    requestAnimationFrame(loop);
  })(performance.now());

  // ---------- spray studio ----------
  // each cap: radius (px at 1440 wide), hardness of the edge, flow, overspray, how fast it runs, sound pitch; calligraphy is a 45° slit
  const CAPS = [
    { id: 'pinkdot', r: 7, hard: .72, flow: 1, over: .3, drip: 1.6, hz: 5200 },
    { id: 'skinny', r: 4.2, hard: .82, flow: .95, over: .18, drip: 1.3, hz: 6800 },
    { id: 'outline', r: 15, hard: .62, flow: 1, over: .4, drip: 2.2, hz: 4000 },
    { id: 'nyfat', r: 34, hard: .46, flow: 1.1, over: .7, drip: 3.4, hz: 2500 },
    { id: 'astro', r: 60, hard: .26, flow: 1.15, over: .9, drip: 4.6, hz: 1700 },
    { id: 'calli', r: 28, hard: .88, flow: 1.25, over: .22, drip: 2.6, hz: 3300, slit: .2, ang: -Math.PI / 4 },
  ];
  const COLOURS = [ORANGE, INK, '#d3d6db', PINK, ACID, '#f6f3ec'];
  let cap = CAPS[3], colour = ORANGE;
  const capsEl = $('.caps'), swEl = $('.swatches');
  capsEl.innerHTML = CAPS.map(c => `<button type="button" class="cap-btn" role="radio" aria-checked="${c === cap}" data-cap="${c.id}" aria-label="${byId[c.id].name}">
    <img src="${IMG(byId[c.id])}" alt=""><span>${byId[c.id].name}</span></button>`).join('');
  swEl.innerHTML = COLOURS.map(c => `<button type="button" class="sw" role="radio" aria-checked="${c === colour}" data-c="${c}" style="background:${c}" aria-label="${c}"></button>`).join('');
  capsEl.addEventListener('click', e => {
    const b = e.target.closest('.cap-btn'); if (!b) return;
    cap = CAPS.find(c => c.id === b.dataset.cap);
    $$('.cap-btn', capsEl).forEach(x => x.setAttribute('aria-checked', x === b)); nozzleSize(); sfx.click();
  });
  swEl.addEventListener('click', e => {
    const b = e.target.closest('.sw'); if (!b) return;
    colour = b.dataset.c; $$('.sw', swEl).forEach(x => x.setAttribute('aria-checked', x === b)); sfx.rattle(2);
  });
  const bar = $('.studio-bar');
  function studio(on) {
    painting = on; hero.classList.toggle('painting', on); bar.hidden = !on;
    if (on) { sfx.rattle(5); lastTouch = performance.now(); }
  }
  $('.studio-open').addEventListener('click', () => studio(true));
  $('.studio-close').addEventListener('click', () => studio(false));
  addEventListener('keydown', e => { if (e.key === 'Escape') { if (menu.classList.contains('open')) setMenu(false); else if (detailOpen) location.hash = ''; else if (painting) studio(false); } });

  const wall = $('.wall'), ctx = wall.getContext('2d');
  let W = 0, H = 0, dpr = 1, scaleR = 1, acc = null, cols = 0;
  const CELL = 12;
  function size() {
    const prev = W ? (() => { const c = document.createElement('canvas'); c.width = wall.width; c.height = wall.height; c.getContext('2d').drawImage(wall, 0, 0); return c; })() : null;
    dpr = Math.min(devicePixelRatio || 1, 2); W = hero.clientWidth; H = hero.clientHeight;
    wall.width = W * dpr; wall.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    scaleR = Math.min(1.2, Math.max(.6, W / 1440));
    cols = Math.ceil(W / CELL); acc = new Float32Array(cols * Math.ceil(H / CELL));
    if (prev) ctx.drawImage(prev, 0, 0, W, H); else oldWall();
    nozzleSize();
  }
  // the wall has history: an old throw-up, half buffed
  function oldWall() {
    ctx.save(); ctx.globalAlpha = .035; ctx.fillStyle = INK; ctx.font = `${Math.round(H * .5)}px "Dela Gothic One", sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.translate(W * .5, H * .52); ctx.rotate(-.06); ctx.fillText('缶全', 0, 0); ctx.restore();
    const tones = ['#dedad2', '#e3e0d8', '#d8d4cb'];
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = tones[i % 3];
      const w = W * (.12 + Math.random() * .2), h = H * (.08 + Math.random() * .16);
      ctx.fillRect(Math.random() * (W - w), Math.random() * (H - h), w, h);
    }
  }
  (document.fonts ? document.fonts.load('40px "Dela Gothic One"', '缶全').catch(() => {}) : Promise.resolve()).then(size);
  addEventListener('resize', () => { clearTimeout(size.t); size.t = setTimeout(size, 200); });

  const rgb = h => { const n = parseInt(h.slice(1), 16); return [n >> 16, n >> 8 & 255, n & 255]; };
  // one burst of paint from the nozzle
  function stamp(x, y, a) {
    const r = cap.r * scaleR, [R, G, B] = rgb(colour);
    ctx.save(); ctx.translate(x, y);
    if (cap.slit) { ctx.rotate(cap.ang); ctx.scale(1, cap.slit); }
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
    g.addColorStop(0, `rgba(${R},${G},${B},${a})`); g.addColorStop(cap.hard, `rgba(${R},${G},${B},${a * .9})`); g.addColorStop(1, `rgba(${R},${G},${B},0)`);
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill(); ctx.restore();
    // overspray: the fine dust that lands outside the line
    const n = Math.round(cap.over * (6 + r * .5));
    ctx.fillStyle = `rgba(${R},${G},${B},${Math.min(.55, a * 2.2)})`;
    for (let i = 0; i < n; i++) {
      const ang = Math.random() * 6.283, d = r * (.75 + Math.abs(gauss()) * .9), s = .5 + Math.random() * 1.3;
      let ox = Math.cos(ang) * d, oy = Math.sin(ang) * d;
      if (cap.slit) { const k = cap.slit + .25; const rx = ox * Math.cos(cap.ang) - oy * k * Math.sin(cap.ang); oy = ox * Math.sin(cap.ang) + oy * k * Math.cos(cap.ang); ox = rx; }
      ctx.fillRect(x + ox, y + oy, s, s);
    }
    // paint that piles up in one place runs
    const ci = Math.floor(y / CELL) * cols + Math.floor(x / CELL);
    if (acc && ci >= 0 && ci < acc.length) {
      acc[ci] += a * r * .12;
      if (acc[ci] > cap.drip * 7) {
        acc[ci] = -cap.drip * 4;
        drops.push({ x: x + (Math.random() - .5) * r * (cap.slit ? 1.4 : .7), y: y + r * (cap.slit ? .25 : .45), len: 0, v: 1.1 + Math.random() * .8,
          max: r * 1.2 + 30 + Math.random() * 110, w: Math.max(1.6, r * .1 + Math.random() * 1.5), c: colour });
      }
    }
  }
  function gauss() { return (Math.random() + Math.random() + Math.random() - 1.5) / 1.5; }
  const drops = [];
  function runDrops(dt) {
    for (let i = drops.length - 1; i >= 0; i--) {
      const d = drops[i], step = d.v * dt / 16; d.v = Math.max(.06, d.v * .985);
      ctx.fillStyle = d.c; ctx.globalAlpha = .92;
      ctx.fillRect(d.x - d.w / 2, d.y + d.len, d.w, step + .5);
      d.len += step;
      if (d.len > d.max || d.v < .07) { ctx.beginPath(); ctx.arc(d.x, d.y + d.len, d.w * .85, 0, 7); ctx.fill(); drops.splice(i, 1); }
      ctx.globalAlpha = 1;
    }
  }
  // the pointer is a nozzle: paint flows with time, so slow lines are heavy and fast lines are dusty
  const nozzle = $('.nozzle');
  function nozzleSize() {
    const r = cap.r * scaleR, w = r * 2, h = cap.slit ? r * 2 * cap.slit : w;
    nozzle.style.width = Math.max(8, w) + 'px'; nozzle.style.height = Math.max(cap.slit ? 4 : 8, h) + 'px';
    nozzle.style.borderRadius = cap.slit ? '2px' : '50%';
    nozzle.dataset.rot = cap.slit ? cap.ang : 0;
  }
  let spray = null, nx = -99, ny = -99;
  hero.addEventListener('pointermove', e => {
    if (!painting) return;
    const r = hero.getBoundingClientRect(); nx = e.clientX - r.left; ny = e.clientY - r.top;
    nozzle.style.transform = `translate(${nx}px,${ny}px) translate(-50%,-50%) rotate(${nozzle.dataset.rot || 0}rad)`;
    if (spray) { spray.tx = nx; spray.ty = ny; }
  });
  hero.addEventListener('pointerdown', e => {
    if (!painting || e.target.closest('button,a,.studio')) return;
    const r = hero.getBoundingClientRect(); nx = e.clientX - r.left; ny = e.clientY - r.top;
    spray = { x: nx, y: ny, tx: nx, ty: ny, x0: nx, y0: ny, x1: nx, y1: ny };
    try { hero.setPointerCapture(e.pointerId); } catch (err) {} sfx.on(); e.preventDefault();
  });
  const stopSpray = () => { if (!spray) return; tags.push(spray); spray = null; sfx.off(); };
  hero.addEventListener('pointerup', stopSpray); hero.addEventListener('pointercancel', stopSpray);
  const tags = [];
  let lastT = performance.now();
  (function paint(now) {
    const dt = Math.min(48, now - lastT); lastT = now;
    if (spray) {
      const L2 = Math.hypot(spray.tx - spray.x, spray.ty - spray.y), r = cap.r * scaleR, gap = Math.max(1.2, cap.slit ? r * cap.slit * .6 : r * .3);
      const n = Math.max(1, Math.ceil(L2 / gap));
      const base = .46 * cap.flow * dt / 16, a = Math.max(.03, Math.min(.6, base / (1 + (L2 / Math.max(dt, 1)) * 6 / r)));
      for (let i = 1; i <= n; i++) stamp(spray.x + (spray.tx - spray.x) * i / n, spray.y + (spray.ty - spray.y) * i / n, a);
      sfx.level(L2 / dt);
      spray.x = spray.tx; spray.y = spray.ty;
      spray.x0 = Math.min(spray.x0, spray.x - r); spray.y0 = Math.min(spray.y0, spray.y - r); spray.x1 = Math.max(spray.x1, spray.x + r); spray.y1 = Math.max(spray.y1, spray.y + r + 80);
    }
    if (drops.length) runDrops(dt);
    requestAnimationFrame(paint);
  })(lastT);
  // buffing: a slightly-wrong grey rolled over every piece, like the city does
  $('.buff').addEventListener('click', () => {
    const list = tags.splice(0); drops.length = 0; if (acc) acc.fill(0);
    if (!list.length) return;
    sfx.roll();
    list.forEach((t, k) => {
      const pad = 26, x = t.x0 - pad, y = t.y0 - pad, w = t.x1 - t.x0 + pad * 2, h = t.y1 - t.y0 + pad * 2;
      const tone = ['#d9d5cc', '#dfdbd3', '#d4d0c6'][k % 3], t0 = performance.now() + k * 110, dur = REDUCED ? 1 : 560;
      (function roll(now) {
        const u = Math.min(1, Math.max(0, (now - t0) / dur));
        ctx.fillStyle = tone; ctx.fillRect(x, y, w * u, h);
        if (u < 1) requestAnimationFrame(roll);
      })(performance.now());
    });
  });

  // ---------- sound: a filtered hiss per cap, the ball rattling in the can, the click of a cap ----------
  const sfx = (() => {
    let ac = null, hiss = null, gain = null, band = null, muted = false, noise = null;
    const btn = $('.sound');
    btn.addEventListener('click', () => { muted = !muted; btn.setAttribute('aria-pressed', !muted); if (muted && gain) gain.gain.setTargetAtTime(0, ac.currentTime, .02); });
    function init() {
      if (ac) return true;
      try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return false; }
      noise = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate); const d = noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      band = ac.createBiquadFilter(); band.type = 'bandpass'; band.Q.value = .6;
      const hp = ac.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 500;
      gain = ac.createGain(); gain.gain.value = 0;
      hiss = ac.createBufferSource(); hiss.buffer = noise; hiss.loop = true; hiss.connect(band); band.connect(hp); hp.connect(gain); gain.connect(ac.destination); hiss.start();
      return true;
    }
    function burst(t, dur, f, v) {
      const s = ac.createBufferSource(); s.buffer = noise; const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = f; bp.Q.value = 4;
      const g = ac.createGain(); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + dur);
      s.connect(bp); bp.connect(g); g.connect(ac.destination); s.start(t, Math.random()); s.stop(t + dur + .02);
    }
    return {
      on() { if (muted || !init()) return; ac.resume(); band.frequency.setTargetAtTime(cap.hz, ac.currentTime, .01); gain.gain.setTargetAtTime(.22, ac.currentTime, .015); },
      off() { if (gain) gain.gain.setTargetAtTime(0, ac.currentTime, .04); },
      level(speed) { if (gain && !muted) gain.gain.setTargetAtTime(.14 + Math.min(.14, speed * .05), ac.currentTime, .05); },
      click() { if (muted || !init()) return; ac.resume(); burst(ac.currentTime, .04, 4200, .5); burst(ac.currentTime + .05, .03, 2600, .35); },
      rattle(n) { if (muted || !init()) return; ac.resume(); for (let i = 0; i < n; i++) burst(ac.currentTime + i * .085 + Math.random() * .02, .05, 3000 + Math.random() * 1500, .45); },
      roll() { if (muted || !init()) return; ac.resume(); burst(ac.currentTime, .6, 900, .25); },
    };
  })();

  // ---------- product pages ----------
  const detail = $('#detail');
  function go(id, fromImg) { pendingFrom = fromImg || null; location.hash = '#/p/' + id; }
  function render(p) {
    const cat = CATS.find(c => c.id === p.cat), [bg, fg] = BG[cat.bg];
    detail.style.setProperty('--dbg', bg); detail.style.setProperty('--dfg', fg);
    const i = PRODUCTS.indexOf(p), prev = PRODUCTS[(i - 1 + N) % N], next = PRODUCTS[(i + 1) % N];
    const uses = Object.entries(p.uses).map(([k, v], n) => `<li><b>${L(USE[k][0], USE[k][1])}<small>${USE[k][1].toUpperCase()}</small></b>
      <span class="meter" aria-label="${v} / 3">${[1, 2, 3].map(m => `<i class="${m <= v ? 'on' : ''}" style="--k:${n * 3 + m}"></i>`).join('')}</span></li>`).join('');
    const surf = p.surf[0] === 'all' ? `<span>${L('すべての現場', 'Every spot')}</span>`
      : Object.keys(SURF).map(k => `<span class="${p.surf.includes(k) ? '' : 'off'}">${L(SURF[k][0], SURF[k][1])}</span>`).join('');
    detail.innerHTML = `<div class="d-in">
      <div class="d-left">
        <button type="button" class="d-back">← ${L('商品一覧', 'All products')}</button>
        <div class="d-block"><h3>${L('用途', 'Good for')}<small>USES</small></h3><ul class="uses">${uses}</ul></div>
        <div class="d-block"><h3>${L('対応面', 'Surfaces')}<small>SURFACES</small></h3><div class="surf">${surf}</div></div>
        <div class="d-block"><h3>${L('仕様', 'Specs')}<small>SPECS</small></h3><table class="d-table">${p.table.map(s => `<tr><th>${L(s[0], s[1])}</th><td>${L(s[2], s[3])}</td></tr>`).join('')}</table></div>
      </div>
      <div class="d-right">
        <div class="d-stage"><div class="frame" aria-hidden="true"><i></i><i></i><i></i><i></i></div><img class="d-toy" src="${IMG(p)}" alt="${p.name}"></div>
        <p class="d-copy">${L(p.copy[0], p.copy[1])}</p>
        <div class="d-text">
          <span class="d-series">${L(p.series[0], p.series[1])} · ${L(cat.ja, cat.en)}</span>
          <h2 class="d-name">${p.name}</h2><span class="d-kana">${p.kana}</span>
          <p class="d-desc">${L(p.desc[0], p.desc[1])}</p>
          <div class="d-buy"><button type="button" disabled>${L('カートに入れる', 'Add to cart')}</button><small>${L('コンセプトブランドのため販売していません', 'Concept brand: not for sale')}</small></div>
        </div>
        <nav class="d-nav" aria-label="More products">
          <a href="#/p/${prev.id}"><img src="${IMG(prev)}" alt="">← ${prev.name}</a>
          <a href="#/p/${next.id}">${next.name} →<img src="${IMG(next)}" alt=""></a>
        </nav>
      </div></div>`;
    $('.d-back', detail).addEventListener('click', () => { location.hash = ''; });
  }
  function open(p) {
    const from = pendingFrom; pendingFrom = null;
    const swap = () => {
      if (from) from.style.viewTransitionName = '';
      render(p); detail.hidden = false; detail.scrollTop = 0; detailOpen = true;
      document.documentElement.classList.add('locked');
      $('.d-toy', detail).style.viewTransitionName = 'toy';
      $('.d-back', detail).focus({ preventScroll: true });
    };
    if (document.startViewTransition && !REDUCED) {
      if (from) from.style.viewTransitionName = 'toy';
      document.startViewTransition(swap).finished.finally(() => { const t = $('.d-toy', detail); if (t) t.style.viewTransitionName = ''; enterAnim(); });
    } else { swap(); enterAnim(); }
  }
  function enterAnim() { detail.classList.remove('enter'); void detail.offsetWidth; detail.classList.add('enter'); }
  function close() {
    if (!detailOpen) return;
    const toy = $('.d-toy', detail), id = toy && PRODUCTS.find(p => toy.src.endsWith(IMG(p)))?.id;
    const card = id && $(`.card[data-id="${id}"] img`);
    const swap = () => {
      detail.hidden = true; detailOpen = false; document.documentElement.classList.remove('locked');
      if (toy) toy.style.viewTransitionName = '';
      if (card && inView(card)) card.style.viewTransitionName = 'toy';
    };
    if (document.startViewTransition && !REDUCED) {
      if (toy) toy.style.viewTransitionName = 'toy';
      document.startViewTransition(swap).finished.finally(() => { if (card) card.style.viewTransitionName = ''; });
    } else swap();
  }
  const inView = el => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; };
  function route() {
    const m = location.hash.match(/^#\/p\/([\w-]+)/);
    if (m && byId[m[1]]) open(byId[m[1]]); else close();
  }
  addEventListener('hashchange', route);

  // ---------- toys lean toward the pointer ----------
  let px = innerWidth / 2, py = innerHeight / 2, queued = false;
  addEventListener('pointermove', e => { px = e.clientX; py = e.clientY; if (!queued && !REDUCED) { queued = true; requestAnimationFrame(lean); } }, { passive: true });
  function lean() {
    queued = false;
    for (const img of $$('.card .art img')) {
      const r = img.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) continue;
      img.style.setProperty('--ry', ((px - r.left - r.width / 2) / innerWidth * 22).toFixed(1) + 'deg');
      img.style.setProperty('--rx', (-(py - r.top - r.height / 2) / innerHeight * 12).toFixed(1) + 'deg');
    }
  }

  // ---------- the page repaints itself per section ----------
  const body = document.body, index = $('.index');
  hero.dataset.bg = 'wall';
  const bgObs = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    body.dataset.bg = e.target.dataset.bg || 'wall';
    $$('a', index).forEach(a => a.classList.toggle('on', a.dataset.cat === e.target.dataset.cat));
  }), { rootMargin: '-50% 0px -50% 0px' });
  $$('[data-bg]').forEach(s => bgObs.observe(s));
  new IntersectionObserver(es => es.forEach(e => { heroVisible = e.isIntersecting; })).observe(hero);
  new IntersectionObserver(es => es.forEach(e => index.classList.toggle('show', e.isIntersecting)), { rootMargin: '0px 0px -40% 0px' }).observe(productsEl);
  const rv = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rv.unobserve(e.target); } }), { rootMargin: '0px 0px -12% 0px' });
  $$('.rv').forEach(el => rv.observe(el));

  // ---------- manifesto: each script moves on its own clock ----------
  const man = $('[data-kinetic]');
  const SRC = { ja: $('[lang=ja]', man).textContent, en: $('[lang=en]', man).textContent };
  function kinetic() {
    const lang = document.documentElement.dataset.lang, span = $(`[lang=${lang}]`, man);
    span.textContent = ''; let i = 0;
    const kind = ch => /[一-鿿]/.test(ch) ? 'kanji' : /[぀-ゟ]/.test(ch) ? 'hira' : /[゠-ヿ]/.test(ch) ? 'kata' : 'latin';
    const delay = { kanji: 0, kata: 90, hira: 180, latin: 0 }, gap = { kanji: 70, kata: 45, hira: 34, latin: 24 };
    SRC[lang].split(/(\s+)/).forEach(word => {
      if (/^\s+$/.test(word)) { span.append(' '); return; }
      // Latin words must not break inside; Japanese may break between any two characters
      const w = /[A-Za-z]/.test(word) ? document.createElement('span') : document.createDocumentFragment();
      if (w.style) w.style.cssText = 'display:inline-block;white-space:nowrap';
      [...word].forEach(ch => {
        const k = kind(ch), c = document.createElement('span'); c.className = 'ch ' + k; c.textContent = ch;
        c.style.setProperty('--d', (delay[k] + i++ * gap[k]) + 'ms'); w.appendChild(c);
      });
      span.appendChild(w);
    });
    man.classList.remove('in'); void man.offsetWidth;
    if (man.dataset.seen) man.classList.add('in');
  }
  new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { man.dataset.seen = 1; man.classList.add('in'); } }), { threshold: .4 }).observe(man);

  // ---------- JP / EN ----------
  function setLang(l) {
    document.documentElement.dataset.lang = l; document.documentElement.lang = l;
    $$('[data-set-lang]').forEach(b => b.setAttribute('aria-pressed', b.dataset.setLang === l));
    try { localStorage.setItem('kanzen-lang', l); } catch (e) {}
    kinetic();
  }
  $$('[data-set-lang]').forEach(b => b.addEventListener('click', () => setLang(b.dataset.setLang)));
  let saved = null; try { saved = localStorage.getItem('kanzen-lang'); } catch (e) {}
  setLang(saved || 'ja');
  route();
})();
