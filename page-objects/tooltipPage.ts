import { Locator, Page } from '@playwright/test';
import { BasePage } from './basePage';

export class TooltipPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigateToTooltip() {
    await this.navigateToHome();
    await this.page.getByRole('link', { name: 'Modal & Overlays' }).click();
    await this.page.getByRole('link', { name: 'Tooltip' }).click();
  }

  get toolTipCard() {
    return this.page.locator('nb-card').filter({ hasText: 'Tooltip Placements' });
  }

  async hoverTopButton() {
    await this.toolTipCard.getByRole('button', { name: 'Top' }).hover();
  }

  get tooltip() {
    return this.page.locator('nb-tooltip');
  }
}