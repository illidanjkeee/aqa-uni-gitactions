import { Locator, Page } from '@playwright/test';
import { BasePage } from './basePage';

export class ThemeSelectionPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get dropDownMenu() {
    return this.page.locator('ngx-header nb-select');
  }

  get optionList() {
    return this.page.locator('nb-option-list nb-option');
  }

  get header() {
    return this.page.locator('nb-layout-header');
  }

  async selectTheme(themeName: string) {
    await this.dropDownMenu.click();
    await this.optionList.filter({ hasText: themeName }).click();
  }
}