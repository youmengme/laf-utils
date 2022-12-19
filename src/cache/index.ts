import mapAgeCleaner from 'map-age-cleaner'

const CACHE_KEY = '__LAF__APP__CUSTOM__CACHE__'
let instance: any
interface Entry<V> {
  maxAge: number;
  data: V;
}

interface Options<K, V> {
  maxAge?: number
  data?: ReadonlyArray<[K, V]> | Iterable<[K, V]>
}

export class Cache<K = any, V = any> implements Map<K, V> {
  private readonly data: Map<K, Entry<V>>
  public readonly [Symbol.toStringTag]: 'Map' = 'Map'
  public maxAge: number = 0

  constructor(props?: Options<K, V>) {
    this.data = new Map()

    mapAgeCleaner(this.data)
    const {
      maxAge = 0,
      data = []
    } = props || {}

    this.maxAge = maxAge

    if (Array.isArray(data)) {										// tslint:disable-line:early-exit
      for (const [key, value] of data) {
        this.set(key, value)
      }
    }
  }
  static init(shared: Map<any, any>) {
    if (!shared) {
      throw new Error('shared is required')
    }
    if (!shared.has(CACHE_KEY)) {
      shared.set(CACHE_KEY, new Cache())
    }

    instance = shared.get(CACHE_KEY)
  }
  get size() {
    return this.data.size
  }

  clear() {
    this.data.clear()
  }

  delete(key: K) {
    return this.data.delete(key)
  }

  has(key: K) {
    return this.data.has(key)
  }

  get(key: K, defaultData?: V) {
    const value = this.data.get(key)

    if (value) {
      return value.data
    } else if (defaultData) {
      return defaultData
    } else {
      return undefined
    }
  }

  set(key: K, value: V, maxAge?: number) {
    this.data.set(key, {
      maxAge: Date.now() + (maxAge || 0),
      data: value
    })

    return this
  }

  values() {
    return this.createIterator(item => item[1].data)
  }

  keys() {
    return this.data.keys()
  }

  entries() {
    return this.createIterator<[K, V]>(item => [item[0], item[1].data])
  }

  forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any) {
    for (const [key, value] of this.entries()) {
      callbackfn.apply(thisArg, [value, key, this])
    }
  }

  [Symbol.iterator]() {
    return this.entries()
  }

  private* createIterator<T>(projection: (item: [K, Entry<V>]) => T) {
    for (const item of this.data.entries()) {
      yield projection(item)
    }
  }
}

export const CacheInstance = () => {
  if (!instance) {
    throw new Error('Cache instance not initialized, Please call Cache.init() in App:ready trigger for initialization first.')
  }
  return instance
}

export default Cache
