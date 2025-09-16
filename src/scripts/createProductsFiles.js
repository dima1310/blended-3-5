import fs from 'fs/promises';
import path from 'node:path';
import { PATH_DB, PATH_FILES_DIR } from '../constants/products.js';

/**
 * Конвертує назву продукту в назву файлу
 * @param {string} productName - назва продукту
 * @returns {string} назва файлу з розширенням .json
 */

function createFileName(productName) {
    return productName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        + '.json';
}

async function createProductsFiles() {
    try {

        console.log('Читання продуктів з базі данних...');
        const data = await fs.readFile(PATH_DB, 'utf-8');
        const products = JSON.parse(data);

        if (products.length === 0) {

            console.log('Продуктів у базі данних немає');
            console.log('Згенеруйте продукти командою: npm run generate 10');
            return;

        }
        console.log(` Знайдено ${products.length} продуктів`);


        console.log('Створення папки files...');
        await fs.mkdir(PATH_FILES_DIR, { recursive: true });


        console.log('Очишення папкі files...');
        try {
            const exitingFiles = await fs.readdir(PATH_FILES_DIR);
            const jsonFiles = exitingFiles.filter(file => file.endsWith('.json'));

            for (const file of jsonFiles) {
                await fs.unlink(path.join(PATH_FILES_DIR, file));
            }
            console.log(` Видалено ${jsonFiles.length} старих файлів`);

        } catch (error) {
// Полка порожня
        }

        console.log('Створення файлів продуктів...');
        const createdFiles = [];
        const errors = [];

        for (let i = 0; i < products.length; i++) {
            const product = products[i];


            try {
                const fileName = createFileName(product.name);
                const filePath = path.join(PATH_FILES_DIR, fileName);


                await fs.writeFile(filePath, JSON.stringify(product, null, 2), 'utf-8');

                createdFiles.push({
                    originalName: product.name,
                    fileName: fileName,
                    path: filePath,
                });

                console.log(` ${i + 1}/${products.length} - ${file.name}`);

            } catch (error) {
                errors.push({
                    product: product.name,
                    error: error.message
                });
                console.log(` ${i + 1}/${products.length} - Помилка: ${product.name}`);
            }
        }

        console.log('\n  Результати створення файлів:');
        console.log(` Успішно створенно: ${createdFiles.length} файлів`);
        console.log(` Помилок: ${errors.length}`);

        if (createdFiles.length > 0) {
            console.log('\n Створені файли:');

            createdFiles.forEach((file, index) => {
                console.log(` ${index + 1}.  "${file.originalName}" -> ${file.fileName}`);

            });

        }

        if (errors.length > 0) {
            console.log('\n Помилка:');
            errors.forEach((error, index) => {
                console.log(`  ${index + 1}. ${error.product}: ${error.error}`);
            });
        }
        console.log(`\n Файли збережено в: ${PATH_FILES_DIR}`);

        return {
            totalProducts: products.length,
            createdFiles: createdFiles.length,
            errors: errors.length,
            filesDir: PATH_FILES_DIR
        };
    } catch (error) {
        console.error(' Помилка при створенні файлів продуктів:', error);
        throw error;
    }
}


if (process.argv[1] === new URL(import.meta.url).pathname) {
    createProductsFiles()
        .then((result) => {
            console.log('\n  Операція завершена успішно!');
            console.log(` Статистика: ${result.createdFiles}/${result.totalProducts} файлів створено`);

            if (result.errors === 0) {
                console.log(' Всі файли створено без помилок!');

            }
        })
        .catch(error => {
            console.error(' Критична помилка:', error.message);
            process.exit(1);
        });
}
export { createProductsFiles };