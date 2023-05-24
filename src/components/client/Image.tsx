"use client"

import { FC, useEffect, useMemo, useRef, useState } from "react"

const mimes = {
  jpg: "jpeg"
}

type Mime = "jpeg" | "png" | "gif" | "webp"
type Props = {
  src: string
  width?: number
  height?: number
  alt?: string
  lazy?: boolean
  webp?: boolean
  className?: string
  imgClassName?: string
}

const Image: FC<Props> = ({
  src: srcProp,
  width,
  height,
  alt = "",
  lazy = true,
  webp = true,
  className,
  imgClassName
}) => {
  const [visible, setVisible] = useState(false)
  const picture = useRef(null)
  const src = useMemo(() => {
    return `/assets/images${srcProp[0] === "/" ? srcProp : `/${srcProp}`}`
  }, [srcProp])
  const mime = useMemo(() => {
    const match = src.match(/(jpe?g|png|gif|webp)$/g)?.[0]
    return mimes[match as keyof typeof mimes] || match || "jpeg"
  }, [srcProp]) as Mime

  useEffect(() => {
    if (lazy && picture.current) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            setVisible(true)
            observer.unobserve(entry.target)
          }
        })
      }, {
        rootMargin: "300px 0px"
      })
      observer.observe(picture.current)

      return () => {
        observer.disconnect()
      }
    }
  }, [picture.current])

  return (
    <picture className={className} ref={picture}>
      {webp &&
        <source type="image/webp" srcSet={!lazy || visible ? `${src}.webp` : undefined} />
      }

      <source type={`image/${mime}`} srcSet={!lazy || visible ? src : undefined} />

      <img
        className={imgClassName}
        src={!lazy || visible ? src : undefined}
        alt={alt}
        width={width}
        height={height}
      />
    </picture>
  )
}

export default Image
