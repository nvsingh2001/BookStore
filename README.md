# BookStore

## Branch strategy

- `main` — production branch. Stays minimal; only receives merges from `dev` when it's ready to ship.
- `dev` — integration branch. Backend and frontend work merges here first, and `main` is only ever updated from `dev`.
- `backend` — the ASP.NET Core solution (`BookStore`, `BookStore.BusinessLogic`, `BookStore.DataAccess`, `BookStore.DomainModel`), branched from `dev`.
- `frontend` — the React client (`BookStore.client`), branched from `dev`.

Feature work branches off `backend`/`frontend` (or `dev`, for cross-cutting changes) and merges back before eventually flowing up to `main`.
