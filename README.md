# sv-blog (Work In Progress)

A modern, containerized, and fully type-safe blog application template built with **Svelte 5**, **SvelteKit**, and **Better Auth**, designed to run completely inside local containers. 

> [!WARNING]
> This repository is a public GitHub repository and is currently a **Work In Progress (WIP)**. Features are actively being developed and the structure is subject to change.

---

## Tech Stack & Architecture

* **Frontend:** [Svelte 5](https://svelte.dev/) (utilizing experimental runes & top-level async) and [SvelteKit](https://svelte.dev/docs/kit).
* **Database & ORM:** [PostgreSQL](https://www.postgresql.org/) managed by [Drizzle ORM](https://orm.drizzle.team/) for schema-first migrations and type safety.
* **Authentication:** [Better Auth](https://www.better-auth.com/) (Email & Password, Svelte client integration, Admin & Session management plugins).
* **Styling:** [@drop-in/graffiti](https://github.com/vertex-cl/graffiti) — A minimalist, standards-based, utility-free CSS toolkit mapping styling onto semantic HTML5 tags.
* **Reverse Proxy:** [Caddy](https://caddyserver.com/) container configured to map incoming local traffic to `http://blog.localhost` with WebSocket support for hot-reloading (Vite HMR).
* **Local Development Environment:** Containerized using **Podman / Docker Compose** (enabling rootless, daemon-less development without needing Node.js or Postgres installed on the host machine).

---

## Local Development Setup

This project is optimized to run inside containers using **Podman** (with standard rootless user namespaces on Fedora/Linux) or **Docker**.

### Prerequisites
Make sure you have Podman (or Docker) and its compose plugin installed. On Fedora:
```bash
sudo dnf install podman docker-compose-plugin
```

If you are using rootless Podman, make sure the user API socket is enabled:
```bash
systemctl --user enable --now podman.socket
```
To allow the Caddy container to bind to port 80/443 without root/sudo privileges:
```bash
sudo sysctl net.ipv4.ip_unprivileged_port_start=80
echo "net.ipv4.ip_unprivileged_port_start=80" | sudo tee /etc/sysctl.d/50-unprivileged-ports.conf
```

### 1. Configure the Environment
Create your local environment file:
```bash
cp .env.example .env
```
*(The environment file contains the local database connection credentials and a secret for Better Auth. SvelteKit will automatically read these inside the container).*

### 2. Start the Application Stack
Download images, install node dependencies, and boot all services (PostgreSQL, SvelteKit, Caddy) in the background:
```bash
podman compose up -d
```
*(Use `docker compose up -d` if using Docker).*

### 3. Initialize the Database Schema
Push the authentication and database schema (declaring `user`, `session`, `account`, and `verification` tables) into the local PostgreSQL instance:
```bash
podman compose run --rm web sh -c "npm install && npm run db:push -- --force"
```

### 4. Access the Site
Open your browser and navigate to:
```text
http://blog.localhost
```
Fedora's system resolver (`systemd-resolved`) automatically resolves any `*.localhost` domains to `127.0.0.1`, which will be intercepted by Caddy and reverse-proxied to SvelteKit.

---

## Project Structure

```text
.
├── .agents/                 # Workspace agent rules and instructions
├── src/
│   ├── lib/
│   │   ├── auth.ts          # Better Auth backend server configurations
│   │   ├── auth-client.ts   # Better Auth frontend client configurations
│   │   └── server/db/
│   │       ├── index.ts     # Drizzle client constructor
│   │       └── schema.ts    # Database schema rules
│   └── routes/
│       ├── +layout.svelte   # Main page wrapper (imports styling sheets)
│       ├── +page.svelte     # Public landing index page
│       ├── api/auth/        # Better Auth API backend catch-all endpoint
│       └── auth/signup/     # Account registration page
├── compose.yaml             # Multi-container orchestrator configuration
├── Caddyfile                # Caddy reverse proxy routing instructions
└── drizzle.config.ts        # Database migration builder configurations
```

---

## Roadmap & TODOs

For a detailed breakdown of completed setup tasks, upcoming authentication features, schema designs, and CMS progress, please see the dedicated [TODO.md](TODO.md) roadmap file.
