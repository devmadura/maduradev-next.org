export type eventType = {
  id: number;
  image: string;
  url: string;
  online: boolean;
  new: boolean;
  title: string;
  slug: string;
  description: string;
  tanggal: string;
};

export const events: eventType[] = [
  {
    id: 1,
    image: "events/even.jpg",
    url: "#",
    online: true,
    new: true,
    title: "Bedah Buku Atomic Habits",
    slug: "bedah-buku-atomic-habits",
    description:
      "Mari bergabung dalam acara Bedah Buku: Atomic Habits untuk menggali lebih dalam konsep membangun kebiasaan kecil yang dapat membawa perubahan besar dalam hidup.",
    tanggal: "22 08 2025",
  },
  {
    id: 2,
    image: "events/event.jpeg",
    url: "#",
    online: false,
    new: false,
    title: "Yuk gabung di Meetup Belajar Laravel Dasar! 🚀",
    slug: "yuk-gabung-di-meetup-belejar-laravel-dasar",
    description:
      "Acara ini ditujukan untuk kamu yang ingin mulai belajar Laravel, salah satu framework PHP paling populer dan powerful saat ini. Kita akan membahas konsep dasar Laravel mulai dari instalasi, routing, controller, blade templating, hingga koneksi ke database.",
    tanggal: "11 08 2025",
  },
  {
    id: 3,
    image: "events/example.jpg",
    url: "#",
    online: false,
    new: true,
    title: "Baner Frontend Testing",
    slug: "baner-frontend-testing",
    description:
      "In the version of Next.js that issued this warning, access to these properties is still possible directly but will warn. In future versions, these APIs will be async and direct access will not work as expected. <code>const data = 5 > 1 ? true : false<code>",
    tanggal: "11 08 2025",
  },
];
