import { generateI18nStaticParams } from "$i18n/helpers"
import RepoList from "$components/client/RepoList"
import { FC } from "react"

export const generateStaticParams = generateI18nStaticParams("/")

interface Props {
  params: {
    lng: string
  }
}

const Page: FC<Props> = ({ params: { lng } }) => {
  return (
    <div>
      {/* <HomeHero />
    <Image src={"example.jpeg"} alt={"hero"} lazy={false} /> */}
      <RepoList lang={lng} />
    </div>
  )
}

export default Page
