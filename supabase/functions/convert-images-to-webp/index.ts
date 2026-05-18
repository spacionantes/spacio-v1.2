// Edge function: convert all images in `listing-photos` bucket to WebP (q=80),
// upload alongside originals, and update DB references. Originals are KEPT.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { decode as decodeJpeg } from "https://esm.sh/@jsquash/jpeg@1.5.0?bundle";
import { decode as decodePng } from "https://esm.sh/@jsquash/png@3.1.1?bundle";
import { encode as encodeWebp } from "https://esm.sh/@jsquash/webp@1.4.0?bundle";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const BUCKET = "listing-photos";
const QUALITY = 80;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

async function listAll(prefix = ""): Promise<string[]> {
  const out: string[] = [];
  const { data, error } = await supabase.storage.from(BUCKET).list(prefix, { limit: 1000 });
  if (error) throw error;
  for (const item of data ?? []) {
    const path = prefix ? `${prefix}/${item.name}` : item.name;
    if (item.id === null) {
      // folder
      out.push(...(await listAll(path)));
    } else {
      out.push(path);
    }
  }
  return out;
}

function publicUrl(path: string) {
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

async function convertOne(path: string) {
  const ext = path.split(".").pop()?.toLowerCase();
  if (!ext || !["jpg", "jpeg", "png"].includes(ext)) return { path, skipped: "not-jpeg-png" };
  const webpPath = path.replace(/\.(jpe?g|png)$/i, ".webp");

  // Skip if .webp already exists
  const { data: existing } = await supabase.storage.from(BUCKET).list(
    webpPath.includes("/") ? webpPath.substring(0, webpPath.lastIndexOf("/")) : "",
    { search: webpPath.split("/").pop() }
  );
  if (existing?.some((f) => (webpPath.includes("/") ? f.name === webpPath.split("/").pop() : f.name === webpPath))) {
    // still update DB references
    await updateDbRefs(path, webpPath);
    return { path, status: "already-webp", webpPath };
  }

  const { data: blob, error: dlErr } = await supabase.storage.from(BUCKET).download(path);
  if (dlErr || !blob) return { path, error: dlErr?.message ?? "download failed" };
  const buf = await blob.arrayBuffer();

  let imageData;
  try {
    imageData = ext === "png" ? await decodePng(buf) : await decodeJpeg(buf);
  } catch (e) {
    return { path, error: `decode: ${(e as Error).message}` };
  }

  const webpBuf = await encodeWebp(imageData, { quality: QUALITY });

  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(webpPath, webpBuf, { contentType: "image/webp", upsert: true });
  if (upErr) return { path, error: `upload: ${upErr.message}` };

  await updateDbRefs(path, webpPath);

  return {
    path,
    webpPath,
    originalBytes: buf.byteLength,
    webpBytes: webpBuf.byteLength,
    saved: `${Math.round((1 - webpBuf.byteLength / buf.byteLength) * 100)}%`,
  };
}

async function updateDbRefs(oldPath: string, newPath: string) {
  const oldUrl = publicUrl(oldPath);
  const newUrl = publicUrl(newPath);
  // Encoded URL stored in DB may use %20 etc — match by encoded form
  const oldEncoded = oldUrl;
  await supabase.from("listing_images").update({ image_url: newUrl }).eq("image_url", oldEncoded);
  await supabase.from("listings").update({ image_url: newUrl }).eq("image_url", oldEncoded);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const files = await listAll("");
    const results = [];
    for (const f of files) {
      try {
        results.push(await convertOne(f));
      } catch (e) {
        results.push({ path: f, error: (e as Error).message });
      }
    }
    const converted = results.filter((r: any) => r.webpBytes);
    const totalOriginal = converted.reduce((s: number, r: any) => s + r.originalBytes, 0);
    const totalWebp = converted.reduce((s: number, r: any) => s + r.webpBytes, 0);
    return new Response(
      JSON.stringify({
        total: files.length,
        converted: converted.length,
        skipped: results.length - converted.length,
        totalOriginalKB: Math.round(totalOriginal / 1024),
        totalWebpKB: Math.round(totalWebp / 1024),
        savedKB: Math.round((totalOriginal - totalWebp) / 1024),
        results,
      }, null, 2),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
