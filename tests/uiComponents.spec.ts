import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/')
})

test.describe('Form Layouts Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.getByRole('link', { name: 'Forms' }).click();
        await page.getByRole('link', { name: 'Form Layouts' }).click();
    })

    test('Input Fields', async ({ page }) => {
        const usingTheGridEmailInput = page.locator('nb-card').filter({ hasText: 'Using the Grid' }).getByRole('textbox', {name: "email"})
        
        await usingTheGridEmailInput.fill('test@test.com')
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.pressSequentially('test2@test.com', {delay: 100})

        const inputValue = await usingTheGridEmailInput.inputValue()
        expect(inputValue).toBe('test2@test.com')

        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com')
    })
    test('Radio Buttons', async ({ page }) => {
        const usingTheGridForm = page.locator('nb-card').filter({ hasText: 'Using the Grid' })
        await usingTheGridForm.getByRole('radio', {name: "Option 1"}).check({force: true})
        const radioStatus = await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked()
        expect(radioStatus).toBe(true)
    })
        


})

test('Checkboxes', async ({ page }) => {
    await page.getByRole('link', { name: 'Modal & Overlays' }).click();
    await page.getByRole('link', { name: 'Toastr' }).click();
    // expect(page).toHaveURL('http://localhost:4200/pages/modal-overlays/toastr')

    await page.getByRole('checkbox', { name: 'Hide on click' }).uncheck({force: true})
    await page.getByRole('checkbox', { name: 'Prevent arising of duplicate toast' }).check({force: true})


    const allCheckboxes = page.getByRole('checkbox')
    for (const checkbox of await allCheckboxes.all()) {
        await checkbox.check({force: true})
        expect(await checkbox.isChecked()).toBe(true)

    }
})

test('list and items', async ({ page }) => {
    const dropDownMenu = page.locator('ngx-header nb-select')
    await dropDownMenu.click()

    page.getByRole('list')
    page.getByRole('listitem')

    const optionList = page.locator('nb-option-list nb-option')
    await expect(optionList).toHaveText(['Light', 'Dark', 'Cosmic', 'Corporate'])
    await optionList.filter({hasText: 'Cosmic'}).click()
    const header = page.locator('nb-layout-header')
    // await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

    // create array with all themes and expected colors
    const colorsPerTheme = [
        {theme: 'Light', color: 'rgb(255, 255, 255)'},
        {theme: 'Dark', color: 'rgb(34, 43, 69)'},
        {theme: 'Cosmic', color: 'rgb(50, 50, 89)'},
        {theme: 'Corporate', color: 'rgb(255, 255, 255)'}
    ]

    // test each theme
    for (const {theme, color} of colorsPerTheme) {
        await dropDownMenu.click()
        await optionList.filter({hasText: theme}).click()
        await expect(header).toHaveCSS('background-color', color)
    }
})

test('Tooltips', async ({ page }) => {
    await page.getByRole('link', { name: 'Modal & Overlays' }).click()
    await page.getByRole('link', { name: 'Tooltip' }).click()

    const toolTipCard = page.locator('nb-card').filter({hasText: 'Tooltip Placements'})
    await toolTipCard .getByRole('button', {name: 'Top'}).hover()

    page.getByRole('tooltip')
    const tooltip = await page.locator('nb-tooltip').textContent()
    expect(tooltip).toBe('This is a tooltip')
})

test('Dialog box', async ({ page }) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    page.on('dialog', dialog =>{
        expect(dialog.message()).toEqual('Are you sure you want to delete?');
        dialog.accept();
    });

    await page.getByRole('table').locator('tr',{hasText: 'mdo@gmail.com'}).locator('.nb-trash').click()
    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')

})

test('Web Tables', async ({ page }) => {
    // Navigate to Smart Table page
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    // Locate table elements
    const table = page.locator('table')
    const targetRow = table.locator('tr', {hasText: 'twitter@outlook.com'}).first()
    const tableRow = table.locator('tr')
    const tableColumn = table.locator('td')

    // Edit age in the first row
    await targetRow.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('Age').clear()
    await page.locator('input-editor').getByPlaceholder('Age').fill('35')
    await page.locator('.nb-checkmark').click()

    // Navigate to page 2 and edit email
    await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
    const targetRowById = page.getByRole('row', { name: '11' }).filter({ has: page.locator('td').nth(1).getByText('11') })
    await targetRowById.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('E-mail').clear()
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com')
    await page.locator('.nb-checkmark').click()

    // Verify the email was updated
    await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com')

    // Test the filter of the table
    const ages = ['20', '30', '40', '200']
    for (const age of ages) {
        await page.locator('input-filter').getByPlaceholder('Age').clear()
        await page.locator('input-filter').getByPlaceholder('Age').fill(age)
        await page.waitForTimeout(500)
        const ageRows = page.locator('tbody tr')

    await Promise.all((await ageRows.all()).map(async row => {
        const rowAge = await row.locator('td').last().textContent();

        if (age == '200') {
            expect(await page.getByRole('table').textContent()).toContain('No data found');
        } else {
            expect(rowAge).toBe(age);
        }
    }));
    }
})

    