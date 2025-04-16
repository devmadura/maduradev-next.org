import TeamClient from "./TeamClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Core Team",
  description: "core team MaduraDev",
};

export default function Team() {
  return <TeamClient />;
}
