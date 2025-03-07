import { Locator, Page } from '@playwright/test';
import { BasePage } from './basePage';

export class FormLayoutsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get usingTheGridForm() {
    return this.page.locator('nb-card').filter({ hasText: 'Using the Grid' });
  }

  get usingTheGridEmailInput() {
    return this.usingTheGridForm.getByRole('textbox', { name: "email" });
  }

  async getRadioButton(optionName: string) {
    return this.usingTheGridForm.getByRole('radio', { name: optionName });
  }

  async navigateToFormLayouts() {
    await this.navigateToHome();
    await this.page.getByRole('link', { name: 'Forms' }).click();
    await this.page.getByRole('link', { name: 'Form Layouts' }).click();
  }
}