const lpEvents = [
  'lp-change',
  'lp-click',
  'lp-input',
  'lp-focus',
  'lp-blur',
  'lp-icon-load',
  'lp-icon-error',
  'lp-open',
  'lp-close',
  'lp-select',
  'lp-select-open',
  'lp-select-close',
  'lp-loading-start',
  'lp-loading-end',
  // Add more as your design system grows
];

for (const eventName of lpEvents) {
  window.addEventListener(
    eventName,
    e => logLpEvent(e),
    { capture: true }
  );
}

function logLpEvent(e) {
  const time = new Date().toISOString().split('T')[1].replace('Z', '');
  const name = e.type;
  const detail = e.detail ?? {};

  console.groupCollapsed(
    `%cLP-EVENT%c${name}%c ${time}`,
    'background:#6C5CE7;color:white;padding:2px 6px;border-radius:4px;',
    'background:#00CEC9;color:black;padding:2px 6px;border-radius:4px;margin-left:4px;',
    'color:#636e72;margin-left:4px;'
  );

  console.log('%cTarget:', 'color:#0984e3;font-weight:bold;', e.target);
  console.log('%cDetail:', 'color:#e17055;font-weight:bold;', detail);
  console.log('%cPath:', 'color:#fdcb6e;font-weight:bold;', e.composedPath());

  console.groupEnd();
}