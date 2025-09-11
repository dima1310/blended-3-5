import fs from 'node:fs/promises';
import { PATH_DB } from '../constants/products.js';

export const writeProducts = async (data) => {
  try {
    const data = await fs.writeFile(PATH_DB, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};
