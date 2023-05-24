/*
 * This file has .js extension because it needs to be imported in next.config.js.
 * This file can be edited but should *NOT* be imported in any of the TS files in this project
 * Use $i18n/settings.ts to import the correctly typed config
 */

const fallbackLng = "it"

module.exports = {
  fallbackLng,
  languages: [fallbackLng, "en"],
  defaultNS: "common",
  paths: {
    "/login": {
      en: "/login",
      it: "/accedi"
    },
    "/repos": {
      en: "/repos",
      it: "/repos"
    }
  }
}
