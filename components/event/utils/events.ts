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
    image: "events/ngopi.jpeg",
    url: "#",
    online: false,
    new: true,
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
