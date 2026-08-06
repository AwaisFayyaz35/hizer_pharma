import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

const CATEGORIES = [
  { name: "General", icon: "🏥", subcategories: ["Immunity", "Energy & Vitality", "Gut Health"] },
  { name: "Female Infertility", icon: "🌸", subcategories: ["PCOS", "Hormone Balance", "Fallopian Support"] },
  { name: "Male Infertility", icon: "💙", subcategories: ["Sperm Health", "Testosterone Support"] },
  { name: "Orthopedic", icon: "🦴", subcategories: ["Joint Support", "Bone Health", "Post-Surgery Recovery"] },
  { name: "Nutritional", icon: "🌿", subcategories: ["Essential Fatty Acids", "Vitamins & Minerals", "Protein"] },
  { name: "Gynae & Obstetrics", icon: "🤰", subcategories: ["Prenatal", "Postnatal", "Menopause"] },
  { name: "Skin", icon: "✨", subcategories: ["Anti-aging", "Acne Management", "Brightening"] },
  { name: "Obesity", icon: "💪", subcategories: ["Weight Management", "Metabolism", "Appetite Control"] },
];

const PRODUCTS = [
  {
    name: "OvaBoost PCOS Support",
    category: "Female Infertility",
    subcategory: "PCOS",
    price: 2800,
    discountPrice: 2400,
    rx: false,
    stock: 45,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
    description: "A clinically formulated supplement to support hormonal balance and reproductive health in women with PCOS. Contains myo-inositol, alpha-lipoic acid, and chromium.",
    dosage: "Take 2 capsules daily with meals.",
    featured: true,
  },
  {
    name: "FertiMax Male Support",
    category: "Male Infertility",
    subcategory: "Sperm Health",
    price: 3200,
    discountPrice: 2800,
    rx: false,
    stock: 32,
    image: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&h=400&fit=crop",
    description: "Advanced formula to support male reproductive health, sperm count, and motility. Contains CoQ10, zinc, selenium, and L-carnitine.",
    dosage: "Dissolve 1 sachet daily in 200ml water.",
    featured: true,
  },
  {
    name: "OsteoFlex Plus",
    category: "Orthopedic",
    subcategory: "Joint Support",
    price: 1800,
    rx: false,
    stock: 78,
    image: "https://images.unsplash.com/photo-1607619662634-3ac55ec0e216?w=400&h=400&fit=crop",
    description: "Comprehensive joint and bone support formula with glucosamine, chondroitin, and vitamin D3 for improved mobility.",
    dosage: "Take 3 tablets daily with meals.",
    featured: true,
  },
  {
    name: "Clomiphene 50mg",
    category: "Female Infertility",
    subcategory: "Hormone Balance",
    price: 1200,
    discountPrice: 1000,
    rx: true,
    stock: 20,
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=400&fit=crop",
    description: "Prescription ovulation induction therapy for women experiencing anovulatory infertility. Requires valid prescription.",
    dosage: "As prescribed by your physician. Typically 50mg daily for 5 days.",
    featured: true,
  },
  {
    name: "SlimPro Metabolic Blend",
    category: "Obesity",
    subcategory: "Weight Management",
    price: 2200,
    discountPrice: 1900,
    rx: false,
    stock: 56,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop",
    description: "Scientifically formulated metabolic support blend with green tea extract, CLA, and B-complex to aid healthy weight management.",
    dosage: "Take 2 capsules 30 minutes before meals.",
  },
  {
    name: "VitaGlow Skin Complex",
    category: "Skin",
    subcategory: "Anti-aging",
    price: 3500,
    discountPrice: 3000,
    rx: false,
    stock: 41,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=400&fit=crop",
    description: "Premium skin health supplement with marine collagen, vitamins C, E, and biotin for radiant, youthful skin.",
    dosage: "Take 2 capsules daily with water.",
  },
  {
    name: "OmegaMax 3-6-9",
    category: "Nutritional",
    subcategory: "Essential Fatty Acids",
    price: 1600,
    rx: false,
    stock: 92,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&crop=entropy",
    description: "Triple omega complex sourced from cold-pressed flaxseed, sunflower, and fish oil — supporting cardiovascular and brain health.",
    dosage: "Take 2 softgels daily with food.",
  },
  {
    name: "PreNatal Complete",
    category: "Gynae & Obstetrics",
    subcategory: "Prenatal",
    price: 2600,
    discountPrice: 2300,
    rx: false,
    stock: 0,
    image: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&h=400&fit=crop&crop=entropy",
    description: "Complete prenatal nutrition with methylfolate, iron bisglycinate, DHA, and 25 essential vitamins and minerals.",
    dosage: "Take 1 tablet daily as directed.",
  },
];

async function run() {
  await connectDB();

  const categoryDocs = {};
  for (const c of CATEGORIES) {
    const doc = await Category.findOneAndUpdate(
      { name: c.name },
      { name: c.name, icon: c.icon, subcategories: c.subcategories.map((name) => ({ name })) },
      { upsert: true, new: true }
    );
    categoryDocs[c.name] = doc;
  }
  console.log(`Seeded ${CATEGORIES.length} categories`);

  let created = 0;
  for (const p of PRODUCTS) {
    const exists = await Product.findOne({ name: p.name });
    if (exists) continue;
    await Product.create({
      name: p.name,
      description: p.description,
      category: categoryDocs[p.category]._id,
      subcategory: p.subcategory,
      price: p.price,
      discountPrice: p.discountPrice,
      rx: p.rx,
      stock: p.stock,
      dosage: p.dosage,
      featured: p.featured || false,
      images: [{ url: p.image, publicId: "seed-placeholder" }],
    });
    created += 1;
  }
  console.log(`Seeded ${created} new products (${PRODUCTS.length - created} already existed)`);

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
