import EventClient from "./EventClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Event",
  description: "semua list event maduradev",
};
export default function Event() {
  return <EventClient />;
}
