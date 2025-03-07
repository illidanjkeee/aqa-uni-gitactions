import { test, expect } from '@playwright/test';
// Importing page object classes - each represents a distinct page in the application
import { FormLayoutsPage } from '../page-objects/formLayoutsPage';
import { ToastrPage } from '../page-objects/toastrPage';
import { ThemeSelectionPage } from '../page-objects/themeSelectionPage';
import { TooltipPage } from '../page-objects/tooltipPage';
import { SmartTablePage } from '../page-objects/smartTablePage';

test.describe('Form Layouts Page', () => {
  test('Input Fields', async ({ page }) => {
    // Instantiating a page object for the Form Layouts page
    // This encapsulates all the form layout page elements and actions
    const formLayoutsPage = new FormLayoutsPage(page);
    // Using navigation method from the page object instead of direct URL manipulation
    await formLayoutsPage.navigateToFormLayouts();
    
    // Accessing page elements through properties defined in the page object
    // Rather than using raw selectors in tests
    await formLayoutsPage.usingTheGridEmailInput.fill('test@test.com');
    await formLayoutsPage.usingTheGridEmailInput.clear();
    await formLayoutsPage.usingTheGridEmailInput.pressSequentially('test2@test.com', { delay: 100 });

    // Getting properties from page elements through the page object
    const inputValue = await formLayoutsPage.usingTheGridEmailInput.inputValue();
    expect(inputValue).toBe('test2@test.com');
    await expect(formLayoutsPage.usingTheGridEmailInput).toHaveValue('test2@test.com');
  });

  test('Radio Buttons', async ({ page }) => {
    // Creating the page object for the form layouts page
    const formLayoutsPage = new FormLayoutsPage(page);
    await formLayoutsPage.navigateToFormLayouts();
    
    // Using a parameterized getter method from the page object
    // This method abstracts the selector logic for finding specific radio buttons
    const radioButton = await formLayoutsPage.getRadioButton('Option 1');
    await radioButton.check({ force: true });
    
    const radioStatus = await radioButton.isChecked();
    expect(radioStatus).toBe(true);
  });
});

test('Checkboxes', async ({ page }) => {
  // Creating a different page object for a new page being tested
  const toastrPage = new ToastrPage(page);
  // Using the page object's navigation method
  await toastrPage.navigateToToastr();

  // Using parameterized methods to interact with specific checkboxes
  // The underlying selectors are hidden within the page object
  await toastrPage.getCheckbox('Hide on click').uncheck({ force: true });
  await toastrPage.getCheckbox('Prevent arising of duplicate toast').check({ force: true });

  // Getting a collection of elements through a page object method
  // This demonstrates how POM can manage groups of similar elements
  const allCheckboxes = toastrPage.getAllCheckboxes();
  for (const checkbox of await allCheckboxes.all()) {
    await checkbox.check({ force: true });
    expect(await checkbox.isChecked()).toBe(true);
  }
});

test('List and items', async ({ page }) => {
  // Using a specialized page object for theme selection functionality
  const themeSelectionPage = new ThemeSelectionPage(page);
  await themeSelectionPage.navigateToHome();
  
  // Accessing UI components through properties defined in the page object
  await themeSelectionPage.dropDownMenu.click();
  await expect(themeSelectionPage.optionList).toHaveText(['Light', 'Dark', 'Cosmic', 'Corporate']);
  await themeSelectionPage.optionList.filter({ hasText: 'Cosmic' }).click();

  // Test data defined in the test, but interaction happens through the page object
  const colorsPerTheme = [
    { theme: 'Light', color: 'rgb(255, 255, 255)' },
    { theme: 'Dark', color: 'rgb(34, 43, 69)' },
    { theme: 'Cosmic', color: 'rgb(50, 50, 89)' },
    { theme: 'Corporate', color: 'rgb(255, 255, 255)' }
  ];

  for (const { theme, color } of colorsPerTheme) {
    // Using a higher-level action method that encapsulates multiple steps
    // This is a good example of how POM can simplify complex interactions
    await themeSelectionPage.selectTheme(theme);
    await expect(themeSelectionPage.header).toHaveCSS('background-color', color);
  }
});

test('Tooltips', async ({ page }) => {
  // Page object for tooltip functionality
  const tooltipPage = new TooltipPage(page);
  await tooltipPage.navigateToTooltip();
  
  // Using an action method that encapsulates a complex interaction (hover)
  await tooltipPage.hoverTopButton();
  
  // Accessing UI elements through the page object
  const tooltipText = await tooltipPage.tooltip.textContent();
  expect(tooltipText).toBe('This is a tooltip');
});

test('Dialog box', async ({ page }) => {
  // Using the smart table page object
  const smartTablePage = new SmartTablePage(page);
  await smartTablePage.navigateToSmartTable();

  // Setting up dialog handler - not directly related to POM but works with it
  page.on('dialog', dialog => {
    expect(dialog.message()).toEqual('Are you sure you want to delete?');
    dialog.accept();
  });

  // Using a composite method that finds a row by text and then interacts with it
  // This showcases how POM can combine multiple actions into meaningful operations
  await smartTablePage.getRowByText('mdo@gmail.com').locator('.nb-trash').click();
  await expect(smartTablePage.table.locator('tr').first()).not.toHaveText('mdo@gmail.com');
});

test('Web Tables', async ({ page }) => {
  // Using the smart table page object for table interactions
  const smartTablePage = new SmartTablePage(page);
  await smartTablePage.navigateToSmartTable();

  // Using methods to find specific rows in the table
  const targetRow = smartTablePage.getRowByText('twitter@outlook.com');
  await targetRow.locator('.nb-edit').click();
  // Accessing form elements through page object methods
  await smartTablePage.getInputEditor('Age').clear();
  await smartTablePage.getInputEditor('Age').fill('35');
  // Using action methods for common operations
  await smartTablePage.clickCheckmark();

  // Page object method for pagination
  await smartTablePage.navigateToPage('2');
  // Alternative method to find rows by ID instead of text
  const targetRowById = smartTablePage.getRowById('11');
  await targetRowById.locator('.nb-edit').click();
  await smartTablePage.getInputEditor('E-mail').clear();
  await smartTablePage.getInputEditor('E-mail').fill('test@test.com');
  await smartTablePage.clickCheckmark();

  // Verification using the found rowD
  await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com');

  // Testing filtering - using a high-level page object method
  const ages = ['20', '30', '40', '200'];
  
  for (const age of ages) {
    // POM method that encapsulates the complete filtering operation
    await smartTablePage.filterByAge(age);
    
    // Using table rows exposed by the page object
    await Promise.all((await smartTablePage.ageRows.all()).map(async row => {
      const rowAge = await row.locator('td').last().textContent();

      if (age == '200') {
        expect(await smartTablePage.table.textContent()).toContain('No data found');
      } else {
        expect(rowAge).toBe(age);
      }
    }));
  }
});