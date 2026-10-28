// ===== Thème verdure : cadre Weld, lianes, fleurs et papillons autour de la fenêtre =====
(() => {
  const win = document.querySelector('.index-window, .payment-shell');
  if (!win) return;

  const GREENS = ['#3f9b3a', '#57b847', '#2f7f2e', '#6cc95a', '#4aa843'];
  const FLOWERS = ['#ff7eb6', '#ffffff', '#ffd23f', '#c77dff', '#ff9f6b'];
  let back, front, seed;

  // aléatoire stable : le décor est identique à chaque chargement
  const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const pick = list => list[Math.floor(rand() * list.length)];
  const el = (parent, cls, css) => {
    const node = document.createElement(cls === 'nd-fw' || cls === 'nd-bf' ? 'div' : 'i');
    node.className = cls;
    Object.assign(node.style, css);
    parent.appendChild(node);
    return node;
  };
  const px = v => Math.round(v) + 'px';

  const leaf = (parent, x, y, size, rot) => el(parent, 'nd-lf', {
    left: px(x), top: px(y), width: px(size), height: px(size),
    backgroundColor: pick(GREENS), transform: `rotate(${rot}deg)`
  });
  const flower = (parent, x, y, scale = 1, color = pick(FLOWERS)) => {
    const f = el(parent, 'nd-fw', { left: px(x), top: px(y), transform: `scale(${scale})` });
    f.style.setProperty('--c', color);
    f.innerHTML = '<b style="left:7px;top:0"></b><b style="left:0;top:7px"></b><b style="left:14px;top:7px"></b><b style="left:7px;top:14px"></b><u></u>';
  };
  // liane qui pend : tige en petits segments + feuilles alternées + quelques fleurs
  const vine = (x0, y0, length, amp, flowers, thick = 5) => {
    const box = el(front, 'nd-vine', { left: px(x0), top: px(y0), width: '0', height: px(length) });
    box.style.setProperty('--d', (4 + rand() * 3).toFixed(1) + 's');
    box.style.setProperty('--a', (1 + rand() * 2).toFixed(1) + 'deg');
    const n = Math.floor(length / 9);
    const flowerAt = new Set();
    while (flowerAt.size < Math.min(flowers, Math.max(0, n - 5))) flowerAt.add(4 + Math.floor(rand() * (n - 4)));
    const phase = rand() * 6;
    for (let k = 0; k < n; k++) {
      const y = k * 9;
      const x = amp * Math.sin(k * 0.4 + phase) * Math.min(1, k / 6);
      el(box, 'nd-st', { left: px(x - thick / 2), top: px(y), width: px(thick), height: '10px' });
      if (k % 2 === 0) {
        const side = (k / 2) % 2 === 0 ? 1 : -1;
        const size = pick([12, 14, 16]);
        leaf(box, x + (side > 0 ? 4 : -size - 4), y - 4, size, side * (10 + rand() * 20));
      }
      if (flowerAt.has(k)) flower(box, x - 10, y - 8, 0.8 + rand() * 0.25);
    }
    leaf(box, amp * Math.sin(n * 0.4 + phase) - 6, n * 9, 13, 45);
  };
  // touffe de mousse le long d'un bord
  const tuft = (x0, x1, y, density) => {
    for (let x = x0; x < x1; x += 10) {
      if (rand() < density) {
        const size = pick([12, 14, 16, 18]);
        leaf(front, x, y - size * 0.55 + (rand() * 6 - 3), size, rand() * 40 - 20);
      }
    }
  };
  const butterfly = (x, y, color) => {
    const b = el(front, 'nd-bf', { left: px(x), top: px(y) });
    b.style.setProperty('--c', color);
    b.style.setProperty('--d', (7 + rand() * 5).toFixed(1) + 's');
    b.style.setProperty('--dx', px(30 + rand() * 50));
    b.style.setProperty('--dy', px(-20 - rand() * 40));
    b.innerHTML = '<b></b><b></b><u></u>';
  };

  const build = () => {
    back?.remove(); front?.remove();
    seed = 424242;
    const r = win.getBoundingClientRect();
    const W = r.width, H = r.height;
    const small = innerWidth < 700;
    const T = small ? 14 : 34; // épaisseur du cadre Weld

    back = document.createElement('div');
    back.className = 'nd-layer nd-back';
    front = document.createElement('div');
    front.className = 'nd-layer nd-front';
    for (const layer of [back, front]) {
      Object.assign(layer.style, { left: px(r.left + scrollX), top: px(r.top + scrollY), width: px(W), height: px(H) });
      document.body.appendChild(layer);
    }

    // cadre vert texture Weld + liserés foncés
    const radius = small ? 18 : 40;
    el(back, 'nd-frame', { left: px(-T), top: px(-T), width: px(W + 2 * T), height: px(H + 2 * T), padding: px(T), borderRadius: px(radius), boxSizing: 'border-box' });
    el(back, 'nd-rim', { left: px(-T - 5), top: px(-T - 5), width: px(W + 2 * T + 10), height: px(H + 2 * T + 10), borderRadius: px(radius + 5), boxSizing: 'border-box' });
    el(back, 'nd-rim-in', { left: '-4px', top: '-4px', width: px(W + 8), height: px(H + 8), borderRadius: '6px', boxSizing: 'border-box' });

    // mousse et fleurs sur le haut du cadre, surtout dans les coins
    tuft(-T + 6, Math.min(W * 0.3, 280), -T + 8, 0.85);
    tuft(W - Math.min(W * 0.3, 280), W + T - 10, -T + 8, 0.85);
    tuft(W * 0.45, W * 0.55, -T + 8, 0.35);
    [[-T + 30, '#ffffff'], [-T + 100, '#ff7eb6'], [W + T - 60, '#ffd23f'], [W + T - 130, '#c77dff']]
      .forEach(([x, c]) => flower(front, x, -T - 6, 1, c));

    // lianes qui tombent le long des bords
    if (small) {
      vine(-T / 2, -T + 8, H * 0.35, 4, 2, 4);
      vine(W + T / 2, -T + 8, H * 0.45, 4, 2, 4);
    } else {
      vine(-T / 2 - 2, -T + 10, Math.min(H * 0.55, 460), 7, 3);
      vine(-T / 2 + 16, -T + 10, Math.min(H * 0.22, 170), 5, 1, 4);
      vine(W + T / 2 + 2, -T + 10, Math.min(H * 0.62, 520), 8, 3);
      vine(W + T / 2 - 18, -T + 10, Math.min(H * 0.28, 220), 6, 2, 4);
    }

    // herbe et fleurs sur le bas du cadre
    tuft(-T, W + T, H + T - 6, small ? 0.4 : 0.55);
    if (!small) {
      [0.12, 0.3, 0.55, 0.75, 0.9].forEach((p, i) => {
        el(front, 'nd-st', { left: px(W * p + 8), top: px(H + T - 30), width: '4px', height: '24px' });
        flower(front, W * p, H + T - 44, 1, FLOWERS[i]);
      });
      // papillons dans les marges
      butterfly(-T - 90, H * 0.25, '#ffb3d1');
      butterfly(W + T + 50, H * 0.18, '#ffe066');
      butterfly(W + T + 70, H * 0.7, '#bde0fe');
      butterfly(-T - 110, H * 0.72, '#e0c3fc');
    }
  };

  let timer;
  const rebuild = () => { clearTimeout(timer); timer = setTimeout(build, 120); };
  addEventListener('resize', rebuild);
  addEventListener('load', build);
  if (document.fonts) document.fonts.ready.then(build);
  build();
})();
