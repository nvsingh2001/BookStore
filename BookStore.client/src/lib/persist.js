const AUTH_KEY = 'bookstore.auth'
const ADMIN_KEY = 'bookstore.admin'

function safeParse(json) {
  try {
    return JSON.parse(json)
  } catch {
    return null
  }
}

function safeGet(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSet(key, value) {
  try {
    if (value === null) {
      localStorage.removeItem(key)
    } else {
      localStorage.setItem(key, value)
    }
  } catch {
    // Storage unavailable (private browsing, blocked site data, etc.) - ignore.
  }
}

export function loadPersistedState() {
  const preloadedState = {}

  const auth = safeParse(safeGet(AUTH_KEY))
  if (auth?.token) {
    preloadedState.auth = { user: auth.user, token: auth.token, status: 'idle', error: null }
  }

  const admin = safeParse(safeGet(ADMIN_KEY))
  if (admin?.token) {
    preloadedState.admin = { admin: admin.admin, token: admin.token, status: 'idle', error: null }
  }

  return preloadedState
}

export function persistAuthState(store) {
  let prevAuthToken
  let prevAdminToken

  store.subscribe(() => {
    const state = store.getState()

    if (state.auth.token !== prevAuthToken) {
      prevAuthToken = state.auth.token
      safeSet(
        AUTH_KEY,
        state.auth.token ? JSON.stringify({ token: state.auth.token, user: state.auth.user }) : null,
      )
    }

    if (state.admin?.token !== prevAdminToken) {
      prevAdminToken = state.admin?.token
      safeSet(
        ADMIN_KEY,
        state.admin?.token
          ? JSON.stringify({ token: state.admin.token, admin: state.admin.admin })
          : null,
      )
    }
  })
}
