create table if not exists codex_coach_projects (
  id text primary key,
  title text not null,
  tag text not null,
  owner_user_id text not null,
  status text not null default 'active',
  estimated_optimistic_credits integer not null,
  estimated_expected_credits integer not null,
  estimated_heavy_credits integer not null,
  selected_model_class text not null,
  created_at text not null default current_timestamp,
  updated_at text not null default current_timestamp
);

create table if not exists codex_coach_sessions (
  id text primary key,
  project_id text not null references codex_coach_projects(id),
  thread_id text,
  started_at text not null default current_timestamp,
  last_active_at text not null default current_timestamp,
  model text,
  reasoning_level text,
  input_tokens integer not null default 0,
  output_tokens integer not null default 0,
  cached_input_tokens integer not null default 0,
  estimated_credits integer not null default 0,
  actual_credits integer
);

create table if not exists codex_coach_usage_events (
  id text primary key,
  user_id text not null,
  project_id text references codex_coach_projects(id),
  session_id text references codex_coach_sessions(id),
  thread_id text,
  hook_event text not null,
  model text,
  reasoning_level text,
  input_tokens integer not null default 0,
  output_tokens integer not null default 0,
  cached_input_tokens integer not null default 0,
  estimated_credits integer,
  actual_credits integer,
  dedupe_key text not null unique,
  created_at text not null default current_timestamp
);

create table if not exists codex_coach_weekly_rollups (
  week_id text not null,
  user_id text not null,
  used_credits integer not null default 0,
  remaining_credits integer not null,
  projected_end_of_week_burn integer,
  coaching_state text not null,
  updated_at text not null default current_timestamp,
  primary key (week_id, user_id)
);
