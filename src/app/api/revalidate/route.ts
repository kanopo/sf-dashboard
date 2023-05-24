import type { NextApiRequest, NextApiResponse } from "next"
import { NextResponse } from "next/server"
import { languages } from "$i18n/helpers"
import { getPath } from "$helpers/routes"
import { ReplaceParams, Href } from "$types/routes"

type PageParams = {
  path: Href
  params: ReplaceParams
}

type RequestParams = {
  pages: PageParams[]
}

export const GET = async(req: NextApiRequest, res: NextApiResponse): Promise<Response> => {
  if (req.query?.token !== process.env.REVALIDATE_TOKEN) {
    return new Response("Invalid token", {
      status: 401
    })
  }

  if (!req.body?.pages?.length) {
    return NextResponse.json({
      message: "Pages not provided"
    }, {
      status: 400
    })
  }

  try {
    const { pages } = req.body as RequestParams
    const paths = languages.map((lng) => {
      return pages.map(({ path, params }: PageParams) => getPath({
        href: path,
        lng,
        replaceParams: params
      }))
    }).flat()

    const results = await Promise.allSettled(paths.map((path => res.revalidate(path))))

    return NextResponse.json({
      revalidated: paths.filter((_, i) => results[i].status === "fulfilled"),
      failed: paths.filter((_, i) => results[i].status === "rejected")
    }, {
      status: 200
    })
  } catch (err) {
    return NextResponse.json({
      message: "Error revalidating",
      stack: err
    }, {
      status: 500
    })
  }
}
