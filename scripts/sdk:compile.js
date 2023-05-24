/* eslint-disable no-console */
const OpenAPI = require("openapi-typescript-codegen")
const { join } = require("path")

const definitionPaths = {
  dev: "http://localhost:8000",
  staging: "https://api-staging.cattlesociety.it",
  prod: "https://api.cattlesociety.it"
}

const args = process.argv.slice(2)
const env = args[0] || "dev"

const input = definitionPaths[env] + "/v1/docs?format=json"
const output = join(process.cwd(), "sdk")

void (async() => {
  console.log("Compiling OpenAPI definition...")

  await OpenAPI.generate({
    input,
    output,
    useUnionTypes: true
  })

  console.log("SDK generated!")
})().catch(console.error)
