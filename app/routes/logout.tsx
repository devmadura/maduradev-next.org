import { redirect } from "react-router";
import { createClientWithResponse } from "@/lib/supabase/server";

export async function action({ request }: { request: Request }) {
  const { supabase, getCookieHeaders } = createClientWithResponse(request);
  await supabase.auth.signOut();

  const responseHeaders = new Headers();
  for (const cookie of getCookieHeaders()) {
    responseHeaders.append("Set-Cookie", cookie);
  }

  return redirect("/login", { headers: responseHeaders });
}

export async function loader() {
  throw redirect("/");
}
