const BASE_URL = process.env.NAMECOM_BASE_URL;
const USERNAME = process.env.NAMECOM_USERNAME;
const API_TOKEN = process.env.NAMECOM_API_TOKEN;

function getHeaders() {
  if (!USERNAME || !API_TOKEN) {
    throw new Error("NAMECOM_USERNAME or NAMECOM_API_TOKEN is not configured in environment variables.");
  }
  const auth = Buffer.from(`${USERNAME}:${API_TOKEN}`).toString("base64");
  return {
    "Authorization": `Basic ${auth}`,
    "Content-Type": "application/json",
  };
}

export interface NamecomDnsRecord {
  id: string;
  domainName: string;
  host: string;
  type: string;
  answer: string;
  ttl: number;
}

/**
 * List all DNS records for a given domain zone.
 */
export async function listDnsRecords(domain: string): Promise<NamecomDnsRecord[]> {
  const url = `${BASE_URL}/core/v1/domains/${domain}/records`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Name.com Error (${response.status}): ${text || response.statusText}`);
    }

    const data = await response.json();
    return data.records || [];
  } catch (error: any) {
    console.error("Error listing DNS records:", error);
    throw error;
  }
}

/**
 * Create a new DNS record.
 */
export async function createDnsRecord(
  domain: string,
  host: string,
  type: string,
  answer: string,
  ttl: number = 300
): Promise<NamecomDnsRecord> {
  const url = `${BASE_URL}/core/v1/domains/${domain}/records`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ host, type, answer, ttl }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Name.com Error (${response.status}): ${text || response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error creating DNS record:", error);
    throw error;
  }
}

/**
 * Update an existing DNS record.
 */
export async function updateDnsRecord(
  domain: string,
  recordId: string,
  host: string,
  type: string,
  answer: string,
  ttl: number = 300
): Promise<NamecomDnsRecord> {
  const url = `${BASE_URL}/core/v1/domains/${domain}/records/${recordId}`;
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ host, type, answer, ttl }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Name.com Error (${response.status}): ${text || response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error updating DNS record:", error);
    throw error;
  }
}

/**
 * Delete an existing DNS record.
 */
export async function deleteDnsRecord(domain: string, recordId: string): Promise<boolean> {
  const url = `${BASE_URL}/core/v1/domains/${domain}/records/${recordId}`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: getHeaders(),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Name.com Error (${response.status}): ${text || response.statusText}`);
    }

    return true;
  } catch (error: any) {
    console.error("Error deleting DNS record:", error);
    throw error;
  }
}
