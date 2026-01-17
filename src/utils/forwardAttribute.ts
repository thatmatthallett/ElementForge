export function forwardAttribute(host: HTMLElement, target: HTMLElement, name: string, value: string | null) {
  if (value === null) {
    target.removeAttribute(name);
  } else {
    target.setAttribute(name, value);
  }
  host.removeAttribute(name);
}