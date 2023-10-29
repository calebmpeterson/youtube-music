import fs from 'node:fs';

const cssToInject = new Map<string, (() => void) | undefined>();
const cssToInjectFile = new Map<string, (() => void) | undefined>();
export const injectCSS = (
  webContents: Electron.WebContents,
  css: string,
  cb: (() => void) | undefined = undefined,
) => {
  if (cssToInject.size === 0 && cssToInjectFile.size === 0) {
    setupCssInjection(webContents);
  }

  cssToInject.set(css, cb);
};

const setupCssInjection = (webContents: Electron.WebContents) => {
  webContents.on('dom-ready', () => {
    cssToInject.forEach(async (callback, css) => {
      await webContents.insertCSS(css);
      callback?.();
    });

    cssToInjectFile.forEach(async (callback, filepath) => {
      await webContents.insertCSS(fs.readFileSync(filepath, 'utf8'));
      callback?.();
    });
  });
};

export const injectJavaScript = (
  webContents: Electron.WebContents,
  filepath: string,
) => {
  const script = fs.readFileSync(filepath, 'utf8');
  webContents.on('did-finish-load', () => {
    webContents.executeJavaScript(script);
  });
};
