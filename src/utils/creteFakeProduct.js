import { faker } from '@faker-js/faker';

export function createFakeProduct() {
  return {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    price: parseFloat(faker.commerce.price()),
    description: faker.commerce.productDescription(),
    category: faker.commerce.department(),
    inStock: faker.datatype.boolean(),
    rating: parseFloat((Math.random() * 5).toFixed(1)),
    createdAt: faker.date.recent().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  };
}
