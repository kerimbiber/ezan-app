/* ============================================================
   ÇAĞLAYAN LOJİSTİK - Uygulama Mantığı
   SPA yönlendirme, auth, ilan ve teklif yönetimi
   ============================================================ */

// ── Genel Değişkenler ──
let currentRole = null; // 'shipper' veya 'carrier'
let currentUser = null;
let pageHistory = [];

// ── Uygulama ──
const App = {
  init() {
    // Tema yükle
    const theme = DB.getTheme();
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    this.updateThemeIcons();

    // Demo veri
    DB.seedDemoData();

    // Şehir selectlerini doldur
    this.populateCitySelects();

    // Oturum kontrol
    const session = DB.getSession();
    if (session) {
      currentUser = session;
      currentRole = session.role;
      if (session.role === 'shipper') {
        this.showPage('page-shipper-home');
      } else {
        this.showPage('page-carrier-home');
      }
    }

    // Tarih alanlarını bugüne ayarla
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('job-date');
    const deliveryInput = document.getElementById('job-delivery-date');
    if (dateInput) dateInput.min = today;
    if (deliveryInput) deliveryInput.min = today;
  },

  populateCitySelects() {
    const selects = ['job-from', 'job-to'];
    selects.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      CITIES.forEach(city => {
        const opt = document.createElement('option');
        opt.value = city;
        opt.textContent = city;
        el.appendChild(opt);
      });
    });
  },

  showPage(pageId, params = {}) {
    // Rol parametresi
    if (params.role) {
      currentRole = params.role;
    }

    // Geçmiş
    const currentActive = document.querySelector('.page.active');
    if (currentActive && currentActive.id !== pageId) {
      pageHistory.push(currentActive.id);
      if (pageHistory.length > 20) pageHistory.shift();
    }

    // Tüm sayfaları gizle
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    // Hedef sayfayı göster
    const target = document.getElementById(pageId);
    if (target) {
      target.classList.add('active');
    }

    // Sayfa yüklendiğinde yapılacaklar
    this.onPageLoad(pageId, params);
  },

  goBack() {
    if (pageHistory.length > 0) {
      const prevPage = pageHistory.pop();
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      const target = document.getElementById(prevPage);
      if (target) target.classList.add('active');
      this.onPageLoad(prevPage, {});
    }
  },

  onPageLoad(pageId, params) {
    switch (pageId) {
      case 'page-login':
        this.setupLoginPage();
        break;
      case 'page-register':
        this.setupRegisterPage();
        break;
      case 'page-shipper-home':
        Dashboard.loadShipper();
        break;
      case 'page-carrier-home':
        Dashboard.loadCarrier();
        break;
      case 'page-create-job':
        Jobs.resetForm();
        break;
      case 'page-my-jobs':
        Jobs.loadMyJobs();
        break;
      case 'page-browse-jobs':
        Jobs.loadBrowse();
        break;
      case 'page-job-detail':
        Jobs.loadDetail(params.jobId);
        break;
      case 'page-carrier-offers':
        Jobs.loadCarrierOffers();
        break;
      case 'page-profile':
        Profile.load();
        break;
      case 'page-job-offers':
        Jobs.loadJobOffers(params.jobId);
        break;
    }
  },

  setupLoginPage() {
    const title = document.getElementById('login-title');
    const subtitle = document.getElementById('login-subtitle');
    if (currentRole === 'shipper') {
      title.textContent = 'Yük Sahibi Girişi';
      subtitle.textContent = 'Yük ilanlarınızı yönetin';
    } else {
      title.textContent = 'Nakliyeci Girişi';
      subtitle.textContent = 'Yük ilanlarını inceleyin ve teklif verin';
    }
    document.getElementById('login-error').classList.add('hidden');
    document.getElementById('login-form').reset();
  },

  setupRegisterPage() {
    const subtitle = document.getElementById('register-subtitle');
    const companyGroup = document.getElementById('reg-company-group');
    const plateGroup = document.getElementById('reg-plate-group');
    const vehicleGroup = document.getElementById('reg-vehicle-group');
    const companyLabel = document.getElementById('reg-company-label');

    if (currentRole === 'shipper') {
      subtitle.textContent = 'Yük Sahibi hesabı oluşturun';
      companyGroup.style.display = 'flex';
      companyLabel.textContent = 'Firma Adı';
      plateGroup.style.display = 'none';
      vehicleGroup.style.display = 'none';
    } else {
      subtitle.textContent = 'Nakliyeci hesabı oluşturun';
      companyGroup.style.display = 'flex';
      companyLabel.textContent = 'Firma / İşletme Adı';
      plateGroup.style.display = 'flex';
      vehicleGroup.style.display = 'flex';
    }
    document.getElementById('register-error').classList.add('hidden');
    document.getElementById('register-form').reset();
  },

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    DB.setTheme(next);
    this.updateThemeIcons();
  },

  updateThemeIcons() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const sunIcons = document.querySelectorAll('#theme-icon-sun');
    const moonIcons = document.querySelectorAll('#theme-icon-moon');

    // Inline tema ikonlarını güncelle
    document.querySelectorAll('.theme-icon-inline').forEach(el => {
      if (isDark) {
        el.innerHTML = '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>';
      } else {
        el.innerHTML = '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
      }
    });
  },

  toast(message, duration = 2500) {
    const el = document.getElementById('toast');
    el.textContent = message;
    el.classList.remove('hidden');
    setTimeout(() => el.classList.add('hidden'), duration);
  }
};

