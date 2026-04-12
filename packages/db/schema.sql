-- Breeders (one row per tenant)
create table breeders (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  owner_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

-- Site-level config (one row per breeder)
create table site_config (
  breeder_id uuid primary key references breeders(id) on delete cascade,
  title text not null,
  tagline text,
  about_text text,
  about_breed_text text,
  hero_video_url text,
  hero_video_mobile_url text,
  logo_url text,
  instagram_url text,
  tiktok_url text,
  facebook_url text,
  seo_description text,
  seo_keywords text,
  og_image_url text,
  updated_at timestamptz default now()
);

-- Dogs
create table dogs (
  id uuid primary key default gen_random_uuid(),
  breeder_id uuid not null references breeders(id) on delete cascade,
  slug text not null,
  name text not null,
  full_name text,
  breed text,
  birth_date date,
  gender text check (gender in ('male', 'female')),
  description text,
  cover_image_url text,
  status text default 'active' check (status in ('active', 'retired', 'sold')),
  sort_order int default 0,
  created_at timestamptz default now(),
  unique(breeder_id, slug)
);

-- Per-dog photo gallery
create table dog_images (
  id uuid primary key default gen_random_uuid(),
  dog_id uuid not null references dogs(id) on delete cascade,
  url text not null,
  caption text,
  sort_order int default 0
);

-- Hall of Fame
create table hall_of_fame (
  id uuid primary key default gen_random_uuid(),
  breeder_id uuid not null references breeders(id) on delete cascade,
  dog_name text not null,
  title text,
  year int,
  image_url text,
  description text,
  sort_order int default 0
);

-- Available Puppies
create table puppies (
  id uuid primary key default gen_random_uuid(),
  breeder_id uuid not null references breeders(id) on delete cascade,
  photo_url text,
  gender text check (gender in ('male', 'female')),
  birth_date date,
  sire text,
  dam text,
  status text default 'available' check (status in ('available', 'reserved', 'sold')),
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Contact form submissions
create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  breeder_id uuid not null references breeders(id) on delete cascade,
  contact text not null,
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- Per-puppy photo gallery
create table puppy_images (
  id uuid primary key default gen_random_uuid(),
  puppy_id uuid not null references puppies(id) on delete cascade,
  url text not null,
  sort_order int default 0
);

-- Per-hof-entry photo gallery
create table hof_images (
  id uuid primary key default gen_random_uuid(),
  hof_id uuid not null references hall_of_fame(id) on delete cascade,
  url text not null,
  sort_order int default 0
);

-- ─── Row Level Security ───────────────────────────────────────────────────────

alter table breeders enable row level security;
alter table site_config enable row level security;
alter table dogs enable row level security;
alter table dog_images enable row level security;
alter table hall_of_fame enable row level security;
alter table contact_messages enable row level security;
alter table puppies enable row level security;
alter table puppy_images enable row level security;
alter table hof_images enable row level security;

-- Public read (used at SSG build time via service role, but readable for safety)
create policy "public read breeders"     on breeders     for select using (true);
create policy "public read site_config"  on site_config  for select using (true);
create policy "public read dogs"         on dogs         for select using (true);
create policy "public read dog_images"   on dog_images   for select using (true);
create policy "public read hall_of_fame" on hall_of_fame for select using (true);
-- Anyone can submit a contact message (anon insert), only owner can read/update
create policy "public insert contact_messages" on contact_messages
  for insert with check (breeder_id in (select id from breeders));

create policy "owner manages contact_messages" on contact_messages
  for all using (
    breeder_id in (select id from breeders where owner_user_id = auth.uid())
  );

create policy "public read puppies"      on puppies      for select using (true);
create policy "public read puppy_images" on puppy_images for select using (true);
create policy "public read hof_images"   on hof_images   for select using (true);

-- Owner manages their own data
create policy "owner manages breeders" on breeders
  for all using (auth.uid() = owner_user_id);

create policy "owner manages site_config" on site_config
  for all using (
    breeder_id in (select id from breeders where owner_user_id = auth.uid())
  );

create policy "owner manages dogs" on dogs
  for all using (
    breeder_id in (select id from breeders where owner_user_id = auth.uid())
  );

create policy "owner manages dog_images" on dog_images
  for all using (
    dog_id in (
      select id from dogs
      where breeder_id in (select id from breeders where owner_user_id = auth.uid())
    )
  );

create policy "owner manages hall_of_fame" on hall_of_fame
  for all using (
    breeder_id in (select id from breeders where owner_user_id = auth.uid())
  );

create policy "owner manages puppies" on puppies
  for all using (
    breeder_id in (select id from breeders where owner_user_id = auth.uid())
  );

create policy "owner manages puppy_images" on puppy_images
  for all using (
    puppy_id in (
      select id from puppies
      where breeder_id in (select id from breeders where owner_user_id = auth.uid())
    )
  );

create policy "owner manages hof_images" on hof_images
  for all using (
    hof_id in (
      select id from hall_of_fame
      where breeder_id in (select id from breeders where owner_user_id = auth.uid())
    )
  );
