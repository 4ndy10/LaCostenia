// ponytail: native sessionStorage + beforeunload purge covers LFPDPPP ephemeral privacy with zero state library

const SESSION_KEY = 'lc_v2_ephemeral_session';
export const DEFAULT_AUTH_STATUS = 'Usuario no registrado';

function getStorage() {
  try {
    return typeof window !== 'undefined' && window.sessionStorage ? window.sessionStorage : null;
  } catch {
    return null;
  }
}

export function readSessionState() {
  const store = getStorage();
  if (!store) {
    return { status: DEFAULT_AUTH_STATUS, favorites: [], chatHistory: [] };
  }
  try {
    const raw = store.getItem(SESSION_KEY);
    if (!raw) {
      const initial = { status: DEFAULT_AUTH_STATUS, favorites: [], chatHistory: [] };
      store.setItem(SESSION_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return { status: DEFAULT_AUTH_STATUS, favorites: [], chatHistory: [] };
  }
}

function writeSessionState(nextState) {
  const store = getStorage();
  if (!store) return nextState;
  try {
    store.setItem(SESSION_KEY, JSON.stringify(nextState));
  } catch {
    // Quota or private mode fallback
  }
  return nextState;
}

export function toggleFavoriteRecipe(recipeId) {
  const state = readSessionState();
  const idx = state.favorites.indexOf(recipeId);
  if (idx >= 0) {
    state.favorites.splice(idx, 1);
  } else {
    state.favorites.push(recipeId);
  }
  writeSessionState(state);
  return state.favorites.includes(recipeId);
}

export function isFavoriteRecipe(recipeId) {
  return readSessionState().favorites.includes(recipeId);
}

export function recordChatInteraction(userMessage, botReply) {
  const state = readSessionState();
  state.chatHistory.push({
    user: userMessage,
    bot: botReply,
    ts: Date.now()
  });
  writeSessionState(state);
  return state.chatHistory;
}

export function purgeEphemeralSession() {
  const store = getStorage();
  if (store) {
    store.clear();
  }
}

export function initAuthState() {
  const state = readSessionState();
  const badgeEl = document.getElementById('auth-status-label');
  if (badgeEl) {
    badgeEl.textContent = state.status || DEFAULT_AUTH_STATUS;
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', purgeEphemeralSession);
  }

  return state;
}
