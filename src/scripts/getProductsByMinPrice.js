import fs from 'node:fs/promises';
import { PATH_DB } from '../constants/products.js';

async function getProductsByMinPrice(minPrice) {
  try {
    const data = await fs.readFile(PATH_DB, 'utf-8');
    const products = JSON.parse(data);

    const filteredProducts = products.filter();

    return filteredProducts;
  } catch (error) {
    console.error('Помилка при читанні файлу або фільтрації продуктів:', error);
    throw error;
  }
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const minPrice = parseFloat(process.argv[2]);

  if (isNaN(minPrice)) {
    console.error('❌ Помилка: Необхідно вказати коректну мінімальну ціну');
    console.log('Приклад використання: npm run get-products-by-min-price 100');
    process.exit(1);
  }

  getProductsByMinPrice(minPrice)
    .then((products) => {
      console.log(`\n Пошук продуктів з ціною від $${minPrice}`);
      console.log(` Знайдено продуктів: ${products.length}`);

      if (products.length === 0) {
        console.log('🚫 Продуктів з такою мінімальною ціною не знайдено');
      } else {
        console.log('\n Знайдені продукти:');
        products.forEach((product, index) => {
          console.log(`\n${index + 1}. ${product.name}`);
          console.log(` Ціна: $${product.price}`);
          console.log(` Категорія: ${product.category}`);
          console.log(` Опис: ${product.description.substring(0, 50)}...`);
        });

        const avgPrice =
          products.reduce((sum, product) => sum + product.price, 0) /
          products.length;
        const maxPrice = Math.max(...products.map((p) => p.price));
        const minPriceInResults = Math.min(...products.map((p) => p.price));

        console.log('\n Статистика:');
        console.log(`   Середня ціна: $${avgPrice.toFixed(2)}`);
        console.log(`   Максимальна ціна: $${maxPrice}`);
        console.log(`   Мінімальна ціна в результатах: $${minPriceInResults}`);
      }
    })
    .catch((error) => {
      console.error('❌ Помилка при виконанні:', error.message);
      process.exit(1);
    });
}

export { getProductsByMinPrice };
