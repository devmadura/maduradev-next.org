import EventClient from "./EventClient";
import ListEvent from "@/components/event/list-event";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description: "semua list event MaduraDev",
};

export default function Event() {
  return (
    <>
      <EventClient />
      <div className="container px-4 md:px-6">
        <ListEvent />
      </div>
    </>
  );
}
