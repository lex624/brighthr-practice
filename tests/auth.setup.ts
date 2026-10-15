import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import fs from 'fs';            //store creds in auth 

//sign in once and keep auth creds for all subsequent runs
setup('authenticate', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(process.env.BRIGHTHR_EMAIL!, process.env.BRIGHTHR_PASSWORD!);

  fs.mkdirSync('.auth', { recursive: true });
  await page.context().storageState({ path: '.auth/user.json' });
});