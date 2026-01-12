import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🗑️ Cleaning up products...");

    // 1. Delete OrderItems first (because they reference Products without Cascade)
    console.log("   - Deleting OrderItems...");
    await prisma.orderItem.deleteMany({});

    // 2. Delete Reviews (Cascade from Product, but cleaning explicitly is fine too)
    // 3. Delete CartItems (Cascade from Product)

    // 4. Delete Products
    console.log("   - Deleting Products...");
    const { count } = await prisma.product.deleteMany({});

    console.log(`✅ Removed ${count} products.`);
    console.log("Note: OrderItems were also removed to enforce referential integrity.");
}

main()
    .catch((e) => {
        console.error("❌ Error cleaning products:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
