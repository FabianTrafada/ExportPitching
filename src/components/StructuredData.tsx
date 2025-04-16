export default function StructuredData() {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "ExportPitch AI",
      url: "https://exportpitch.ai",
      logo: "https://exportpitch.ai/logo.png",
      sameAs: [
        "https://facebook.com/exportpitchai",
        "https://twitter.com/exportpitchai",
        "https://instagram.com/exportpitchai",
        "https://linkedin.com/company/exportpitchai",
      ],
      description:
        "AI-powered pitching training platform helping Indonesian exporters succeed in global markets with personalized feedback and cultural insights.",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Jl. Export Indonesia No. 123",
        addressLocality: "Jakarta",
        addressRegion: "DKI Jakarta",
        postalCode: "12345",
        addressCountry: "ID",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+62-21-1234-5678",
        contactType: "customer service",
        availableLanguage: ["English", "Indonesian"],
      },
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "IDR",
        lowPrice: "499000",
        highPrice: "999000",
        offerCount: "3",
      },
    }
  
    const courseStructuredData = {
      "@context": "https://schema.org",
      "@type": "Course",
      name: "AI-Powered Export Pitch Training",
      description:
        "Learn how to effectively pitch Indonesian products to international buyers using AI-powered training and feedback.",
      provider: {
        "@type": "Organization",
        name: "ExportPitch AI",
        sameAs: "https://exportpitch.ai",
      },
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "online",
        courseWorkload: "PT10H",
        inLanguage: "en",
      },
    }
  
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseStructuredData) }} />
      </>
    )
  }
  