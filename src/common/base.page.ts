import { Page } from "@playwright/test";

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string) {
    await this.page.goto(url);
  }

  async click(locator: string) {
    await this.page.locator(locator).click();
  }

  async fill(locator: string, text: string) {
    await this.page.locator(locator).fill(text);
  }

  async clear(locator: string) {
    await this.page.locator(locator).fill("");
  }

  async press(locator: string, key: string) {
    await this.page.locator(locator).press(key);
  }

  async waitVisible(locator: string, timeout = 5000) {
    await this.page.locator(locator).waitFor({ state: "visible", timeout });
  }

  async waitHidden(locator: string, timeout = 5000) {
    await this.page.locator(locator).waitFor({ state: "hidden", timeout });
  }

  async scrollToElement(locator: string) {
    await this.page.locator(locator).scrollIntoViewIfNeeded();
  }

  async refresh() {
    await this.page.reload();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async getText(locator: string): Promise<string | null> {
    return this.page.locator(locator).textContent();
  }

  async getAttribute(locator: string, attr: string): Promise<string | null> {
    return this.page.locator(locator).getAttribute(attr);
  }

  async count(locator: string): Promise<number> {
    return this.page.locator(locator).count();
  }

  async isPresent(locator: string): Promise<boolean> {
    return (await this.page.locator(locator).count()) > 0;
  }

  async isEnabled(locator: string): Promise<boolean> {
    return this.page.locator(locator).isEnabled();
  }

  async selectByValue(locator: string, value: string) {
    await this.page.locator(locator).selectOption({ value });
  }

  async selectByLabel(locator: string, label: string) {
    await this.page.locator(locator).selectOption({ label });
  }

  async zoom(zoomPercentage = 100) {
    await this.page.evaluate(
      (zoom) => (document.body.style.zoom = `${zoom}%`),
      zoomPercentage
    );
  }

  async waitForIdle(timeout = 10000) {
    await this.page.waitForLoadState("networkidle", { timeout });
  }

  async acceptAlert() {
    this.page.once("dialog", async (dialog) => {
      await dialog.accept();
    });
  }
  
  async dismissAlert() {
    this.page.once("dialog", async (dialog) => {
      await dialog.dismiss();
    });
  }
  
  async getAlertText(): Promise<string> {
    return new Promise((resolve) => {
      this.page.once("dialog", async (dialog) => {
        const message = dialog.message();
        await dialog.dismiss();
        resolve(message);
      });
    });
  }

  async waitForPopup(callback: () => Promise<void>) {
    const [popup] = await Promise.all([
      this.page.waitForEvent("popup"),
      callback(),
    ]);
    return popup;
  }

  async waitForNewTab(context, callback: () => Promise<void>) {
    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      callback(), 
    ]);
    await newPage.waitForLoadState();
    return newPage;
  }

  async waitForToast(locator: string, timeout = 5000) {
    await this.page.locator(locator).waitFor({ state: "visible", timeout });
  }
  
}
