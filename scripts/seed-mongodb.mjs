import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"
import { randomUUID } from "node:crypto"

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || "auriga"

if (!uri) {
  console.error("[seed] MONGODB_URI is not set")
  process.exit(1)
}

const now = () => new Date().toISOString()

const mainCategories = [
  {
    name: "Inline Speed Skating",
    slug: "inline-speed-skating",
    description:
      "Complete range of inline speed skating equipment including boots, frames, wheels, and accessories",
  },
  {
    name: "Ice Speed Skating",
    slug: "ice-speed-skating",
    description: "Professional ice speed skating gear including boots, blades, and clap skates",
  },
  {
    name: "Cycling & Triathlon",
    slug: "cycling-triathlon",
    description: "High-performance cycling and triathlon equipment for competitive athletes",
  },
  {
    name: "Fashion & Apparel",
    slug: "fashion-apparel",
    description: "Athletic apparel and fashion for performance and style",
  },
]

// Subcategories the homepage looks up by name (boots/frames/wheels/packages)
const subCategories = [
  { name: "Skate Packages", slug: "inline-skate-packages", parent: "inline-speed-skating" },
  { name: "Boots", slug: "inline-boots", parent: "inline-speed-skating" },
  { name: "Frames", slug: "inline-frames", parent: "inline-speed-skating" },
  { name: "Wheels", slug: "inline-wheels", parent: "inline-speed-skating" },
  { name: "Bearings", slug: "inline-bearings", parent: "inline-speed-skating" },
  { name: "Accessories", slug: "inline-accessories", parent: "inline-speed-skating" },
]

async function main() {
  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db(dbName)
  console.log(`[seed] Connected to ${dbName}`)

  // --- Categories ---
  const categories = db.collection("categories")
  const slugToId = {}

  for (const cat of mainCategories) {
    const id = randomUUID()
    slugToId[cat.slug] = id
    await categories.updateOne(
      { slug: cat.slug },
      {
        $set: {
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          image_url: "/placeholder.svg?height=400&width=600",
          parent_id: null,
          is_active: true,
          updated_at: now(),
        },
        $setOnInsert: { id, created_at: now() },
      },
      { upsert: true },
    )
  }

  // re-read main category ids (in case they already existed)
  for (const cat of mainCategories) {
    const doc = await categories.findOne({ slug: cat.slug })
    slugToId[cat.slug] = doc.id
  }

  for (const sub of subCategories) {
    const id = randomUUID()
    await categories.updateOne(
      { slug: sub.slug },
      {
        $set: {
          name: sub.name,
          slug: sub.slug,
          description: `${sub.name} for speed skating`,
          image_url: "/placeholder.svg?height=400&width=600",
          parent_id: slugToId[sub.parent],
          is_active: true,
          updated_at: now(),
        },
        $setOnInsert: { id, created_at: now() },
      },
      { upsert: true },
    )
    const doc = await categories.findOne({ slug: sub.slug })
    slugToId[sub.slug] = doc.id
  }
  console.log(`[seed] Upserted ${mainCategories.length + subCategories.length} categories`)

  // --- Admin user ---
  const users = db.collection("users")
  const adminEmail = "admin@auriga.com"
  const adminPassword = "admin1234"
  const existingAdmin = await users.findOne({ email: adminEmail })
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10)
    await users.insertOne({
      id: randomUUID(),
      email: adminEmail,
      password_hash: passwordHash,
      first_name: "Auriga",
      last_name: "Admin",
      role: "admin",
      email_confirmed_at: now(),
      created_at: now(),
      updated_at: now(),
    })
    console.log(`[seed] Created admin user -> ${adminEmail} / ${adminPassword}`)
  } else {
    console.log(`[seed] Admin user already exists -> ${adminEmail}`)
  }

  // --- Sample products ---
  const products = db.collection("products")
  const productCategories = db.collection("product_categories")

  const sampleProducts = [
    {
      name: "Auriga Pro Carbon Inline Boot",
      slug: "auriga-pro-carbon-inline-boot",
      price_in_cents: 49900,
      product_type: "boot",
      categories: ["inline-boots", "inline-speed-skating"],
      deal_of_the_day: true,
    },
    {
      name: "Velocity 4x110 Inline Frame",
      slug: "velocity-4x110-inline-frame",
      price_in_cents: 21900,
      product_type: "frame",
      categories: ["inline-frames", "inline-speed-skating"],
      deal_of_the_day: false,
    },
    {
      name: "RaceLine 110mm Wheels (Set of 8)",
      slug: "raceline-110mm-wheels-set",
      price_in_cents: 12900,
      product_type: "wheel",
      categories: ["inline-wheels", "inline-speed-skating"],
      deal_of_the_day: true,
    },
    {
      name: "Complete Inline Race Package",
      slug: "complete-inline-race-package",
      price_in_cents: 79900,
      product_type: "package",
      categories: ["inline-skate-packages", "inline-speed-skating"],
      deal_of_the_day: false,
    },
    {
      name: "Aero Speed Helmet",
      slug: "aero-speed-helmet",
      price_in_cents: 8900,
      product_type: "helmet",
      categories: ["inline-accessories", "inline-speed-skating"],
      deal_of_the_day: true,
    },
    {
      name: "Precision Ceramic Bearings",
      slug: "precision-ceramic-bearings",
      price_in_cents: 5900,
      product_type: "bearing",
      categories: ["inline-bearings", "inline-speed-skating"],
      deal_of_the_day: false,
    },
  ]

  for (const p of sampleProducts) {
    const existing = await products.findOne({ slug: p.slug })
    let productId
    if (existing) {
      productId = existing.id
    } else {
      productId = randomUUID()
      await products.insertOne({
        id: productId,
        name: p.name,
        slug: p.slug,
        description: `${p.name} - engineered for competitive performance.`,
        short_description: `${p.name} for serious athletes.`,
        feature_description: "Premium materials and race-tested design.",
        price_in_cents: p.price_in_cents,
        category_id: slugToId[p.categories[p.categories.length - 1]] || null,
        image_url: "/placeholder.svg?height=600&width=600",
        stock_quantity: 25,
        is_active: true,
        status: "published",
        product_type: p.product_type,
        product_type_details: {},
        features: [],
        tags: [],
        deal_of_the_day: p.deal_of_the_day,
        created_at: now(),
        updated_at: now(),
      })
    }

    // join records
    for (const slug of p.categories) {
      const categoryId = slugToId[slug]
      if (!categoryId) continue
      await productCategories.updateOne(
        { product_id: productId, category_id: categoryId },
        {
          $set: { product_id: productId, category_id: categoryId },
          $setOnInsert: { id: randomUUID(), created_at: now() },
        },
        { upsert: true },
      )
    }
  }
  console.log(`[seed] Upserted ${sampleProducts.length} products with category links`)

  // --- Helpful indexes ---
  await users.createIndex({ email: 1 }, { unique: true })
  await categories.createIndex({ slug: 1 }, { unique: true })
  await products.createIndex({ slug: 1 }, { unique: true })
  await productCategories.createIndex({ product_id: 1 })
  await productCategories.createIndex({ category_id: 1 })
  console.log("[seed] Indexes ensured")

  await client.close()
  console.log("[seed] Done")
}

main().catch((err) => {
  console.error("[seed] Error:", err)
  process.exit(1)
})
