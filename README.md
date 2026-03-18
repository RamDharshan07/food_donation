## Food Donation Platform (MERN) — Map Demo

This repo includes a working **map-based demo** of a food donation platform:

- **Restaurants** create surplus food listings (with expiry + location)
- **NGO** sees nearby listings on a map + distance
- **Claim system** locks a listing when claimed
- **Expiry** auto-removes/marks expired listings

### Run (demo mode, no Mongo required)

Backend (runs in mock-data mode if `MONGO_URI` is not set):

```bash
cd server
npm run dev
```

Frontend:

```bash
cd client
npm run dev
```

Open `http://localhost:5173/`.

### Env (optional)

- **Client**: copy `client/.env.example` → `client/.env` (set `VITE_API_URL` if backend port differs)
- **Server**: copy `server/.env.example` → `server/.env` (set `MONGO_URI` to enable Mongo mode)

### JWT Auth setup (required for login/register)

1) Create `server/.env` and set `JWT_SECRET`.

**Generate a strong JWT secret on Windows (PowerShell):**

```powershell
# 64 random bytes -> base64 string
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Max 256 }))
```

Copy the output and set:

```env
JWT_SECRET=PASTE_THE_GENERATED_VALUE_HERE
JWT_EXPIRES_IN=7d
```

2) Restart the server after updating `.env`.

### Auth API (backend)

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (requires `Authorization: Bearer <token>`)

### API (backend)

- `GET /health`
- `GET /api/listings?nearLat=..&nearLng=..&radiusKm=..`
- `POST /api/listings`
- `POST /api/claims`
- `POST /api/claims/:claimId/complete`

