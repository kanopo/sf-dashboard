"use client"

import classNames from "classnames"
import { ForwardedRef, forwardRef, useImperativeHandle, useState } from "react"
import { CookiePreference } from "$constants/cookies"
import styles from "$styles/components/CookieAccordion.module.css"
import { useClientTranslation } from "$i18n/client"

export type CookieAccordionRef = {
  getId(): CookiePreference
  getValue(): boolean
  setValue(value: boolean): void
}
type Props = {
  id: CookiePreference
  title: string
  description: string
  defaultValue?: boolean
  editable?: boolean
}

const CookieAccordion = forwardRef<CookieAccordionRef, Props>(({
  id,
  title,
  description,
  defaultValue = false,
  editable = true
}: Props, ref: ForwardedRef<CookieAccordionRef>) => {
  const [checked, setChecked] = useState<boolean>(defaultValue)
  const [open, setOpen] = useState<boolean>(true)
  const { t } = useClientTranslation()

  useImperativeHandle(ref, () => ({
    getId: (): CookiePreference => id,
    getValue: (): boolean => checked,
    setValue: (value: boolean): void => {
      if (editable) {
        setChecked(value)
      }
    }
  }))

  const toggleChecked = (): void => {
    if (editable) {
      setChecked(!checked)
    }
  }

  return (
    <div className={styles.accordion}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={classNames(styles.title, !editable && styles.titleDisabled)} onClick={toggleChecked}>{t(`COOKIE.${title}`)}</div>

          <div className={classNames(styles.descriptionToggle, open && styles.descriptionToggleOpen)} onClick={(): void => setOpen(!open)}>
            {t(`COOKIE.${open ? "HIDE" : "SHOW"}_DESCRIPTION`)}

            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="5" viewBox="0 0 10 5"><path fill="none" fillRule="evenodd" stroke="#979797" strokeLinecap="round" strokeLinejoin="round" d="M9.243 0L5 4.243h0L.757 0"/></svg>
          </div>
        </div>

        <div className={styles.headerRight}>
          <div className={classNames(styles.check, checked && styles.checkChecked, !editable && styles.checkDisabled)} onClick={toggleChecked} />
        </div>
      </div>

      <div className={classNames(styles.description, open && styles.descriptionOpen)}>
        <div>
          { t(`COOKIE.${description}`) }
        </div>
      </div>
    </div>
  )
})
CookieAccordion.displayName = "CookieAccordion"

export default CookieAccordion
