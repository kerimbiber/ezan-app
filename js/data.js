/* ============================================================
   ÇAĞLAYAN LOJİSTİK - Veri Katmanı
   localStorage ile çalışan basit veri yönetimi
   ============================================================ */

const CITIES = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya',
  'Ankara', 'Antalya', 'Artvin', 'Aydın', 'Balıkesir', 'Bartın',
  'Batman', 'Bayburt', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu',
  'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli',
  'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum',
  'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay',
  'Iğdır', 'Isparta', 'İstanbul', 'İzmir', 'Kahramanmaraş', 'Karabük',
  'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kırıkkale', 'Kırklareli',
  'Kırşehir', 'Kilis', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya',
  'Manisa', 'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir',
  'Niğde', 'Ordu', 'Osmaniye', 'Rize', 'Sakarya', 'Samsun',
  'Siirt', 'Sinop', 'Sivas', 'Şanlıurfa', 'Şırnak', 'Tekirdağ',
  'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova',
  'Yozgat', 'Zonguldak'
];

const CARGO_TYPE_LABELS = {
  genel: 'Genel Kargo',
  gida: 'Gıda Ürünleri',
  insaat: 'İnşaat Malzemesi',
  mobilya: 'Mobilya',
  tekstil: 'Tekstil',
  elektronik: 'Elektronik',
  kimyasal: 'Kimyasal Madde',
  tarim: 'Tarım Ürünleri',
  otomotiv: 'Otomotiv Parçaları',
  diger: 'Diğer'
};

const CARGO_TYPE_ICONS = {
  genel: '📦',
  gida: '🍎',
  insaat: '🧱',
  mobilya: '🛋️',
  tekstil: '🧵',
  elektronik: '💻',
  kimyasal: '⚗️',
  tarim: '🌾',
  otomotiv: '🔧',
  diger: '📋'
};

const VEHICLE_LABELS = {
  tir: 'TIR (Uzun Yol)',
  kamyon: 'Kamyon',
  kamyonet: 'Kamyonet',
  frigorifik: 'Frigorifik',
  tanker: 'Tanker',
  lowbed: 'Lowbed',
  farketmez: 'Farketmez'
};

