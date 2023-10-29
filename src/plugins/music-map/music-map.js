document.querySelectorAll('.S').forEach((link) => {
  link.addEventListener('click', (event) => {
    const { href, innerText: query } = event.target;

    if (!href.startsWith('https://www.music-map.com')) {
      console.warn(`Prevented external navigation to ${href}`);
      event.preventDefault();
    }

    bridge.openFromMusicMap(query);
  });
});
