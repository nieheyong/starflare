import Dexie from 'dexie'
const db = new Dexie('Database')
window.db = db

db.version(1).stores({
  data: 'name',
  readme: 'id'
})

const genQueueSave = saveFun => {
  let saving = false
  let queueSaveData = null
  return async data => {
    queueSaveData = data
    if (saving) return
    saving = true
    while (queueSaveData) {
      const whenSaveDone = saveFun(queueSaveData)
      queueSaveData = null
      await whenSaveDone
    }
    saving = false
  }
}

const openDb = async () => {
  try {
    await db.open()
  } catch (e) {
    console.error(e)
  }
}

export const getData = async (name, fallback = null) => {
  try {
    await openDb()
    const res = await db.data.get(name)
    if (res) return res.data
  } catch (e) {
    console.error(e)
  }
  return fallback
}

export const setData = async (name, data) => {
  try {
    await openDb()
    await db.data.put({ name, data })
  } catch (e) {
    console.error(e)
  }
}

export const getRepos = () => getData('repos', [])

const setRepos = repos => setData('repos', repos)

export const updateRepos = genQueueSave(setRepos)

export const getUserTags = () => getData('tags', [])

const setUserTags = userTag => setData('tags', userTag)

export const updateUserTags = genQueueSave(setUserTags)

export const getReadme = id => db.readme.get(id)

export const setReadme = readme =>
  db.readme.put({ ...readme, time: Date.now() })
