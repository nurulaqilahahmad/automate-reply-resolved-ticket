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

  await page.goto(
    "https://www.npra.gov.my/support/admin/admin_ticket.php?track=" + trackingID
  );
  console.log("- Open ticket page.");

  await page.locator("#regInputUsername").fill("QuestSupport2");
  await page.locator("#regInputPassword").fill("Abc123@");
  await page.locator("#recaptcha-submit").click();
  console.log("- Login.");

  //  KIV
  // const markAsResolve = await page.locator('div.value a').filter(a => a.innerText === 'Mark as Resolved').waitHandle();
  // if (markAsResolve) {
  //     await markAsResolve.click();
  //     console.log('- Mark as Resolved.');
  // } else {
  //     console.log('- Ticket is already Resolved.');
  // }

  await page.locator('a[title="Print"]').click();
  console.log("- Click Print");

  window.print();
  setTimeout("closePrintView()", 3000); // delay required for IE to realise what's going on
  window.onafterprint = closePrintView();
  function closePrintView() {
    // do something
  }
  console.log("- Close Print Dialog");

  // await browser.close();
})();
