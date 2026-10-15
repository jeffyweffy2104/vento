import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("landing page exposes the waitlist flow", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /find your people in new york city\./i })).toBeVisible();
  await expect(page.getByRole("button", { name: "join the waitlist." })).toBeVisible();
  await expect(page.getByTestId("liquid-sculpture")).toHaveAttribute("data-state", /ready|fallback/);
  await expect(page.locator("html")).toHaveJSProperty("scrollWidth", await page.locator("html").evaluate((element) => element.clientWidth));
  await page.goto("/?join=1");
  await expect(page.getByRole("heading", { name: "you're invited." })).toBeVisible();
  await expect(page.getByLabel("Email address")).toBeVisible();
  await expect(page.getByText(/optional marketing texts/i)).toBeVisible();
});

test("landing has an intentional GPU fallback", async ({ page }) => {
  await page.goto("/?gpu=off");
  await expect(page.getByTestId("liquid-sculpture")).toHaveAttribute("data-state", "fallback");
  await expect(page.locator(".hero-poster")).toBeVisible();
  await expect(page.getByRole("button", { name: "join the waitlist." })).toBeVisible();
});

test("landing respects reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByTestId("liquid-sculpture")).toHaveAttribute("data-state", /ready|fallback/);
  await expect(page.getByRole("heading", { name: /find your people in new york city\./i })).toBeVisible();
});

test("conversation onboarding progresses without collecting hidden data", async ({ page }) => {
  await page.goto("/messages");
  await expect(page.getByRole("heading", { name: "let’s make something happen." })).toBeVisible();
  await page.getByRole("button", { name: "start" }).click();
  await page.getByLabel(/what city feels like home/i).fill("New York");
  await page.getByRole("button", { name: "send" }).click();
  await expect(page.getByText("New York", { exact: true })).toBeVisible();
  await expect(page.getByLabel(/where should we send/i)).toBeVisible();
});

test("messaging handoff is honest when no owned number is configured", async ({ page }) => {
  await page.goto("/join/continue");
  await expect(page.getByText("Nothing is sent automatically.")).toBeVisible();
  await expect(page.getByText("text signup is not available yet.")).toBeVisible();
  await expect(page.getByRole("link", { name: "continue on the web" })).toHaveAttribute("href", "/messages");
});

test("public pages have no serious accessibility violations", async ({ page }) => {
  for (const path of ["/", "/about", "/messages", "/join/continue", "/privacy", "/terms"]) {
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
