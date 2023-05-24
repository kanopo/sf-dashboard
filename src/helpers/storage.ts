import { RetrievalMode, ITypedStorage, TypedStorageOptions } from "$types/storage"

class TypedStorage<T> implements ITypedStorage<T> {
  private readonly storage: Storage
  private readonly retrievalMode: RetrievalMode

  constructor({
    storage = "localStorage",
    ignoreMissingStorage = false,
    fallbackStorage = undefined,
    retrievalMode = "raw"
  }: TypedStorageOptions = {}) {
    const browserStorage = typeof window !== "undefined" && window?.[storage]
    this.storage = browserStorage || global[storage] || fallbackStorage
    this.retrievalMode = retrievalMode

    if (!this.storage && !ignoreMissingStorage) {
      throw Error("Web Storage API not found.")
    }
  }

  public get length(): number {
    return this.storage?.length
  }

  public key<U extends keyof T>(index: number): U {
    return this.storage?.key(index) as U
  }

  public getItem<U extends keyof T>(key: U, retrievalMode: RetrievalMode = this.retrievalMode): T[U] | null {
    const item = this.storage?.getItem(key.toString())

    if (item === null) {
      return item
    }

    try {
      return JSON.parse(item) as T[U]
    } catch (error) {
      switch (retrievalMode) {
        case "safe":
          return null
        case "raw":
          // eslint-disable-next-line @typescript-eslint/ban-types
          return item as unknown as T[U]
        default:
          throw error
      }
    }
  }

  public setItem<U extends keyof T>(key: U, value: T[U]): void {
    this.storage?.setItem(key.toString(), JSON.stringify(value))
  }

  public removeItem<U extends keyof T>(key: U): void {
    this.storage?.removeItem(key.toString())
  }

  public clear(): void {
    this.storage?.clear()
  }
}

type LocalStorage = {
  session: string
  user: string
  token: string
  googleToken: string
}

export const typedLocalStorage = new TypedStorage<LocalStorage>({ ignoreMissingStorage: true })
