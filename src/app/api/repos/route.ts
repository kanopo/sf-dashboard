export const dynamic = "force-dynamic"
import { Octokit } from "@octokit/rest"
import { NextRequest } from "next/server"

// TODO: API endpoint to get all repos
export async function GET(request: NextRequest): Promise<Response> {

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN

  const searchParams = request.nextUrl.searchParams
  const octokit = new Octokit({
    auth: GITHUB_TOKEN
  })

  if (searchParams.has("repoName") && searchParams.has("repoOwner")) {
    // console.log(searchParams.get("repoName"))
    // console.log(searchParams.get("repoOwner"))

    const repoName: string = searchParams.get("repoName")!
    const repoOwner: string = searchParams.get("repoOwner")!

    const repoResponse = await octokit.repos.get({
      owner: repoOwner,
      repo: repoName
    })

    // TODO: add error handling

    return new Response(JSON.stringify(repoResponse.data))
  } else {
    const response = await octokit.repos.listForAuthenticatedUser({
      per_page: 100
    })
    return new Response(JSON.stringify(response.data))
  }


}
