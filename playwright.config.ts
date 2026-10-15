//urls-browser timetous retries-reporting
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  testDir: './tests',                     //results dir
  retries: process.env.CI ? 2 : 0,        // 2 retries
  timeout: 60_000,                         // timeout (per test ms)
  expect: { timeout: 15_000 },             // timeout (per assertion)
  reporter: [['list'], ['html', { open: 'never' }]],   // report dir

  use: {
    baseURL: 'https://sandbox-app.brighthr.com',       // base url
    actionTimeout: 15_000,              //click fill timeout ms
    navigationTimeout: 30_000,          //page load timout ms
    trace: 'retain-on-failure',         //DOM ntwrk console
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: '.auth/user.json' },
      dependencies: ['setup'],
    },
  ],
});