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