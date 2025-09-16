import fs from 'node:fs/promises';
import { PATH_DB } from '../constants/products';

async function groupProductsByCategories() {
    try {
        const data = await fs.readFile(PATH_DB, 'utf-8');
        const products = JSON.parse(data);

        const groupedByCategories = products.reduce((acc, product) => {
            const category = product.category || 'Uncategorized';

            if (!acc(category)) {
                acc[category] = [];
            }
            acc[category].push(product);

            return acc;
        },
            
            {});

        return groupedByCategories;
    }
    catch (error) {
        console.error('Помилка при читанні файлу:', error);
        throw error;
     }
}
    
if (process.argv[1] == new URL(import.meta.url).pathname) {
    groupProductsByCategories()
        .then(async (groupedProducts) => {


            const data = await fs.readFile(PATH_DB, 'utf-8');
            const products = JSON.parse(data);

            console.log('\n Групування продуктів за категоріями');
            console.log('='.repeat(60));

            if (products.length == 0) {

                console.log(' Продуктів у базі даних немає');
                console.log('Згенеруйте продукти командою: npm run generate 10');
                return;

            }

            console.log(` Всього продуктів: ${products.length}`);
            console.log(` Всього лфеугорій: ${Object.keys(groupedProducts).length}\n`);


            console.log(' Продукти згруповані за категоріямі:\n');

            Object.entries(groupedProducts).forEach(([category, productNames]) => {
                console.log(` ${category}:`);
                console.log(`. Кільлість продуктів: ${productNames.length}`);
                console.log(` Назви продуктів:`);
                productNames.forEach((name, index) => {
                    console.log(`  ${index + 1}. ${name}`);


                });
                console.log('');

            });


            const categoryCounts = Object.entries(groupedProducts)
                .map(([category, products]) => ({ category, count: names.length }))
                .sort((a, b) => b.count - a.count);
            
            console.log(' Статистика по категоріях:');
            categoryCounts.forEach(({ item, index }) => {
                console.log(` ${index + 1}. ${item.category} - ${item.count} продуктив`);

            });

            if (categoryCounts.length > 0) {
                const topCategory = categoryCounts[0];
                console.log(`\n Найпопулярніша категорія: "${topCategory.category}"  (${topCategory.count} продуктив`);
            }

            console.log('\n JSON представленія результату:');
            console.log(JSON.stringify(groupedProducts, null, 2));

        })
        .catch((error) => {
            console.error('Помилка при виконані:', error.message);
            process.exit(1);
        });
}
export { groupProductsByCategories };
