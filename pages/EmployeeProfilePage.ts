import { Page, Locator, expect } from '@playwright/test';
import { Employee } from '../data/employee';

export class EmployeeProfilePage {
  readonly page: Page;
  readonly confirmCheckbox: Locator;
  readonly confirmLabel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.confirmCheckbox = page.locator('[data-testid="deleteCheckBox"]');
    this.confirmLabel = page.getByText('I understand this action cannot be reversed');
  }

  deleteButton(employee: Employee): Locator {
    return this.page.getByRole('button', { name: `Delete ${employee.firstName}` });
  }

  async deleteEmployee(employeeId: string, employee: Employee) {
    await this.page.goto(`/employee-profile/${employeeId}/delete`);
    await expect(this.confirmLabel).toBeVisible();

    await expect(
      this.deleteButton(employee),
      'A permanent delete should stay disabled until the warning is acknowledged',
    ).toBeDisabled();

    await this.confirmCheckbox.dispatchEvent('click');
    await expect(this.confirmCheckbox).toBeChecked();

    await expect(this.deleteButton(employee)).toBeEnabled();
    await this.deleteButton(employee).click();
  }
}