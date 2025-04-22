const puppeteer = require("puppeteer");

// Take the third argument of array and bind to a variable
const args = process.argv.slice(2);
const [trackingID] = args;

if (trackingID === undefined) {
  console.log("ERROR! Please enter a tracking ID.");
  process.exit(0);
}

(async () => {
  const browser = await puppeteer.launch({ headless: false }); // headless set to false to launch full version of browser (browser is displaying)
  const page = await browser.newPage();

  // Open ticket page
  await page.goto(
    "https://www.npra.gov.my/support/admin/admin_ticket.php?track=" + trackingID
  );
  console.log("- Open ticket page.");

  // Login Admin support page
  await page.locator("#regInputUsername").fill("QuestSupport2");
  await page.locator("#regInputPassword").fill("Abc123@");
  await page.locator("#recaptcha-submit").click();
  console.log("- Login.");

  //  KIV - Check if the ticket is resolved or not, if not, click resolve, if it's resolved, continue
  // const markAsResolve = await page.locator('div.value a').filter(a => a.innerText === 'Mark as Resolved').waitHandle();
  // if (markAsResolve) {
  //     await markAsResolve.click();
  //     console.log('- Mark as Resolved.');
  // } else {
  //     console.log('- Ticket is already Resolved.');
  // }

  // Click Print in resolved ticket
  // await page.locator('a[title="Print"]').click();
  // console.log("- Click Print");

  // Close Print Dialog
  // Wait a bit to make sure the print dialog opens
  // const printUrl = await page.locator('a[title="Print"]').getAttribute('href');
  // const printPage = await browser.newPage();

  // Override window.print BEFORE navigating to the print page
  await page.evaluateOnNewDocument(() => {
    window.print = () => {}; // disable print dialog
  });
  await page.goto('https://www.npra.gov.my/support/admin/print.php?track=' + trackingID);
  console.log("- Go to Print page.");

  const pageContent = await page.locator('body').content();
  console.log(pageContent);
  
  // await new Promise(resolve => setTimeout(resolve, 10000));
  // console.log("- Wait for 10 seconds.");
  // Press Escape to close the print dialog
  // await page.keyboard.press('Escape');
  // await page.close();
  // console.log("- Click Escape.");

  // await browser.close();
})();
