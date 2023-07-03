const { Builder, By } = require("selenium-webdriver");

// URL of the webpage to scrape
const url =
  "https://www.jeevee.com/products/mamaearth-aqua-glow-hydrating-sunscreen-gel-50-gm-14976";

(async () => {
  // Launch a new browser instance
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    // Navigate to the URL
    await driver.get(url);

    // Define an array of selector-label pairs for the title elements
    const titleSelectors = [
      {
        selector: "div.flex.items-start.justify-between",
        label: "OverAll Title",
      },
      { selector: "span.text-sm", label: "span element" },
      { selector: "h1", label: "h1 element" },
      // Add more selector-label pairs as needed
    ];

    // Declare the titles variable as an empty array
    let titles = [];

    // Retrieve the text content from multiple title elements
    for (const { selector, label } of titleSelectors) {
      const titleElement = await driver.findElement(By.css(selector));
      if (titleElement) {
        const innerTitle = await titleElement.getText();
        titles.push({ label, title: innerTitle.trim() });
      }
    }

    if (titles.length === 0) {
      console.log("Title elements not found.");
    }

    // Define an array of selector-label pairs for the description elements
    const descriptionSelectors = [
      {
        selector: "div.bg-white.rounded-b-2xl.rounded-tr-2xl > div",
        label: "OVERALL DESCRIPTION",
      },
      // Description parts
      {
        selector: "h3",
        label: "h3 element",
      },
      { selector: "p", label: "p element" },
      { selector: ".result-list", label: "Description 3" },
      { selector: ".woodmart-list", label: "KEY INGREDIENT" },
      {
        selector: "div.flex-1.app-pd.border-r > div > div > div",
        label: "HOW TO USE",
      },
      { selector: "div.text-xs", label: "Disclaimer" },
      // Add more selector-label pairs as needed
    ];

    // Declare the descriptions variable as an empty array
    let descriptions = [];

    // Retrieve the text content from multiple description elements
    for (const { selector, label } of descriptionSelectors) {
      const descriptionElement = await driver.findElement(By.css(selector));
      if (descriptionElement) {
        const description = await descriptionElement.getText();
        descriptions.push({ label, description: description.trim() });
      }
    }

    if (descriptions.length === 0) {
      console.log("Description elements not found.");
    }

    // Find the image elements by tag name
    const imageElements = await driver.findElements(By.tagName("img"));
    const images = [];

    if (imageElements.length) {
      // Retrieve the image URLs
      for (const imageElement of imageElements) {
        const imageUrl = await imageElement.getAttribute("src");
        images.push(imageUrl);
      }
    } else {
      console.log("Image elements not found.");
    }

    const productData = {
      titles,
      descriptions,
      images,
    };

    console.log("Product Data:", productData);
  } finally {
    // Quit the browser
    await driver.quit();
  }
})();
