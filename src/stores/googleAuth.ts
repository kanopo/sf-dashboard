import { create } from "zustand"

type GoogleAuthStore = {
  googleToken: string | null
  onAccess(token: string): void
}

const initialState = {
  googleToken: null
}

const useGoogleAuth = create<GoogleAuthStore>((set) => ({
  ...initialState,
  onAccess: (token: string): void => {
    set({ googleToken: token })
  }
}))

export default useGoogleAuth
