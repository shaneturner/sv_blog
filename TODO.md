# sv-blog Project Roadmap & TODO List

This document tracks completed tasks, upcoming features, and the active roadmap for the `sv-blog` project.

---

## Phase 1: Core Architecture & Setup (Completed)

- [x] **Local Multi-Container Stack:** Configure [compose.yaml](file:///home/shane/code/sv_blog/compose.yaml) to orchestrate PostgreSQL, Node/SvelteKit, and a reverse proxy.
- [x] **Caddy Reverse Proxy:** Define [Caddyfile](file:///home/shane/code/sv_blog/Caddyfile) to host the application at `http://blog.localhost` with WebSocket (HMR) capabilities.
- [x] **Rootless Podman Support:** Configure user namespace socket mapping and sysctl instructions for binding to ports 80/443.
- [x] **SELinux Compatibility:** Apply `:z` flags to directory mounts to avoid permission blocks on Fedora.
- [x] **Authentication Core:** Initialize Better Auth backend configuration in [auth.ts](file:///home/shane/code/sv_blog/src/lib/auth.ts) and client utility in [auth-client.ts](file:///home/shane/code/sv_blog/src/lib/auth-client.ts).
- [x] **Database Initialization:** Run the first Drizzle schema push to establish core user and session tables.

---

## Phase 2: Authentication Flow (Next Up)

- [ ] **Signup Page:** Implement user registration form in [signup/+page.svelte](file:///home/shane/code/sv_blog/src/routes/auth/signup/+page.svelte) using Svelte 5 runes and `authClient.signUp.email()`.
- [ ] **Signin Page:** Implement login form in [signin/+page.svelte](file:///home/shane/code/sv_blog/src/routes/auth/signin/+page.svelte).
- [ ] **Route Guaging:** Restrict access to CMS pages for unauthenticated users, redirecting them to the login flow.

---

## Phase 3: Database & Blog Schema

- [ ] **Define Posts Schema:** Create the `post` table structure in [schema.ts](file:///home/shane/code/sv_blog/src/lib/server/db/schema.ts) with fields:
  - `id` (text, primary key)
  - `title` (text)
  - `slug` (text, unique)
  - `content` (text)
  - `published` (boolean, default false)
  - `authorId` (references `user.id` with cascade on delete)
  - `createdAt` & `updatedAt` (timestamps)
- [ ] **Establish Relations:** Connect users to their written posts.
- [ ] **Apply Schema:** Sync tables using `podman compose run --rm web npm run db:push`.

---

## Phase 4: CMS / Admin Dashboard

- [ ] **Create Post UI:** Build a writing form at `/admin/new` utilizing a markdown or rich text field.
- [ ] **Posts Dashboard:** Add a workspace at `/admin` listing all posts, with toggle states to publish/unpublish or delete.
- [ ] **Permissions Gate:** Ensure only authenticated users (or those with the `admin` role) can access the `/admin` workspace.

---

## Phase 5: Public Blog Interface

- [ ] **Index Blog Feed:** Update [+page.svelte](file:///home/shane/code/sv_blog/src/routes/+page.svelte) to fetch all published posts from Drizzle and render them.
- [ ] **Dynamic Post Reading:** Build a route `/posts/[slug]` loading the requested post by slug and converting content to HTML.
- [ ] **Styling Overhaul:** Polish forms, dashboard, and reader views using `@drop-in/graffiti` styles.
