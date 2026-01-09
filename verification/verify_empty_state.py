from playwright.sync_api import sync_playwright, expect

def verify_empty_state():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Intercept requests to vehicles to return empty list
        page.route("**/rest/v1/vehicles*", lambda route: route.fulfill(
            status=200,
            body='[]',
            headers={'Content-Type': 'application/json'}
        ))

        # Navigate to the test page
        page.goto("http://localhost:5173/test-vehicles")

        # Wait for the empty state to appear
        expect(page.get_by_text("Nenhum veículo encontrado")).to_be_visible()
        expect(page.get_by_text("Você ainda não possui veículos")).to_be_visible()

        # There should be 2 buttons now (one in header, one in empty state)
        expect(page.get_by_role("button", name="Novo Veículo")).to_have_count(2)

        # Take screenshot
        page.screenshot(path="verification/vehicles_empty_state.png")
        print("Screenshot taken: verification/vehicles_empty_state.png")

        browser.close()

if __name__ == "__main__":
    verify_empty_state()
