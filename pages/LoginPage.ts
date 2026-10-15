import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly email: Locator;
  readonly password: Locator;
  readonly submit: Locator;

  constructor(page: Page) {
    this.page = page;
    this.email = page.locator('input[type="email"]');
    this.password = page.locator('input[type="password"]');
    this.submit = page.getByRole('button', { name: 'Login' });
  }

  async goto() {
    await this.page.goto('/');          // base URL from the config
  }

  async login(email: string, password: string) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submit.click();
    await this.page.waitForURL(/sandbox-app\.brighthr\.com/, { timeout: 45_000 });
    await expect(this.page.getByRole('link', { name: 'Bright HR home page' })).toBeVisible();
  }
}