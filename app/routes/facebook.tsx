import { redirect } from "react-router";

export function loader() {
  throw redirect("https://www.facebook.com/share/1HirCi8H6x/");
}
