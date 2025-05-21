# Test info

- Name: test
- Location: /Users/joemilburn/Projects/kanban-saas/tests/kanban.spec.js:3:5

# Error details

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('textbox', { name: 'Board name' })

    at /Users/joemilburn/Projects/kanban-saas/tests/kanban.spec.js:11:59
```

# Page snapshot

```yaml
- heading "Your boards" [level=1]
- button "+ New board"
- list:
  - listitem:
    - link "Main Board":
      - /url: /board/cmastbxoo0002m3p5wq73vlrf
  - listitem:
    - link "jrmilburn's board":
      - /url: /board/cmatiowce0000m3ktca1yztnt
  - listitem:
    - link "Test":
      - /url: /board/cmatk092m0007m3pbfat6mwor
  - listitem:
    - link "New Board":
      - /url: /board/cmaxehda500016dvi8gvz78b2
- button "Sign Out"
- alert
- button "Open Next.js Dev Tools":
  - img
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test('test', async ({ page }) => {
   4 |   await page.goto('http://localhost:3000/login');
   5 |   await page.getByRole('button', { name: 'Sign in with GitHub' }).click();
   6 |   await page.getByRole('textbox', { name: 'Username or email address' }).fill('jrmilburn@outlook.com');
   7 |   await page.getByRole('textbox', { name: 'Password' }).click();
   8 |   await page.getByRole('textbox', { name: 'Password' }).fill('D!n!who1!');
   9 |   await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  10 |   await page.getByRole('button', { name: '+ New board' }).click();
> 11 |   await page.getByRole('textbox', { name: 'Board name' }).fill('New Board');
     |                                                           ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  12 |   await page.getByRole('button', { name: 'Create' }).click();
  13 |   await page.getByRole('link', { name: 'New Board' }).click();
  14 |   await page.getByRole('button', { name: '+' }).first().click();
  15 |   await page.locator('div').filter({ hasText: /^To DoDrop cards here\+$/ }).getByPlaceholder('Add card…').click();
  16 |   await page.locator('div').filter({ hasText: /^To DoDrop cards here\+$/ }).getByPlaceholder('Add card…').fill('Card 1');
  17 |   await page.getByRole('button', { name: '+' }).first().click();
  18 |   await page.locator('div').filter({ hasText: /^To DoCard 1\+$/ }).getByPlaceholder('Add card…').click();
  19 |   await page.locator('div').filter({ hasText: /^To DoCard 1\+$/ }).getByPlaceholder('Add card…').fill('Card 2');
  20 |   await page.getByRole('button', { name: '+' }).first().click();
  21 |   await page.locator('div').filter({ hasText: /^DoingDrop cards here\+$/ }).getByPlaceholder('Add card…').click();
  22 |   await page.locator('div').filter({ hasText: /^DoingDrop cards here\+$/ }).getByPlaceholder('Add card…').fill('Card 3');
  23 |   await page.getByRole('button', { name: '+' }).nth(1).click();
  24 |   await page.locator('div').filter({ hasText: /^DoneDrop cards here\+$/ }).getByPlaceholder('Add card…').click();
  25 |   await page.locator('div').filter({ hasText: /^DoneDrop cards here\+$/ }).getByPlaceholder('Add card…').fill(' Card 4');
  26 |   await page.getByRole('button', { name: '+' }).nth(2).click();
  27 |   await page.getByRole('button', { name: '+ Column' }).click();
  28 |   await page.getByRole('textbox', { name: 'Column name' }).fill('New Column');
  29 |   await page.getByRole('button', { name: 'Create' }).click();
  30 |   await page.locator('div').filter({ hasText: /^New Column$/ }).getByRole('button').click();
  31 |   await page.getByRole('menuitem', { name: 'Rename' }).click();
  32 |   await page.getByRole('textbox').click();
  33 |   await page.getByRole('textbox').fill('Commissioned');
  34 |   await page.getByRole('button', { name: 'Save' }).click();
  35 |   await page.getByRole('button', { name: 'Card 4' }).click();
  36 |   await page.getByRole('button', { name: 'Card 4' }).click();
  37 |   await page.getByRole('button', { name: 'Card 4' }).click();
  38 |   await page.getByRole('button', { name: 'Card 3' }).click();
  39 |   await page.getByRole('button', { name: 'Card 4' }).click();
  40 |   await page.getByRole('button', { name: 'Card 4' }).click();
  41 |   await page.getByRole('button', { name: 'Card 2' }).getByRole('button').click();
  42 |   await page.getByRole('menuitem', { name: 'Rename' }).click();
  43 |   await page.getByRole('textbox').click();
  44 |   await page.getByRole('textbox').fill('Code');
  45 |   await page.getByRole('button', { name: 'Save' }).click();
  46 |   await page.getByRole('button', { name: 'Sign Out' }).click();
  47 | });
```