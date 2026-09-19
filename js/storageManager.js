/**
 * ASTRONOVA - Local Storage & IndexedDB Manager ("My Earth Data")
 * Stores images, spectral analyses, reports, comparisons, and favorites.
 * Powers Privacy Center: 100% offline data guarantees.
 */

class StorageManager {
  constructor() {
    this.dbName = 'AstroNovaEarthDB';
    this.dbVersion = 1;
    this.storeName = 'earth_records';
    this.db = null;

    this.filterOnlyFavorites = false;
    this.initDB();
  }

  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('type', 'type', { unique: false });
          store.createIndex('isFavorite', 'isFavorite', { unique: false });
          store.createIndex('createdAt', 'createdAt', { unique: false });
        }
      };

      request.onsuccess = (e) => {
        this.db = e.target.result;
        this.renderFileList();
        this.updatePrivacyMetrics();
        resolve(this.db);
      };

      request.onerror = (e) => {
        console.error('IndexedDB error:', e.target.error);
        reject(e.target.error);
      };
    });
  }

  async saveRecord(record) {
    if (!this.db) await this.initDB();
    const item = {
      id: record.id || 'rec_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      title: record.title || 'Untitled Earth Record',
      type: record.type || 'analysis', // 'analysis', 'report', 'comparison', 'image'
      imageDataUrl: record.imageDataUrl || null,
      data: record.data || {},
      isFavorite: record.isFavorite || false,
      createdAt: record.createdAt || new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const req = store.put(item);
      req.onsuccess = () => {
        this.renderFileList();
        this.updatePrivacyMetrics();
        resolve(item);
      };
      req.onerror = () => reject(req.error);
    });
  }

  async getAllRecords() {
    if (!this.db) await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async deleteRecord(id) {
    if (!this.db) await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const req = store.delete(id);
      req.onsuccess = () => {
        this.renderFileList();
        this.updatePrivacyMetrics();
        resolve();
      };
      req.onerror = () => reject(req.error);
    });
  }

  async renameRecord(id, newTitle) {
    if (!this.db) await this.initDB();
    const records = await this.getAllRecords();
    const item = records.find(r => r.id === id);
    if (item) {
      item.title = newTitle;
      await this.saveRecord(item);
    }
  }

  async toggleFavorite(id) {
    if (!this.db) await this.initDB();
    const records = await this.getAllRecords();
    const item = records.find(r => r.id === id);
    if (item) {
      item.isFavorite = !item.isFavorite;
      await this.saveRecord(item);
      if (window.AstroApp) {
        window.AstroApp.showToast(
          item.isFavorite ? 'FAVORITED' : 'UNFAVORITED',
          `"${item.title}" ${item.isFavorite ? 'marked as ⭐ Favorite.' : 'removed from favorites.'}`,
          'info'
        );
      }
    }
  }

  async clearAllData() {
    if (!this.db) await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const req = store.clear();
      req.onsuccess = () => {
        localStorage.clear();
        this.renderFileList();
        this.updatePrivacyMetrics();
        resolve();
      };
      req.onerror = () => reject(req.error);
    });
  }

  async exportDataJSON() {
    const records = await this.getAllRecords();
    const exportBundle = {
      app: 'AstroNova Remote Sensing AI',
      exportDate: new Date().toISOString(),
      localStorage: { ...localStorage },
      indexedDBRecords: records
    };

    const blob = new Blob([JSON.stringify(exportBundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `astronova_data_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async importDataJSON(jsonStr) {
    try {
      const bundle = JSON.parse(jsonStr);
      if (bundle.indexedDBRecords && Array.isArray(bundle.indexedDBRecords)) {
        for (const item of bundle.indexedDBRecords) {
          await this.saveRecord(item);
        }
      }
      if (bundle.localStorage) {
        for (const k in bundle.localStorage) {
          localStorage.setItem(k, bundle.localStorage[k]);
        }
      }
      this.renderFileList();
      this.updatePrivacyMetrics();
      if (window.AstroApp) {
        window.AstroApp.showToast('IMPORT SUCCESS', 'AstroNova records restored successfully.', 'success');
      }
    } catch (e) {
      alert('Invalid AstroNova JSON backup file.');
    }
  }

  async renderFileList() {
    const listContainer = document.getElementById('files-grid-container');
    if (!listContainer) return;

    let records = await this.getAllRecords();

    // Sort newest first
    records.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Filter favorites if toggled
    if (this.filterOnlyFavorites) {
      records = records.filter(r => r.isFavorite);
    }

    if (records.length === 0) {
      listContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align:center; padding: 48px 20px; color:var(--text-muted);">
          <div style="font-size:2.5rem; margin-bottom:12px;">📁</div>
          <p style="font-family:var(--font-hud); font-size:1.1rem; color:#fff;">No records stored yet.</p>
          <p style="font-size:0.85rem; margin-top:4px;">Analyze satellite images or save dossiers to populate My Earth Data.</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = records.map(rec => `
      <div class="glass-panel" style="padding:16px; display:flex; flex-direction:column; justify-content:space-between;" data-id="${rec.id}">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
            <span class="prototype-tag" style="font-size:0.68rem;">${rec.type.toUpperCase()}</span>
            <button class="btn-fav-toggle" onclick="window.AstroStorage.toggleFavorite('${rec.id}')" style="background:none; border:none; cursor:pointer; font-size:1.2rem; color:${rec.isFavorite ? 'var(--orbital-gold)' : 'var(--text-dim)'};">
              ${rec.isFavorite ? '⭐' : '☆'}
            </button>
          </div>
          ${rec.imageDataUrl ? `
            <div style="width:100%; height:130px; border-radius:var(--radius-sm); overflow:hidden; margin-bottom:12px; border:1px solid var(--border-glass);">
              <img src="${rec.imageDataUrl}" style="width:100%; height:100%; object-fit:cover;" />
            </div>
          ` : ''}
          <h4 style="font-family:var(--font-display); font-size:0.98rem; color:#fff; word-break:break-word;">${rec.title}</h4>
          <p style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">
            ${new Date(rec.createdAt).toLocaleDateString()} ${new Date(rec.createdAt).toLocaleTimeString()}
          </p>
        </div>

        <div style="display:flex; gap:6px; margin-top:16px; flex-wrap:wrap;">
          <button class="btn-hud" style="padding:4px 10px; font-size:0.75rem;" onclick="window.AstroStorage.openRecord('${rec.id}')">Open</button>
          <button class="btn-hud" style="padding:4px 10px; font-size:0.75rem;" onclick="window.AstroStorage.promptRename('${rec.id}')">Rename</button>
          <button class="btn-hud" style="padding:4px 10px; font-size:0.75rem;" onclick="window.AstroStorage.downloadRecord('${rec.id}')">Download</button>
          <button class="btn-hud btn-danger" style="padding:4px 10px; font-size:0.75rem;" onclick="window.AstroStorage.deleteRecord('${rec.id}')">Delete</button>
        </div>
      </div>
    `).join('');
  }

  async openRecord(id) {
    const records = await this.getAllRecords();
    const item = records.find(r => r.id === id);
    if (!item) return;

    if (item.imageDataUrl && window.AstroApp) {
      await window.AstroApp.loadCustomImage(item.imageDataUrl, item.title);
      window.AstroApp.switchView('view-analysis');
    } else if (item.data && window.AstroReport) {
      window.AstroReport.showDossier(item.data, item.imageDataUrl);
    }
  }

  async promptRename(id) {
    const records = await this.getAllRecords();
    const item = records.find(r => r.id === id);
    if (!item) return;
    const newTitle = prompt('Enter new record title:', item.title);
    if (newTitle && newTitle.trim()) {
      await this.renameRecord(id, newTitle.trim());
    }
  }

  async downloadRecord(id) {
    const records = await this.getAllRecords();
    const item = records.find(r => r.id === id);
    if (!item) return;

    if (item.imageDataUrl) {
      const a = document.createElement('a');
      a.href = item.imageDataUrl;
      a.download = `${item.title.replace(/\s+/g, '_')}.png`;
      a.click();
    } else {
      const blob = new Blob([JSON.stringify(item, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${item.title.replace(/\s+/g, '_')}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  async updatePrivacyMetrics() {
    const records = await this.getAllRecords();
    const imagesCount = records.filter(r => !!r.imageDataUrl).length;
    const totalRecords = records.length;

    // Estimate storage size
    let bytes = JSON.stringify(records).length;
    for (const k in localStorage) {
      bytes += (localStorage[k] || '').length;
    }
    const kb = (bytes / 1024).toFixed(1);

    const elBytes = document.getElementById('privacy-stored-size');
    const elImages = document.getElementById('privacy-images-count');
    const elHistory = document.getElementById('privacy-records-count');

    if (elBytes) elBytes.textContent = `${kb} KB`;
    if (elImages) elImages.textContent = imagesCount;
    if (elHistory) elHistory.textContent = totalRecords;
  }
}

window.StorageManager = StorageManager;
