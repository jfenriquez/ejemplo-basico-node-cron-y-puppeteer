const puppeteer = require("puppeteer");
const fs = require("fs");
const https = require("https");

////// scraping functions para buscar imagen y descargar imágen 
///en pixabay.com

function getLastParameter(url) {
  const urlObj = new URL(url);
  const pathSegments = urlObj.pathname.split("/").filter((segment) => segment);
  return pathSegments[pathSegments.length - 1];
}

async function downloadImage(url, filepath) {
  const file = fs.createWriteStream(filepath);
  https
    .get(url, (response) => {
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        console.log("Image downloaded:", filepath);
      });
    })
    .on("error", (err) => {
      //      fs.unlink(filepath);
      fs.unlink(filepath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Error deleting file:", unlinkErr.message);
        }
      });

      console.error("Error downloading image:", err.message);
    });
}

async function scrapeSecondImage(url) {
  try {
    const browser = await puppeteer.launch({ headless: false });
    //const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 260000 });

    // Esperar a que todas las imágenes se carguen
    await page.waitForSelector("img", { timeout: 260000 });

    // Selecciona todas las imágenes en la página y sus URLs
    const imageUrls = await page.evaluate(() => {
      const images = document.querySelectorAll("img", { timeout: 260000 });
      return Array.from(images).map((img) => img.src);
    });

    console.log("All image URLs:", imageUrls);

    const name = getLastParameter(url);
    if (imageUrls.length > 1) {
      const secondImageUrl = imageUrls[4];
      console.log("Second image URL:", secondImageUrl);
      await downloadImage(secondImageUrl, `${name}.jpg`);
    } else {
      console.log("No second image found");
    }

    // Agregar una pausa para observar el resultado
    await new Promise((resolve) => setTimeout(resolve, 160000));
    await browser.close();
  } catch (error) {
    console.log("Error:", error);
  }
}

//const url = "https://pixabay.com/es/vectors/search/perro/"; // Cambia esto por la URL del sitio web que quieres analizar
//scrapeSecondImage(url);

async function main() {
  const array_url = [
    "https://pixabay.com/es/vectors/search/PASADO",
    "https://pixabay.com/es/vectors/search/PASIÓN",
    "https://pixabay.com/es/vectors/search/PATERNIDAD",
    "https://pixabay.com/es/vectors/search/PATRIA",
    "https://pixabay.com/es/vectors/search/PAZ",
    "https://pixabay.com/es/vectors/search/PECADOS",
    "https://pixabay.com/es/vectors/search/PELIGRO",
    "https://pixabay.com/es/vectors/search/PENA",
    "https://pixabay.com/es/vectors/search/PENSAMIENTO",
  ];

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  for (let url in array_url) {
    console.log("______________", array_url[url]);
    scrapeSecondImage(array_url[url]);
    await delay(8000); // Pausa de 10 segundos para q cargue
  }
}
main();
