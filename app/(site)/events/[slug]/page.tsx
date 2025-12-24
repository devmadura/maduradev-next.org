import { Metadata } from "next";
import { getEvent } from "@/lib/event";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PageParams {
  params: Promise<{ slug: string }>;
}

// generate metadata
export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) {
    return {
      title: "Event tidak ditemukan",
      description: "Event yang kamu cari tidak tersedia.",
    };
  }

  return {
    title: `${event.title}`,
    description: event.description_small,
    openGraph: {
      title: event.title,
      description: event.description_small,
      images: [event.image],
      url: `${process.env.NEXT_URL_PUBLISH}/${event.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: event.description_small,
      images: [event.image],
    },
  };
}

export default async function detailEvet({ params }: PageParams) {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) return notFound();

  return (
    <div className="max-w-3xl mx-auto bg-background overflow-hidden">
      {/* Gambar */}
      <div className="w-full">
        <img
          src={event.image.startsWith("http") ? event.image : `/${event.image}`}
          alt={event.title}
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Konten */}
      <div className="p-6 space-y-4">
        {/* Judul */}
        <h1 className="text-4xl font-bold ">{event.title}</h1>
        {/* Subjudul */}
        <p className="text-lg font-medium ">{event.description_small}</p>

        {/* Informasi detail */}
        <div className="bg-background border rounded-lg p-4 space-y-2 text-sm">
          <p>
            <strong>Date:</strong> {event.tanggal}
          </p>
          <p>
            <strong>Time:</strong> {event.waktu}
          </p>
          <p>
            <strong>Format:</strong> {event.format}
          </p>
          <p>
            <strong>Category:</strong> {event.online ? "Online" : "Offline"}
          </p>
          <p>
            <strong>Location:</strong>{" "}
            <span dangerouslySetInnerHTML={{ __html: event.location }} />
          </p>
        </div>
        {/* Deskripsi panjang */}
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: event.description }} />
        </div>
        <Button className="bg-gradient-to-r from-primary to-blue-400 hover:from-primary/90 hover:to-blue-400/90">
          <Link href={event.url} target="_blank" rel="noopener noreferrer">
            Daftar
          </Link>
        </Button>
      </div>
    </div>
  );
}
