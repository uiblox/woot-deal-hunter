# Woot Deals

Spring Boot backend (proxies the Woot developer API) + React/MUI frontend using TanStack Query.

## Run
1. Request a Woot API key (https://developer.woot.com).
2. Backend: `cd backend && WOOT_API_KEY=your_key mvn spring-boot:run` (port 8080)
3. Frontend: `cd frontend && npm install && npm run dev` (port 5173, proxies `/api` to 8080)

## Endpoints
- `GET /api/feed/{feed}?page=n` → Woot `GET /feed/{feed}`
- `POST /api/offers` (JSON array of up to 25 offer IDs) → Woot `POST /getoffers`

Responses are cached 60s server-side; Woot allows 1,000 requests/day.
