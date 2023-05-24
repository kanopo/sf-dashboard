"use client"

import styles from "$styles/components/HomeHero.module.css"
import { FC } from "react"
import { useClientTranslation } from "$i18n/client"

const HomeHero: FC = () => {
  const { t } = useClientTranslation("common")

  return (
    <section className={styles.container}>
      <div className="container">
        <h1 className={styles.title}>{t("TITLE")}</h1>
      </div>
    </section>
  )
}

export default HomeHero
