import { db } from "@/db/neon";
import { practiceTemplates } from "@/db/schema";

  const templates = [
    {
      title: "Introduction to Indonesian Textiles",
      description: "Practice introducing your textile products to international buyers",
      questions: JSON.stringify([
        "What makes your batik patterns unique or culturally meaningful?",
        "How do you ensure the quality of your fabrics?",
        "Can you explain your sustainable production methods?",
        "How do your products compare to other textiles in terms of durability and comfort?",
        "What's the average production timeline for a bulk order?",
        "What kind of certifications do you have (e.g., eco-friendly, fair trade)?",
        "How do you ensure ethical labor practices in your production process?",
        "Can you share previous client experiences or export success stories?",
        "What kind of customization do you offer for international buyers?",
        "What packaging methods do you use for international shipping?",
        "Which shipping/logistics partners do you usually use for export to the US?",
        "What's your estimated delivery time for the US market?",
        "Do you offer insurance or tracking on shipped goods?",
        "What payment methods do you accept from international clients (e.g., wire transfer, PayPal, LC)?",
        "Do you require a deposit? What are your terms for full payment?",
      ]),
      difficulty: "Beginner",
      duration: 5,
      industry: "Textiles",
      targetMarket: "United States",
      targetMarketCode: "US",
      imageUrl: "/placeholder.svg?height=200&width=300",
      isActive: true,
    },
    {
      title: "Negotiating with European Buyers",
      description: "Practice negotiation techniques with European retail chains",
      questions: JSON.stringify([
        "How do you usually handle negotiations about shipping costs?",
        "What are your standard delivery timelines to Europe?",
        "Can you offer expedited shipping if needed?",
        "What logistics partners do you work with in Europe?",
        "What makes your furniture stand out in terms of design or quality?",
        "Can you explain your pricing structure?",
        "Are discounts available for large or recurring orders?",
        "How do you handle damaged goods or return policies?",
        "What guarantees or warranties do you offer?",
        "What certifications (e.g., FSC, CE marking) do you provide?",
        "How do you calculate your profit margin when negotiating?",
        "Do you offer drop shipping or warehousing services in Europe?",
        "What's your policy for contract minimums or exclusivity agreements?",
        "What payment methods and timelines do you offer for international buyers?",
        "Are you open to consignment models or only upfront payment?",
      ]),
      difficulty: "Intermediate",
      duration: 10,
      industry: "Furniture",
      targetMarket: "Europe",
      targetMarketCode: "EU",
      imageUrl: "/placeholder.svg?height=200&width=300",
      isActive: true,
    },
    {
      title: "Presenting Food Products to Japanese Market",
      description: "Practice pitching Indonesian food products to Japanese distributors",
      questions: JSON.stringify([
        "Which products are most compatible with Japanese culinary preferences?",
        "What health benefits do your products offer?",
        "How long is the shelf life and how is it preserved?",
        "How do you ensure food safety and quality standards?",
        "Do your products meet Japan's food labeling requirements?",
        "What packaging formats do you offer (bulk, retail-ready)?",
        "Can you customize packaging and labeling for Japan?",
        "Have you previously exported to Japan or similar markets?",
        "Do you have Halal certification or organic labels?",
        "How do you plan to handle language or communication barriers?",
        "Which shipping methods are safest and most cost-effective for perishable goods?",
        "Do you use cold chain logistics or special containers?",
        "How long does shipping usually take to Japan?",
        "What payment terms do you offer for first-time international buyers?",
        "Are there minimum order quantities and deposit requirements?",
      ]),
      difficulty: "Advanced",
      duration: 15,
      industry: "Food",
      targetMarket: "Japan",
      targetMarketCode: "JP",
      imageUrl: "/placeholder.svg?height=200&width=300",
      isActive: true,
    },
    {
      title: "Handling Objections from Middle Eastern Buyers",
      description: "Practice addressing common objections from Middle Eastern markets",
      questions: JSON.stringify([
        "How do you research and adapt to cultural preferences in the Middle East?",
        "What kind of product customization do you offer?",
        "Can you provide examples of designs that have been successful in Saudi Arabia?",
        "What materials and craftsmanship are used in your products?",
        "How do you ensure high quality and consistency?",
        "Are your products compliant with Islamic art/design principles?",
        "Do you offer bulk discounts or custom design packages?",
        "How do you handle feedback or revisions from clients?",
        "What's your usual production timeline?",
        "How do you package fragile or high-value handicrafts for export?",
        "Which freight or air cargo partners do you prefer for the Middle East?",
        "Do you provide customs documentation and HS codes?",
        "How do you protect goods from damage during shipping?",
        "What are your international payment options and schedules?",
        "Do you support payment in installments or require full payment upfront?",
      ]),
      difficulty: "Intermediate",
      duration: 10,
      industry: "Handicrafts",
      targetMarket: "Middle East",
      targetMarketCode: "ME",
      imageUrl: "/placeholder.svg?height=200&width=300",
      isActive: true,
    },
    {
      title: "Pitching Agricultural Products to Australian Buyers",
      description: "Practice presenting Indonesian agricultural products to Australian importers",
      questions: JSON.stringify([
        "Which of your products are approved for import into Australia?",
        "How do you ensure compliance with Australia's biosecurity laws?",
        "Do you conduct lab testing or third-party inspections?",
        "How do you preserve freshness during transit?",
        "What documentation do you provide (e.g., phytosanitary certificates)?",
        "What makes your farming methods sustainable?",
        "How do you minimize waste in your production and packaging?",
        "Do your farmers follow organic or eco-friendly practices?",
        "Can you provide case studies or success stories?",
        "Which shipping methods do you use for perishable products to Australia?",
        "Do you work with cold chain logistics providers?",
        "What is your average shipping time to Australia?",
        "How do you handle customs clearance in Australia?",
        "What payment systems do you support (bank transfer, escrow, etc.)?",
        "Are there pre-order options or standing contracts available?",
      ]),
      difficulty: "Advanced",
      duration: 15,
      industry: "Agriculture",
      targetMarket: "Australia",
      targetMarketCode: "AU",
      imageUrl: "/placeholder.svg?height=200&width=300",
      isActive: true,
    },
    {
      title: "First-Time Meeting with International Buyer",
      description: "Practice your first meeting with a new international contact",
      questions: JSON.stringify([
        "How do you describe your company's mission and values?",
        "What makes your product line unique?",
        "Which products are most suitable for the Canadian market?",
        "How do you establish trust and credibility in a first meeting?",
        "Can you share any client testimonials or case studies?",
        "What are your production capabilities?",
        "Do you have experience exporting to North America?",
        "What packaging options do you offer?",
        "How do you handle after-sales support?",
        "What logistics companies do you use for Canadian shipments?",
        "How long does delivery typically take to Canada?",
        "What customs or trade documents do you usually provide?",
        "How do you handle delays or issues in delivery?",
        "What are your payment terms and accepted methods?",
        "Do you offer special deals for first-time buyers?",
      ]),
      difficulty: "Beginner",
      duration: 5,
      industry: "General",
      targetMarket: "Canada",
      targetMarketCode: "CA",
      imageUrl: "/placeholder.svg?height=200&width=300",
      isActive: true,
    },
  ];

  async function main() {
    console.log("🌱 Seeding roleplay topics...")
    for (const topic of templates) {
      await db.insert(practiceTemplates).values(topic)
    }
    console.log("✅ Done seeding!")
  }
  
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })