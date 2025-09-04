import { Page } from "@playwright/test";
import { BasePage } from "../common/base.page";

export class LoginPage extends BasePage{
  private loginModalBtn = "a#login2";
  private usernameInp = "input#loginusername";
  private passwordInp = "input#loginpassword";
  private loginBtn = "button:has-text('Log in')";
  private welcomeTxt = "li > a#nameofuser";
  private logoutBtn = "a#logout2";

  constructor(page: Page) {
    super(page);
  }

  async login(username: string, password: string) {
    await this.click(this.loginModalBtn);
    await this.fill(this.usernameInp, username);
    await this.fill(this.passwordInp, password);
    await this.click(this.loginBtn);
  }

  async checkWelcome(expected: string) {
    await this.waitVisible(this.welcomeTxt, 10000);
    const welcomeText = await this.getText(this.welcomeTxt);
    if (welcomeText?.trim() !== expected) {
      throw new Error(`Expected welcomeText '${expected}', got '${welcomeText}'`);
    }
  }

  async logout(){
    await this.click(this.logoutBtn);
  }
}
