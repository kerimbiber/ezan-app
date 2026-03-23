import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = 'cl_';

async function _get(key) {
  try {
    const val = await AsyncStorage.getItem(PREFIX + key);
    return val ? JSON.parse(val) : null;
  } catch { return null; }
}

async function _set(key, val) {
  await AsyncStorage.setItem(PREFIX + key, JSON.stringify(val));
}

const DB = {
  // Kullanıcılar
  async getUsers() {
    return (await _get('users')) || [];
  },
  async saveUser(user) {
    const users = await this.getUsers();
    users.push(user);
    await _set('users', users);
  },
  async updateUser(userId, updates) {
    const users = await this.getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      Object.assign(users[idx], updates);
      await _set('users', users);
      return users[idx];
    }
    return null;
  },
  async findUser(email) {
    const users = await this.getUsers();
    return users.find(u => u.email === email);
  },
  async getUserById(id) {
    const users = await this.getUsers();
    return users.find(u => u.id === id);
  },

  // Oturum
  async setSession(user) { await _set('session', user); },
  async getSession() { return await _get('session'); },
  async clearSession() { await AsyncStorage.removeItem(PREFIX + 'session'); },

  // İlanlar
  async getJobs() { return (await _get('jobs')) || []; },
  async saveJob(job) {
    const jobs = await this.getJobs();
    jobs.push(job);
    await _set('jobs', jobs);
    return job;
  },
  async updateJob(jobId, updates) {
    const jobs = await this.getJobs();
    const idx = jobs.findIndex(j => j.id === jobId);
    if (idx !== -1) {
      Object.assign(jobs[idx], updates);
      await _set('jobs', jobs);
      return jobs[idx];
    }
    return null;
  },
  async deleteJob(jobId) {
    const jobs = (await this.getJobs()).filter(j => j.id !== jobId);
    await _set('jobs', jobs);
    const offers = (await this.getOffers()).filter(o => o.jobId !== jobId);
    await _set('offers', offers);
  },
  async getJobById(id) {
    const jobs = await this.getJobs();
    return jobs.find(j => j.id === id);
  },

  // Teklifler
  async getOffers() { return (await _get('offers')) || []; },
  async saveOffer(offer) {
    const offers = await this.getOffers();
    offers.push(offer);
    await _set('offers', offers);
    return offer;
  },
  async updateOffer(offerId, updates) {
    const offers = await this.getOffers();
    const idx = offers.findIndex(o => o.id === offerId);
    if (idx !== -1) {
      Object.assign(offers[idx], updates);
      await _set('offers', offers);
      return offers[idx];
    }
    return null;
  },
  async getOffersForJob(jobId) {
    const offers = await this.getOffers();
    return offers.filter(o => o.jobId === jobId);
  },
  async getOffersByCarrier(carrierId) {
    const offers = await this.getOffers();
    return offers.filter(o => o.carrierId === carrierId);
  },

  // Bildirimler
  async getNotifications() { return (await _get('notifications')) || []; },
  async saveNotification(notif) {
    const notifs = await this.getNotifications();
    notifs.push(notif);
    await _set('notifications', notifs);
  },
  async getNotificationsForUser(userId) {
    const notifs = await this.getNotifications();
    return notifs
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  async getUnreadCount(userId) {
    const notifs = await this.getNotifications();
    return notifs.filter(n => n.userId === userId && !n.read).length;
  },

  // Tema
  async getTheme() {
    const t = await AsyncStorage.getItem(PREFIX + 'theme');
    return t || 'light';
  },
  async setTheme(theme) {
    await AsyncStorage.setItem(PREFIX + 'theme', theme);
  },

  // Demo Veri
  async seedDemoData() {
    const users = await this.getUsers();
    if (users.length > 0) return;

    const demoUsers = [
      { id: 'u1', name: 'Ahmet Yılmaz', email: 'ahmet@demo.com', password: '123456', phone: '0532 111 22 33', role: 'shipper', company: 'Yılmaz Ticaret A.Ş.', rating: 4.8, ratingCount: 12 },
      { id: 'u2', name: 'Mehmet Kaya', email: 'mehmet@demo.com', password: '123456', phone: '0535 444 55 66', role: 'carrier', company: 'Kaya Nakliyat', plate: '34 ABC 123', vehicle: 'tir', rating: 4.5, ratingCount: 8 },
      { id: 'u3', name: 'Fatma Demir', email: 'fatma@demo.com', password: '123456', phone: '0542 777 88 99', role: 'shipper', company: 'Demir İnşaat Ltd.', rating: 4.9, ratingCount: 15 },
      { id: 'u4', name: 'Ali Öztürk', email: 'ali@demo.com', password: '123456', phone: '0555 333 44 55', role: 'carrier', company: 'Öztürk Lojistik', plate: '06 DEF 456', vehicle: 'kamyon', rating: 4.2, ratingCount: 5 }
    ];
    await _set('users', demoUsers);

    const now = new Date();
    const demoJobs = [
      { id: 'j1', shipperId: 'u1', cargoType: 'gida', weight: 18, from: 'İstanbul', to: 'Ankara', date: '2026-03-25', deliveryDate: '2026-03-26', vehiclePref: 'frigorifik', price: 32000, desc: 'Soğuk zincir gereklidir. Meyve ve sebze taşıması yapılacaktır.', status: 'active', createdAt: new Date(now - 3600000 * 2).toISOString() },
      { id: 'j2', shipperId: 'u3', cargoType: 'insaat', weight: 24, from: 'İzmir', to: 'Antalya', date: '2026-03-27', deliveryDate: '2026-03-28', vehiclePref: 'tir', price: 28000, desc: 'İnşaat demiri ve çimento. Yükleme noktasında forklift mevcuttur.', status: 'active', createdAt: new Date(now - 3600000 * 5).toISOString() },
      { id: 'j3', shipperId: 'u1', cargoType: 'elektronik', weight: 5, from: 'Bursa', to: 'Gaziantep', date: '2026-03-28', deliveryDate: '2026-03-30', vehiclePref: 'kamyon', price: 18000, desc: 'Beyaz eşya taşıması. Dikkatli taşıma gerektirir.', status: 'active', createdAt: new Date(now - 3600000 * 8).toISOString() },
      { id: 'j4', shipperId: 'u3', cargoType: 'tekstil', weight: 12, from: 'Denizli', to: 'İstanbul', date: '2026-03-24', deliveryDate: '2026-03-25', vehiclePref: 'kamyon', price: 22000, desc: 'Tekstil ürünleri, kuru ortamda taşınmalıdır.', status: 'active', createdAt: new Date(now - 3600000 * 12).toISOString() },
      { id: 'j5', shipperId: 'u1', cargoType: 'tarim', weight: 30, from: 'Konya', to: 'Mersin', date: '2026-03-26', deliveryDate: '2026-03-27', vehiclePref: 'tir', price: 25000, desc: 'Buğday taşıması. Liman teslimatı yapılacaktır.', status: 'active', createdAt: new Date(now - 3600000 * 15).toISOString() }
    ];
    await _set('jobs', demoJobs);

    const demoOffers = [
      { id: 'o1', jobId: 'j1', carrierId: 'u2', price: 30000, note: 'Frigorifik aracım mevcut, hemen yola çıkabilirim.', status: 'pending', createdAt: new Date(now - 3600000).toISOString() },
      { id: 'o2', jobId: 'j2', carrierId: 'u4', price: 26000, note: 'İzmir-Antalya hattını düzenli yapıyorum.', status: 'pending', createdAt: new Date(now - 3600000 * 3).toISOString() }
    ];
    await _set('offers', demoOffers);
  }
};

export default DB;
