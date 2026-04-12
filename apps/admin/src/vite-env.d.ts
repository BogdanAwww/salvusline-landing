/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_GH_PAT: string;
  readonly VITE_GH_OWNER: string;
  readonly VITE_GH_REPO: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
