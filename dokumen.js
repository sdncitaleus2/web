(() => {
  'use strict';
  const config = window.SCHOOL_DOCS_CONFIG;
  const grid = document.getElementById('docsGrid');
  const state = document.getElementById('docsState');
  const search = document.getElementById('docsSearch');
  const count = document.getElementById('docsCount');
  if (!config || !grid || !state) return;

  const owner = 'sdncitaleus2';
  const repo = 'web';
  const branch = 'main';
  const apiBase = `https://api.github.com/repos/${owner}/${repo}/contents/`;
  let allFiles = [];

  const formatBytes = (bytes) => {
    if (!Number.isFinite(bytes) || bytes < 1) return 'Ukuran tidak tersedia';
    const units = ['B', 'KB', 'MB', 'GB'];
    let value = bytes, unit = 0;
    while (value >= 1024 && unit < units.length - 1) { value /= 1024; unit++; }
    return `${value.toLocaleString('id-ID', { maximumFractionDigits: 1 })} ${units[unit]}`;
  };
  const details = (name) => {
    const ext = (name.split('.').pop() || '').toLowerCase();
    const map = {
      pdf: ['PDF', 'PDF'], doc: ['Word', 'W'], docx: ['Word', 'W'],
      xls: ['Excel', 'X'], xlsx: ['Excel', 'X'], csv: ['CSV', 'CSV'],
      ppt: ['PowerPoint', 'P'], pptx: ['PowerPoint', 'P'],
      jpg: ['Gambar', 'IMG'], jpeg: ['Gambar', 'IMG'], png: ['Gambar', 'IMG'], webp: ['Gambar', 'IMG'],
      txt: ['Teks', 'TXT'], odt: ['Dokumen', 'DOC'], ods: ['Spreadsheet', 'XLS'], odp: ['Presentasi', 'PPT'],
      zip: ['Arsip ZIP', 'ZIP'], rar: ['Arsip RAR', 'RAR']
    };
    return map[ext] || [ext ? ext.toUpperCase() : 'Berkas', 'FILE'];
  };
  const humanName = (name) => name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
  const ignored = (name) => name.startsWith('.') || /^(petunjuk|readme)\.md$/i.test(name) || name === '.gitkeep';

  async function listFiles(path, depth = 0) {
    if (depth > 4) return [];
    const encodedPath = path.split('/').map(encodeURIComponent).join('/');
    const response = await fetch(`${apiBase}${encodedPath}?ref=${branch}`, {
      headers: { Accept: 'application/vnd.github+json' }
    });
    if (!response.ok) {
      if (response.status === 404) return [];
      if (response.status === 403) throw new Error('GitHub membatasi permintaan sementara. Coba muat ulang beberapa menit lagi.');
      throw new Error(`Daftar dokumen gagal dimuat (HTTP ${response.status}).`);
    }
    const entries = await response.json();
    if (!Array.isArray(entries)) return [];
    const files = [];
    for (const item of entries) {
      if (ignored(item.name)) continue;
      if (item.type === 'file') files.push(item);
      else if (item.type === 'dir') files.push(...await listFiles(item.path, depth + 1));
    }
    return files;
  }

  function render(files) {
    grid.replaceChildren();
    const query = (search?.value || '').trim().toLocaleLowerCase('id-ID');
    const visible = files.filter(file =>
      `${humanName(file.name)} ${file.name}`.toLocaleLowerCase('id-ID').includes(query)
    );
    count.textContent = `${visible.length} dokumen`;
    if (!visible.length) {
      state.hidden = false;
      const title = document.createElement('strong');
      title.textContent = query ? 'Dokumen tidak ditemukan' : 'Belum ada dokumen';
      const description = document.createElement('span');
      description.textContent = query
        ? 'Coba gunakan kata kunci lain.'
        : `Unggah berkas ke folder ${config.folder} di GitHub. Card akan muncul otomatis setelah berkas masuk ke branch main.`;
      state.replaceChildren(title, description);
      return;
    }
    state.hidden = true;
    for (const file of visible) {
      const [type, icon] = details(file.name);
      const card = document.createElement('a');
      card.className = 'doc-card';
      card.href = file.html_url || `https://github.com/${owner}/${repo}/blob/${branch}/${file.path}`;
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
      card.setAttribute('aria-label', `Buka dokumen ${humanName(file.name)} di GitHub`);
      const top = document.createElement('div'); top.className = 'doc-card-top';
      const glyph = document.createElement('span'); glyph.className = 'doc-file-icon';
      glyph.setAttribute('aria-hidden', 'true'); glyph.textContent = icon;
      const badge = document.createElement('span'); badge.className = 'doc-type'; badge.textContent = type;
      top.append(glyph, badge);
      const title = document.createElement('h2'); title.textContent = humanName(file.name) || file.name;
      const meta = document.createElement('div'); meta.className = 'doc-card-meta';
      const size = document.createElement('span'); size.textContent = formatBytes(file.size);
      const open = document.createElement('span'); open.className = 'doc-open'; open.textContent = 'Buka berkas ↗';
      meta.append(size, open); card.append(top, title, meta); grid.append(card);
    }
  }

  async function init() {
    state.hidden = false;
    state.textContent = 'Memuat daftar dokumen dari GitHub…';
    try {
      allFiles = await listFiles(config.folder);
      allFiles.sort((a, b) => a.name.localeCompare(b.name, 'id'));
      render(allFiles);
    } catch (error) {
      state.replaceChildren();
      const title = document.createElement('strong'); title.textContent = 'Dokumen belum dapat dimuat';
      const message = document.createElement('p');
      message.textContent = error.message || 'Periksa koneksi internet, nama branch, dan izin repositori.';
      const link = document.createElement('a');
      link.href = `https://github.com/${owner}/${repo}/tree/${branch}/${config.folder}`;
      link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = 'Buka folder dokumen di GitHub';
      state.append(title, message, link);
      count.textContent = 'Daftar belum tersedia';
    }
  }
  if (search) search.addEventListener('input', () => render(allFiles));
  init();
})();
