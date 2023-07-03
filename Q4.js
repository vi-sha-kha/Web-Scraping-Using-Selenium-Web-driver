const { Builder, By, Key, until } = require("selenium-webdriver");
require("chromedriver");

async function scrapeHamrobazar() {
  try {
    const driver = await new Builder().forBrowser("chrome").build();
    await driver.get("https://hamrobazaar.com/");

    // Wait for the product listings to load
    await driver.wait(until.elementLocated(By.css("section")));

    let previousHeight = 0;
    let currentHeight = await driver.executeScript(
      "return document.body.scrollHeight"
    );
    let scrollAttempts = 0;
    const maxScrollAttempts = 1; // Maximum number of scroll attempts

    // Scroll to the bottom of the page until no more items are loaded or maximum scroll attempts reached
    while (
      previousHeight !== currentHeight &&
      scrollAttempts < maxScrollAttempts
    ) {
      previousHeight = currentHeight;
      await driver.executeScript(
        "window.scrollTo(0, document.body.scrollHeight)"
      );
      await driver.sleep(2000); // Wait for the page to load new items
      currentHeight = await driver.executeScript(
        "return document.body.scrollHeight"
      );
      scrollAttempts++;
    }

    // Wait for all product listings to load
    await driver.wait(
      until.elementsLocated(By.css("section .card-product-linear"))
    );

    // Extract product listings
    const productListings = await driver.findElements(
      By.css("section .card-product-linear")
    );

    // Array to hold the scraped data
    const products = [];

    // Iterate over each product listing
    for (const listing of productListings) {
      const title = await listing
        .findElement(By.css(".nameAndDropdown"))
        .getText();
      const price = await listing
        .findElement(By.css(".priceAndCondition"))
        .getText();
      const location = await listing
        .findElement(By.css(".locationAndTime"))
        .getText();
      const description = await listing.findElement(By.css("p")).getText();
      const image = await listing
        .findElement(By.css("img"))
        .getAttribute("src");

      // Create an object with the scraped data
      const product = {
        title,
        price,
        location,
        description,
        image,
      };

      // Push the object to the array
      products.push(product);
    }

    await driver.quit();

    // Log the array of objects
    console.log(products);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// Call the scraper function
scrapeHamrobazar();
