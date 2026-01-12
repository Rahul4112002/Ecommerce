import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🗑️ Cleaning up ENTIRE database...");

    // Delete dependent data first to avoid Foreign Key constraints
    console.log("   - Deleting OrderItems...");
    await prisma.orderItem.deleteMany({});

    console.log("   - Deleting OrderTracking...");
    await prisma.orderTracking.deleteMany({});

    console.log("   - Deleting Orders...");
    await prisma.order.deleteMany({});

    console.log("   - Deleting Reviews...");
    await prisma.review.deleteMany({});

    console.log("   - Deleting Wishlists...");
    await prisma.wishlist.deleteMany({});

    console.log("   - Deleting CartItems...");
    await prisma.cartItem.deleteMany({});

    console.log("   - Deleting Carts...");
    await prisma.cart.deleteMany({});

    console.log("   - Deleting Addresses...");
    await prisma.address.deleteMany({});

    // Products
    console.log("   - Deleting Products...");
    await prisma.product.deleteMany({});

    // Users & Auth
    console.log("   - Deleting Accounts & Sessions...");
    await prisma.account.deleteMany({});
    await prisma.session.deleteMany({});

    console.log("   - Deleting Users...");
    await prisma.user.deleteMany({});

    console.log("✅ Database cleared successfully.");
}

main()
    .catch((e) => {
        console.error("❌ Error cleaning database:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
