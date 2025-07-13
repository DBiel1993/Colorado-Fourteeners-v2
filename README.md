# Colorado Fourteeners

> A community-driven web application for exploring Colorado’s mountains, sharing rides and gear, and connecting with fellow outdoor enthusiasts—powered by Next.js, Azure services, Mapbox, and AI.

---

## Table of Contents

1. [Features](#features)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)

   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Environment Variables](#environment-variables)
   - [Running Locally](#running-locally)

5. [Deployment](#deployment)
6. [Contributing](#contributing)
7. [License](#license)

---

## Features

- **Trail Explorer**: Interactive Mapbox map with PostGIS-powered geo-queries.
- **User-Submitted Edits**: Suggest updates to trail data—queued for moderator approval.
- **Ride Share & Gear Share**: Post and browse ride offers and gear loans.
- **Community Forum**: Create threads and posts with realtime updates via Azure SignalR.
- **Local Markets**: Discover mountain-region shops, guides, and services.
- **AI Enhancements**:

  - Semantic search (“find easy sunset loops near Denver”).
  - “TrailBot” chatbot powered by Azure OpenAI.
  - Auto-moderation & summarization of long trip reports.

- **Secure Auth & Permissions**: Azure AD B2C for signup, login, and role-based access.

---

## Architecture

```mermaid
graph LR
  User["End User"]
  Frontend["Next.js Web App\n(hosted on Vercel)"]
  API["Server Actions / Azure Functions"]
  Auth["Azure AD B2C"]
  DB["Azure Database for PostgreSQL\n(+ PostGIS)"]
  Storage["Azure Blob Storage"]
  Realtime["Azure SignalR Service"]
  AI["Azure OpenAI / Cognitive Services"]
  Search["Azure Cognitive Search"]
  Maps["Mapbox GL JS"]

  User -->|browse & submit| Frontend
  Frontend -->|XHR / Server Actions| API
  API --> Auth
  API --> DB
  API --> Storage
  API --> Realtime
  API --> AI
  API --> Search
  Frontend --> Maps
```

---

## Tech Stack

| Layer               | Technology / Service                      |
| ------------------- | ----------------------------------------- |
| **Frontend**        | Next.js (App Router), TypeScript, React   |
| **Styling/UI**      | Tailwind CSS, shadcn/ui                   |
| **Hosting & CI/CD** | Vercel + GitHub Actions                   |
| **Auth**            | Azure AD B2C                              |
| **Database**        | Azure Database for PostgreSQL (+ PostGIS) |
| **Storage**         | Azure Blob Storage                        |
| **Realtime**        | Azure SignalR Service                     |
| **Search & AI**     | Azure Cognitive Search, Azure OpenAI      |
| **Maps & Geo**      | Mapbox GL JS, Turf.js                     |
| **Monitoring**      | Azure Monitor & Application Insights      |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- Git
- An Azure account with:

  - Azure AD B2C tenant
  - Azure Database for PostgreSQL instance (+ PostGIS)
  - Azure Blob Storage account
  - Azure SignalR Service instance
  - Azure Cognitive Search service
  - Azure OpenAI deployment

### Installation

1. **Clone the repo**

   ```bash
   git clone https://github.com/your-org/colorado-fourteeners.git
   cd colorado-fourteeners
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

### Environment Variables

Create a `.env.local` file at the project root and fill in:

```dotenv
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token
AZURE_AD_B2C_TENANT=your-tenant-name
AZURE_AD_B2C_CLIENT_ID=your-client-id
AZURE_AD_B2C_CLIENT_SECRET=your-client-secret
DATABASE_URL=postgresql://user:pass@host:5432/dbname
AZURE_BLOB_CONNECTION_STRING=your-blob-conn-string
SIGNALR_CONNECTION_STRING=your-signalr-conn-string
COGNITIVE_SEARCH_ENDPOINT=https://your-search.search.windows.net
COGNITIVE_SEARCH_API_KEY=your-search-api-key
AZURE_OPENAI_ENDPOINT=https://your-openai.openai.azure.com
AZURE_OPENAI_API_KEY=your-openai-api-key
```

### Running Locally

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view in your browser.

---

## Deployment

1. **Push** to `main` on GitHub → triggers GitHub Actions.
2. **Vercel** automatically deploys from `main` to production.
3. **Preview Deploys** available for every PR branch.
4. Ensure all Azure secrets are configured in Vercel’s Environment Variables.

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit your changes: `git commit -m "chore: add awesome feature"`.
4. Push to your fork and open a Pull Request.
5. Ensure CI passes and reviewers sign off.

Please follow our [Code of Conduct](CODE_OF_CONDUCT.md) and [Contributing Guidelines](CONTRIBUTING.md).

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
