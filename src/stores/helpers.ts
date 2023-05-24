import { StoreApi, UseBoundStore } from "zustand"
import { shallow } from "zustand/shallow"

export function usePartialStore<Store, Key extends keyof Store>(useStore: UseBoundStore<StoreApi<Store>>, keys: Key[]): Pick<Store, Key> {
  return useStore(
    (store) => keys.reduce((obj, key) => {
      obj[key] = store[key]
      return obj
    }, {} as Pick<Store, Key>),
    shallow
  )
}
