import { Locator, Page } from '@playwright/test';
import { BasePage } from './basePage';

export class ToastrPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigateToToastr() {
    await this.navigateToHome();
    await this.page.getByRole('link', { name: 'Modal & Overlays' }).click();
    await this.page.getByRole('link', { name: 'Toastr' }).click();
  }

  getCheckbox(name: string) {
    return this.page.getByRole('checkbox', { name });
  }

  getAllCheckboxes() {
    return this.page.getByRole('checkbox');
  }
}