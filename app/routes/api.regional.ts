import type { LoaderFunctionArgs } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  
  const API_BASE_URL = process.env.VITE_API_CO_ID_BASE_URL || "https://use.api.co.id";
  const API_KEY = process.env.VITE_API_CO_ID_KEY || "";
  
  const headers = {
    "Content-Type": "application/json",
    ...(API_KEY ? { 
      "x-api-co-id": API_KEY
    } : {})
  };

  try {
    if (type === "provinces") {
      const res = await fetch(`${API_BASE_URL}/regional/indonesia/provinces`, { headers });
      if (!res.ok) throw new Error(`API returned status ${res.status}`);
      const data = await res.json();
      return Response.json(data);
    } 
    
    if (type === "regencies") {
      const provinceId = url.searchParams.get("province_id");
      if (!provinceId) {
        return Response.json({ error: "province_id is required" }, { status: 400 });
      }
      
      const res = await fetch(`${API_BASE_URL}/regional/indonesia/regencies?province_code=${provinceId}`, { headers });
      if (!res.ok) throw new Error(`API returned status ${res.status}`);
      const data = await res.json();
      return Response.json(data);
    }

    if (type === "universities") {
      const search = url.searchParams.get("search") || "";
      const fetchUrl = search
        ? `${API_BASE_URL}/regional/indonesia/universities?name=${encodeURIComponent(search)}`
        : `${API_BASE_URL}/regional/indonesia/universities`;
      const res = await fetch(fetchUrl, { headers });
      if (!res.ok) throw new Error(`API returned status ${res.status}`);
      const data = await res.json();
      return Response.json(data);
    }

    return Response.json({ error: "Invalid type parameter" }, { status: 400 });
  } catch (error: any) {
    console.error("Error in regional API proxy loader:", error);
    return Response.json({ error: error.message || "Failed to fetch from remote API" }, { status: 500 });
  }
}
