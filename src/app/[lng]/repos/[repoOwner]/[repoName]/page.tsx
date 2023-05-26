/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import React, { FC, useEffect, useState } from "react"

interface Props {
  params: {
    repoOwner: string
    repoName: string
  }
}

const page: FC<Props> = ({ params }: Props) => {

  const [repo, setRepo] = useState(null)


  useEffect(() => {

    void fetch("/api/repos?" + new URLSearchParams({
      repoOwner: params.repoOwner,
      repoName: params.repoName
    }), {
      cache: "no-cache"
    })
      .then(res => res.json())
      .then(data => setRepo(data))

  }, [])


  return (
    <div>
      <p>{params.repoOwner}</p>
      <p>{params.repoName}</p>

      <h1>repo content</h1>
      {JSON.stringify(repo)}
    </div>
  )
}

export default page
