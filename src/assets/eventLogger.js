import { efEvents } from '../lib/events';

for (const eventName of efEvents) {
  window.addEventListener(
    eventName,
    e => logEfEvent(e),
    { capture: true }
  );
}


function logEfEvent(e) {
  const time = new Date().toISOString().split('T')[1].replace('Z', '');
  const name = e.type;
  const detail = e.detail ?? {};

  console.groupCollapsed(
    `%cEF-EVENT%c${name}%c ${time}`,
    'background:#6C5CE7;color:white;padding:2px 6px;border-radius:4px;',
    'background:#00CEC9;color:black;padding:2px 6px;border-radius:4px;margin-left:4px;',
    'color:#636e72;margin-left:4px;'
  );

  console.log('%cTarget:', 'color:#0984e3;font-weight:bold;', e.target);
  console.log('%cDetail:', 'color:#e17055;font-weight:bold;', detail);
  console.log('%cPath:', 'color:#fdcb6e;font-weight:bold;', e.composedPath());

  console.groupEnd();
}