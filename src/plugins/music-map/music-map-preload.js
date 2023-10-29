const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('bridge', {
  openFromMusicMap,
});

function openFromMusicMap(query) {
  console.log('openFromMusicMap', query);
  ipcRenderer.invoke('music-map:open', query);
}
