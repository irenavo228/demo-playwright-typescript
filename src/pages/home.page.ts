import { Page } from "@playwright/test";
import { BasePage } from "../common/base.page";

export class HomePage extends BasePage {
  private homeBtn = "#navbarExample > ul > li.nav-item.active > a";
  private navbarTitle = ".navbar-brand";
  private addToCartBtn = "#tbodyid > div.row > div > a";
  private viewCartBtn = "#navbarExample > ul > li:nth-child(4) > a";
  private categoryName = "a#itemc:has-text('{x}')";
  private productName = "a.hrefch:has-text('{x}')";

  constructor(page: Page) {
    super(page);
  }

  async gotoHome() {
    await this.click(this.homeBtn);
  }

  async checkHomeTitle(expected: string) {
    await this.waitVisible(this.navbarTitle, 10000);
    const title = await this.getText(this.navbarTitle);
    if (title?.trim() !== expected) {
      throw new Error(`Expected title '${expected}', got '${title}'`);
    }
  }

  async selectCategory(categoryName: string) {
    await this.click(this.categoryName.replace("{x}", categoryName));
  }

  async selectProduct(productName: string) {
    await this.click(this.productName.replace("{x}", productName));
  }

  async addToCart() {
    await this.click(this.addToCartBtn);
    await this.page.waitForTimeout(500);
    await this.acceptAlert();
  }

  async viewCart() {
    await this.click(this.viewCartBtn);
  }
}