// Run this to regenerate after schema changes:
// pnpm supabase gen types typescript --project-id <PROJECT_ID> > packages/db/types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      breeders: {
        Row: {
          id: string;
          slug: string;
          name: string;
          owner_user_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          owner_user_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          owner_user_id?: string | null;
          created_at?: string;
        };
      };
      site_config: {
        Row: {
          breeder_id: string;
          title: string;
          tagline: string | null;
          about_text: string | null;
          hero_video_url: string | null;
          hero_video_mobile_url: string | null;
          logo_url: string | null;
          instagram_url: string | null;
          tiktok_url: string | null;
          facebook_url: string | null;
          seo_description: string | null;
          seo_keywords: string | null;
          og_image_url: string | null;
          updated_at: string;
        };
        Insert: {
          breeder_id: string;
          title: string;
          tagline?: string | null;
          about_text?: string | null;
          hero_video_url?: string | null;
          hero_video_mobile_url?: string | null;
          logo_url?: string | null;
          instagram_url?: string | null;
          tiktok_url?: string | null;
          facebook_url?: string | null;
          seo_description?: string | null;
          seo_keywords?: string | null;
          og_image_url?: string | null;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["site_config"]["Insert"]>;
      };
      dogs: {
        Row: {
          id: string;
          breeder_id: string;
          slug: string;
          name: string;
          full_name: string | null;
          breed: string | null;
          birth_date: string | null;
          gender: "male" | "female" | null;
          description: string | null;
          cover_image_url: string | null;
          status: "active" | "retired" | "sold";
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          breeder_id: string;
          slug: string;
          name: string;
          full_name?: string | null;
          breed?: string | null;
          birth_date?: string | null;
          gender?: "male" | "female" | null;
          description?: string | null;
          cover_image_url?: string | null;
          status?: "active" | "retired" | "sold";
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["dogs"]["Insert"]>;
      };
      dog_images: {
        Row: {
          id: string;
          dog_id: string;
          url: string;
          caption: string | null;
          sort_order: number;
        };
        Insert: {
          id?: string;
          dog_id: string;
          url: string;
          caption?: string | null;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["dog_images"]["Insert"]>;
      };
      hall_of_fame: {
        Row: {
          id: string;
          breeder_id: string;
          dog_name: string;
          title: string | null;
          year: number | null;
          image_url: string | null;
          description: string | null;
          sort_order: number;
        };
        Insert: {
          id?: string;
          breeder_id: string;
          dog_name: string;
          title?: string | null;
          year?: number | null;
          image_url?: string | null;
          description?: string | null;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["hall_of_fame"]["Insert"]>;
      };
    };
  };
};

// Convenience row types
export type Breeder = Database["public"]["Tables"]["breeders"]["Row"];
export type SiteConfig = Database["public"]["Tables"]["site_config"]["Row"];
export type Dog = Database["public"]["Tables"]["dogs"]["Row"];
export type DogImage = Database["public"]["Tables"]["dog_images"]["Row"];
export type HallOfFameEntry = Database["public"]["Tables"]["hall_of_fame"]["Row"];

// Joined types used across the app
export type DogWithImages = Dog & { dog_images: DogImage[] };
export type BreederWithConfig = Breeder & { site_config: SiteConfig };
