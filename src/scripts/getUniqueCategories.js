import fs from 'node:fs/promises';
import { PATH_DB } from '../constants/products';

async function getUniqueCategories() {
  try {
    const data = await fs.readFile(PATH_DB, 'utf-8');
    const products = JSON.parse(data);

    const categories = products
      .map((product) => product.category)
      .filter(
        (category) =>
          category !== undefined && category !== null && category !== '',
      );

    const getUniqueCategories = [...new Set(categories)];

    return getUniqueCategories;
  } catch (error) {
    console.error('Помілка при чітанні файлу або щтриманні категорій:', error);
    throw error;
  }
}

if (process.argv[1] == new URL(import.meta.url).pathname) {
  getUniqueCategories()
    .then(async (uniqueCategories) => {
      const data = await fs.readFile(PATH_DB, 'utf-8');
      const products = JSON.parse(data);

      console.log(`\n Аналіз категорії продуктів`);
      console.log('='.repeat(50));

      if (products.length == 0) {
        console.log(' Продуктів немає');
        console.log('Згенеруймо продукти командою: npm run generate 10');
        return;
      }
      console.log(` Всього продуктів: ${products.length}`);
      console.log(` Унікальні категорії (${uniqueCategories.length}`);

      if (uniqueCategories.length == 0) {
        console.log(' Унікальних категорій немає');
        return;
      }

      console.log('\n Список унікальних категорій:');
      uniqueCategories.forEach((category, index) => {
        console.log(`  ${index + 1}. ${category}`);
      });

      const categoryStats = uniqueCategories.map((category) => {
        const productsInCategory = products.filter(
          (product) => product.category == category,
        );
        const totalValue = productsInCategory.reduce(
          (sum, product) => sum + (product.price || 0),
          0,
        );
        const avgPrice =
          productsInCategory.length > 0
            ? totalValue / productsInCategory.length
            : 0;

        return {
          name: category,
          count: productsInCategory.length,
          totalValue: totalValue,
          avgPrice: avgPrice,
        };
      });

      categoryStats.sort((a, b) => b.count - a.count);

      console.log('\n Детальна статистика по категоріям:');
      console.log(
        '┌─────────────────────────┬─────────┬──────────────┬─────────────┐',
      );
      console.log(
        '│ Категорія               │ К-сть   │ Загальна $   │ Середня $   │',
      );
      console.log(
        '├─────────────────────────┼─────────┼──────────────┼─────────────┤',
      );

      categoryStats.forEach((stat) => {
        const name = stat.name.padEnd(23);
        const count = stat.count.toString().padStart(7);
        const total = `$${stat.totalValue.toFixed(2)}`.padStart(12);
        const avg = `$${stat.avgPrice.toFixed(2)}`.padStart(11);
        console.log(`│ ${name} │ ${count} │ ${total} │ ${avg} │`);
      });

      console.log(
        '└─────────────────────────┴─────────┴──────────────┴─────────────┘',
      );

      console.log('\n Топ 3 категорії за кількістю продуктів;');
      categoryStats.slice(0, 3).forEach((stat, index) => {
        console.log(`   ${index + 1}. ${stat.name} - ${stat.count} продуктів`);
      });

      const sortedByValue = [...categoryStats].sort(
        (a, b) => b.totalValue - a.totalValue,
      );
      console.log('\n Топ 3 категорії за загальною вартістю:');
      sortedByValue.slice(0, 3).forEach((stat, index) => {
        console.log(
          `  ${index + 1}, ${stat.name} - $${stat.totalValue.toFixed(2)}`,
        );
      });

      const productsWithoutCategory = products.filter(
        (product) => !product.category || product.category == '',
      );

      if (productsWithoutCategory.length > 0) {
        console.log(
          `\n⚠️  Увага: ${productsWithoutCategory.length} продуктів без категорії`,
        );
      }
    })
    .catch((error) => {
      console.error('❌ Помилка при виконанні:', error.message);
      process.exit(1);
    });
}

export { getUniqueCategories };
