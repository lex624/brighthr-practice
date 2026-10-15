//test setup/teardown
import { test as base } from '@playwright/test';        
import { EmployeeHubPage } from '../pages/EmployeeHubPage';
import { EmployeeProfilePage } from '../pages/EmployeeProfilePage';

// new test fixture ready to use to accommodate setup/teardown
export const test = base.extend<{ hub: EmployeeHubPage }>({
  hub: async ({ page }, use, testInfo) => {
    // ---- setup ----
    const hub = new EmployeeHubPage(page);
    await hub.goto();

    await use(hub);          // run from here

    // ---- teardown ----
    const profile = new EmployeeProfilePage(page);

    // Delete all employees created during the test
    for (const employee of hub.created) {
      try {
        await hub.goto();
        const id = await hub.getEmployeeId(employee);
        if (!id) continue;                    // already gone, or never created
        await profile.deleteEmployee(id, employee);
      } catch (error) {
        testInfo.annotations.push({
          type: 'cleanup-failed',
          description: `Could not delete ${employee.firstName} ${employee.lastName}: ${
            error instanceof Error ? error.message : String(error)
          }`,
        });
      }
    }
  },
});

export { expect } from '@playwright/test';