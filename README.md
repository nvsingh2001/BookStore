# BookStore

A full-stack bookstore application: an ASP.NET Core Web API backend and a React frontend.

## Project structure

- `BookStore.Api` — the ASP.NET Core Web API host: controllers, middleware, DI wiring, Redis/RabbitMQ/SMTP infrastructure.
- `BookStore.BusinessLogic` — services, DTOs' business rules, and the interfaces `Api` depends on.
- `BookStore.DataAccess` — EF Core `DbContext`, repositories, and migrations.
- `BookStore.DomainModel` — entities, DTOs, and enums shared across the other backend projects.
- `BookStore.client` — the React frontend (Webpack + Babel), talking to the API over HTTP.

## Frontend features

- **Customer-facing**: browsing/search, cart, wishlist, checkout, order history, and profile, all backed by Redux Toolkit slices (`authSlice`, `cartSlice`, `wishlistSlice`) under `src/features`.
- **Admin UI** (`src/routes/admin`, guarded by `withAdminAuth`): login, product catalog CRUD with image upload, and creating additional admin accounts.
- Both customer and admin sessions persist their token to `localStorage` (`src/lib/persist.js`) so a page reload doesn't log the user out.

## Running locally

Copy `.env.example` to `.env` and fill in real values, then bring up the backend's dependencies:

```
docker compose up mssql redis rabbitmq mailpit
```

Run `BookStore.Api` from your IDE (or `dotnet run`) pointed at `localhost` for each dependency via `appsettings.Development.json`/user-secrets. Mailpit's web UI is at `localhost:8025`; RabbitMQ's management UI is at `localhost:15672`.

For the frontend, from `BookStore.client`:

```
npm install
npm run dev
```

To run the whole stack containerized instead, `docker compose up` builds and starts `BookStore.Api` itself alongside its dependencies.
