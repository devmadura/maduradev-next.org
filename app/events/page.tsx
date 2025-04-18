import EventClient from "./EventClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description: "semua list event MaduraDev",
};
export default function Event() {
  return <EventClient />;
}
