import fs from 'node:fs/promises';
import { PATH_DB } from '../constants/products.js';

async function getTotalPrice() {
  try {
    const data = await fs.readFile(PATH_DB, 'utf-8');
    const products = JSON.parse(data);

    const totalPrice = products.reduce((sum, product) => {
      return sum + product.price || 0;
    }, 0);

    return totalPrice;
  } catch (error) {
    console.error(
      'Помілка при читанні файлу або обчисленні загальної вартості',
    );
    throw error;
  }
}

if (process.argv[1] == new URL(import.meta.url).pathname) {
  getTotalPrice()
    .then(async (totalPrice) => {
      const data = await fs.readFile(PATH_DB, 'utf-8');
      const products = JSON.parse(data);

      console.log(`\n Загальна вартість всіх продуктів`);
      console.log('='.repeat(50));
      if (products.length == 0) {
        console.log(' Продуктів немає');
        console.log('Згенеруймо продукти командою: npm run generate 5');
        return;
      }

      console.log(` Загальна вартість продуктів: $(products.length)`);
      console.log(` Загальна вартість продуктів: $${totalPrice.toFixed(2)}`);

      const prices = products.map((p) => p.price || 0);
      const avgPrice =
        prices.length > 0
          ? prices.reduce((sum, price) => sum + price, 0) / prices.length
          : 0;
      const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
      const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

      console.log('\n Статистика:');
      console.log(`  Середня ціна: $${avgPrice.toFixed(2)}`);
      console.log(`  Максимальна ціна: $${maxPrice.toFixed(2)}`);
      console.log(`. Мінімальна ціна: $${minPrice.toFixed(2)}`);

      const sortedProducts = [...products].sort((a, b) => b.price - a.price);
      console.log(`\n Топ 5 найдорожчих продуктив:`);
      sortedProducts.slice(0, 3).forEach((product, index) => {
        console.log(
          `   ${index + 1}. ${product.name} - $${product.price.toFixed(2)}`,
        );
      });

      const categoryTotals = products.reduce((acc, product) => {
        const category = product.category || 'Невідома категорія';
        if (!acc[category]) {
          acc[category] = { total: 0, count: 0 };
        }
        acc[category].total += product.price || 0;
        return acc;
      }, {});

      console.log(`\n Загальна вартість по категоріям:`);
      Object.entries(categoryTotals)
        .sort(([, a], [, b]) => b.total - a.total)
        .forEach(([category, data]) => {
          console.log(
            `   ${category}: $${data.total.toFixed(2)} (${data.count} шт.)`,
          );
        });
    })
    .catch((error) => {
      console.log('Помилка прі віконнанні:', error.message);
      process.exit(1);
    });
}

export { getTotalPrice };
