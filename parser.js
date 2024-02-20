import puppeteer from "puppeteer";
import { messages } from './rout/auth/messages.js';

export async function parseData(photodb) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://dzen.ru/a/Y8vnUBsDQiKKbKTb');

  // Получаем текущие данные из базы данных
  const existingAttractions = await photodb.find({}, { _id: 0 }).toArray();
  const existingAttractionNames = existingAttractions.map(attraction => attraction.attraction);

  const attractions = await page.evaluate((existingAttractionNames) => {
    const spans = Array.from(document.querySelectorAll('h2[data-testid="article-render__block"] span'));
    const images = Array.from(document.querySelectorAll('.article-image-item__image'));

    const newAttractions = [];

    spans.forEach((span, index) => {
      const textContent = span.textContent.trim();

      if (textContent && textContent.includes(':')) {
        const [attraction, countries] = textContent.split(':').map(part => part.trim());
        const city = countries.split(',').pop();
        const firstCountry = countries.split(',')[0].trim();

        const imageElement = images[index];
        const imageUrl = imageElement ? imageElement.getAttribute('src') : '';

        // Проверка наличия аттракции в существующих данных
        if (!existingAttractionNames.includes(attraction)) {
          newAttractions.push({
            attraction,
            countries: firstCountry,
            city,
            img: imageUrl,
          });
        } else {
          console.log(`Аттракция '${attraction}' уже существует в базе данных.`);
        }
      }
    });

    return newAttractions;
  }, existingAttractionNames);

  // Сохраняем только новые данные
  if (attractions.length > 0) {
    await photodb.insertMany(attractions);
    console.log(messages.success.dataParsedDatabase);
  } else {
    console.log(messages.success.newParsedDatabase);
  }

  await browser.close();
}



