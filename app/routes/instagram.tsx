import { redirect } from "react-router";

export function loader() {
  throw redirect("https://www.instagram.com/maduradev");
}
