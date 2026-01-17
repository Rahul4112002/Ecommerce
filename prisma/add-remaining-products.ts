// Add remaining 5 FLOCK Premium products
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Adding remaining FLOCK Premium products...');

    // Get category
    const category = await prisma.category.findFirst({
        where: { slug: 'eyeglasses' }
    });

    if (!category) {
        throw new Error('Eyeglasses category not found');
    }

    // Get brand
    const brand = await prisma.brand.findFirst({
        where: { slug: 'flock-premium' }
    });

    if (!brand) {
        throw new Error('FLOCK Premium brand not found');
    }

    // Products to add (excluding M-7710 Gold which user manually added)
    const productsToAdd = [
        {
            name: "FLOCK Premium Round Frame M-7710 Silver",
            slug: "flock-premium-round-frame-m-7710-silver",
            sku: "FLOCK-M7710-SILVER",
            description: "Premium silver round metal eyeglasses frame with classic design. Lightweight and comfortable. Made in India with premium quality materials. Model: M-7710-50-20",
            imageUrl: "/products/frame-m7710-silver.png",
            gender: "UNISEX" as const,
            shape: "ROUND" as const,
            material: "METAL" as const,
        },
        {
            name: "FLOCK Premium Rectangle Frame M-7706 Silver",
            slug: "flock-premium-rectangle-frame-m-7706-silver",
            sku: "FLOCK-M7706-SILVER",
            description: "Premium silver rectangular metal eyeglasses frame with modern design. Perfect for professional look. Made in India with premium quality materials. Model: M-7706-51-20",
            imageUrl: "/products/frame-m7706-silver.png",
            gender: "MEN" as const,
            shape: "RECTANGLE" as const,
            material: "METAL" as const,
        },
        {
            name: "FLOCK Premium Rectangle Frame M-7706 Gold",
            slug: "flock-premium-rectangle-frame-m-7706-gold",
            sku: "FLOCK-M7706-GOLD",
            description: "Premium gold rectangular metal eyeglasses frame with sophisticated design. Perfect for business and formal occasions. Made in India with premium quality materials. Model: M-7706-51-20",
            imageUrl: "/products/frame-m7706-gold.png",
            gender: "MEN" as const,
            shape: "RECTANGLE" as const,
            material: "METAL" as const,
        },
        {
            name: "FLOCK Premium Aviator Frame M-7707 Gold",
            slug: "flock-premium-aviator-frame-m-7707-gold",
            sku: "FLOCK-M7707-GOLD",
            description: "Premium gold aviator style metal eyeglasses frame with trendy design. Classic aviator shape for stylish look. Made in India with premium quality materials. Model: M-7707-54-20",
            imageUrl: "/products/frame-m7707-aviator.png",
            gender: "UNISEX" as const,
            shape: "AVIATOR" as const,
            material: "METAL" as const,
        },
        {
            name: "FLOCK Premium Rectangle Frame M-7702 Blue",
            slug: "flock-premium-rectangle-frame-m-7702-blue",
            sku: "FLOCK-M7702-BLUE",
            description: "Premium blue rectangular metal eyeglasses frame with modern design. Stylish blue color for contemporary look. Made in India with premium quality materials. Model: M-7702-54-20",
            imageUrl: "/products/frame-m7702-blue.png",
            gender: "UNISEX" as const,
            shape: "RECTANGLE" as const,
            material: "METAL" as const,
        },
    ];

    let added = 0;
    let skipped = 0;

    for (const product of productsToAdd) {
        // Check if already exists
        const existing = await prisma.product.findFirst({
            where: { slug: product.slug }
        });

        if (existing) {
            console.log(`✓ ${product.name} already exists`);
            skipped++;
            continue;
        }

        try {
            await prisma.product.create({
                data: {
                    name: product.name,
                    slug: product.slug,
                    sku: product.sku,
                    description: product.description,
                    price: 449,
                    comparePrice: 599,
                    categoryId: category.id,
                    brandId: brand.id,
                    stock: 50,
                    isActive: true,
                    isFeatured: true,
                    images: {
                        create: {
                            url: product.imageUrl,
                            alt: product.name,
                            position: 0,
                        }
                    },
                    attributes: {
                        create: {
                            gender: product.gender,
                            shape: product.shape,
                            material: product.material,
                            frameSize: 'MEDIUM',
                        }
                    }
                }
            });

            console.log(`✓ Added: ${product.name}`);
            added++;
        } catch (error) {
            console.error(`✗ Failed to add ${product.name}:`, error);
        }
    }

    console.log(`\n${added} products added, ${skipped} already existed`);
    console.log('Done!');
}

main()
    .catch((e) => {
        console.error('Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
