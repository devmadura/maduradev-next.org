import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { events } from "./utils/events";
import Link from "next/link";
export default function ListEvent() {
  return (
    <>
      {events.map((event, i) => (
        <div
          className="mt-10 rounded-xl overflow-hidden border bg-background/50 backdrop-blur-sm"
          key={i}
        >
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative h-64 md:h-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-background/20 to-blue-400/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                {/* <div className="w-5 h-5 border-t-8 border-t-transparent border-l-12 border-l-primary border-b-8 border-b-transparent ml-1" /> */}
                <Link
                  href={`/events/${event.slug}`}
                  className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors"
                >
                  <Image
                    src={event.image}
                    height={300}
                    width={300}
                    alt={event.title}
                    className="h-full"
                  />
                </Link>
              </div>
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
                {event.new ? "New" : "defericeted"}
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                {event.title}
              </h3>
              <p className="text-muted-foreground mb-6">
                {event.description.slice(0, 200)}...
              </p>
              <div className="flex flex-wrap gap-2 mb-2">
                <span
                  className={`inline-flex items-center rounded-md ${event.online ? "bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/10 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-400/20" : "bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-600/10 dark:bg-orange-900/30 dark:text-orange-400 dark:ring-orange-400/20"}  `}
                >
                  {event.online ? "online" : "offline"}
                </span>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-gradient-to-r from-primary to-blue-400 hover:from-primary/90 hover:to-blue-400/90">
                  <Link href={`/events/${event.slug}`}>Detail</Link>
                </Button>
                <Button variant="outline" disabled>
                  <Calendar className="me-1" /> {event.tanggal}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
