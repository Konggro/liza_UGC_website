-- Key-value table used by the make-server-675548e5 edge function
-- (collaborations, reviews, videos, contact submissions).
create table if not exists public.kv_store_675548e5 (
  key text not null primary key,
  value jsonb not null
);

-- Only the edge function (service role) may touch this table.
-- RLS on with no policies blocks direct access via the public anon key.
alter table public.kv_store_675548e5 enable row level security;
