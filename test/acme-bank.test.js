'use strict';

const {
  ClassicRunner,
  Eyes,
  Target,
  RectangleSize,
  Configuration,
  BatchInfo } = require('@applitools/eyes-webdriverio');

describe('ACME Bank', function () {
  // This WebdriverIO test case class contains everything needed to run a full visual test against the ACME bank site.
  // It runs the test locally against Google Chrome using the Applitools classic runner.
  // If you want to run cross-browser visual tests, consider using the Ultrafast Grid.

  // Test control inputs to read once and share for all tests
  var applitoolsApiKey;

  // Applitools objects to share for all tests
  let batch;
  let config;
  let runner;

  // Test-specific objects
  let eyes;


  before(async () => {
    // This method sets up the configuration for running visual tests locally using the classic runner.
    // The configuration is shared by all tests in a test suite, so it belongs in a `before` method.
    // If you have more than one test class, then you should abstract this configuration to avoid duplication. 

    // Read the Applitools API key from an environment variable.
    // To find your Applitools API key:
    // https://applitools.com/tutorials/getting-started/setting-up-your-environment.html
    applitoolsApiKey = process.env.APPLITOOLS_API_KEY;

    // Create the classic runner.
    runner = new ClassicRunner();

    // Create a new batch for tests.
    // A batch is the collection of visual checkpoints for a test suite.
    // Batches are displayed in the Eyes Test Manager, so use meaningful names.
    batch = new BatchInfo('Applitools Example: WebdriverIO 7 JavaScript with the Classic Runner');

    // Create a configuration for Applitools Eyes.
    config = new Configuration();
    
    // Set the Applitools API key so test results are uploaded to your account.
    // If you don't explicitly set the API key with this call,
    // then the SDK will automatically read the `APPLITOOLS_API_KEY` environment variable to fetch it.
    config.setApiKey(applitoolsApiKey);

    // Set the batch for the config.
    config.setBatch(batch);
  });
  
  
  beforeEach(async function () {
    // This method sets up each test with its own ChromeDriver and Applitools Eyes objects.
    
    // Create the Applitools Eyes object connected to the runner and set its configuration.
    eyes = new Eyes(runner);
    eyes.setConfiguration(config);

    // Open Eyes to start visual testing.
    // It is a recommended practice to set all four inputs:
    browser = await eyes.open(
      
        // WebDriver object to "watch".
        browser,
        
        // The name of the application under test.
        // All tests for the same app should share the same app name.
        // Set this name wisely: Applitools features rely on a shared app name across tests.
        'ACME Bank',
        
        // The name of the test case for the given application.
        // Additional unique characteristics of the test may also be specified as part of the test name,
        // such as localization information ("Home Page - EN") or different user permissions ("Login by admin").
        this.currentTest.fullTitle(),
      
        // The viewport size for the local browser.
        // Eyes will resize the web browser to match the requested viewport size.
        // This parameter is optional but encouraged in order to produce consistent results.
        new RectangleSize(1024, 768)
    );
  });
  
  it('should log into a bank account', async () => {
    // This test covers login for the Applitools demo site, which is a dummy banking app.
    // The interactions use typical Selenium calls,
    // but the verifications use one-line snapshot calls with Applitools Eyes.
    // If the page ever changes, then Applitools will detect the changes and highlight them in the Eyes Test Manager.
    // Traditional assertions that scrape the page for text values are not needed here.

    // Load the login page.
    await browser.url('https://demo.applitools.com');

    // Verify the full login page loaded correctly.
    await eyes.check(Target.window().fully().withName("Login page"));
    
    // Perform login.
    await browser.$("#username").setValue("andy");
    await browser.$("#password").setValue("i<3pandas");
    await browser.$("#log-in").click();

    // Verify the full main page loaded correctly.
    // This snapshot uses LAYOUT match level to avoid differences in closing time text.
    await eyes.check(Target.window().fully().withName("Main page").layout());
  });
  
  afterEach(async () => {

    // Close Eyes to tell the server it should display the results.
    await eyes.closeAsync();

    // Quit the WebdriverIO instance
    await browser.closeWindow();

    // Warning: `eyes.closeAsync()` will NOT wait for visual checkpoints to complete.
    // You will need to check the Eyes Test Manager for visual results per checkpoint.
    // Note that "unresolved" and "failed" visual checkpoints will not cause the Mocha test to fail.

    // If you want the ACME demo app test to wait synchronously for all checkpoints to complete, then use `eyes.close()`.
    // If any checkpoints are unresolved or failed, then `eyes.close()` will make the ACME demo app test fail.
  });
  
  after(async () => {
    // Close the batch and report visual differences to the console.
    // Note that it forces Mocha to wait synchronously for all visual checkpoints to complete.
    const allTestResults = await runner.getAllTestResults();
    console.log(allTestResults);
  });
  
});
