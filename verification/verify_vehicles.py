from playwright.sync_api import sync_playwright, expect
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Mock Supabase request
        # Note: The URL might include query parameters, so we use * wildcards
        page.route("**/rest/v1/vehicles*", lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            body="""[
                {
                    "id": "1",
                    "title": "Urbano Caio Apache",
                    "model_year": 2025,
                    "fabrication_year": 2024,
                    "chassis_manufacturer": "Volkswagen",
                    "body_manufacturer": "Caio",
                    "condition": "new",
                    "available_quantity": 1,
                    "mileage": 1000,
                    "media_files": {},
                    "organization_id": "test-org"
                },
                {
                    "id": "2",
                    "title": "Marcopolo Paradiso G8",
                    "model_year": 2024,
                    "fabrication_year": 2024,
                    "chassis_manufacturer": "Scania",
                    "body_manufacturer": "Marcopolo",
                    "condition": "used",
                    "available_quantity": 1,
                    "mileage": 50000,
                    "media_files": {},
                    "organization_id": "test-org"
                },
                {
                    "id": "3",
                    "title": "Outro 2024",
                    "model_year": 2024,
                    "fabrication_year": 2023,
                    "chassis_manufacturer": "Mercedes",
                    "body_manufacturer": "Comil",
                    "condition": "semi-new",
                    "available_quantity": 5,
                    "mileage": 20000,
                    "media_files": {},
                    "organization_id": "test-org"
                }
            ]"""
        ))

        try:
            # Give vite some time to start if needed, but it should be fast
            page.goto("http://localhost:5173/verify/vehicles")

            # Wait for content to load
            expect(page.get_by_text("3 veículos encontrados")).to_be_visible(timeout=10000)

            # Verify Default Sorting/Grouping headers
            expect(page.get_by_text("Ano Modelo 2025")).to_be_visible()
            expect(page.get_by_text("Ano Modelo 2024")).to_be_visible()

            # Verify Dropdowns
            expect(page.get_by_text("Por Ano Modelo (Decrescente)")).to_be_visible()
            expect(page.get_by_text("Ano: Mais novos")).to_be_visible()

            # Take screenshot
            page.screenshot(path="/app/verification/vehicles_page.png", full_page=True)
            print("Verification successful!")

        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="/app/verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
