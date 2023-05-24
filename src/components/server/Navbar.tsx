import "server-only"

import { FC } from "react"
import TLink from "$components/client/TLink"

const Navbar: FC = () => {
  return (
    <header>
      <div className="container">
        <TLink href={"/"}>Home</TLink>
        <TLink href={"/login"}>Login</TLink>
      </div>
    </header>
  )
}

export default Navbar
