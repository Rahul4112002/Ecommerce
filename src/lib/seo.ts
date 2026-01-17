import { Metadata } from "next";

// Default SEO Configuration
export const defaultSEO = {
    siteName: "Leehit Eyewear",
    siteUrl: "https://leehiteyewear.live",
    defaultTitle: "Leehit Eyewear - Premium Eyeglasses & Sunglasses Online",
    defaultDescription: "Shop premium eyeglasses and sunglasses at Leehit Eyewear. Discover stylish frames for men and women with the latest designs. Free shipping across India.",
    defaultImage: "/leehit-logo.jpeg",
    brandKeywords: [
        "Leehit Eyewear",
        "Leehit",
        "eyeglasses online",
        "sunglasses",
        "premium eyewear",
        "eyeframes",
        "glasses online India",
    ],
};

// Generate Product Structured Data (JSON-LD)
export function generateProductSchema(product: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    inStock: boolean;
}) {
    return {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: product.image,
        brand: {
            "@type": "Brand",
            name: "Leehit Eyewear",
        },
        offers: {
            "@type": "Offer",
            url: `https://leehiteyewear.live/products/${product.id}`,
            priceCurrency: "INR",
            price: product.price.toString(),
            availability: product.inStock
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            seller: {
                "@type": "Organization",
                name: "Leehit Eyewear",
            },
        },
        category: product.category,
    };
}

// Generate Organization Structured Data (JSON-LD)
export function generateOrganizationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Leehit Eyewear",
        url: "https://leehiteyewear.live",
        logo: "https://leehiteyewear.live/leehit-logo.jpeg",
        description: "Premium eyewear store offering stylish eyeglasses and sunglasses for men and women.",
        sameAs: [
            // Add your social media links here when available
            // "https://www.facebook.com/leehiteyewear",
            // "https://www.instagram.com/leehiteyewear",
        ],
        contactPoint: {
            "@type": "ContactPoint",
            contactType: "Customer Service",
            availableLanguage: ["English", "Hindi"],
        },
    };
}

// Generate Website Structured Data (JSON-LD)
export function generateWebsiteSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Leehit Eyewear",
        url: "https://leehiteyewear.live",
        potentialAction: {
            "@type": "SearchAction",
            target: "https://leehiteyewear.live/products?search={search_term_string}",
            "query-input": "required name=search_term_string",
        },
    };
}

// Generate Breadcrumb Structured Data (JSON-LD)
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: `https://leehiteyewear.live${item.url}`,
        })),
    };
}

// Helper to generate page metadata
export function generatePageMetadata(
    title: string,
    description: string,
    path: string,
    image?: string
): Metadata {
    const fullUrl = `${defaultSEO.siteUrl}${path}`;
    const imageUrl = image || defaultSEO.defaultImage;

    return {
        title,
        description,
        alternates: {
            canonical: fullUrl,
        },
        openGraph: {
            type: "website",
            url: fullUrl,
            title,
            description,
            siteName: defaultSEO.siteName,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [imageUrl],
        },
    };
}