// ── Veritabanı (localStorage) ──
const DB = {
  _get(key) {
    try {
      return JSON.parse(localStorage.getItem('cl_' + key)) || null;
    } catch { return null; }
  },

  _set(key, val) {
    localStorage.setItem('cl_' + key, JSON.stringify(val));
  },

  // Kullanıcılar
  getUsers() {
    return this._get('users') || [];
  },

  saveUser(user) {
    const users = this.getUsers();
    users.push(user);
    this._set('users', users);
  },

  findUser(email) {
    return this.getUsers().find(u => u.email === email);
  },

  // Oturum
  setSession(user) {
    this._set('session', user);
  },

  getSession() {
    return this._get('session');
  },

  clearSession() {
    localStorage.removeItem('cl_session');
  },

  // İlanlar
  getJobs() {
    return this._get('jobs') || [];
  },

  saveJob(job) {
    const jobs = this.getJobs();
    jobs.push(job);
    this._set('jobs', jobs);
    return job;
  },

  updateJob(jobId, updates) {
    const jobs = this.getJobs();
    const idx = jobs.findIndex(j => j.id === jobId);
    if (idx !== -1) {
      Object.assign(jobs[idx], updates);
      this._set('jobs', jobs);
      return jobs[idx];
    }
    return null;
  },

  getJobById(id) {
    return this.getJobs().find(j => j.id === id);
  },

  // Teklifler
  getOffers() {
    return this._get('offers') || [];
  },

  saveOffer(offer) {
    const offers = this.getOffers();
    offers.push(offer);
    this._set('offers', offers);
    return offer;
  },

  updateOffer(offerId, updates) {
    const offers = this.getOffers();
    const idx = offers.findIndex(o => o.id === offerId);
    if (idx !== -1) {
      Object.assign(offers[idx], updates);
      this._set('offers', offers);
      return offers[idx];
    }
    return null;
  },

  getOffersForJob(jobId) {
    return this.getOffers().filter(o => o.jobId === jobId);
  },

  getOffersByCarrier(carrierId) {
    return this.getOffers().filter(o => o.carrierId === carrierId);
  },

  // Tema
  getTheme() {
    return localStorage.getItem('cl_theme') || 'light';
  },

  setTheme(theme) {
    localStorage.setItem('cl_theme', theme);
  },

  // Demo Veri
  seedDemoData() {
    if (this.getUsers().length > 0) return;

    // Demo kullanıcılar
    const demoUsers = [
      {
        id: 'u1', name: 'Ahmet Yılmaz', email: 'ahmet@demo.com', password: '123456',
        phone: '0532 111 22 33', role: 'shipper', company: 'Yılmaz Ticaret A.Ş.'
      },
      {
        id: 'u2', name: 'Mehmet Kaya', email: 'mehmet@demo.com', password: '123456',
        phone: '0535 444 55 66', role: 'carrier', company: 'Kaya Nakliyat',
        plate: '34 ABC 123', vehicle: 'tir'
      },
      {
        id: 'u3', name: 'Fatma Demir', email: 'fatma@demo.com', password: '123456',
        phone: '0542 777 88 99', role: 'shipper', company: 'Demir İnşaat Ltd.'
      },
      {
        id: 'u4', name: 'Ali Öztürk', email: 'ali@demo.com', password: '123456',
        phone: '0555 333 44 55', role: 'carrier', company: 'Öztürk Lojistik',
        plate: '06 DEF 456', vehicle: 'kamyon'
      }
    ];
    this._set('users', demoUsers);

    // Demo ilanlar
    const now = new Date();
    const demoJobs = [
      {
        id: 'j1', shipperId: 'u1', cargoType: 'gida', weight: 18,
        from: 'İstanbul', to: 'Ankara', date: '2026-03-25', deliveryDate: '2026-03-26',
        vehiclePref: 'frigorifik', price: 32000,
        desc: 'Soğuk zincir gereklidir. Meyve ve sebze taşıması yapılacaktır.',
        status: 'active', createdAt: new Date(now - 3600000 * 2).toISOString()
      },
      {
        id: 'j2', shipperId: 'u3', cargoType: 'insaat', weight: 24,
        from: 'İzmir', to: 'Antalya', date: '2026-03-27', deliveryDate: '2026-03-28',
        vehiclePref: 'tir', price: 28000,
        desc: 'İnşaat demiri ve çimento. Yükleme noktasında forklift mevcuttur.',
        status: 'active', createdAt: new Date(now - 3600000 * 5).toISOString()
      },
      {
        id: 'j3', shipperId: 'u1', cargoType: 'elektronik', weight: 5,
        from: 'Bursa', to: 'Gaziantep', date: '2026-03-28', deliveryDate: '2026-03-30',
        vehiclePref: 'kamyon', price: 18000,
        desc: 'Beyaz eşya taşıması. Dikkatli taşıma gerektirir.',
        status: 'active', createdAt: new Date(now - 3600000 * 8).toISOString()
      },
      {
        id: 'j4', shipperId: 'u3', cargoType: 'tekstil', weight: 12,
        from: 'Denizli', to: 'İstanbul', date: '2026-03-24', deliveryDate: '2026-03-25',
        vehiclePref: 'kamyon', price: 22000,
        desc: 'Tekstil ürünleri, kuru ortamda taşınmalıdır.',
        status: 'active', createdAt: new Date(now - 3600000 * 12).toISOString()
      },
      {
        id: 'j5', shipperId: 'u1', cargoType: 'tarim', weight: 30,
        from: 'Konya', to: 'Mersin', date: '2026-03-26', deliveryDate: '2026-03-27',
        vehiclePref: 'tir', price: 25000,
        desc: 'Buğday taşıması. Liman teslimatı yapılacaktır.',
        status: 'active', createdAt: new Date(now - 3600000 * 15).toISOString()
      }
    ];
    this._set('jobs', demoJobs);

    // Demo teklif
    const demoOffers = [
      {
        id: 'o1', jobId: 'j1', carrierId: 'u2',
        status: 'pending', createdAt: new Date(now - 3600000).toISOString()
      }
    ];
    this._set('offers', demoOffers);
  }
};
