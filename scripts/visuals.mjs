// visuals.mjs
// Small helper to create SVG connectors and simple animations for internal pages.
export function createConnectorSVG(width=600, height=160) {
  return `
    <svg class="system-connector-svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="grad" x1="0" x2="1">
          <stop offset="0%" stop-color="rgba(18,101,243,0.9)" stop-opacity="0.9" />
          <stop offset="100%" stop-color="rgba(18,101,243,0.2)" stop-opacity="0.2" />
        </linearGradient>
      </defs>
      <path class="system-connector" d="M20 80 C 160 10, 440 150, 580 80" stroke="url(#grad)" stroke-width="1.6" fill="none" stroke-linecap="round" />
    </svg>
  `;
}

export function moduleHTML(title="Module", subtitle=""){
  return `
    <div class="system-panel visual-float" role="img" aria-label="${title} module">
      <div class="system-node">${title}</div>
      ${subtitle?`<div class="muted small">${subtitle}</div>`:''}
    </div>
  `;
}

export function simpleDataStream(count=5){
  let dots = '';
  for(let i=0;i<count;i++) dots += `<div class="dot" style="position:absolute;left:${i*20}px;top:0;opacity:${0.2 + i*0.12}"></div>`;
  return `<div class="data-stream" style="height:6px;width:120px;">${dots}</div>`;
}
