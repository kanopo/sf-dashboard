import { test, expect } from "@playwright/test"

test("index page", async({ page, baseURL }) => {
  await page.goto(`${baseURL}/`)
  await expect(page.locator("h1")).toContainText("SF Next template")

  await expect(page).toHaveScreenshot()
})
