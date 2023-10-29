import path from 'node:path';

import { BrowserWindow, ipcMain } from 'electron';
import is from 'electron-is';

import musicMapCSS from './music-map.css';
import { injectCSS, injectJavaScript } from './utils';

import config from '../../config';
import { isTesting } from '../../utils/testing';

let exploreWindow: BrowserWindow;

export default (win: BrowserWindow) => {
  win.webContents.once('did-finish-load', () => {
    showMusicMapWindow(win);
  });
};

function showMusicMapWindow(win: BrowserWindow) {
  exploreWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'music-map-preload.js'),
      nodeIntegrationInSubFrames: true,
      ...(isTesting()
        ? undefined
        : {
            // Sandbox is only enabled in tests for now
            // See https://www.electronjs.org/docs/latest/tutorial/sandbox#preload-scripts
            sandbox: false,
          }),
    },
    frame: !is.macOS(),
    titleBarOverlay: {
      color: '#00000000',
      symbolColor: '#ffffff',
      height: 36,
    },
    titleBarStyle: is.macOS() ? 'hiddenInset' : 'default',
    autoHideMenuBar: config.get('options.hideMenu'),
  });

  injectCSS(exploreWindow.webContents, musicMapCSS);

  injectJavaScript(
    exploreWindow.webContents,
    // Copied to dist by rollup.main.config.ts
    path.join(__dirname, 'music-map.js'),
  );

  exploreWindow.webContents.once('did-finish-load', () => {
    if (is.dev()) {
      exploreWindow.webContents.openDevTools();
    }
  });

  exploreWindow.once('ready-to-show', () => {
    if (config.get('options.appVisible')) {
      exploreWindow.show();
    }
  });

  exploreWindow.webContents.loadURL('https://www.music-map.com/');

  ipcMain.handle('music-map:open', (_event, query: string) => {
    if (win) {
      const urlToLoad = `https://music.youtube.com/search?q=${query}`;
      win.webContents.loadURL(urlToLoad);
    }
  });
}
