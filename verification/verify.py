from playwright.sync_api import sync_playwright

def verify_frontend():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            # Navigate to the local server
            page.goto("http://localhost:7860")
            
            # Wait for content to load
            page.wait_for_selector(".app-container")
            
            # Click on a category in the sidebar to test navigation
            page.click("text=Fun")
            page.wait_for_timeout(500) # Wait for filter animation
            
            # Take a screenshot
            page.screenshot(path="verification/frontend_verify.png", full_page=True)
            print("Screenshot taken successfully")
            
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_frontend()
