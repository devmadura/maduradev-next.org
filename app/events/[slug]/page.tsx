"use client";
import { useParams } from "next/navigation";
import { events, eventType } from "@/components/event/utils/events";
import { useState, useEffect } from "react";
export default function MyComponent() {
  const { slug } = useParams();
  const [data, setData] = useState<eventType | null>(null);
  useEffect(() => {
    if (slug) {
      const foundEvent = events.find((event) => event.slug === slug);
      setData(foundEvent ?? null);
    }
  }, [slug]);

  if (!data) return <div>Event tidak ditemukan atau sedang dimuat...</div>;

  return (
    <div className="max-w-3xl mx-auto bg-background overflow-hidden">
      {/* Gambar */}
      <div className="w-full">
        <img
          src={`/${data.image}`}
          alt="as"
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Konten */}
      <div className="p-6 space-y-4">
        {/* Judul */}
        <h1 className="text-4xl font-bold ">{data.title}</h1>

        {/* Subjudul */}
        <p className="text-lg font-medium ">{data.description}</p>

        {/* Informasi detail */}
        <div className="bg-background border rounded-lg p-4 space-y-2 text-sm">
          <p>
            <strong>Date</strong> {data.tanggal}
          </p>
          <p>
            <strong>Format:</strong> Workshop
          </p>
          <p>
            <strong>Category:</strong> {data.online ? "Online" : "Offline"}
          </p>
          <p>
            <strong>Location:</strong>{" "}
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              madura
            </a>
          </p>
        </div>

        {/* Deskripsi panjang */}
        {/* <div className="prose max-w-none text-gray-800">
          <p>✨</p>
          <p>
            📣 BandungDev akan mengadakan Event <strong>title</strong>!
          </p>
          <p>
           dd
          </p>
        </div> */}
      </div>
    </div>
  );
}
