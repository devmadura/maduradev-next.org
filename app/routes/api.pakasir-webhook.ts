import type { ActionFunctionArgs } from "react-router";
import { createAdminClient } from "@/lib/supabase/admin";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    let payload: any = {};
    const contentType = request.headers.get("content-type") || "";
    
    if (contentType.includes("application/json")) {
      payload = await request.json();
    } else {
      const formData = await request.formData();
      payload = Object.fromEntries(formData.entries());
    }

    console.log("Pakasir Webhook received payload:", payload);

    const orderId = payload.order_id || payload.orderId;
    const amount = payload.amount;

    if (!orderId || !amount) {
      console.warn("Invalid webhook payload received:", payload);
      return new Response("Invalid Payload", { status: 400 });
    }

    const projectSlug = process.env.PAKASIR_PROJECT_SLUG || "";
    const apiKey = process.env.PAKASIR_API_KEY || "";

    if (!projectSlug || !apiKey) {
      console.error("Missing Pakasir configuration environment variables.");
      return new Response("Server Configuration Error", { status: 500 });
    }

    // Call Pakasir Verification API to double-check authenticity
    const verifyUrl = `https://app.pakasir.com/api/transactiondetail?project=${projectSlug}&amount=${amount}&order_id=${orderId}&api_key=${apiKey}`;
    const response = await fetch(verifyUrl);
    
    if (!response.ok) {
      console.error(`Failed to verify transaction with Pakasir server (HTTP ${response.status})`);
      return new Response("Verification Failed", { status: 400 });
    }

    const data = await response.json();
    console.log("Pakasir verification response:", data);

    const transaction = data.transaction;
    if (transaction && transaction.status === "completed") {
      const adminClient = createAdminClient();
      
      const { error } = await adminClient
        .from("event_registrations")
        .update({ status: "confirmed" })
        .eq("id", orderId);

      if (error) {
        console.error("Failed to update registration status in Supabase:", error);
        return new Response("Database Error", { status: 500 });
      }

      console.log(`Successfully confirmed RSVP registration for order_id: ${orderId}`);
      return new Response("OK", { status: 200 });
    } else {
      console.warn(`Transaction status is not completed: ${transaction?.status}`);
      return new Response("Transaction Not Completed", { status: 200 });
    }
  } catch (error) {
    console.error("Unhandled error inside Pakasir webhook handler:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function loader() {
  return new Response("Method Not Allowed", { status: 405 });
}
