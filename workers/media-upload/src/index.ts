export interface Env {
  MEDIA: R2Bucket;
  SUPABASE_URL: string;       // e.g. "https://xxxx.supabase.co"
  SUPABASE_ANON_KEY: string;  // public anon key — used to call Supabase auth API
  PUBLIC_URL: string;          // e.g. "https://media.salvusline.com"
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

/** Verify the Supabase JWT by calling Supabase's auth endpoint */
async function verifySupabaseToken(token: string, env: Env): Promise<boolean> {
  const res = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: env.SUPABASE_ANON_KEY,
    },
  });
  return res.ok;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    // GET — serve files publicly (CDN-cached)
    if (request.method === "GET") {
      const key = url.pathname.slice(1); // strip leading /
      if (!key) return new Response("Not found", { status: 404 });

      const object = await env.MEDIA.get(key);
      if (!object) return new Response("Not found", { status: 404 });

      return new Response(object.body, {
        headers: {
          "Content-Type": object.httpMetadata?.contentType ?? "application/octet-stream",
          "Cache-Control": "public, max-age=31536000, immutable",
          ...CORS_HEADERS,
        },
      });
    }

    // PUT — upload (requires valid Supabase session)
    if (request.method === "PUT") {
      const auth = request.headers.get("Authorization");
      const token = auth?.replace("Bearer ", "");
      if (!token || !(await verifySupabaseToken(token, env))) {
        return new Response("Unauthorized", { status: 401, headers: CORS_HEADERS });
      }

      const key = url.pathname.slice(1);
      if (!key) {
        return new Response("Missing file path", { status: 400, headers: CORS_HEADERS });
      }

      const contentType = request.headers.get("Content-Type") ?? "application/octet-stream";
      const body = await request.arrayBuffer();

      await env.MEDIA.put(key, body, {
        httpMetadata: { contentType },
      });

      const publicUrl = `${env.PUBLIC_URL.replace(/\/$/, "")}/${key}`;

      return new Response(JSON.stringify({ url: publicUrl }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      });
    }

    return new Response("Method not allowed", { status: 405, headers: CORS_HEADERS });
  },
};
