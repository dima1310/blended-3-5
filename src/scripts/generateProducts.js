import fs from 'node:fs/promises';
import { PATH_DB } from '../constants/products.js';
import { createFakeProduct } from '../utils/creteFakeProduct.js';
import { readProducts } from '../utils/readProducts.js';

async function generateProducts(count) {
  try {
    let existingProducts = readProducts;

    try {
      const data = await fs.readFile(PATH_DB, 'utf-8');
      existingProducts = JSON.parse(data);
    } catch (error) {
      console.log('Файл не існує або порожній, створюємо новий масив');
      existingProducts = [];
    }

    const newProducts = [];
    for (let i = 0; i < count; i++) {
      newProducts.push(createFakeProduct());
    }

    const allProducts = [...existingProducts, ...newProducts];

    await fs.writeFile(PATH_DB, JSON.stringify(allProducts, null, 2), 'utf-8');

    console.log(`Успішно згенеровано ${count} нових продуктів`);
    console.log(`Загальна кількість продуктів: ${allProducts.length}`);

    return allProducts;
  } catch (error) {
    console.error('Помилка при генерації продуктів:', error);
    throw error;
  }
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const count = parseInt(process.argv[2]) || 5;
  generateProducts(count);
}

export { generateProducts };
