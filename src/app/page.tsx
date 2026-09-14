import { Hero } from "@/components/home/Hero";
import { TrustIconRow } from "@/components/ui/TrustIconRow";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { ShopByCategory } from "@/components/home/ShopByCategory";
import { AboutSection } from "@/components/home/AboutSection";
import { ScienceSection } from "@/components/home/ScienceSection";
import { LabResultsPreview } from "@/components/home/LabResultsPreview";
import { Testimonials } from "@/components/home/Testimonials";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { FaqHomeSection } from "@/components/home/FaqHomeSection";
import { ValueSection } from "@/components/home/ValueSection";
import { FinalCta } from "@/components/home/FinalCta";
import { googleReviewsConfigured } from "@/lib/google-reviews";

const HOME_TRUST_ITEMS = [
  { icon: "ri-shield-check-line", label: "Independently Tested" },
  { icon: "ri-checkbox-circle-line", label: "Batch Verified" },
  { icon: "ri-file-list-3-line", label: "COA Available" },
  { icon: "ri-lock-line", label: "Secure Checkout" },
  { icon: "ri-flask-line", label: "Research Use Only" },
];

export default function Home() {
  // Real Google reviews replace the placeholder testimonial carousel once
  // GOOGLE_PLACES_API_KEY/GOOGLE_PLACE_ID are set (see lib/google-reviews.ts);
  // until then, keep showing the mock carousel rather than an empty
  // "not connected" box on the live site.
  const showGoogleReviews = googleReviewsConfigured() || process.env.DEMO_REVIEWS === "true" || process.env.VERCEL_ENV === "preview";

  return (
    <>
      <Hero />
      <TrustIconRow items={HOME_TRUST_ITEMS} marquee />
      <FeaturedProducts />
      {showGoogleReviews ? <ReviewsSection /> : <Testimonials />}
      <ShopByCategory />
      <AboutSection />
      <LabResultsPreview />
      <ScienceSection />
      <FaqHomeSection />
      <ValueSection />
      <FinalCta />
    </>
  );
}
