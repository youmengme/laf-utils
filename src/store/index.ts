type KeyType = string | number | symbol
type ValueCache<T> = {
  data: T
  expire: number
}

export class Store {
  store: Map<KeyType, any> | undefined
  isInit: boolean = false

  init(cloud: any) {
    if (this.isInit) return
    cloud.shared.utilCache = new Map()
    this.store = cloud.shared.utilCache
    this.isInit = true
  }

  checkInstance() {
    if (!this.store || !this.isInit) {
      throw new Error('Please call `store.init(cloud)` to initialize first')
    }
  }

  get<T>(key: KeyType) {
    this.checkInstance()
    const res = this.store?.get(key) as ValueCache<T>
    if (res?.expire > Date.now()) return res.data
    this.store?.delete(key)
    return undefined
  }

  set<T extends any>(key: KeyType, value: T, expire: number = 0) {
    this.checkInstance()
    return this.store?.set(
      key,
      {
        data: value,
        expire
      }
    )
  }

  has(key: KeyType) {
    this.checkInstance()
    return this.store?.has(key)
  }

  delete(key: KeyType) {
    this.checkInstance()
    return this.store?.delete(key)
  }

  clear() {
    this.checkInstance()
    return this.store?.clear()
  }
}

const instance = new Store()

export default instance
