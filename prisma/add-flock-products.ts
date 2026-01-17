// Script to add FLOCK Premium eyeframes to database
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
    {
        name: "FLOCK Premium Round Frame M-7710 Gold",
        slug: "flock-premium-round-m7710-gold",
        sku: "FLOCK-M7710-GOLD",
        description: "Premium gold round metal eyeglasses frame with elegant design. Perfect for everyday wear. Made in India with premium quality materials. Model: M-7710-50-20",
        price: 449,
        comparePrice: 599,
        imageUrl: "/products/frame-m7710-gold.png",
        gender: "UNISEX",
        frameShape: "ROUND",
        frameMaterial: "METAL",
    },
    {
        name: "FLOCK Premium Round Frame M-7710 Silver",
        slug: "flock-premium-round-m7710-silver",
        sku: "FLOCK-M7710-SILVER",
        description: "Premium silver round metal eyeglasses frame with classic design. Lightweight and comfortable. Made in India with premium quality materials. Model: M-7710-50-20",
        price: 449,
        comparePrice: 599,
        imageUrl: "/products/frame-m7710-silver.png",
        gender: "UNISEX",
        frameShape: "ROUND",
        frameMaterial: "METAL",
    },
    {
        name: "FLOCK Premium Rectangle Frame M-7706 Silver",
        slug: "flock-premium-rectangle-m7706-silver",
        sku: "FLOCK-M7706-SILVER",
        description: "Premium silver rectangular metal eyeglasses frame with modern design. Perfect for professional look. Made in India with premium quality materials. Model: M-7706-51-20",
        price: 449,
        comparePrice: 599,
        imageUrl: "/products/frame-m7706-silver.png",
        gender: "MEN",
        frameShape: "RECTANGLE",
        frameMaterial: "METAL",
    },
    {
        name: "FLOCK Premium Rectangle Frame M-7706 Gold",
        slug: "flock-premium-rectangle-m7706-gold",
        sku: "FLOCK-M7706-GOLD",
        description: "Premium gold rectangular metal eyeglasses frame with sophisticated design. Perfect for business and formal occasions. Made in India with premium quality materials. Model: M-7706-51-20",
        price: 449,
        comparePrice: 599,
        imageUrl: "/products/frame-m7706-gold.png",
        gender: "MEN",
        frameShape: "RECTANGLE",
        frameMaterial: "METAL",
    },
    {
        name: "FLOCK Premium Aviator Frame M-7707 Gold",
        slug: "flock-premium-aviator-m7707-gold",
        sku: "FLOCK-M7707-GOLD",
        description: "Premium gold aviator style metal eyeglasses frame with trendy design. Classic aviator shape for stylish look. Made in India with premium quality materials. Model: M-7707-54-20",
        price: 449,
        comparePrice: 599,
        imageUrl: "/products/frame-m7707-aviator.png",
        gender: "UNISEX",
        frameShape: "AVIATOR",
        frameMaterial: "METAL",
    },
    {
        name: "FLOCK Premium Rectangle Frame M-7702 Blue",
        slug: "flock-premium-rectangle-m7702-blue",
        sku: "FLOCK-M7702-BLUE",
        description: "Premium blue rectangular metal eyeglasses frame with modern design. Stylish blue color for contemporary look. Made in India with premium quality materials. Model: M-7702-54-20",
        price: 449,
        comparePrice: 599,
        imageUrl: "/products/frame-m7702-blue.png",
        gender: "UNISEX",
        frameShape: "RECTANGLE",
        frameMaterial: "METAL",
    },
];

async function main() {
    console.log('Adding FLOCK Premium eyeframes...');

    // Get or create category
    let category = await prisma.category.findFirst({
        where: { slug: 'eyeglasses' }
    });

    if (!category) {
        category = await prisma.category.create({
            data: {
                name: 'Eyeglasses',
                slug: 'eyeglasses',
                description: 'Premium eyeglasses collection',
            }
        });
        console.log('Created category: Eyeglasses');
    }

    // Get or create brand
    let brand = await prisma.brand.findFirst({
        where: { slug: 'flock-premium' }
    });

    if (!brand) {
        brand = await prisma.brand.create({
            data: {
                name: 'FLOCK Premium',
                slug: 'flock-premium',
            }
        });
        console.log('Created brand: FLOCK Premium');
    }

    // Add products
    for (const product of products) {
        const existing = await prisma.product.findFirst({
            where: { slug: product.slug }
        });

        if (existing) {
            console.log(`Product ${product.name} already exists, skipping...`);
            continue;
        }

        const createdProduct = await prisma.product.create({
            data: {
                name: product.name,
                slug: product.slug,
                sku: product.sku,
                description: product.description,
                price: product.price,
                comparePrice: product.comparePrice,
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
                        gender: product.gender as any,
                        shape: product.frameShape as any,
                        material: product.frameMaterial as any,
                        frameSize: 'MEDIUM',
                    }
                }
            }
        });

        console.log(`Added: ${product.name}`);
    }

    console.log('Done! All FLOCK Premium frames added.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
