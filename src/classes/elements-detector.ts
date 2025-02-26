import puppeteer, { Browser } from "puppeteer";

interface ActionResult {
  type: "close_signal" | "click" | "unknown";
  element?: HTMLElement;
}

export class ElementsDetector {
  private browser_active = false;
  private browser: Browser = null!;
  private clicked_elements: HTMLElement[] = [];

  async run(url: string): Promise<void> {
    this.browser_active = true;
    this.browser = await puppeteer.launch({ headless: false });
    const page = await this.browser.newPage();

    // Navigate the page to a URL
    await page.goto(url);

    // Set screen size
    await page.setViewport({ width: 1080, height: 1024 });

    await page.waitForNavigation({ waitUntil: "networkidle2" });

    console.log("Evaluating page...");

    while (this.browser_active) {
      const result = await page.evaluate(() => {
        return new Promise<ActionResult>((resolver) => {
          const click_event_handler = (event: MouseEvent) => {
            this.clicked_elements.push(event.target as HTMLElement);
            document.removeEventListener("click", click_event_handler);
            resolver({
              type: "click",
            });
          };

          document.addEventListener("click", click_event_handler);

          document.addEventListener("keyup", (ev) => {
            resolver({
              type: ev.ctrlKey && ev.key === "y" ? "close_signal" : "unknown",
            });
          });
        });
      });

      if (result.type === "close_signal") {
        await this.handle_browser_close();
      }
    }

    console.log("Evaluation completed.");
    console.log(this.clicked_elements);
  }

  private async handle_browser_close() {
    console.log("Intercepted close signal. Closing browser.");
    this.browser_active = false;
    await this.browser.close();
  }
}