// ── Auth ──
const Auth = {
  login(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');

    const user = DB.findUser(email);
    if (!user || user.password !== password) {
      errorEl.textContent = 'E-posta veya şifre hatalı.';
      errorEl.classList.remove('hidden');
      return;
    }

    if (user.role !== currentRole) {
      const roleLabel = currentRole === 'shipper' ? 'Yük Sahibi' : 'Nakliyeci';
      errorEl.textContent = `Bu hesap ${roleLabel} hesabı değil.`;
      errorEl.classList.remove('hidden');
      return;
    }

    currentUser = user;
    DB.setSession(user);
    pageHistory = [];

    if (user.role === 'shipper') {
      App.showPage('page-shipper-home');
    } else {
      App.showPage('page-carrier-home');
    }
    App.toast('Hoş geldiniz, ' + user.name.split(' ')[0] + '!');
  },

  register(e) {
    e.preventDefault();
    const errorEl = document.getElementById('register-error');

    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const company = document.getElementById('reg-company').value.trim();
    const password = document.getElementById('reg-password').value;

    if (DB.findUser(email)) {
      errorEl.textContent = 'Bu e-posta adresi zaten kayıtlı.';
      errorEl.classList.remove('hidden');
      return;
    }

    const user = {
      id: 'u' + Date.now(),
      name,
      email,
      phone,
      company,
      password,
      role: currentRole
    };

    if (currentRole === 'carrier') {
      user.plate = document.getElementById('reg-plate').value.trim();
      user.vehicle = document.getElementById('reg-vehicle').value;
    }

    DB.saveUser(user);
    currentUser = user;
    DB.setSession(user);
    pageHistory = [];

    if (currentRole === 'shipper') {
      App.showPage('page-shipper-home');
    } else {
      App.showPage('page-carrier-home');
    }
    App.toast('Hesabınız oluşturuldu!');
  },

  logout() {
    currentUser = null;
    currentRole = null;
    pageHistory = [];
    DB.clearSession();
    App.showPage('page-welcome');
    App.toast('Çıkış yapıldı');
  }
};

