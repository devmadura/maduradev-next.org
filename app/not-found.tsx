import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex h-screen items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-gray-300">404</h1>
        <p className="mt-4 text-2xl font-semibold text-gray-700">
          Oops! Halaman tidak ditemukan tretan.
        </p>
        <p className="mt-2 text-gray-500">
          Halaman yang Anda cari mungkin telah dihapus atau tidak tersedia.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 transition-colors"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
