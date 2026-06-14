import { redirect } from "react-router";

export function loader() {
  throw redirect("https://github.com/maduradevcommunity");
}
