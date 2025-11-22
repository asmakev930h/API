from playwright.sync_api import sync_playwright, expect

def verify_search():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            # Navigate to the local server
            page.goto("http://localhost:7860")

            # Wait for content to load
            page.wait_for_selector(".app-container")

            # Type into search box
            page.fill("#search", "TikTok")
            page.wait_for_timeout(500) # Wait for filter to apply

            # Verify that only TikTok related cards are visible
            cards = page.locator(".card")
            count = cards.count()
            print(f"Found {count} cards for 'TikTok'")

            if count > 0:
                # Check text of first card
                text = cards.first.inner_text()
                if "TikTok" in text:
                    print("First card contains 'TikTok'")
                else:
                    print(f"First card text: {text}")
                    raise Exception("Search failed: irrelevant card found")
            else:
                raise Exception("Search failed: no cards found")

            # Take a screenshot
            page.screenshot(path="verification/search_verify.png", full_page=True)
            print("Screenshot taken successfully")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_search()
