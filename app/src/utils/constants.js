export const CITIES = [
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

export const CARGO_TYPE_LABELS = {
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

export const CARGO_TYPE_ICONS = {
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

export const VEHICLE_LABELS = {
  tir: 'TIR (Uzun Yol)',
  kamyon: 'Kamyon',
  kamyonet: 'Kamyonet',
  frigorifik: 'Frigorifik',
  tanker: 'Tanker',
  lowbed: 'Lowbed',
  farketmez: 'Farketmez'
};

export const COLORS = {
  primary: '#1a5276',
  primaryLight: '#2980b9',
  primaryDark: '#0e3a55',
  accent: '#e67e22',
  accentLight: '#f39c12',
  accentDark: '#d35400',
  success: '#27ae60',
  successLight: '#2ecc71',
  danger: '#c0392b',
  dangerLight: '#e74c3c',
  warning: '#f39c12',

  light: {
    bgPrimary: '#f5f7fa',
    bgSecondary: '#ffffff',
    bgCard: '#ffffff',
    bgInput: '#f0f3f7',
    textPrimary: '#1a1a2e',
    textSecondary: '#4a5568',
    textMuted: '#8895a7',
    border: '#e2e8f0',
  },
  dark: {
    bgPrimary: '#0f1923',
    bgSecondary: '#1a2836',
    bgCard: '#1e3044',
    bgInput: '#243447',
    textPrimary: '#e8edf2',
    textSecondary: '#a8b8c8',
    textMuted: '#6b7f92',
    border: '#2a3f54',
  }
};

export function formatPrice(price) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

export function formatDate(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
}
