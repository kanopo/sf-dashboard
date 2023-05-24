export type RetrievalMode = "fail" | "raw" | "safe"

export interface ITypedStorage<T> {
  length: number
  key<U extends keyof T>(index: number): U
  setItem<U extends keyof T>(key: U, value: T[U]): void
  getItem<U extends keyof T>(key: U, retrievalMode: RetrievalMode): T[U] | null
  removeItem<U extends keyof T>(key: U): void
  clear(): void
}

export interface TypedStorageOptions {
  storage?: "localStorage" | "sessionStorage"
  fallbackStorage?: Storage
  ignoreMissingStorage?: boolean
  retrievalMode?: RetrievalMode
}
