import { Page, Locator, expect } from '@playwright/test';
import { Employee } from '../data/employee';

export class EmployeeHubPage {
  readonly page: Page;

  // Track created employees so the fixture can delete them after the test.
  readonly created: Employee[] = [];

  readonly heading: Locator;
  readonly sidebarEmployeesLink: Locator;
  readonly addEmployeeButton: Locator;
  readonly searchBox: Locator;
  readonly employeeList: Locator;

  // Add employee modal
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly email: Locator;
  readonly phoneNumber: Locator;
  readonly startDate: Locator;
  readonly jobTitle: Locator;
  readonly sendRegistrationEmail: Locator;
  readonly saveButton: Locator;
  readonly successDialog: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heading = page.getByRole('heading', { name: 'Employee hub' });
    this.sidebarEmployeesLink = page
      .getByRole('navigation', { name: 'Main' })
      .getByRole('link', { name: 'Employees' });
    this.addEmployeeButton = page.getByRole('button', { name: 'Add employee' });
    this.searchBox = page.getByPlaceholder('Name or job title...');
    this.employeeList = page.locator('main');

    this.firstName = page.locator('#firstName');
    this.lastName = page.locator('#lastName');
    this.email = page.locator('#email');
    this.phoneNumber = page.locator('#phoneNumber');
    this.startDate = page.locator('#startDate');
    this.jobTitle = page.locator('#jobTitle');
    this.sendRegistrationEmail = page.locator('#registrationEmail');
    this.saveButton = page.getByRole('button', { name: 'Save new employee' });

    // Scope to the success dialog to avoid matching the add form's close button.
    this.successDialog = page
      .getByRole('dialog')
      .filter({ has: page.getByRole('heading', { name: 'Success! New employee added' }) });
  }

  async goto() {
    await this.page.goto('/dashboard');
    await this.sidebarEmployeesLink.click();
    await this.page.waitForURL(/\/employee-hub/);
    await expect(this.heading).toBeVisible();
  }

  async openAddEmployeeForm() {
    await this.addEmployeeButton.click();
    await expect(this.firstName).toBeVisible();
  }

  async fillEmployeeForm(employee: Employee) {
    await this.firstName.fill(employee.firstName);
    await this.lastName.fill(employee.lastName);
    await this.email.fill(employee.email);
    await this.phoneNumber.fill(employee.phoneNumber);
    await this.jobTitle.fill(employee.jobTitle);

    await this.startDate.fill(employee.startDate);
    // Dismiss the date picker.
    await this.page.getByText('Add new employee').click();

    // untick if ticked to ensure registration emails are disabled
    if (await this.sendRegistrationEmail.isChecked()) {
      await this.page.getByText('Send registration email').click();
    }
    await expect(this.sendRegistrationEmail).not.toBeChecked();
  }

  async saveEmployee(employee: Employee) {
    await expect(this.saveButton).toBeEnabled();
    await this.saveButton.click();

    // The app's own confirmation, naming the employee 
    await expect(this.successDialog).toBeVisible();
    await expect(this.successDialog).toContainText(`${employee.firstName} added`);

    // Close the dialog so it doesn't block further interactions.
    await this.successDialog.getByRole('button', { name: 'Close modal' }).click();
    await expect(this.successDialog).toBeHidden();
  }

  async addEmployee(employee: Employee) {
    await this.openAddEmployeeForm();
    await this.fillEmployeeForm(employee);
    await this.saveEmployee(employee);
    this.created.push(employee);        // Track the employee for teardown cleanup.
  }

  employeeRows(employee: Employee): Locator {
    return this.employeeList.getByText(`${employee.firstName} ${employee.lastName}`, { exact: false });
  }

  async expectEmployeeVisible(employee: Employee) {
    await expect(this.employeeRows(employee).first()).toBeVisible();
  }

  async expectEmployeeListedOnce(employee: Employee) {
    await expect(this.employeeRows(employee)).toHaveCount(1);
  }

  // Extract the employee ID from their profile link for deletion.
  async getEmployeeId(employee: Employee): Promise<string | null> {
    const fullName = `${employee.firstName} ${employee.lastName}`;
    const card = this.page
    .locator('div:has(> a[href^="/employee-profile/"])')
    .filter({ hasText: fullName });

    if ((await card.count()) === 0) return null;

    const href = await card.first().locator('a[href^="/employee-profile/"]').getAttribute('href');
    return href?.split('/employee-profile/')[1]?.split('/')[0] ?? null;
  }

}