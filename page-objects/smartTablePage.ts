import { Locator, Page } from '@playwright/test';
import { BasePage } from './basePage';

export class SmartTablePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get table() {
    return this.page.locator('table');
  }

  async navigateToSmartTable() {
    await this.navigateToHome();
    await this.page.getByText('Tables & Data').click();
    await this.page.getByText('Smart Table').click();
  }

  getRowByText(text: string) {
    return this.table.locator('tr', { hasText: text }).first();
  }

  getRowById(id: string) {
    return this.page.getByRole('row', { name: id })
      .filter({ has: this.page.locator('td').nth(1).getByText(id) });
  }

  async navigateToPage(pageNumber: string) {
    await this.page.locator('.ng2-smart-pagination-nav').getByText(pageNumber).click();
  }

  async filterByAge(age: string) {
    await this.page.locator('input-filter').getByPlaceholder('Age').clear();
    await this.page.locator('input-filter').getByPlaceholder('Age').fill(age);
    await this.page.waitForTimeout(500);
  }

  get ageRows() {
    return this.page.locator('tbody tr');
  }

  getInputEditor(placeholder: string) {
    return this.page.locator('input-editor').getByPlaceholder(placeholder);
  }

  async clickCheckmark() {
    await this.page.locator('.nb-checkmark').click();
  }
}