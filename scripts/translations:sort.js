/* eslint-disable no-console */
const fs = require("fs")
const path = require("path")

const dir = path.join(process.cwd(), "src/i18n/locales")

const sortKeys = json => Object.keys(json)
  .sort((a, b) => a > b ? 1 : -1)
  .reduce((obj, key) => {
    if (typeof json[key] === "string") {
      obj[key] = json[key]
    } else {
      obj[key] = sortKeys(json[key])
    }
    return obj
  }, {});

(() => {
  console.log("Sorting translation files...")

  const locales = fs.readdirSync(dir)
  locales.forEach(locale => {
    const stats = fs.lstatSync(path.join(dir, locale))

    if (stats.isDirectory()) {
      const filenames = fs.readdirSync(path.join(dir, locale))

      filenames.forEach(filename => {
        if (filename.endsWith(".json")) {
          const content = fs.readFileSync(path.join(dir, locale, filename), "utf-8")
          const json = JSON.parse(content)
          const sorted = sortKeys(json)

          fs.writeFileSync(path.join(dir, locale, filename), JSON.stringify(sorted, null, 2))
        }
      })
    }
  })

  console.log("Successfully sorted translation files")
})()
