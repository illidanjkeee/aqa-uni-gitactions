import { Page } from '@playwright/test';
import { BasePage } from './basePage';

export class NavigationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async formLayoutsPage() {
    // Assuming there's a menu item or link to click
    await this.page.getByText('Forms').click();
    await this.page.getByText('Form Layouts').click();
    // await this.waitForUrl(ROUTES.FORM_LAYOUTS);
  }
  
  // Add other navigation methods
}