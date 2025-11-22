from playwright.sync_api import sync_playwright, expect

def verify_navigation():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            # Navigate to the local server
            page.goto("http://localhost:7860")

            # Wait for content to load
            page.wait_for_selector(".app-container")

            # 1. Click "Fun" category
            print("Clicking 'Fun' category...")
            page.click("text=Fun")
            page.wait_for_timeout(500)

            # Check that we are filtered
            fun_cards = page.locator(".card-cat:has-text('Fun')")
            all_cards = page.locator(".card")
            print(f"Visible cards: {all_cards.count()}, Fun cards: {fun_cards.count()}")

            if all_cards.count() != fun_cards.count():
                raise Exception("Filter failed: Visible cards do not match 'Fun' category")

            # 2. Click "Dashboard" (All)
            print("Clicking 'Dashboard'...")
            page.click("text=Dashboard")
            page.wait_for_timeout(500)

            # Check that we are reset (should have more cards than just Fun)
            final_count = all_cards.count()
            print(f"Final visible cards: {final_count}")

            if final_count <= fun_cards.count():
                 raise Exception("Reset failed: Card count did not increase after clicking Dashboard")

            # Take a screenshot
            page.screenshot(path="verification/nav_verify.png", full_page=True)
            print("Screenshot taken successfully")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_navigation()
