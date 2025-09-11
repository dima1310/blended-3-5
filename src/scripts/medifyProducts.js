import fs from 'node:fs/promises';
import { PATH_DB } from '../constants/products';

async function modifyProducts() {
  try {
    const data = await fs.readFile(PATH_DB, 'utf-8');
    const products = JSON.parse(data);

    const modifiedProducts = products.map((product) => {
      const { description, ...productWithoutDescription } = product;
      return productWithoutDescription;
    });

    await fs.writeFile(
      PATH_DB,
      JSON.stringify(modifiedProducts, null, 2),
      'utf-8',
    );

    return modifiedProducts;
  } catch (error) {
    console.error('Помилка при читанні або записі файлу:', error);
    throw error;
  }
}

if (process.argv[1] == new URL(import.meta.url).pathname) {
  modifyProducts()
    .then(async (modifiedProducts) => {
      console.log('\n Модифікація продуктів');
      console.log('='.repeat(50));

      if (modifiedProducts.length == 0) {
        console.log(' Продуктів у базі немає');
        console.log('Згенеруймо продукти командою: npm run generate 5');
        return;
      }
      console.log(` Всього продуктив: ${modifiedProducts.length}`);
      console.log('Поле "descriptionn" успішно відалено з усіх продуктів');

      const hasDescription = modifiedProducts.some((product) =>
        product.hasOwnProperty('description'),
      );

      console.log(
        ` Перевірка: ${
          hasDescription
            ? 'Знайдено поле description'
            : 'Поле description відсутне'
        }`,
      );

      if (modifiedProducts.length > 0) {
        console.log('\n Приклад модифікованіх продуктів:');
        console.log(JSON.stringify(modifiedProducts[0], null, 2));

        console.log('\n   Поля, що залишилися в продуктах:');
        const allFields = new Set();
        modifiedProducts.forEach((product) => {
          Object.keys(product).forEach((key) => allFields.add(key));
        });

        Array.from(allFields).forEach((field, index) => {
          console.log(`  ${index + 1}. ${field}`);
        });

        const originalSize = JSON.stringify(modifiedProducts).length;
        console.log(
          `\n Розмир файлу після модіфікації: ${originalSize} символів`,
        );

        const validProducts = modifiedProducts.filter(
          (product) =>
            product.id && product.name && typeof product.price == 'number',
        );

        console.log(`\n Цілісність даніх:`);
        console.log(
          ` Продуктів з обов'язковими полями: ${validProducts.length}/${modifiedProducts.length}`,
        );
        console.log(
          ` Статус; ${
            validProducts.length == modifiedProducts.length
              ? 'ok'
              : 'Є проблеми'
          }`,
        );
      }
    })
    .catch((error) => {
      console.error(' Помілка при віконанні:', error.message);
      process.exit(1);
    });
}
export { modifyProducts };
