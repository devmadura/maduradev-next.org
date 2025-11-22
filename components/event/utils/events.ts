export type eventType = {
  id: number;
  image: string;
  url: string;
  online: boolean;
  new: boolean;
  title: string;
  slug: string;
  format: "workshop" | "bincang-bincang" | "bootcamp" | "webinar";
  description_small: string;
  description: string;
  location: string;
  tanggal: string;
  waktu: string;
};

export const events: eventType[] = [
  {
    id: 1,
    image: "events/devfest.png",
    url: "devfest.gdgsurabaya.com",
    online: false,
    new: true,
    title: "DevFest 2025 Surabaya",
    slug: "devfest-2025-surabaya",
    format: "webinar",
    description_small:
      "DevFest Google adalah konferensi teknologi tahunan bergengsi yang diselenggarakan oleh Google Developer Groups (GDG) di seluruh dunia kebetulan sekarang di selenggarakan di GDG Surabaya",
    description: `
    <p>🚀 CALLING ALL DEVELOPERS & TECH INNOVATORS! 🚀</p>
    <p>The wait is OVER! DevFest 2025 Surabaya registration is officially OPEN and we’re ready to AmplifiAI your code! 💻✨</p>
    <p>Get ready for an electrifying day packed with:</p>
    <ul>
    <li>🔥 Cutting-edge tech talks</li>
    <li>🎯 Hands-on workshops</li>
    <li>🤝 Amazing networking opportunities</li>
    <li>🎪 Interactive developer games</li>
    <li>💡 AI & ML innovations</li>
    </ul>
    <p>Don’t miss this incredible opportunity to connect with fellow developers, learn from industry experts, and level up your coding game! 🎮</p>
    <p>🎟️ REGISTER NOW at: devfest.gdgsurabaya.com</p>
    <p>Limited spots available - secure yours before they’re gone! ⚡</p>
    <p>Brought to you by Google Developer Groups Surabaya, AI/ML Surabaya, and Flutter Surabaya 🎉</p>
    <p style="color: blue">#DevFestSurabaya2025 #AmplifiAIYourCode #GDGSurabaya #AISurabaya #FlutterSurabaya #TechCommunity #DeveloperEvent #SurabayaTech #GoogleDevelopers #DevFest2025 #CodingCommunity</p>
    `,
    location:
      "<a href='https://maps.app.goo.gl/7aK4dsCYVyg95J3m7' target='_blank' style='text-decoration: underline'>Yarra ballroom by IKADO Surabaya No.3 Jalan pattimura, Surabaya</a>",
    tanggal: "December 6, 2025",
    waktu: "09:00 - 16:00 WIB",
  },
  {
    id: 2,
    image: "events/io.png",
    url: "https://s.id/googleiox-sby-25",
    online: false,
    new: false,
    title: "Google I/O Extended Surabaya",
    slug: "google-io-extended-surabaya",
    format: "webinar",
    description_small:
      "Google I/O Extended Surabaya merupakan acara tahunan yang diselenggarakan oleh Google Developer Groups (GDG) Surabaya.",
    description: `
    <p>The moment you've been waiting for is here! 🎉</p>
    <p>Registration for Google I/O Extended Surabaya is now OFFICIALLY OPEN!</p>
    <p>👇 Here’s how to secure your spot:</p>
    <p>🔗 Go to <a href="https://s.id/googleiox-sby-25">s.id/googleiox-sby-25</a> or scan the QR code on the second slide to fill out the interest form.</p>
    <p>📩 Check your email! Keep an eye on your inbox! If you are selected, you will receive a confirmation email from our team with the next steps.</p>
    <p>✅ Pay commitment fee to confirm your seat, a commitment fee of IDR 50K is required.</p>
    <p>🎉 Congrats you’re in! Once your payment is confirmed, you are officially registered to join us.</p>
    <p>Tag your friends who can't miss this! We can't wait to see you there! 🙌🏻</p>
    <p style="color: blue">#GoogleIOExtended #IOExtendedSurabaya #GDGSurabaya #RegistrationOpen #SurabayaEvent #TechEvent #DeveloperCommunity #InfoSurabaya #AcaraTeknologi</p>
    `,
    location:
      "<a href='https://maps.app.goo.gl/7aK4dsCYVyg95J3m7' target='_blank' style='text-decoration: underline'>Yarra ballroom by IKADO Surabaya No.3 Jalan pattimura, Surabaya</a>",
    tanggal: "Saturday, 19 July 2025",
    waktu: "8:00 - 18:00 WIB",
  },
  {
    id: 3,
    image: "events/ngopi.jpeg",
    url: "#",
    online: false,
    new: false,
    title: "☕ Ngopi Bareng Madura Dev: Pembagian Kaos dan Bincang Santai!",
    slug: "ngopi-bareng-madura-dev-pembagian-kaos-dan-bincang-santai",
    format: "bincang-bincang",
    description_small:
      "Halo para developer Madura! Ada kabar gembira nih! Kami mengundang kalian semua untuk acara 'Ngopi Bareng Madura Dev' yang akan lebih spesial kali ini. Selain mempererat silaturahmi, kita juga akan mengadakan pembagian kaos resmi Madura Dev untuk kalian yang sudah terdaftar.",
    description: `
    <p style="margin-bottom: 10px">Selain itu, kita akan menikmati sesi bincang-bincang santai seputar dunia pengembangan, tren teknologi terkini, dan berbagai ide inovatif yang bisa kita kembangkan bersama. Ini adalah wadah sempurna untuk berbagi pengalaman, mencari solusi atas tantangan yang mungkin sedang kalian hadapi, atau bahkan menemukan partner untuk proyek impian.</p>

    <p style="margin-bottom: 10px">Mari manfaatkan kesempatan ini untuk memperluas jaringan, berinteraksi langsung dengan sesama developer, dan membangun komunitas teknologi Madura yang lebih solid dan inspiratif. Tentu saja, semua ini akan ditemani secangkir kopi hangat yang akan membuat suasana semakin akrab.</p>

    <h2><b>Hadir Kappi Tretan 💯</b></h2>
    `,
    location:
      "<a href='https://maps.app.goo.gl/ZWJqVjvtJSUCA68G7' target='_blank' style='text-decoration: underline'>SINGGA BATU CAFE & RESTO, Panggung, Barurambat Tim., Kec. Pademawu, Kabupaten Pamekasan, Jawa Timur 69321</a>",
    tanggal: "04 06 2025, malam kamis",
    waktu: "18:00 - selesai",
  },
];
