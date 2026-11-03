(() => {
  'use strict';

  if (new URLSearchParams(location.search).get('curtain') !== 'open') return;

  const scriptUrl = document.currentScript.src;
  const assetUrl = (path) => new URL(path, scriptUrl).href;
  const root = document.documentElement;
  const loader = document.createElement('div');
  loader.className = 'pickme-curtain-loader';
  loader.setAttribute('role', 'status');
  loader.setAttribute('aria-live', 'polite');

  const body = document.createElement('div');
  body.className = 'pickme-curtain-body';

  const logo = document.createElement('img');
  logo.className = 'pickme-curtain-logo';
  logo.src = assetUrl('images/pickme-logo.png');
  logo.alt = 'PickMe!';
  logo.draggable = false;

  const tools = document.createElement('div');
  tools.className = 'pickme-curtain-tools';
  tools.setAttribute('aria-hidden', 'true');
  ['gacha', 'slot', 'claw', 'wheel', 'card'].forEach((tool, index) => {
    const image = document.createElement('img');
    image.src = assetUrl(`images/tool-${tool}.png`);
    image.alt = '';
    image.draggable = false;
    image.style.setProperty('--i', index);
    tools.appendChild(image);
  });

  const text = document.createElement('p');
  text.className = 'pickme-curtain-text';
  text.append('GO!GO!GO!', ...Array.from({ length: 3 }, () => {
    const dot = document.createElement('span');
    dot.textContent = '.';
    return dot;
  }));
  body.append(logo, tools, text);

  const wave = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  wave.setAttribute('class', 'pickme-curtain-wave');
  wave.setAttribute('viewBox', '0 0 1440 120');
  wave.setAttribute('preserveAspectRatio', 'none');
  wave.setAttribute('aria-hidden', 'true');
  const wavePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  wavePath.setAttribute('d', 'M0 0H1440V50C1360 100 1280 100 1200 60S1040 20 960 60 800 110 720 70 560 20 480 60 320 105 240 70 80 30 0 70Z');
  wave.appendChild(wavePath);
  loader.append(body, wave);

  root.classList.add('pickme-curtain-pending');
  root.appendChild(loader);

  const reveal = () => {
    const revealDelay = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 50;
    setTimeout(() => {
      root.classList.add('pickme-curtain-revealing');
      void loader.offsetWidth;
      loader.classList.add('done');
    }, revealDelay);
    loader.addEventListener('transitionend', (event) => {
      if (event.target !== loader || event.propertyName !== 'transform') return;
      loader.remove();
      root.classList.remove('pickme-curtain-pending', 'pickme-curtain-revealing');
    });
    setTimeout(() => {
      loader.remove();
      root.classList.remove('pickme-curtain-pending', 'pickme-curtain-revealing');
    }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 100 : 1500);
  };

  if (document.readyState === 'complete') reveal();
  else window.addEventListener('load', reveal, { once: true });
})();