// ── Dashboard ──
const Dashboard = {
  loadShipper() {
    if (!currentUser) return;
    document.getElementById('shipper-name').textContent = currentUser.name.split(' ')[0];

    const jobs = DB.getJobs().filter(j => j.shipperId === currentUser.id);
    const offers = DB.getOffers();

    const activeJobs = jobs.filter(j => j.status === 'active');
    const pendingOffers = offers.filter(o =>
      o.status === 'pending' && jobs.some(j => j.id === o.jobId)
    );
    const doneJobs = jobs.filter(j => j.status === 'done');

    document.getElementById('shipper-active-count').textContent = activeJobs.length;
    document.getElementById('shipper-pending-count').textContent = pendingOffers.length;
    document.getElementById('shipper-done-count').textContent = doneJobs.length;

    // Son ilanlar
    const container = document.getElementById('shipper-jobs-list');
    if (jobs.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="2" y="7" width="20" height="14" rx="2"/>
            <path d="M16 7V5a4 4 0 00-8 0v2"/>
            <line x1="12" y1="12" x2="12" y2="16"/>
            <line x1="10" y1="14" x2="14" y2="14"/>
          </svg>
          <p>Henüz ilan oluşturmadınız</p>
          <button class="btn btn-primary" onclick="App.showPage('page-create-job')">İlk İlanınızı Oluşturun</button>
        </div>`;
    } else {
      container.innerHTML = jobs
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(job => this.renderJobCard(job, 'shipper'))
        .join('');
    }
  },

  loadCarrier() {
    if (!currentUser) return;
    document.getElementById('carrier-name').textContent = currentUser.name.split(' ')[0];

    const allJobs = DB.getJobs().filter(j => j.status === 'active');
    const myOffers = DB.getOffersByCarrier(currentUser.id);
    const activeOffers = myOffers.filter(o => o.status === 'accepted');

    document.getElementById('carrier-available-count').textContent = allJobs.length;
    document.getElementById('carrier-applied-count').textContent = myOffers.length;
    document.getElementById('carrier-active-count').textContent = activeOffers.length;

    // Son ilanlar (teklif verilmemiş olanlar önce)
    const offeredJobIds = myOffers.map(o => o.jobId);
    const container = document.getElementById('carrier-recent-jobs');

    if (allJobs.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <p>Henüz aktif ilan bulunmuyor</p>
        </div>`;
    } else {
      container.innerHTML = allJobs
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(job => {
          const hasOffer = offeredJobIds.includes(job.id);
          return this.renderJobCard(job, 'carrier', hasOffer);
        })
        .join('');
    }
  },

  renderJobCard(job, viewRole, hasOffer = false) {
    const icon = CARGO_TYPE_ICONS[job.cargoType] || '📦';
    const label = CARGO_TYPE_LABELS[job.cargoType] || 'Yük';
    const statusClass = job.status === 'active' ? 'status-active' :
                        job.status === 'pending' ? 'status-pending' : 'status-done';
    const statusText = job.status === 'active' ? 'Aktif' :
                       job.status === 'pending' ? 'Bekliyor' : 'Tamamlandı';

    const offersForJob = DB.getOffersForJob(job.id);
    let footerExtra = '';
    if (viewRole === 'shipper' && offersForJob.length > 0) {
      const pendingCount = offersForJob.filter(o => o.status === 'pending').length;
      if (pendingCount > 0) {
        footerExtra = `<span class="job-status status-pending">${pendingCount} Teklif</span>`;
      }
    }
    if (hasOffer) {
      footerExtra = `<span class="job-status status-pending">Teklif Verildi</span>`;
    }

    const onclick = viewRole === 'shipper'
      ? `App.showPage('page-job-detail', {jobId:'${job.id}'})`
      : `App.showPage('page-job-detail', {jobId:'${job.id}'})`;

    return `
      <div class="job-card" onclick="${onclick}">
        <div class="job-card-header">
          <div class="job-card-type">
            <div class="cargo-icon"><span class="cargo-icon-emoji">${icon}</span></div>
            <div>
              <h4>${label}</h4>
              <span class="weight">${job.weight} ton</span>
            </div>
          </div>
          <div class="job-price">${formatPrice(job.price)}</div>
        </div>
        <div class="job-route">
          <div class="route-city">
            <div class="city-label">Yükleme</div>
            <div class="city-name">${job.from}</div>
          </div>
          <div class="route-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </div>
          <div class="route-city">
            <div class="city-label">Teslimat</div>
            <div class="city-name">${job.to}</div>
          </div>
        </div>
        <div class="job-card-footer">
          <div class="job-date">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            ${formatDate(job.date)}
          </div>
          ${footerExtra || `<span class="job-status ${statusClass}">${statusText}</span>`}
        </div>
      </div>`;
  }
};

