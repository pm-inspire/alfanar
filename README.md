# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## AI-Powered Semantic Search (Arabic RTL) – Added in this repo

This repo originally had **no backend** (no Laravel/PHP). To implement secure AI search (so the OpenAI key never goes to the browser), this branch adds a small **Node/Express API** under `server/` and connects the React UI to it via Vite proxy.

### What it does

- **Understands Arabic intent** for auto-parts queries:
  - Part numbers (e.g. `TY-BRK-7788`)
  - Vehicle brand/model/year (e.g. "ماء رديتر ميتسوبيشي ازرق 2015")
  - Descriptive queries + typo tolerance for common brands (e.g. "متسوبيشي" → Mitsubishi)
- **Hybrid search**:
  - Keyword + part-number matching (fast + deterministic)
  - Optional semantic vector similarity (OpenAI embeddings) for better recall
  - Filter-aware ranking (brand/year/section/in-stock)
- **Alternatives**: suggests 3–5 similar/compatible parts from same sections.
- **RTL-ready**: UI is Arabic/RTL with autocomplete + results page.

### Run locally

1) Install dependencies:

```sh
npm i
```

2) Create env file:

```sh
cp .env.example .env
```

3) Set:

- `OPENAI_API_KEY` (required for semantic search / embeddings)
- `ADMIN_TOKEN` (required for `/api/admin/*`)

4) Start UI + API together:

```sh
npm run dev
```

- UI: `http://localhost:8080/alfanar/`
- API: `http://localhost:8787/api/health`

### Generate embeddings (demo dataset)

This repo ships with a small demo catalog in `server/data/products.sample.json`.

Generate embeddings for it:

```sh
npm run ai:embed:sample
```

### API usage

Search:

```sh
curl -s http://localhost:8787/api/ai-search \
  -H 'content-type: application/json' \
  -d '{"query":"ماء رديتر ميتسوبيشي ازرق 2015","filters":{"in_stock":true}}'
```

Admin config (requires token):

```sh
curl -s http://localhost:8787/api/admin/ai-search/config \
  -H 'x-admin-token: YOUR_TOKEN'
```

### UI routes added

- `GET /alfanar/search?q=...` – results page
- `GET /alfanar/admin/ai-search` – admin page (enter `ADMIN_TOKEN`)

### Test queries (Arabic + typos)

Try these in the header search bar:

- "ماء رديتر ميتسوبيشي ازرق"
- "ماء radiator ميتسوبيشي 2015"
- "قطع غيار تويوتا 2010 فرامل"
- "فحمات تويتا كورولا 2010" (typo)
- "TY-BRK-7788" (part number)

### Production notes (MySQL / real catalog)

This repo includes a MySQL migration template:

- `server/migrations/mysql/001_add_ai_search_columns.sql`

Recommended production approach:

- Store `compatibility` as JSON and embeddings as `embedding_json` (array of floats).
- Generate embeddings in a **queue worker** (batch + retries + rate limiting).
- Keep keyword indexes on `brand`, `year`, `section_main`, `section_sub`, and `part_number`.
- Put the Node API behind your reverse proxy (or re-implement the same engine in Laravel if desired).

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
