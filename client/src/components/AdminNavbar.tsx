import { useAuth } from '../auth/AuthContext'

export function AdminNavbar() {
  const { user, logout } = useAuth()
  const letter = user?.email?.trim()?.[0]?.toUpperCase() || null

  return (
    <div className="border-b border-slate-800 bg-slate-950/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/15 ring-1 ring-emerald-400/40">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5 text-emerald-300"
            >
              <path
                fill="currentColor"
                d="M4 6.5C4 5.12 5.12 4 6.5 4h11a1 1 0 0 1 .8 1.6L17 8l1.3 2.4A1 1 0 0 1 17.4 12H6.5A2.5 2.5 0 0 1 4 9.5Zm2.5 7.5A2.5 2.5 0 0 0 4 16.5v.25A2.25 2.25 0 0 0 6.25 19h11.5A2.25 2.25 0 0 0 20 16.75V16.5A2.5 2.5 0 0 0 17.5 14Z"
              />
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight text-slate-100">
              Food Donation — Admin
            </div>
            <div className="text-xs text-slate-400">Post surplus food from restaurants</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <div
                title={user.email}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-extrabold text-slate-950"
              >
                {letter}
              </div>
              <button
                onClick={logout}
                className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-700"
                type="button"
              >
                Logout
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

