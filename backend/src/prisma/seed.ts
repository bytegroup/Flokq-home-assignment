import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create test user
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: hashedPassword,
    },
  });

  console.log('Created user:', user.email);

  // Create sample parts
  const parts = await prisma.part.createMany({
    data: [
      {
        name: 'Engine Oil Filter',
        brand: 'Bosch',
        price: 12.99,
        stock: 150,
        category: 'Filters',
      },
      {
        name: 'Brake Pads Set',
        brand: 'Brembo',
        price: 89.99,
        stock: 75,
        category: 'Brakes',
      },
      {
        name: 'Air Filter',
        brand: 'K&N',
        price: 45.5,
        stock: 200,
        category: 'Filters',
      },
      {
        name: 'Spark Plugs (Set of 4)',
        brand: 'NGK',
        price: 32.99,
        stock: 120,
        category: 'Ignition',
      },
      {
        name: 'Wiper Blades',
        brand: 'Rain-X',
        price: 24.99,
        stock: 90,
        category: 'Accessories',
      },
      {
        name: 'Battery',
        brand: 'Optima',
        price: 189.99,
        stock: 45,
        category: 'Electrical',
      },
      {
        name: 'Alternator',
        brand: 'Denso',
        price: 245.0,
        stock: 30,
        category: 'Electrical',
      },
      {
        name: 'Radiator',
        brand: 'Mishimoto',
        price: 320.0,
        stock: 25,
        category: 'Cooling',
      },
    ],
  });

  console.log(`Created ${parts.count} parts`);
  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
