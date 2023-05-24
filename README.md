# SF Next Template

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Table of contents

- [Setup](#setup)
    - [Environment variables](#environment-variables)
    - [GIT hooks](#git-hooks)
    - [Path aliases](#path-aliases)
- [API](#api)
    - [SDK generation](#sdk-generation)
    - [Usage](#usage)
    - [Aborting requests](#aborting-requests)
    - [Error handling](#error-handling)
- [Internationalization](#internationalization)
    - [Configuration](#configuration)
    - [Paths translation](#paths-translation)
    - [Link component](#link-component)
    - [Translating strings](#translating-strings)
    - [T component](#t-component)
    - [withLayout HOC](#withlayout-hoc)
- [Styling](#styling)
    - [Configuration](#configuration-1)
    - [Usage](#usage)
    - [Classnames utility](#classnames-utility)
- [Images](#images)
    - [Converting to WebP](#converting-to-webp)
    - [Image component](#image-component)
- [Icons](#icons)
    - [Icon component](#icon-component)

## Setup

### Dependencies
First, install the dependencies:

```npm
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Production

Optimize and build the project:

```bash
npm run build
```

You can test the built version by running:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Environment variables

In order to access environment variables locally run:

```bash
cp .env.sample .env.local
```

**List of variables**

| Name | Description |
| ---------- | ---------- |
| `LANG_COOKIE_MAX_AGE` | Expiration time in seconds for `NEXT_LOCALE` cookie |
| `REVALIDATE_TOKEN` | Token used to [revalidate ISG pages](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration#on-demand-revalidation) through Next.js [API routes](https://nextjs.org/docs/api-routes/introduction) |
| `SITE_URL` | Website base URL, mostly useful to generate paths in `head` |

### GIT hooks

Before starting working with GIT, you **must** add the `pre-commit` and `pre-push` files in your `.git/hooks` directory and make them **executable**:

```bash
npm run git-hooks:init
```

### Path aliases

Imports can be confusing and error prones if we use relative paths, so we can define some [path aliases](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping) inside `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "$constants/*": ["constants/*"],
      "$context/*": ["context/*"],
      "$components/*": ["components/*"],
      "$helpers/*": ["helpers/*"],
      "$hooks/*": ["hooks/*"],
      "$sdk": ["sdk/index.ts"],
      "$styles/*": ["styles/*"],
      "$types/*": ["types/*"]
    }
  }
}
```

**Important:** `baseUrl` is mandatory when using the `paths` object.
This way we can import modules by using absolute paths without worrying to change paths if we move files:

```ts
import { UsersService } from "$sdk"
import Button from "$components/Button"
import useAuth from "$hooks/useAuth"
```

## API

API SDK is generated through [openapi-typescript-codegen](https://www.npmjs.com/package/openapi-typescript-codegen).

### SDK generation

All files are situated in the `sdk` directory and are automatically generated.
You can update them by running

```bash
npm run sdk:compile
```

This scripts accepts an additional argument that indicates the environment from which we want to get the definition file and the possibile values are `dev`, `staging` and `prod`. If none is passed, `dev` is used by default.
Keep in mind that in order to have `dev` working you need to run the project infrastructure locally.

### Usage

The SDK exports `models`, that are the types, and `services`, that are classes whose methods are used to call API endpoints.
The following example shows how to get an organization's data:

```tsx
import { Organization, OrganizationsService } from "$sdk"

const Component = () => {
  const [organization, setOrganization] = useState<Organization>()

  useEffect(() => {
    void (async(): Promise<void> => {
      try {
        const { data } = await OrganizationsService.getOrganization({
          handler: {
            organizationId: 1
          }
        })

        setOrganization(data)
      } catch (err) {}
    })()
  }, [])

  return (
    ...
  )
}
```

### Aborting requests

Every method in service classes is wrapped in a `CancelablePromise`.
You can use request's `cancel` method to abort it and check if it was canceled with its `isCancelled` property:

```tsx
const req = OrganizationsService.getOrganization({
  handler: {
    organizationId: 1
  }
})

try {
  const res = await req

  // do something
} catch (err) {
  // if the request is intentionally aborted we don't want to handle the error
  if (!req.isCancelled) {
    // handle API error or generic error
  }
}

// somewhere else
req.cancel()
```

### Error handling

Errors coming from API microservices have this body:

```ts
type ApiError = {
  error: {
    code?: string
    message: string
  }
  status: number
  statusCode: string
}
```

**useError hook**

You can use the `useError` hook in order to show a message from the API response error.
It returns the following interface:

```ts
type UseError = {
  handleError: (err: any, options?: HandleErrorOptions) => void
}
```

**handleError function**

It shows the toast with the error message. It will translate `ApiError.error.code` if present, otherwise it will show `ApiError.error.message` or `ApiError.statusCode` as a fallback.
In case of token expiration a `logout` is performed.
The function receives the caught error as first argument and an optional `HandleErrorOptions` object to overwrite its default behavior as second argument.

**HandleErrorOptions**

| Option | Description |
| ---------- | ---------- |
| `overwrite?: { [code: string]: ((err: ApiError) => void) \| null }` | An object used to overwrite specific error codes behavior. The `key` comes from the `ApiError.error.code` interface. The values can be either a function or `null` |

**Usage**

`useError` is located in the `hooks` directory, that means that you can use it **only** inside a component.

```ts
import useError from "$hooks/useError"

const Component = () => {
  const { handleError } = useError()

  // basic usage
  useEffect(() => {
    void (async(): Promise<void> => {
      try {
        const { data } = await ServiceName.endpointName(params)

        // handle API data
      } catch (err) {
        handleError(err)
      }
    })()
  }, [])

  // usage with exception
  useEffect(() => {
    void (async(): Promise<void> => {
      try {
        const { data } = await ServiceName.endpointName(params)

        // handle API data
      } catch (err) {
        handleError(err, {
          overwrite: {
            EXPIRED_JWT: (e) => {
              // do something instead of logging out
            },
            NOT_FOUND: null // skips every operation when this error occurs
          }
        })
      }
    })()
  }, [])

  return (
    ...
  )
}
```

## Internationalization

The project uses [next-i18next](https://github.com/isaachinman/next-i18next), a Next.js plugin based on [i18next](https://www.i18next.com/) and [react-i18next](https://react.i18next.com/).

### Configuration

Page templates are in the `pages` directory and they must have their corresponding translation file in `public/locales`. All pages share common translations that can be found in the same directory, inside `common.json`, that also acts as a fallback when page specific files are not present.
Configuration options are inside `constants/i18n.js`, where locales, [rewrites](https://nextjs.org/docs/api-reference/next.config.js/rewrites), [redirects](https://nextjs.org/docs/api-reference/next.config.js/redirects) and paths translations are defined.

### Paths translation

In order to translate a page path, `constants/i18n.js` exports a `paths` object, in which all translations can be set.
The key corresponds to the page path, following the `pages` directory, so the key for nested pages must be in the `path/to/page-name` format.
If the path for all pages is the same, the whole page should be omitted from the `paths` object:

```typescript
export const paths = {
  about: {
    it: "about",
    en: "about"
  } // should be omitted
}
```

If the path should be translated just for some languages, the other ones should be omitted:

```typescript
export const paths = {
  about: {
    it: "chi-siamo",
    en: "about" // should be omitted
  }
}
```

Based on the `paths` object, all rewrites and redirects are automatically generated and passed to `next.config.js`.

**Getting translated paths**

The function `getPath`, defined in `helpers/routes.ts`, returns the translated path of a page based on the passed locale.
It accepts an object with the following properties:

| Property | Description |
| ---------- | ---------- |
| `path: string` |  |
| `locale?: string` | The locale for which we need the translated path. If not passed the default one is used. |
| `params?: { [key: string]: number \| string }` | Parameters for dynamic routes.<br/>**Example:** With `organization/:id` path, this object should be `{ id: 1 }`.<br/>**Important:** An error is thrown if some parameter is missing |

```tsx
// static path for default locale
getPath({ path: "about" })

// static path for specific locale
getPath({ path: "about", locale: "it" })

// dynamic path
getPath({ path: "organization/:id", locale: "it", params: { id: 1 } })
```

### Link component

The `Link` component manages both internal and external links and uses next `Link` and `getPath` internally.
It accepts the following props, plus the `HTMLAnchorElement` ones:

| Prop | Description |
| ---------- | ---------- |
| `href: string` | It can be the page path, an external url or a `mailto` or `tel` url. |
| `hrefParams: { [key: string]: number \| string }` | Parameters for dynamic paths that are used by `getPath` |
| `locale?: string` | The locale for which you need the translated path, defaults to the current language |

**Important:** Never put an `<a />` tag inside this component.

**Usage**

```tsx
import Link from "$components/Link"

const Component = () => {
  return (
    {/* Internal static path */}
    <Link href="about">...</Link>

    {/* Internal dynamic path */}
    <Link
      href="dynamic/:slug"
      hrefParams={{ slug: "page-name" }}
    >...</Link>

    {/* Internal path for specific locale */}
    <Link
      href="about"
      locale="en"
    >...</Link>

    {/* External url */}
    <Link
      href="https://github.com"
      target="_blank"
      rel="nofollow noreferrer"
    >...</Link>

    {/* Mailto url */}
    <Link
      href="mailto:info@soluzionifutura.it"
    >...</Link>
  )
}
```

**Note:** a mailto url won't use an `<a />` tag, but it will be wrapped in a `<span />` that handles the click and opens the mail externally. Not exposing a `mailto:` href is a measure to prevent bot spamming.

### Translating strings

In order to translate strings, use the `useT` hook, built upon `useTranslation` (see [docs](https://react.i18next.com/latest/usetranslation-hook)), which exposes the common translations and that specific page's ones.

```tsx
const { t } = useT()

return (
  <p>{t("TITLE")}</p>
)
```

### T component

The `T` component is designated to render HTML from translation files. You can also use it to translate simple strings so you don't have to import and use both `useT` and `<T/>`.
It accepts the following props:

| Prop | Description |
| ---------- | ---------- |
| `content: string` | The key you need to translate |
| `values?: { [key: string]: number \| string }` | See [interpolation](https://www.i18next.com/translation-function/interpolation) |

**Usage**

We have this configuration inside `common.json`:

```json
{
  "TITLE": "Counter",
  "SUBTITLE": "Subtitle with <em>HTML</em>",
  "TEXT": "The count is {{count}}."
}
```

You can use the `T` component for all these translations:

```tsx
const Component = () => {
  return (
    <h1>
      <T content="TITLE" />
    </h1>

    <h2>
      <T content="SUBTITLE" />
    </h2>

    <p>
      <T content="TEXT" values={{ count: 10 }} />
    </p>
  )
}
```

### withLayout HOC

Every page is wrapped by the `withLayout` HOC, that initializes `TranslationContext` (needed to make `useT` work properly) and renders all common components like `Head`, `Navbar` and `Footer`.
It accepts an options object needed to retrieve the correct translation files and translated paths:

| Prop | Description |
| ---------- | ---------- |
| `path: string` | Page path, used to inject canonical and alternate urls inside `<Head />` and as `ns` fallback if the latter is not defined. **Note:** if it contains `/` characters, they're replaced with `-` to pick the right translation files. |
| `ns?: string` | Translations namespace. It should be named as the corresponding translation file inside `public/locales`. |
| `withNav?: boolean` | Default `true`. Determines if the navbar should be visible in the page. |
| `withFooter?: boolean` | Default `true`. Determines if the footer should be visible in the page. |

## Styling

The project uses [tailwindcss](https://tailwindcss.com/) under the hood, powered by [PostCSS](https://postcss.org/).

### Configuration

All base configuration options are in `tailwind.config.js` (see the [docs](https://tailwindcss.com/docs/theme)).
PostCSS plugins are installed as dev dependencies and are configured inside `postcss.config.js`.

**Note:** PostCSS is not a preprocessor, but a tool for transforming CSS, so all files must have the `.css` extension. You can still use preprocessors features by installing PostCSS plugins like [postcss-mixins](https://github.com/postcss/postcss-mixins).

Every file is inside the `styles` directory.
The `globals.css` file is imported inside `App.tsx` and exposes all global styles, including `tailwind` classes, that can be used everywhere.
The `components` and `pages` directories contain styles relative to single components or pages.

**Note:** Every file inside this folders must be named in the format `Component.module.css`, so it can be imported inside a tsx file and its styles are used only in pages that contain that specific component.

```
| styles
|-- components
|---- Button.module.css
|-- pages
|---- Home.module.css
|-- globals.css
```

### Usage

All files can use both standard CSS and tailwind syntax.

**Button.module.css**

```css
.container {
  @apply border-0 bg-black text-white;
  width: 100%;
}
```

**Button.tsx**

```tsx
import styles from "$styles/components/Button.module.css"

const Button = ({
  children
}) => {
  return (
    <button className={styles.container}>
      {children}
    </button>
  )
}
```

As previously said, you can also use global and `tailwind` classes inside your components. During the build phase, the compiler will take care of purging unused ones:

```tsx
const Component = () => {
  return (
    <div className="w-full global-class">...</div>
  )
}
```

### Classnames utility

In order to easily combine classes without interpolating strings you can use [classnames](https://github.com/JedWatson/classnames):

```tsx
import styles from "$styles/components/Button.module.css"
import classNames from "classnames"

const Button = ({
  children,
  className
}) => {
  return (
    <button className={classNames(styles.container, className)}>
      {children}
    </button>
  )
}
```

**Advanced usage**

See documentation to discover all possible combinations.

```tsx
import styles from "$styles/components/Button.module.css"
import classNames from "classnames"

type Props = {
  children: ReactNode
  className?: string
  outline?: boolean
  disabled?: boolean
  theme: "primary" | "secondary"
}

const Button = ({
  children,
  className,
  outline,
  disabled,
  theme = "primary"
}) => {
  return (
    <button className={classNames(
      styles.container,
      className,
      outline && styles.containerOutline,
      styles[`container${theme}`],
      {
        [styles.containerDisabled]: disabled
      }
    )}>
      {children}
    </button>
  )
}
```

## Images

All the static images are located in `public/assets/images`.

### Converting to WebP

In order to convert them in webp format you should install [libwebp](https://developers.google.com/speed/webp/download) and then run:

```bash
npm run images:convert
```

All the images inside `public/assets/images` are then converted in webp format and the extension is appended to the original name, so that's easier for the `Image` component to retrieve the corresponding source:

```bash
image.jpg -> image.jpg.webp
```

### Image component

It renders a `picture` HTML tag and handles the visualisation of the right source. It should be used just for local images inside `public/assets/images`.

| Prop | Description                                                                  |
| ---------- |------------------------------------------------------------------------------|
| `src: string` | Image src relative to the `public/assets/images` directory.                  |
| `lazy?: boolean` | Enables image lazy loading, defaults to `true`.                              |
| `webp?: boolean` | Renders an additional `source` including the webp image, defaults to `true`. |

## Icons

All SVG icons are located in `public/icons`.
It's suggested to have them inside square viewBox in order to have a standard sizing pattern across all icon, but a not square one won't create any sizing issue since their height is set as `auto` through CSS.
The best way to color them easily and consistently is to set their fill or stroke to `currentColor`, so they'll inherit their container text color without requiring specific CSS.

### Icon component

SVGs are rendered through the `Icon` component, that uses [react-inlinesvg](https://www.npmjs.com/package/react-inlinesvg) under the hood.
It accepts the following props:

| Prop | Description |
| ---------- | ---------- |
| `name: IconName` | `IconName` is defined inside `types/icon` and it must match the corresponding file name inside `public/icons` |
| `size?: number` | Icon size in pixel. If omitted the default value is `24`. It can be easily overwritten with CSS |
| `className?: string` | Additional className to assign to the SVG |
