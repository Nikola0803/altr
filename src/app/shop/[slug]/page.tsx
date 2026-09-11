import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getProductBySlug, getProducts, getRelatedProducts } from "@/lib/products";
import { ProductCard } from "@/components/product/ProductCard";
import { FrequentlyBoughtTogether } from "@/components/product/FrequentlyBoughtTogether";
import { ProductClient } from "./ProductClient";

const SITE_URL = "https://altrpeptides.com";

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  const title = `${product.name}, Research Peptide | ALTR`;
  const description = `${product.shortDescription} ${product.purity ? `Purity: ${product.purity}.` : ""} Batch-tested with a published Certificate of Analysis. Research use only.`.trim();
  return {
    title,
    description,
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: {
      type: "website",
      title,
      description,
      images: product.image ? [{ url: product.image, width: 800, height: 800, alt: product.name }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(slug);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    description: product.shortDescription,
    image: product.image ? [`${SITE_URL}${product.image}`] : undefined,
    category: product.categoryLabel,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/shop/${product.slug}`,
      priceCurrency: "CAD",
      price: product.price,
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Shop", item: `${SITE_URL}/shop` },
      { "@type": "ListItem", position: 3, name: product.name, item: `${SITE_URL}/shop/${product.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="mx-auto max-w-[1400px] px-4 py-4 md:px-8">
        <nav className="flex flex-wrap items-center gap-2 text-xs text-charcoal/50">
          <Link href="/" className="transition hover:text-charcoal">
            Home
          </Link>
          <i className="ri-arrow-right-s-line" />
          <Link href="/shop" className="transition hover:text-charcoal">
            Shop
          </Link>
          <i className="ri-arrow-right-s-line" />
          <span className="font-medium text-charcoal">{product.name}</span>
        </nav>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 pb-12 md:px-8">
        <ProductClient product={product} />
      </div>

      <FrequentlyBoughtTogether product={product} related={related} />

      {related.length > 0 && (
        <section className="border-t border-stone py-16 md:py-24">
          <div className="mx-auto max-w-[1400px] px-4 md:px-8">
            <h2 className="mb-8 font-display text-2xl font-bold text-charcoal md:text-3xl">You may also like</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
