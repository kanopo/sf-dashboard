"use client"

import TLink from "$components/client/TLink"
import Link from "next/link"
import { FC, useEffect, useState } from "react"
import { GitHubRepo } from "$types/githubOctokit"


interface Props {
    lang: string
}
const RepoList: FC<Props> = ({ lang }) => {

  const [repos, setRepos] = useState([])

  useEffect(() => {
    void fetch("/api/repos", {
      cache: "no-cache"
    })
      .then(res => res.json())
      .then(data => setRepos(data))

  }, [])


  return (
    <div className="w-[50vw]">
      <h1>My repos</h1>

      {repos && repos.map((repo: GitHubRepo) => (
        // <Link href={lang + '/repos/' + repo.owner + "/" + repo.name}>
        <Link key={repo.id} href={lang + "/repos/" + repo.full_name}>

          <div className="border-2 p-2 m-2">
            <p>{repo.full_name}</p>
            <p>{repo.name}</p>
            <p>{repo.language}</p>
            <p>{repo.description}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default RepoList