// ── İlan Yönetimi ──
const Jobs = {
  resetForm() {
    const form = document.getElementById('create-job-form');
    if (form) form.reset();
    document.getElementById('create-job-error').classList.add('hidden');
  },

  create(e) {
    e.preventDefault();
    if (!currentUser) return;

    const errorEl = document.getElementById('create-job-error');
    const from = document.getElementById('job-from').value;
    const to = document.getElementById('job-to').value;

    if (from === to && from !== '') {
      errorEl.textContent = 'Yükleme ve teslimat şehri aynı olamaz.';
      errorEl.classList.remove('hidden');
      return;
    }

    const job = {
      id: 'j' + Date.now(),
      shipperId: currentUser.id,
      cargoType: document.getElementById('job-cargo-type').value,
      weight: parseFloat(document.getElementById('job-weight').value),
      from,
      to,
      date: document.getElementById('job-date').value,
      deliveryDate: document.getElementById('job-delivery-date').value,
      vehiclePref: document.getElementById('job-vehicle-pref').value,
      price: parseInt(document.getElementById('job-price').value),
      desc: document.getElementById('job-desc').value.trim(),
      status: 'active',
      createdAt: new Date().toISOString()
    };

    DB.saveJob(job);
    App.toast('İlan başarıyla yayınlandı!');
    pageHistory.pop(); // Form sayfasını geçmişten çıkar
    App.showPage('page-shipper-home');
  },

  loadMyJobs(filter = 'active') {
    if (!currentUser) return;
    const jobs = DB.getJobs().filter(j => j.shipperId === currentUser.id);
    const container = document.getElementById('my-jobs-list');

    let filtered;
    if (filter === 'active') {
      filtered = jobs.filter(j => j.status === 'active');
    } else if (filter === 'pending') {
      filtered = jobs.filter(j => {
        const offers = DB.getOffersForJob(j.id);
        return offers.some(o => o.status === 'pending');
      });
    } else {
      filtered = jobs.filter(j => j.status === 'done');
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="2" y="3" width="20" height="18" rx="2"/>
            <line x1="8" y1="7" x2="16" y2="7"/>
            <line x1="8" y1="11" x2="16" y2="11"/>
            <line x1="8" y1="15" x2="12" y2="15"/>
          </svg>
          <p>Bu kategoride ilan bulunmuyor</p>
        </div>`;
    } else {
      container.innerHTML = filtered
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map(job => Dashboard.renderJobCard(job, 'shipper'))
        .join('');
    }
  },

  filterMyJobs(tab) {
    document.querySelectorAll('#page-my-jobs .tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`#page-my-jobs .tab[data-tab="${tab}"]`).classList.add('active');
    this.loadMyJobs(tab);
  },

  loadBrowse() {
    const jobs = DB.getJobs().filter(j => j.status === 'active');
    const offeredJobIds = currentUser ? DB.getOffersByCarrier(currentUser.id).map(o => o.jobId) : [];
    const container = document.getElementById('browse-jobs-list');
    document.getElementById('search-jobs').value = '';

    if (jobs.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <p>Aktif ilan bulunmuyor</p>
        </div>`;
    } else {
      container.innerHTML = jobs
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map(job => {
          const hasOffer = offeredJobIds.includes(job.id);
          return Dashboard.renderJobCard(job, 'carrier', hasOffer);
        })
        .join('');
    }
  },

  search(query) {
    query = query.toLowerCase().trim();
    const jobs = DB.getJobs().filter(j => j.status === 'active');
    const offeredJobIds = currentUser ? DB.getOffersByCarrier(currentUser.id).map(o => o.jobId) : [];
    const container = document.getElementById('browse-jobs-list');

    const filtered = jobs.filter(j =>
      j.from.toLowerCase().includes(query) ||
      j.to.toLowerCase().includes(query) ||
      (CARGO_TYPE_LABELS[j.cargoType] || '').toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <p>"${query}" için sonuç bulunamadı</p>
        </div>`;
    } else {
      container.innerHTML = filtered
        .map(job => {
          const hasOffer = offeredJobIds.includes(job.id);
          return Dashboard.renderJobCard(job, 'carrier', hasOffer);
        })
        .join('');
    }
  },

  loadDetail(jobId) {
    const job = DB.getJobById(jobId);
    if (!job) return;

    const container = document.getElementById('job-detail-content');
    const shipper = DB.getUsers().find(u => u.id === job.shipperId);
    const isOwner = currentUser && currentUser.id === job.shipperId;
    const isCarrier = currentUser && currentUser.role === 'carrier';

    const existingOffer = isCarrier
      ? DB.getOffersByCarrier(currentUser.id).find(o => o.jobId === jobId)
      : null;

    const offersCount = DB.getOffersForJob(jobId).length;

    let actionsHtml = '';

    if (isOwner) {
      actionsHtml = `
        <div class="detail-actions">
          <button class="btn btn-primary btn-lg btn-full" onclick="App.showPage('page-job-offers', {jobId:'${job.id}'})">
            Gelen Teklifleri Gör (${offersCount})
          </button>
        </div>`;
    } else if (isCarrier) {
      if (existingOffer) {
        const statusMap = {
          pending: 'Teklifiniz değerlendiriliyor',
          accepted: 'Teklifiniz kabul edildi!',
          rejected: 'Teklifiniz reddedildi'
        };
        const statusClassMap = {
          pending: 'status-pending',
          accepted: 'status-active',
          rejected: 'status-rejected'
        };
        actionsHtml = `
          <div class="detail-actions">
            <div class="job-status ${statusClassMap[existingOffer.status]}" style="text-align:center;padding:14px;font-size:0.92rem;border-radius:14px">
              ${statusMap[existingOffer.status]}
            </div>
          </div>`;
      } else {
        actionsHtml = `
          <div class="detail-actions">
            <button class="btn btn-primary btn-lg btn-full" onclick="Jobs.applyToJob('${job.id}')">
              Teklif Ver
            </button>
          </div>`;
      }
    }

    container.innerHTML = `
      <div class="detail-header">
        <span class="cargo-icon-emoji" style="font-size:2.5rem">${CARGO_TYPE_ICONS[job.cargoType] || '📦'}</span>
        <h2>${CARGO_TYPE_LABELS[job.cargoType] || 'Yük'}</h2>
        <span class="text-muted">${job.weight} ton</span>
      </div>

      <div class="detail-route">
        <div class="route-city">
          <div class="city-label">Yükleme</div>
          <div class="city-name">${job.from}</div>
        </div>
        <div class="route-arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </div>
        <div class="route-city">
          <div class="city-label">Teslimat</div>
          <div class="city-name">${job.to}</div>
        </div>
      </div>

      <div class="detail-price-box">
        <div class="label">Teklif Edilen Ücret</div>
        <div class="price">${formatPrice(job.price)}</div>
      </div>

      <div class="detail-info-grid">
        <div class="detail-info-item">
          <div class="label">Yükleme Tarihi</div>
          <div class="value">${formatDate(job.date)}</div>
        </div>
        <div class="detail-info-item">
          <div class="label">Teslimat Tarihi</div>
          <div class="value">${formatDate(job.deliveryDate)}</div>
        </div>
        <div class="detail-info-item">
          <div class="label">Araç Tercihi</div>
          <div class="value">${VEHICLE_LABELS[job.vehiclePref] || 'Belirtilmemiş'}</div>
        </div>
        <div class="detail-info-item">
          <div class="label">Durum</div>
          <div class="value">${job.status === 'active' ? 'Aktif' : job.status === 'done' ? 'Tamamlandı' : 'Bekliyor'}</div>
        </div>
      </div>

      ${job.desc ? `
        <div class="detail-desc">
          <h4>Açıklama</h4>
          <p>${escapeHtml(job.desc)}</p>
        </div>
      ` : ''}

      ${shipper ? `
        <div class="detail-publisher">
          <div class="detail-publisher-avatar">${shipper.name.charAt(0)}</div>
          <div class="detail-publisher-info">
            <h4>${shipper.name}</h4>
            <p>${shipper.company || 'Bireysel'}</p>
          </div>
        </div>
      ` : ''}

      ${actionsHtml}
    `;
  },

  applyToJob(jobId) {
    if (!currentUser) return;

    const existing = DB.getOffersByCarrier(currentUser.id).find(o => o.jobId === jobId);
    if (existing) {
      App.toast('Bu ilana zaten teklif verdiniz');
      return;
    }

    const offer = {
      id: 'o' + Date.now(),
      jobId: jobId,
      carrierId: currentUser.id,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    DB.saveOffer(offer);
    App.toast('Teklifiniz gönderildi!');
    this.loadDetail(jobId);
  },

  loadJobOffers(jobId) {
    const job = DB.getJobById(jobId);
    if (!job) return;

    const offers = DB.getOffersForJob(jobId);
    const container = document.getElementById('job-offers-content');

    if (offers.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="margin-top:40px">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <p>Bu ilan için henüz teklif gelmedi</p>
        </div>`;
      return;
    }

    container.innerHTML = `
      <div style="padding:4px 0 12px">
        <p class="text-muted" style="font-size:0.88rem">${CARGO_TYPE_LABELS[job.cargoType]} - ${job.from} → ${job.to}</p>
      </div>
    ` + offers.map(offer => {
      const carrier = DB.getUsers().find(u => u.id === offer.carrierId);
      if (!carrier) return '';

      const statusHtml = offer.status === 'pending'
        ? `<div class="offer-actions">
             <button class="btn btn-success btn-sm" onclick="Jobs.respondOffer('${offer.id}','accepted')">Kabul Et</button>
             <button class="btn btn-danger btn-sm" onclick="Jobs.respondOffer('${offer.id}','rejected')">Reddet</button>
           </div>`
        : offer.status === 'accepted'
          ? `<div class="job-status status-active" style="text-align:center;padding:10px;border-radius:10px">Kabul Edildi</div>`
          : `<div class="job-status status-rejected" style="text-align:center;padding:10px;border-radius:10px">Reddedildi</div>`;

      return `
        <div class="offer-card">
          <div class="offer-card-header">
            <div class="offer-avatar">${carrier.name.charAt(0)}</div>
            <div class="offer-info">
              <h4>${carrier.name}</h4>
              <p>${carrier.company || 'Bireysel'}</p>
            </div>
          </div>
          <div class="offer-details">
            <span class="label">Telefon</span>
            <span class="value">${carrier.phone}</span>
            <span class="label">Plaka</span>
            <span class="value">${carrier.plate || '-'}</span>
            <span class="label">Araç</span>
            <span class="value">${VEHICLE_LABELS[carrier.vehicle] || '-'}</span>
          </div>
          ${statusHtml}
        </div>`;
    }).join('');
  },

  respondOffer(offerId, status) {
    DB.updateOffer(offerId, { status });
    const message = status === 'accepted' ? 'Teklif kabul edildi!' : 'Teklif reddedildi.';
    App.toast(message);

    // Sayfayı yenile
    const offer = DB.getOffers().find(o => o.id === offerId);
    if (offer) {
      this.loadJobOffers(offer.jobId);
    }
  },

  loadCarrierOffers(filter = 'pending') {
    if (!currentUser) return;
    const offers = DB.getOffersByCarrier(currentUser.id);
    const container = document.getElementById('carrier-offers-list');

    const filtered = offers.filter(o => o.status === filter);

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <p>Bu kategoride teklif bulunmuyor</p>
        </div>`;
    } else {
      container.innerHTML = filtered.map(offer => {
        const job = DB.getJobById(offer.jobId);
        if (!job) return '';
        return Dashboard.renderJobCard(job, 'carrier', true);
      }).join('');
    }
  },

  filterCarrierOffers(tab) {
    document.querySelectorAll('#page-carrier-offers .tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`#page-carrier-offers .tab[data-tab="${tab}"]`).classList.add('active');
    this.loadCarrierOffers(tab);
  }
};

// ── Profil ──
const Profile = {
  load() {
    if (!currentUser) return;

    document.getElementById('profile-avatar').textContent = currentUser.name.charAt(0);
    document.getElementById('profile-name').textContent = currentUser.name;
    document.getElementById('profile-email').textContent = currentUser.email;
    document.getElementById('profile-phone').textContent = currentUser.phone;

    const badge = document.getElementById('profile-role-badge');
    if (currentUser.role === 'shipper') {
      badge.textContent = 'Yük Sahibi';
      badge.className = 'badge badge-shipper';
      document.getElementById('profile-company-row').style.display = 'flex';
      document.getElementById('profile-company-label').textContent = 'Firma';
      document.getElementById('profile-company').textContent = currentUser.company || '-';
      document.getElementById('profile-plate-row').style.display = 'none';
      document.getElementById('profile-vehicle-row').style.display = 'none';
    } else {
      badge.textContent = 'Nakliyeci';
      badge.className = 'badge badge-carrier';
      document.getElementById('profile-company-row').style.display = 'flex';
      document.getElementById('profile-company-label').textContent = 'Firma';
      document.getElementById('profile-company').textContent = currentUser.company || '-';
      document.getElementById('profile-plate-row').style.display = 'flex';
      document.getElementById('profile-plate').textContent = currentUser.plate || '-';
      document.getElementById('profile-vehicle-row').style.display = 'flex';
      document.getElementById('profile-vehicle').textContent = VEHICLE_LABELS[currentUser.vehicle] || '-';
    }
  }
};

// ── Yardımcılar ──
function formatPrice(price) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short'
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ── Başlat ──
document.addEventListener('DOMContentLoaded', () => App.init());
