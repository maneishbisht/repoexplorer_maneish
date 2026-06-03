export function loadRecent() {

  try {

    const raw = localStorage.getItem(import.meta.env.VITE_STORAGE_KEY)

    return raw ? JSON.parse(raw) : []

  } catch {

    return []

  }
}


export function saveRecent(search){
  try {
    localStorage.setItem(import.meta.env.VITE_STORAGE_KEY, JSON.stringify(search))
  } catch { /* ignore */ }
}

export const SORT_FNS = {

  stars: (a, b) => (b.stargazers_count - a.stargazers_count),

  name: (a, b) => (a.name?.localeCompare(b.name) ?? 0),

  updated: (a, b) => (new Date(b.updated_at) - new Date(a.updated_at)),

}