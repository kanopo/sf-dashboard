import React, { FC, PropsWithChildren } from "react"
import { PageParams } from "$types/next"

const Layout: FC<PropsWithChildren<PageParams>> = ({
  children
}) => (
  <html>
    <body>{children}</body>
  </html>
)

export default Layout
