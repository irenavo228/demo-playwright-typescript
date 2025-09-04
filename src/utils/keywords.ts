import { LoginPage } from "../pages/login.page";
import { HomePage } from "../pages/home.page";

export const loginRegistry = {
  "Login": async (page, data) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(data.username, data.password);
  },
  "Check Welcome": async (page, data) => {
    const loginPage = new LoginPage(page);
    const expectedText = data.expected || data.text || data.welcome;
    await loginPage.checkWelcome(expectedText);
  },
  "Logout": async (page) => {
    const loginPage = new LoginPage(page);
    await loginPage.logout();
  },
}

export const homeRegistry = {
  "Go to Home": async (page) => {
    const homePage = new HomePage(page);
    await homePage.gotoHome();
  },
  "Check Home Title": async (page, data) => {
    const homePage = new HomePage(page);
    const expectedTitle = data.expected || data.text || data.title;
    await homePage.checkHomeTitle(expectedTitle);
  },
  "Select Category": async (page, data) => {
    const homePage = new HomePage(page);
    await homePage.selectCategory(data.category);
  },
  "Select Product": async (page, data) => {
    const homePage = new HomePage(page);
    await homePage.selectProduct(data.product);
  },
  "Add to Cart": async (page) => {
    const homePage = new HomePage(page);
    await homePage.addToCart();
  },
  "View Cart": async (page) => {
    const homePage = new HomePage(page);
    await homePage.viewCart();
  },
};