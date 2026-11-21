"""Chup man hinh game Van Dao Tu Tien bang Playwright (Chromium headless).

Cach dung (tu thu muc goc repo):
    python3 tools/screenshot.py

Mo http://localhost:8123/index.html (can chay san:
    python3 -m http.server 8123 --bind 127.0.0.1
o thu muc goc repo), cua so 1280x720:
  - cho 3 giay, chup menu -> ops/specs/img/muse_menu.png
  - click (265, 342) "Bat dau hanh trinh", cho 1,5 giay
  - click (253, 551) "Nhap the", cho 3 giay,
    chup the gioi game -> ops/specs/img/muse_test.png
  - ghi lai moi loi console / pageerror ra stdout.
"""
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
IMG_DIR = ROOT / "ops" / "specs" / "img"
URL = "http://localhost:8123/index.html"


def main() -> int:
    IMG_DIR.mkdir(parents=True, exist_ok=True)
    errors = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=["--no-sandbox"])
        page = browser.new_page(viewport={"width": 1280, "height": 720})
        page.on("pageerror", lambda e: errors.append(f"pageerror: {e}"))
        page.on(
            "console",
            lambda m: errors.append(f"console.{m.type}: {m.text}")
            if m.type in ("error",)
            else None,
        )

        page.goto(URL, wait_until="load", timeout=60000)
        page.wait_for_timeout(3000)
        page.screenshot(path=str(IMG_DIR / "muse_menu.png"))
        print("menu screenshot: ops/specs/img/muse_menu.png")

        page.mouse.click(265, 342)  # "Bat dau hanh trinh"
        page.wait_for_timeout(1500)

        page.mouse.click(253, 551)  # "Nhap the"
        page.wait_for_timeout(3000)
        page.screenshot(path=str(IMG_DIR / "muse_test.png"))
        print("world screenshot: ops/specs/img/muse_test.png")

        browser.close()

    if errors:
        print(f"CONSOLE ERRORS ({len(errors)}):")
        for e in errors:
            print(" -", e)
    else:
        print("CONSOLE ERRORS (0): khong co loi console/pageerror")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
