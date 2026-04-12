import { createServerClient } from "@salvus/db";
import type { BreederWithConfig, DogWithImages, HallOfFameEntry } from "@salvus/db";

const BREEDER_SLUG = process.env.BREEDER_SLUG ?? "salvusline";

export interface BreederData {
  breeder: BreederWithConfig;
  dogs: DogWithImages[];
  hallOfFame: HallOfFameEntry[];
}

export async function getBreederData(): Promise<BreederData | null> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Return null if env vars not configured — pages fall back to static content
  if (!supabaseUrl || !supabaseKey) {
    console.warn(
      `[breeder] SUPABASE env vars not set — using static fallback for "${BREEDER_SLUG}"`
    );
    return null;
  }

  const db = createServerClient();

  // Fetch breeder row (cast to any first to avoid Supabase join type inference issues
  // with manually-written Database types — the runtime shape is correct)
  const { data: breederRaw, error: breederError } = await db
    .from("breeders")
    .select("*, site_config(*)")
    .eq("slug", BREEDER_SLUG)
    .single();

  if (breederError || !breederRaw) {
    console.error("[breeder] Failed to fetch breeder:", breederError?.message);
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const breeder = breederRaw as any as BreederWithConfig;

  const { data: dogsRaw } = await db
    .from("dogs")
    .select("*, dog_images(*)")
    .eq("breeder_id", breeder.id)
    .order("sort_order");

  const { data: hallOfFame } = await db
    .from("hall_of_fame")
    .select("*")
    .eq("breeder_id", breeder.id)
    .order("sort_order");

  return {
    breeder,
    dogs: (dogsRaw ?? []) as DogWithImages[],
    hallOfFame: hallOfFame ?? [],
  };
}
