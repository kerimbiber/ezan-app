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

  updateUser(userId, updates) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      Object.assign(users[idx], updates);
      this._set('users', users);
      return users[idx];
    }
    return null;
  },

  findUser(email) {
    return this.getUsers().find(u => u.email === email);
  },

  getUserById(id) {
    return this.getUsers().find(u => u.id === id);
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

  deleteJob(jobId) {
    const jobs = this.getJobs().filter(j => j.id !== jobId);
    this._set('jobs', jobs);
    // İlana ait teklifleri de sil
    const offers = this.getOffers().filter(o => o.jobId !== jobId);
    this._set('offers', offers);
    // İlana ait bildirimleri de sil
    const notifs = this.getNotifications().filter(n => n.jobId !== jobId);
    this._set('notifications', notifs);
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

  // Bildirimler
  getNotifications() {
    return this._get('notifications') || [];
  },

  saveNotification(notif) {
    const notifs = this.getNotifications();
    notifs.push(notif);
    this._set('notifications', notifs);
    return notif;
  },

  getNotificationsForUser(userId) {
    return this.getNotifications()
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  markNotificationRead(notifId) {
    const notifs = this.getNotifications();
    const idx = notifs.findIndex(n => n.id === notifId);
    if (idx !== -1) {
      notifs[idx].read = true;
      this._set('notifications', notifs);
    }
  },

  markAllNotificationsRead(userId) {
    const notifs = this.getNotifications();
    notifs.forEach(n => {
      if (n.userId === userId) n.read = true;
    });
    this._set('notifications', notifs);
  },

  getUnreadCount(userId) {
    return this.getNotifications().filter(n => n.userId === userId && !n.read).length;
  },

  // Mesajlar
  getMessages() {
    return this._get('messages') || [];
  },

  saveMessage(msg) {
    const msgs = this.getMessages();
    msgs.push(msg);
    this._set('messages', msgs);
    return msg;
  },

  getConversation(user1Id, user2Id) {
    return this.getMessages().filter(m =>
      (m.fromId === user1Id && m.toId === user2Id) ||
      (m.fromId === user2Id && m.toId === user1Id)
    ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  },

  getConversationsForUser(userId) {
    const msgs = this.getMessages().filter(m => m.fromId === userId || m.toId === userId);
    const partnerIds = new Set();
    msgs.forEach(m => {
      partnerIds.add(m.fromId === userId ? m.toId : m.fromId);
    });
    return Array.from(partnerIds).map(partnerId => {
      const convMsgs = this.getConversation(userId, partnerId);
      const lastMsg = convMsgs[convMsgs.length - 1];
      const unread = convMsgs.filter(m => m.toId === userId && !m.read).length;
      return { partnerId, lastMsg, unread };
    }).sort((a, b) => new Date(b.lastMsg.createdAt) - new Date(a.lastMsg.createdAt));
  },

  markMessagesRead(fromId, toId) {
    const msgs = this.getMessages();
    msgs.forEach(m => {
      if (m.fromId === fromId && m.toId === toId) m.read = true;
    });
    this._set('messages', msgs);
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
        phone: '0532 111 22 33', role: 'shipper', company: 'Yılmaz Ticaret A.Ş.',
        rating: 4.8, ratingCount: 12
      },
      {
        id: 'u2', name: 'Mehmet Kaya', email: 'mehmet@demo.com', password: '123456',
        phone: '0535 444 55 66', role: 'carrier', company: 'Kaya Nakliyat',
        plate: '34 ABC 123', vehicle: 'tir', rating: 4.5, ratingCount: 8
      },
      {
        id: 'u3', name: 'Fatma Demir', email: 'fatma@demo.com', password: '123456',
        phone: '0542 777 88 99', role: 'shipper', company: 'Demir İnşaat Ltd.',
        rating: 4.9, ratingCount: 15
      },
      {
        id: 'u4', name: 'Ali Öztürk', email: 'ali@demo.com', password: '123456',
        phone: '0555 333 44 55', role: 'carrier', company: 'Öztürk Lojistik',
        plate: '06 DEF 456', vehicle: 'kamyon', rating: 4.2, ratingCount: 5
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

    // Demo teklifler
    const demoOffers = [
      {
        id: 'o1', jobId: 'j1', carrierId: 'u2', price: 30000, note: 'Frigorifik aracım mevcut, hemen yola çıkabilirim.',
        status: 'pending', createdAt: new Date(now - 3600000).toISOString()
      },
      {
        id: 'o2', jobId: 'j2', carrierId: 'u4', price: 26000, note: 'İzmir-Antalya hattını düzenli yapıyorum.',
        status: 'pending', createdAt: new Date(now - 3600000 * 3).toISOString()
      }
    ];
    this._set('offers', demoOffers);

    // Demo bildirimler
    const demoNotifs = [
      {
        id: 'n1', userId: 'u1', type: 'new_offer',
        title: 'Yeni Teklif',
        message: 'Mehmet Kaya, "Gıda Ürünleri - İstanbul → Ankara" ilanınıza teklif verdi.',
        jobId: 'j1', read: false,
        createdAt: new Date(now - 3600000).toISOString()
      },
      {
        id: 'n2', userId: 'u3', type: 'new_offer',
        title: 'Yeni Teklif',
        message: 'Ali Öztürk, "İnşaat Malzemesi - İzmir → Antalya" ilanınıza teklif verdi.',
        jobId: 'j2', read: false,
        createdAt: new Date(now - 3600000 * 3).toISOString()
      }
    ];
    this._set('notifications', demoNotifs);

    // Demo mesajlar
    const demoMessages = [
      {
        id: 'm1', fromId: 'u2', toId: 'u1', jobId: 'j1',
        text: 'Merhaba, gıda taşımacılığı ilanınız için teklif verdim. Frigorifik aracım mevcuttur.',
        read: false, createdAt: new Date(now - 3600000).toISOString()
      },
      {
        id: 'm2', fromId: 'u1', toId: 'u2', jobId: 'j1',
        text: 'Merhaba Mehmet Bey, teklifiniz için teşekkürler. Aracınızın yaşı ve kapasitesi nedir?',
        read: true, createdAt: new Date(now - 3000000).toISOString()
      },
      {
        id: 'm3', fromId: 'u2', toId: 'u1', jobId: 'j1',
        text: '2022 model Volvo FH, 20 ton kapasite. Soğutma sistemi tam çalışır durumda.',
        read: false, createdAt: new Date(now - 2400000).toISOString()
      }
    ];
    this._set('messages', demoMessages);
  }
};
