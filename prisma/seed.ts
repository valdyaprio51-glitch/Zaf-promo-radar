import { PrismaClient, Role, MerchantStatus, PromotionStatus, VerificationStatus, SourceType, CollectionMethod } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database PromoRadar...");

  // 1. Seed Admin & Test Users
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@promoradar.id" },
    update: {},
    create: {
      email: "admin@promoradar.id",
      name: "Admin PromoRadar",
      role: Role.ADMIN,
      passwordHash: "$2a$12$7kP2L49y/Yy25pQG31Zg8e5Z07Lg8fFkJ3.NqL6qWJ7wH9gU7u8sC", // hashed 'admin123'
    },
  });

  const demoUser = await prisma.user.upsert({
    where: { email: "user@promoradar.id" },
    update: {},
    create: {
      email: "user@promoradar.id",
      name: "Budi Santoso",
      role: Role.USER,
      passwordHash: "$2a$12$7kP2L49y/Yy25pQG31Zg8e5Z07Lg8fFkJ3.NqL6qWJ7wH9gU7u8sC", // hashed 'admin123'
    },
  });

  console.log("✅ Users seeded:", adminUser.email, demoUser.email);

  // 2. Seed Categories
  const categoriesData = [
    { name: "Supermarket & Sembako", slug: "supermarket-sembako" },
    { name: "Makanan & Minuman", slug: "makanan-minuman" },
    { name: "Elektronik & Gadget", slug: "elektronik-gadget" },
    { name: "Kesehatan & Kecantikan", slug: "kesehatan-kecantikan" },
    { name: "Fashion & Gaya Hidup", slug: "fashion-lifestyle" },
    { name: "Ibu & Bayi", slug: "ibu-bayi" },
  ];

  const categories = await Promise.all(
    categoriesData.map((cat) =>
      prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: {
          name: cat.name,
          slug: cat.slug,
          isActive: true,
        },
      })
    )
  );
  console.log(`✅ ${categories.length} categories seeded`);

  // 3. Seed Merchants
  const merchantsData = [
    {
      name: "Super Indo",
      slug: "super-indo",
      logoUrl: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=128&auto=format&fit=crop&q=80",
      websiteUrl: "https://www.superindo.co.id",
    },
    {
      name: "Indomaret",
      slug: "indomaret",
      logoUrl: "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=128&auto=format&fit=crop&q=80",
      websiteUrl: "https://www.indomaret.co.id",
    },
    {
      name: "Alfamart",
      slug: "alfamart",
      logoUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=128&auto=format&fit=crop&q=80",
      websiteUrl: "https://www.alfamart.co.id",
    },
    {
      name: "Kopi Kenangan",
      slug: "kopi-kenangan",
      logoUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=128&auto=format&fit=crop&q=80",
      websiteUrl: "https://kopikenangan.com",
    },
    {
      name: "Watsons Indonesia",
      slug: "watsons",
      logoUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=128&auto=format&fit=crop&q=80",
      websiteUrl: "https://www.watsons.co.id",
    },
    {
      name: "Tokopedia Official Store",
      slug: "tokopedia",
      logoUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=128&auto=format&fit=crop&q=80",
      websiteUrl: "https://www.tokopedia.com",
    },
  ];

  const merchants = await Promise.all(
    merchantsData.map((m) =>
      prisma.merchant.upsert({
        where: { slug: m.slug },
        update: {},
        create: {
          name: m.name,
          slug: m.slug,
          logoUrl: m.logoUrl,
          websiteUrl: m.websiteUrl,
          status: MerchantStatus.ACTIVE,
        },
      })
    )
  );
  console.log(`✅ ${merchants.length} merchants seeded`);

  // 4. Seed Promotion Source
  const officialSource = await prisma.promotionSource.upsert({
    where: { id: "source-official-001" },
    update: {},
    create: {
      id: "source-official-001",
      name: "Katalog Promosi Resmi Merchant",
      sourceType: SourceType.OFFICIAL_API,
      baseUrl: "https://promoradar.id/official-partners",
      collectionMethod: CollectionMethod.API,
      isActive: true,
      lastSuccessAt: new Date(),
    },
  });

  // 5. Seed Promotions
  const catGroceries = categories.find((c) => c.slug === "supermarket-sembako")!;
  const catFnB = categories.find((c) => c.slug === "makanan-minuman")!;
  const catElec = categories.find((c) => c.slug === "elektronik-gadget")!;
  const catHealth = categories.find((c) => c.slug === "kesehatan-kecantikan")!;

  const mSuperIndo = merchants.find((m) => m.slug === "super-indo")!;
  const mAlfamart = merchants.find((m) => m.slug === "alfamart")!;
  const mKopiKenangan = merchants.find((m) => m.slug === "kopi-kenangan")!;
  const mWatsons = merchants.find((m) => m.slug === "watsons")!;
  const mTokopedia = merchants.find((m) => m.slug === "tokopedia")!;

  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const nextTwoDays = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
  const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const samplePromotions = [
    {
      title: "Minyak Goreng Sania Pouch 2 Liter Hemat Super Kepo",
      slug: "minyak-goreng-sania-2l-super-indo",
      description: "Promo spesial mingguan Minyak Goreng Sania 2L pouch. Maksimal pembelian 2 pouch per struk per hari di seluruh gerai Super Indo Jabodetabek.",
      imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80",
      originalPrice: 38900,
      promoPrice: 32500,
      discountPercentage: 16,
      termsText: "Berlaku khusus member My Super Indo. Tidak berlaku kelipatan. Pembayaran tunai, debit, atau QRIS.",
      startAt: now,
      endAt: nextWeek,
      status: PromotionStatus.ACTIVE,
      verificationStatus: VerificationStatus.VERIFIED,
      lastVerifiedAt: now,
      merchantId: mSuperIndo.id,
      categoryId: catGroceries.id,
      sourceId: officialSource.id,
      sourceUrl: "https://www.superindo.co.id/promosi/hemat-mingguan",
    },
    {
      title: "Beli 2 Kopi Kenangan Mantan Large Gratis 1 Roti Cokelat Klasik",
      slug: "promo-kopi-kenangan-mantan-gratis-roti",
      description: "Sensasi ngopi hemat di sore hari! Beli 2 cup Kopi Kenangan Mantan ukuran Large langsung dapat gratis 1 Roti Cokelat Klasik yang empuk dan lezat.",
      imageUrl: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&auto=format&fit=crop&q=80",
      originalPrice: 58000,
      promoPrice: 42000,
      discountPercentage: 28,
      termsText: "Berlaku pembelian langsung di outlet (dine-in & take-away) atau aplikasi resmi Kopi Kenangan setiap pukul 14.00 - 18.00 WIB.",
      startAt: now,
      endAt: nextTwoDays,
      status: PromotionStatus.EXPIRING_SOON,
      verificationStatus: VerificationStatus.VERIFIED,
      lastVerifiedAt: now,
      merchantId: mKopiKenangan.id,
      categoryId: catFnB.id,
      sourceId: officialSource.id,
      sourceUrl: "https://kopikenangan.com/promo-sore",
    },
    {
      title: "Susu UHT Ultra Milk 1000ml All Variant Promo JSM Gajian",
      slug: "susu-ultra-milk-1l-alfamart-jsm",
      description: "Penawaran akhir pekan JSM Alfamart: Susu Ultra Milk Full Cream & Cokelat 1 Liter harga spesial hanya Rp 17.500.",
      imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80",
      originalPrice: 21500,
      promoPrice: 17500,
      discountPercentage: 19,
      termsText: "Maksimal 4 pcs per transaksi. Ekstra cashback Rp 1.000 dengan pembayaran GoPay.",
      startAt: now,
      endAt: nextWeek,
      status: PromotionStatus.ACTIVE,
      verificationStatus: VerificationStatus.VERIFIED,
      lastVerifiedAt: now,
      merchantId: mAlfamart.id,
      categoryId: catGroceries.id,
      sourceId: officialSource.id,
      sourceUrl: "https://alfamart.co.id/promo-jsm",
    },
    {
      title: "Skintific 5X Ceramide Barrier Moisture Gel 30g Diskon 35%",
      slug: "skintific-5x-ceramide-moisturizer-watsons",
      description: "Perbaiki skin barrier dengan Skintific Ceramide Moisturizer favorit Indonesia. Diskon 35% di Watsons seluruh Indonesia.",
      imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80",
      originalPrice: 169000,
      promoPrice: 109850,
      discountPercentage: 35,
      termsText: "Stok terbatas selama persediaan masih ada. Berlaku di gerai Watsons offline dan online store.",
      startAt: now,
      endAt: nextMonth,
      status: PromotionStatus.ACTIVE,
      verificationStatus: VerificationStatus.VERIFIED,
      lastVerifiedAt: now,
      merchantId: mWatsons.id,
      categoryId: catHealth.id,
      sourceId: officialSource.id,
      sourceUrl: "https://watsons.co.id/skintific-promo",
    },
    {
      title: "Anker Soundcore Space One ANC Wireless Headphones Mega Sale",
      slug: "anker-soundcore-space-one-tokopedia",
      description: "Headphone wireless dengan Active Noise Cancellation terbaik di kelasnya. Garansi resmi Anker Indonesia 18 bulan.",
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
      originalPrice: 1599000,
      promoPrice: 1149000,
      discountPercentage: 28,
      termsText: "Gunakan kupon cashback toko untuk potongan tambahan hingga Rp 50.000. Gratis ongkir ke seluruh Indonesia.",
      startAt: now,
      endAt: nextMonth,
      status: PromotionStatus.ACTIVE,
      verificationStatus: VerificationStatus.VERIFIED,
      lastVerifiedAt: now,
      merchantId: mTokopedia.id,
      categoryId: catElec.id,
      sourceId: officialSource.id,
      sourceUrl: "https://tokopedia.com/anker-official",
    },
  ];

  for (const promo of samplePromotions) {
    const created = await prisma.promotion.upsert({
      where: { slug: promo.slug },
      update: {},
      create: promo,
    });

    // Seed price history
    await prisma.promotionPriceHistory.create({
      data: {
        promotionId: created.id,
        originalPrice: promo.originalPrice,
        promoPrice: promo.promoPrice,
        sourceReference: promo.sourceUrl,
      },
    });
  }

  console.log(`✅ ${samplePromotions.length} sample promotions & price history seeded successfully!`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

