'use client'

import TLink from "$components/client/TLink"
import Link from "next/link"
import { FC, useEffect, useState } from "react"


interface Props {
    lang: string
}
const RepoList: FC<Props> = ({ lang }) => {

    const [repos, setRepos] = useState([])

    useEffect(() => {
        fetch('/api/repos', {
            cache: 'no-cache',
        })
            .then(res => res.json())
            .then(data => setRepos(data))

    }, [])

    return (
        <div className="w-[50vw]">
            <h1>My repos</h1>

            {repos && repos.map((repo: any) => (
                // <Link href={lang + '/repos/' + repo.owner + "/" + repo.name}>
                <Link href={lang + '/repos/' + repo.full_name}>

                    <div id={repo.id} className="border-2 p-2 m-2">
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
