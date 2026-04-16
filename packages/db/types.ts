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
          about_breed_text: string | null;
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
          about_breed_text?: string | null;
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
      contact_messages: {
        Row: {
          id: string;
          breeder_id: string;
          contact: string;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          breeder_id: string;
          contact: string;
          message: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["contact_messages"]["Insert"]>;
      };
      puppies: {
        Row: {
          id: string;
          breeder_id: string;
          photo_url: string | null;
          gender: "male" | "female" | null;
          birth_date: string | null;
          sire: string | null;
          dam: string | null;
          status: "available" | "reserved" | "sold";
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          breeder_id: string;
          photo_url?: string | null;
          gender?: "male" | "female" | null;
          birth_date?: string | null;
          sire?: string | null;
          dam?: string | null;
          status?: "available" | "reserved" | "sold";
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["puppies"]["Insert"]>;
      };
      puppy_images: {
        Row: {
          id: string;
          puppy_id: string;
          url: string;
          sort_order: number;
        };
        Insert: {
          id?: string;
          puppy_id: string;
          url: string;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["puppy_images"]["Insert"]>;
      };
      hof_images: {
        Row: {
          id: string;
          hof_id: string;
          url: string;
          sort_order: number;
        };
        Insert: {
          id?: string;
          hof_id: string;
          url: string;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["hof_images"]["Insert"]>;
      };
      blog_posts: {
        Row: {
          id: string;
          breeder_id: string;
          slug: string;
          title: string;
          excerpt: string | null;
          content: string | null;
          cover_image_url: string | null;
          published: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          breeder_id: string;
          slug: string;
          title: string;
          excerpt?: string | null;
          content?: string | null;
          cover_image_url?: string | null;
          published?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["blog_posts"]["Insert"]>;
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
export type ContactMessage = Database["public"]["Tables"]["contact_messages"]["Row"];
export type Puppy = Database["public"]["Tables"]["puppies"]["Row"];
export type PuppyImage = Database["public"]["Tables"]["puppy_images"]["Row"];
export type HofImage = Database["public"]["Tables"]["hof_images"]["Row"];
export type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];

export type PuppyWithImages = Puppy & { puppy_images: PuppyImage[] };
export type HofEntryWithImages = HallOfFameEntry & { hof_images: HofImage[] };

// Joined types used across the app
export type DogWithImages = Dog & { dog_images: DogImage[] };
export type BreederWithConfig = Breeder & { site_config: SiteConfig };
