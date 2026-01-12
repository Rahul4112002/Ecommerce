import { PrismaClient, FrameShape, FrameMaterial, Gender, FrameSize, OrderStatus, PaymentMethod, PaymentStatus, Role } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  /*
  // Create Admin User
  const adminPassword = await hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@eyeframes.com" },
    update: {},
    create: {
      email: "admin@eyeframes.com",
      name: "Admin User",
      password: adminPassword,
      role: Role.ADMIN,
    },
  });
  console.log("✅ Admin user created");

  // Create Test User
  const userPassword = await hash("user123", 12);
  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      name: "Test User",
      password: userPassword,
      role: Role.CUSTOMER,
    },
  });
  console.log("✅ Test user created");
  */
  console.log("ℹ️ User seeding skipped (Commented out).");

  // Placeholder users for reference in loop below if needed, though loop is also commented out
  const admin = { id: 'placeholder' };
  const user = { id: 'placeholder' };

  // Create Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "men" },
      update: {},
      create: {
        name: "Men",
        slug: "men",
        description: "Stylish eyeframes for men",
        image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800",
      },
    }),
    prisma.category.upsert({
      where: { slug: "women" },
      update: {},
      create: {
        name: "Women",
        slug: "women",
        description: "Elegant eyeframes for women",
        image: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800",
      },
    }),
    prisma.category.upsert({
      where: { slug: "kids" },
      update: {},
      create: {
        name: "Kids",
        slug: "kids",
        description: "Durable eyeframes for kids",
        image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800",
      },
    }),
    prisma.category.upsert({
      where: { slug: "sunglasses" },
      update: {},
      create: {
        name: "Sunglasses",
        slug: "sunglasses",
        description: "Premium sunglasses collection",
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800",
      },
    }),
  ]);
  console.log("✅ Categories created");

  // Create Brands
  const brands = await Promise.all([
    prisma.brand.upsert({
      where: { slug: "rayban" },
      update: {},
      create: {
        name: "Ray-Ban",
        slug: "rayban",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Ray-Ban_logo.svg/200px-Ray-Ban_logo.svg.png",
      },
    }),
    prisma.brand.upsert({
      where: { slug: "oakley" },
      update: {},
      create: {
        name: "Oakley",
        slug: "oakley",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Oakley_logo.svg/200px-Oakley_logo.svg.png",
      },
    }),
    prisma.brand.upsert({
      where: { slug: "lenskart" },
      update: {},
      create: {
        name: "Lenskart",
        slug: "lenskart",
        logo: "https://static1.lenskart.com/media/desktop/img/site-images/main_logo.svg",
      },
    }),
    prisma.brand.upsert({
      where: { slug: "eyeframes" },
      update: {},
      create: {
        name: "EyeFrames",
        slug: "eyeframes",
      },
    }),
  ]);
  console.log("✅ Brands created");

  // Create Products
  const products = [
    {
      name: "Classic Aviator Gold Frame",
      slug: "classic-aviator-gold-frame",
      description: "Timeless aviator design with gold metal frame. Perfect for a sophisticated look. Features adjustable nose pads for comfort.",
      price: 2499,
      comparePrice: 3499,
      sku: "AV-GOLD-001",
      stock: 50,
      isFeatured: true,
      categorySlug: "men",
      brandSlug: "eyeframes",
      attributes: {
        shape: FrameShape.AVIATOR,
        material: FrameMaterial.METAL,
        gender: Gender.MEN,
        frameSize: FrameSize.MEDIUM,
        frameWidth: 140,
        bridgeWidth: 18,
        templeLength: 145,
        weight: 28,
      },
      images: [
        { url: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800", alt: "Aviator front view" },
        { url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800", alt: "Aviator side view" },
      ],
      variants: [
        { color: "Gold", colorCode: "#FFD700", stock: 20 },
        { color: "Silver", colorCode: "#C0C0C0", stock: 15 },
        { color: "Rose Gold", colorCode: "#B76E79", stock: 15 },
      ],
    },
    {
      name: "Round Retro Black Frame",
      slug: "round-retro-black-frame",
      description: "Vintage-inspired round frames with acetate construction. Lightweight and comfortable for all-day wear.",
      price: 1999,
      comparePrice: 2799,
      sku: "RD-BLK-002",
      stock: 35,
      isFeatured: true,
      categorySlug: "women",
      brandSlug: "eyeframes",
      attributes: {
        shape: FrameShape.ROUND,
        material: FrameMaterial.ACETATE,
        gender: Gender.WOMEN,
        frameSize: FrameSize.SMALL,
        frameWidth: 135,
        bridgeWidth: 16,
        templeLength: 140,
        weight: 22,
      },
      images: [
        { url: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800", alt: "Round frame front" },
        { url: "https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=800", alt: "Round frame angle" },
      ],
      variants: [
        { color: "Black", colorCode: "#000000", stock: 15 },
        { color: "Tortoise", colorCode: "#8B4513", stock: 10 },
        { color: "Crystal", colorCode: "#F5F5DC", stock: 10 },
      ],
    },
    {
      name: "Rectangle Business Frame",
      slug: "rectangle-business-frame",
      description: "Professional rectangular frames ideal for office wear. Premium titanium build ensures durability and style.",
      price: 3299,
      comparePrice: null,
      sku: "RC-TI-003",
      stock: 25,
      isFeatured: true,
      categorySlug: "men",
      brandSlug: "eyeframes",
      attributes: {
        shape: FrameShape.RECTANGLE,
        material: FrameMaterial.TITANIUM,
        gender: Gender.MEN,
        frameSize: FrameSize.LARGE,
        frameWidth: 145,
        bridgeWidth: 18,
        templeLength: 150,
        weight: 18,
      },
      images: [
        { url: "https://images.unsplash.com/photo-1483120263983-91160a5f1f53?w=800", alt: "Rectangle frame" },
        { url: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800", alt: "Rectangle side" },
      ],
      variants: [
        { color: "Gunmetal", colorCode: "#2C3539", stock: 12 },
        { color: "Black Matte", colorCode: "#1C1C1C", stock: 13 },
      ],
    },
    {
      name: "Cat Eye Fashion Frame",
      slug: "cat-eye-fashion-frame",
      description: "Glamorous cat-eye frames that add instant style. Perfect for fashion-forward individuals.",
      price: 2299,
      comparePrice: 2999,
      sku: "CE-PK-004",
      stock: 40,
      isFeatured: true,
      categorySlug: "women",
      brandSlug: "eyeframes",
      attributes: {
        shape: FrameShape.CAT_EYE,
        material: FrameMaterial.ACETATE,
        gender: Gender.WOMEN,
        frameSize: FrameSize.MEDIUM,
        frameWidth: 138,
        bridgeWidth: 17,
        templeLength: 142,
        weight: 24,
      },
      images: [
        { url: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=800", alt: "Cat eye front" },
        { url: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800", alt: "Cat eye angle" },
      ],
      variants: [
        { color: "Pink", colorCode: "#FFC0CB", stock: 15 },
        { color: "Purple", colorCode: "#800080", stock: 15 },
        { color: "Black", colorCode: "#000000", stock: 10 },
      ],
    },
    {
      name: "Kids Flexible Frame",
      slug: "kids-flexible-frame",
      description: "Durable and flexible frames designed specifically for active kids. Bendable material prevents breakage.",
      price: 999,
      comparePrice: 1499,
      sku: "KD-FLX-005",
      stock: 60,
      isFeatured: false,
      categorySlug: "kids",
      brandSlug: "eyeframes",
      attributes: {
        shape: FrameShape.OVAL,
        material: FrameMaterial.TR90,
        gender: Gender.KIDS,
        frameSize: FrameSize.SMALL,
        frameWidth: 120,
        bridgeWidth: 14,
        templeLength: 125,
        weight: 15,
      },
      images: [
        { url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800", alt: "Kids frame" },
      ],
      variants: [
        { color: "Blue", colorCode: "#4169E1", stock: 20 },
        { color: "Red", colorCode: "#DC143C", stock: 20 },
        { color: "Green", colorCode: "#228B22", stock: 20 },
      ],
    },
    {
      name: "Wayfarer Classic Black",
      slug: "wayfarer-classic-black",
      description: "Iconic wayfarer style that never goes out of fashion. Unisex design suitable for everyone.",
      price: 2799,
      comparePrice: 3599,
      sku: "WF-BLK-006",
      stock: 45,
      isFeatured: true,
      categorySlug: "sunglasses",
      brandSlug: "eyeframes",
      attributes: {
        shape: FrameShape.WAYFARER,
        material: FrameMaterial.ACETATE,
        gender: Gender.UNISEX,
        frameSize: FrameSize.MEDIUM,
        frameWidth: 142,
        bridgeWidth: 18,
        templeLength: 145,
        weight: 32,
      },
      images: [
        { url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800", alt: "Wayfarer front" },
        { url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800", alt: "Wayfarer side" },
      ],
      variants: [
        { color: "Black", colorCode: "#000000", stock: 25 },
        { color: "Tortoise", colorCode: "#8B4513", stock: 20 },
      ],
    },
    {
      name: "Clubmaster Vintage Frame",
      slug: "clubmaster-vintage-frame",
      description: "Retro clubmaster style with browline design. Perfect blend of vintage and modern aesthetics.",
      price: 2599,
      comparePrice: null,
      sku: "CM-VT-007",
      stock: 30,
      isFeatured: false,
      categorySlug: "men",
      brandSlug: "eyeframes",
      attributes: {
        shape: FrameShape.CLUBMASTER,
        material: FrameMaterial.ACETATE,
        gender: Gender.MEN,
        frameSize: FrameSize.MEDIUM,
        frameWidth: 140,
        bridgeWidth: 17,
        templeLength: 145,
        weight: 26,
      },
      images: [
        { url: "https://images.unsplash.com/photo-1483120263983-91160a5f1f53?w=800", alt: "Clubmaster frame" },
      ],
      variants: [
        { color: "Black Gold", colorCode: "#1C1C1C", stock: 15 },
        { color: "Tortoise Gold", colorCode: "#8B4513", stock: 15 },
      ],
    },
    {
      name: "Geometric Hexagon Frame",
      slug: "geometric-hexagon-frame",
      description: "Trendy hexagonal frames for those who want to stand out. Lightweight metal construction.",
      price: 1899,
      comparePrice: 2499,
      sku: "HX-MT-008",
      stock: 25,
      isFeatured: false,
      categorySlug: "women",
      brandSlug: "eyeframes",
      attributes: {
        shape: FrameShape.GEOMETRIC,
        material: FrameMaterial.METAL,
        gender: Gender.WOMEN,
        frameSize: FrameSize.SMALL,
        frameWidth: 132,
        bridgeWidth: 16,
        templeLength: 140,
        weight: 20,
      },
      images: [
        { url: "https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=800", alt: "Hexagon frame" },
      ],
      variants: [
        { color: "Gold", colorCode: "#FFD700", stock: 10 },
        { color: "Silver", colorCode: "#C0C0C0", stock: 10 },
        { color: "Rose Gold", colorCode: "#B76E79", stock: 5 },
      ],
    },
    {
      name: "Sport Performance Frame",
      slug: "sport-performance-frame",
      description: "Designed for active lifestyles. Secure fit, sweat-resistant, and durable construction.",
      price: 1799,
      comparePrice: null,
      sku: "SP-TR-009",
      stock: 35,
      isFeatured: false,
      categorySlug: "men",
      brandSlug: "eyeframes",
      attributes: {
        shape: FrameShape.RECTANGLE,
        material: FrameMaterial.TR90,
        gender: Gender.MEN,
        frameSize: FrameSize.LARGE,
        frameWidth: 148,
        bridgeWidth: 19,
        templeLength: 150,
        weight: 22,
      },
      images: [
        { url: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800", alt: "Sport frame" },
      ],
      variants: [
        { color: "Black Red", colorCode: "#000000", stock: 15 },
        { color: "Blue", colorCode: "#0000CD", stock: 10 },
        { color: "Grey", colorCode: "#808080", stock: 10 },
      ],
    },
    {
      name: "Oversized Square Frame",
      slug: "oversized-square-frame",
      description: "Bold oversized square frames that make a statement. Celebrity-inspired design.",
      price: 2199,
      comparePrice: 2899,
      sku: "OS-SQ-010",
      stock: 28,
      isFeatured: true,
      categorySlug: "women",
      brandSlug: "eyeframes",
      attributes: {
        shape: FrameShape.SQUARE,
        material: FrameMaterial.ACETATE,
        gender: Gender.WOMEN,
        frameSize: FrameSize.LARGE,
        frameWidth: 150,
        bridgeWidth: 18,
        templeLength: 148,
        weight: 35,
      },
      images: [
        { url: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800", alt: "Oversized frame" },
        { url: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=800", alt: "Oversized side" },
      ],
      variants: [
        { color: "Black", colorCode: "#000000", stock: 10 },
        { color: "Brown", colorCode: "#8B4513", stock: 10 },
        { color: "Burgundy", colorCode: "#800020", stock: 8 },
      ],
    },
  ];

  /*
  for (const productData of products) {
  const category = categories.find((c) => c.slug === productData.categorySlug);
  const brand = brands.find((b) => b.slug === productData.brandSlug);

  const product = await prisma.product.upsert({
    where: { slug: productData.slug },
    update: {},
    create: {
      name: productData.name,
      slug: productData.slug,
      description: productData.description,
      price: productData.price,
      comparePrice: productData.comparePrice,
      sku: productData.sku,
      stock: productData.stock,
      isFeatured: productData.isFeatured,
      categoryId: category?.id,
      brandId: brand?.id,
    },
  });

  // Create attributes
  await prisma.frameAttribute.upsert({
    where: { productId: product.id },
    update: {},
    create: {
      productId: product.id,
      ...productData.attributes,
    },
  });

  // Create images
  for (let i = 0; i < productData.images.length; i++) {
    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: productData.images[i].url,
        alt: productData.images[i].alt,
        position: i,
      },
    });
  }

  // Create variants
  for (const variant of productData.variants) {
    await prisma.productVariant.create({
      data: {
        productId: product.id,
        color: variant.color,
        colorCode: variant.colorCode,
        stock: variant.stock,
      },
    });
  }

  console.log(`✅ Product created: ${productData.name}`);
}
*/
  console.log("ℹ️ Product seeding skipped (Commented out).");

  // Create sample reviews (one review per user per product)
  const allProducts = await prisma.product.findMany();
  const reviewTexts = [
    { title: "Great quality!", comment: "Really impressed with the quality. Fits perfectly!", rating: 5 },
    { title: "Love it", comment: "Stylish and comfortable. Worth the price.", rating: 4 },
    { title: "Good product", comment: "Nice frames, fast delivery. Happy with purchase.", rating: 4 },
    { title: "Excellent", comment: "Best frames I've ever owned. Highly recommend!", rating: 5 },
    { title: "Very satisfied", comment: "Perfect fit and great look. Will buy again.", rating: 5 },
  ];

  // const users = [admin, user];

  /*
  // Each user reviews different products to avoid unique constraint
  for (let i = 0; i < Math.min(allProducts.length, 6); i++) {
    const product = allProducts[i];
    const reviewData = reviewTexts[i % reviewTexts.length];
    const reviewUser = users[i % 2]; // Alternate between users

    await prisma.review.create({
      data: {
        productId: product.id,
        userId: reviewUser.id,
        rating: reviewData.rating,
        title: reviewData.title,
        comment: reviewData.comment,
        isVerified: true,
      },
    });
  }
  console.log("✅ Reviews created");
  */
  console.log("ℹ️ Reviews seeding skipped.");

  // Create Coupons
  await prisma.coupon.upsert({
    where: { code: "FIRST10" },
    update: {},
    create: {
      code: "FIRST10",
      description: "10% off on first order",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minPurchase: 999,
      usageLimit: 1000,
      usedCount: 0,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.coupon.upsert({
    where: { code: "FLAT200" },
    update: {},
    create: {
      code: "FLAT200",
      description: "Flat ₹200 off",
      discountType: "FIXED",
      discountValue: 200,
      minPurchase: 1499,
      usageLimit: 500,
      usedCount: 0,
      startDate: new Date(),
      endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    },
  });
  console.log("✅ Coupons created");

  // Create Banners
  await prisma.banner.createMany({
    data: [
      {
        title: "New Arrivals",
        subtitle: "Check out our latest collection",
        image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1200",
        link: "/products?sort=newest",
        position: 0,
        isActive: true,
      },
      {
        title: "Summer Sale",
        subtitle: "Up to 40% off on selected items",
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1200",
        link: "/products?sale=true",
        position: 1,
        isActive: true,
      },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Banners created");

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
