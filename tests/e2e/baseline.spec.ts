import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("landing page exposes the waitlist flow", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /find your people in/i })).toBeVisible();
  await page.getByRole("button", { name: /join the waitlist/i }).click();
  await expect(page.getByRole("heading", { name: "you're invited." })).toBeVisible();
  await expect(page.getByLabel("Email address")).toBeVisible();
  await expect(page.getByText(/optional marketing texts/i)).toBeVisible();
});

test("public pages have no serious accessibility violations", async ({ page }) => {
  for (const path of ["/", "/about", "/privacy", "/terms"]) {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .disableRules(["color-contrast"])
      .analyze();
    expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? "")), path).toEqual([]);
  }
});

test("health endpoint reports the service", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBeTruthy();
  await expect(response.json()).resolves.toMatchObject({ status: "ok", service: "vento-web" });
});
