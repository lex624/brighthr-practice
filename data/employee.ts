// generate random user data
import { randomUUID } from 'crypto';

export const TEST_DATA_MARKER = 'Testerson';        //fixed label surname

export interface Employee {
  firstName: string; lastName: string; email: string;
  phoneNumber: string; startDate: string; jobTitle: string;
}

export function buildEmployee(firstName = 'Ada'): Employee {
  const id = randomUUID().slice(0, 6);        // use first 6 chars
  return {
    firstName,
    lastName: `${TEST_DATA_MARKER}-${id}`,
    email: `qa.automation+${id}@example.com`,
    phoneNumber: '07700945123',               
    startDate: '01/10/2026',
    jobTitle: 'Automation Test Engineer',
  };
}