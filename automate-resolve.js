const puppeteer = require("puppeteer");
const { convert } = require("html-to-text");

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
  console.log("- Login Admin support page.");

  //  KIV - Check if the ticket is resolved or not, if not, click resolve, if it's resolved, continue
  await new Promise(resolve => setTimeout(resolve, 1000));
  const markAsResolve = await page.$eval('div.value.center.out-close a', el => el.innerHTML);
  // const isNotResolved = markAsResolve.filter(a => a.innerHTML == 'Mark as Resolved');
  // const isNotResolved = markAsResolve.content();
  // console.log(markAsResolve);
  if (markAsResolve === "Mark as Resolved") {
      await page.locator('div.value.center.out-close a').click();
      console.log('- Mark as Resolved.');
  } else {
      console.log('- Ticket is already Resolved.');
  }

  
  // Override window.print BEFORE navigating to the print page
  await page.evaluateOnNewDocument(() => {
    window.print = () => {}; // disable print dialog
  });
  await page.goto('https://www.npra.gov.my/support/admin/print.php?track=' + trackingID);
  console.log("- Go to Print page.");
  
  // Select the content and copy to clipboard.
  await page.keyboard.down('Control');
  await page.keyboard.down('A');
  await page.keyboard.up('A');
  await page.keyboard.down('C');
  await page.keyboard.up('Control');
  await page.keyboard.up('C');
  console.log("- Select all and Copy the content.");
  
  
  // Login Outlook account
  await page.goto('https://outlook.office365.com/mail/');
  await page.locator("#i0116").fill("aqilah@milradius.com.my");
  await page.locator("#idSIButton9").click();
  await new Promise(resolve => setTimeout(resolve, 1000));
  await page.locator("#i0118").fill("Qwerty@mrsb");
  await page.locator("#idSIButton9").click();
  await new Promise(resolve => setTimeout(resolve, 1000));
  await page.locator("#idSIButton9").click();
  console.log("- Login Outlook account.");
  
  // Reply email
  await new Promise(resolve => setTimeout(resolve, 5000));
  await page.locator("#topSearchInput").fill(trackingID);
  await new Promise(resolve => setTimeout(resolve, 3000));
  await page.locator("div[id='searchSuggestion-0']").click();
  await new Promise(resolve => setTimeout(resolve, 3000));
  await page.locator("button[id='557']").click();
  await new Promise(resolve => setTimeout(resolve, 3000));
  await page.locator("div[role='textbox']").fill("Resolved.");
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');
  await page.keyboard.down('Control');
  await page.keyboard.down('V');
  await page.keyboard.up('V');
  // await new Promise(resolve => setTimeout(resolve, 3000));
  // await page.keyboard.down('Enter');
  console.log("- Reply Resolved Ticket assigned email.");
  
  
  
  // Click Print in resolved ticket
  // await page.locator('a[title="Print"]').click();
  // console.log("- Click Print");

  // Close Print Dialog
  // Wait a bit to make sure the print dialog opens
  // const printUrl = await page.locator('a[title="Print"]').getAttribute('href');
  // const printPage = await browser.newPage();
  
  // const pageContent = await page.content();
  // const text = convert(pageContent);
  // // console.log(text);
  // console.log("- Access the content.");

  // await page.locator("div[role='textbox']").fill(text);       // Takes too long

  // await page.locator(".ms-Button.ms-Button--commandBar.ms-Button--hasMenu.root-390").click();
  // await page.locator(".ms-ContextualMenu-link.root-421").click();
  // await page.keyboard.press('ArrowDown');
  // await page.keyboard.press('ArrowDown');
  // await page.keyboard.press('Enter');
  
  // await new Promise(resolve => setTimeout(resolve, 10000));
  // console.log("- Wait for 10 seconds.");
  // Press Escape to close the print dialog
  // await page.keyboard.press('Escape');
  // await page.close();
  // console.log("- Click Escape.");

  // await browser.close();
})();
