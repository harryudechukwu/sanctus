import { useState, useEffect, useCallback } from 'react'
import { openDB } from 'idb'

const DB_NAME = 'sanctus'
const STORE_NAME = 'bookmarks'

const getDB = () =>
  openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    },
  })

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDB()
      .then((db) => db.getAll(STORE_NAME))
      .then((data) => {
        setBookmarks(data)
        setLoading(false)
      })
  }, [])

  const addBookmark = useCallback(async (saint) => {
    const db = await getDB()
    await db.put(STORE_NAME, saint)
    setBookmarks((prev) => [...prev.filter((b) => b.id !== saint.id), saint])
  }, [])

  const removeBookmark = useCallback(async (id) => {
    const db = await getDB()
    await db.delete(STORE_NAME, id)
    setBookmarks((prev) => prev.filter((b) => b.id !== id))
  }, [])

  const isBookmarked = useCallback(
    (id) => bookmarks.some((b) => b.id === id),
    [bookmarks],
  )

  return { bookmarks, loading, addBookmark, removeBookmark, isBookmarked }
}
