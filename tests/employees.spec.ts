// import { test, expect } from '@playwright/test';
import { test, expect } from '../fixtures/fixtures';
import { EmployeeHubPage } from '../pages/EmployeeHubPage';
import { buildEmployee } from '../data/employee';
import { EmployeeProfilePage } from '../pages/EmployeeProfilePage';


test.describe('Employee hub', { tag: '@regression' }, () => {
  test('two employees can be added and both are then displayed', { tag: '@smoke' }, async ({ page, hub }) => {
    const first = buildEmployee('Ada');
    const second = buildEmployee('Grace');

    await test.step('add the first employee, filling in all fields', async () => {
      await hub.addEmployee(first);
      await hub.expectEmployeeVisible(first);
    });

    await test.step('add a second employee', async () => {
      await hub.addEmployee(second);
      await hub.expectEmployeeVisible(second);
    });

    await test.step('navigate to the employee tab and verify both are displayed', async () => {
      await page.reload();
      await expect(hub.heading).toBeVisible();

      await hub.expectEmployeeVisible(first);
      await hub.expectEmployeeVisible(second);

      await hub.expectEmployeeListedOnce(first);
      await hub.expectEmployeeListedOnce(second);
    });
  });
});


  test('an employee can be deleted', {tag: ['@smoke', '@prerelease'],}, async ({ page }) => {
    const hub = new EmployeeHubPage(page);
    const profile = new EmployeeProfilePage(page);
    await hub.goto();

    const employee = buildEmployee('Temporary');
    await hub.addEmployee(employee);
    await hub.expectEmployeeVisible(employee);

    const id = await hub.getEmployeeId(employee);
    expect(id, 'the new employee should have a profile link').toBeTruthy();

    await profile.deleteEmployee(id!, employee);

    await expect(async () => {
      await page.reload();
      await expect(hub.employeeRows(employee)).toHaveCount(0);
    }).toPass({ timeout: 60_000 });
});