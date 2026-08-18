import { test, expect } from "@playwright/test";

test.describe("Location Wishlist E2E Flow", () => {
  test("should load location page, toggle wishlist button, and persist state after reload", async ({ page }) => {
    // 1. Inject mock authentication session cookie into the browser context
    await page.context().addCookies([
      {
        name: "next-auth.session-token",
        value: "mock-session-token",
        domain: "localhost",
        path: "/",
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
      },
    ]);

    // 2. Open the browser to the location page
    await page.goto("/location/62432");

    // 3. Locate the Wishlist button
    const wishlistButton = page.getByRole("button", { name: /wishlist/i });
    await expect(wishlistButton).toBeVisible();

    const initialText = await wishlistButton.innerText();

    // 4. Perform live browser click
    await wishlistButton.click();

    // 5. Assert UI change in real time
    await expect(wishlistButton).not.toHaveText(initialText);

    // 6. Hard reload page to verify SSR + Redis data persistence
    await page.reload();

    // 7. Ensure state was saved in the database/cache and restored on fresh page load
    await expect(wishlistButton).not.toHaveText(initialText);
  });
});
