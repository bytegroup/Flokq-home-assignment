import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
    try {
        const filePath = path.join(__dirname, 'parts.sql');
        const sql = fs.readFileSync(filePath, 'utf8');

        // Check if data already exists (optional)
        const count = await prisma.part.count();
        if (count > 0) {
            console.log('✅ Seed skipped — parts already exist.');
            return;
        }

        console.log('🌱 Running SQL seed file...');
        await prisma.$executeRawUnsafe(sql);
        console.log('✅ Database seeded successfully.');
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
