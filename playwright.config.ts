import { PlaywrightTestConfig,devices } from "playwright/test";



const TIMEOUTS = {
    GLOBAL: 45*60*1000,
    TEST: 2*60*1000,
    EXPECT: 15*1000,
    ACTIONS: 20*1000,
    ELEMENT: 15*1000,
    NAVIGATION: 45*1000,
    API: 30*1000
} as const;


const config: PlaywrightTestConfig = {

    globalTimeout: TIMEOUTS.GLOBAL,
    timeout: TIMEOUTS.TEST,

    expect: {
        timeout: TIMEOUTS.EXPECT
    },

    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['html'], ['junit', { outputFile: 'test-results/junit.xml' }]],

  
  use: {
    actionTimeout: TIMEOUTS.ACTIONS,
    navigationTimeout: TIMEOUTS.NAVIGATION,
    
    // Screenshots and videos
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    
    // Browser settings
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] ,
             headless: true},
      
    },

  

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],
};

export default config;