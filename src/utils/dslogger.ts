const isDev = import.meta.env?.MODE === 'development';

export const dsLogger = {
  warn(component: string, message: string, ...args: unknown[]) {
    if (isDev) console.warn(`[lp] <${component}> ${message}`, ...args);
  },

  error(component: string, message: string, ...args: unknown[]) {
    if (isDev) console.error(`[lp] <${component}> ${message}`, ...args);
  }
};
