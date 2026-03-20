const HADITHS = [
  {
    text: '"Ameller niyetlere göredir. Herkese niyet ettiği şey vardır."',
    source: 'Buhari, Müslim',
  },
  {
    text: '"Müslüman, elinden ve dilinden Müslümanların güvende olduğu kimsedir."',
    source: 'Buhari, Müslim',
  },
  {
    text: '"Kolaylaştırın, zorlaştırmayın. Müjdeleyin, nefret ettirmeyin."',
    source: 'Buhari, Müslim',
  },
  {
    text: '"Sizden biriniz kendisi için istediğini kardeşi için de istemedikçe iman etmiş olmaz."',
    source: 'Buhari, Müslim',
  },
  {
    text: '"Güzel söz sadakadır."',
    source: 'Buhari, Müslim',
  },
  {
    text: '"Kim Allah\'a ve ahiret gününe inanıyorsa komşusuna ikramda bulunsun."',
    source: 'Buhari, Müslim',
  },
  {
    text: '"Kul, kardeşinin yardımında olduğu müddetçe, Allah da kulun yardımındadır."',
    source: 'Müslim',
  },
  {
    text: '"Sabır, acının ilk anında gösterilendir."',
    source: 'Buhari, Müslim',
  },
  {
    text: '"Temizlik imanın yarısıdır."',
    source: 'Müslim',
  },
  {
    text: '"İnsanlara teşekkür etmeyen, Allah\'a da şükretmez."',
    source: 'Tirmizi',
  },
  {
    text: '"En hayırlınız, ahlakı en güzel olanınızdır."',
    source: 'Buhari',
  },
  {
    text: '"Merhamet etmeyene merhamet olunmaz."',
    source: 'Buhari, Müslim',
  },
  {
    text: '"Öfkelendiğin zaman sus."',
    source: 'Ahmed b. Hanbel',
  },
  {
    text: '"Dünya ahiretin tarlasıdır."',
    source: 'Acluni',
  },
  {
    text: '"Allah güzeldir, güzeli sever."',
    source: 'Müslim',
  },
  {
    text: '"İlim öğrenmek her Müslümana farzdır."',
    source: 'İbn Mace',
  },
  {
    text: '"Yolda eziyet veren bir şeyi kaldırmak sadakadır."',
    source: 'Buhari, Müslim',
  },
  {
    text: '"Bir kulun Allah\'ın hoşuna en çok giden ameli, az da olsa devamlı olanıdır."',
    source: 'Buhari, Müslim',
  },
  {
    text: '"Cennet annelerin ayakları altındadır."',
    source: 'Nesai',
  },
  {
    text: '"Cömert kişi Allah\'a yakın, insanlara yakın, cennete yakındır."',
    source: 'Tirmizi',
  },
  {
    text: '"İnsanların en hayırlısı, insanlara en faydalı olandır."',
    source: 'Taberani',
  },
  {
    text: '"Güleryüzle karşılaşmak da sadakadır."',
    source: 'Tirmizi',
  },
  {
    text: '"Akrabalık bağlarını koparan cennete giremez."',
    source: 'Buhari, Müslim',
  },
  {
    text: '"İki nimet vardır ki insanların çoğu aldanmıştır: Sağlık ve boş vakit."',
    source: 'Buhari',
  },
  {
    text: '"Hayâ imandandır."',
    source: 'Buhari, Müslim',
  },
  {
    text: '"Mümin bir delikten iki kere ısırılmaz."',
    source: 'Buhari, Müslim',
  },
  {
    text: '"Kuvvetli mümin, zayıf müminden daha hayırlıdır."',
    source: 'Müslim',
  },
  {
    text: '"Dua ibadetin özüdür."',
    source: 'Tirmizi',
  },
  {
    text: '"Kim bir ağaç dikerse, ondan yenilen meyve kendisi için sadakadır."',
    source: 'Müslim',
  },
  {
    text: '"Bir müminin diğer mümine bağlılığı, parçaları birbirini destekleyen bina gibidir."',
    source: 'Buhari, Müslim',
  },
];

export function getDailyHadith() {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  );
  const index = dayOfYear % HADITHS.length;
  return HADITHS[index];
}

export function getRandomHadith() {
  const index = Math.floor(Math.random() * HADITHS.length);
  return HADITHS[index];
}
