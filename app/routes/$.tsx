export function loader() {
  throw new Response("Not Found", { status: 404 });
}

export default function CatchAll() {
  return null;
}

export function ErrorBoundary() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-black text-primary">404</h1>
        <p className="text-xl text-muted-foreground">Halaman tidak ditemukan</p>
        <a
          href="/"
          className="inline-block rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Kembali ke Beranda
        </a>
      </div>
    </div>
  );
}
