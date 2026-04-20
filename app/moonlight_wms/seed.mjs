/**
 * Moonlight WMS — Database Seed Script
 * Inserts 4,000 grocery products + 1 user per stakeholder role
 *
 * Usage:  node seed.mjs
 * Requires DATABASE_URL in .env (or already in env)
 */

import pg from 'pg'
import crypto from 'crypto'
import { readFileSync, existsSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── Load .env ─────────────────────────────────────────────────────────────────
const envPath = resolve(__dirname, '.env')
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([\w]+)\s*=\s*(.*)$/)
    if (m) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
  }
}

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  console.error('❌  DATABASE_URL not set. Add it to .env and retry.')
  process.exit(1)
}

const pool = new pg.Pool({ connectionString: DATABASE_URL, ssl: false })
const q = (text, params) => pool.query(text, params)

function hashPassword(plain) {
  return crypto.createHash('sha256').update(plain + 'moonlight_salt_v1').digest('hex')
}

let _seq = 1
function uid(prefix = 'id') {
  return `${prefix}_${Date.now()}_${(_seq++).toString().padStart(6, '0')}`
}
function pad(n, len = 6) { return String(n).padStart(len, '0') }
function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }

// ── Categories ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'cat_001', name: 'Fresh Produce',          icon: '🥦' },
  { id: 'cat_002', name: 'Dairy & Eggs',            icon: '🥛' },
  { id: 'cat_003', name: 'Meat & Seafood',          icon: '🥩' },
  { id: 'cat_004', name: 'Bakery & Bread',          icon: '🍞' },
  { id: 'cat_005', name: 'Beverages',               icon: '🥤' },
  { id: 'cat_006', name: 'Snacks & Confectionery',  icon: '🍫' },
  { id: 'cat_007', name: 'Canned & Packaged',       icon: '🛒' },
  { id: 'cat_008', name: 'Frozen Foods',            icon: '🧊' },
  { id: 'cat_009', name: 'Condiments & Sauces',     icon: '🧄' },
  { id: 'cat_010', name: 'Cereals & Breakfast',     icon: '🥣' },
  { id: 'cat_011', name: 'Personal Care',           icon: '🧴' },
  { id: 'cat_012', name: 'Household & Cleaning',    icon: '🧹' },
  { id: 'cat_013', name: 'Baby & Toddler',          icon: '👶' },
  { id: 'cat_014', name: 'Health & Wellness',       icon: '💊' },
  { id: 'cat_015', name: 'International Foods',     icon: '🌍' },
]

// ── Suppliers ─────────────────────────────────────────────────────────────────
const SUPPLIERS = [
  { id: 'sup_001', code: 'SUP-001', name: 'FreshFarm Co.',         email: 'orders@freshfarm.com',      phone: '+1-555-1001', address: '12 Farm Road, Portland' },
  { id: 'sup_002', code: 'SUP-002', name: 'GlobalGrocer Ltd.',     email: 'supply@globalgrocer.com',   phone: '+1-555-1002', address: '45 Trade St, Seattle' },
  { id: 'sup_003', code: 'SUP-003', name: 'NaturePure Organics',   email: 'sales@naturepure.com',      phone: '+1-555-1003', address: '88 Green Ave, Denver' },
  { id: 'sup_004', code: 'SUP-004', name: 'PremiumDairy Inc.',     email: 'dairy@premiumdairy.com',    phone: '+1-555-1004', address: '7 Milk Lane, Wisconsin' },
  { id: 'sup_005', code: 'SUP-005', name: 'OceanBest Seafood',     email: 'orders@oceanbest.com',      phone: '+1-555-1005', address: '3 Harbour Rd, Miami' },
  { id: 'sup_006', code: 'SUP-006', name: 'SunBake Wholesale',     email: 'wholesale@sunbake.com',     phone: '+1-555-1006', address: '21 Bakery Blvd, Chicago' },
  { id: 'sup_007', code: 'SUP-007', name: 'BevWorld Distributors', email: 'biz@bevworld.com',          phone: '+1-555-1007', address: '99 Drink St, Atlanta' },
  { id: 'sup_008', code: 'SUP-008', name: 'SnackKing Corp.',       email: 'orders@snackking.com',      phone: '+1-555-1008', address: '55 Snack Pkwy, Dallas' },
  { id: 'sup_009', code: 'SUP-009', name: 'FrozenPlus Group',      email: 'logistics@frozenplus.com',  phone: '+1-555-1009', address: '14 Ice Way, Minneapolis' },
  { id: 'sup_010', code: 'SUP-010', name: 'Unilever Trade',        email: 'trade@unilever.com',        phone: '+1-555-1010', address: '200 Corporate Dr, NYC' },
]

// ── Warehouses ────────────────────────────────────────────────────────────────
const WAREHOUSES = [
  { id: 'wh_001', code: 'WH-MEL', name: 'Melbourne Ambient Store' },
  { id: 'wh_002', code: 'WH-SYD', name: 'Sydney Cold Storage' },
  { id: 'wh_003', code: 'WH-BNE', name: 'Brisbane Dry Goods Depot' },
]

// ── Warehouse Zones ───────────────────────────────────────────────────────────
// capacity stored as percentage (0-100) matching frontend display
const ZONES = [
  { id: 'zone_001', warehouse: 'Melbourne Ambient Store',    zone: 'Zone A — Fresh Produce',      capacity: 72, max_capacity: 100, stored: 'Vegetables, Fruits, Salads' },
  { id: 'zone_002', warehouse: 'Sydney Cold Storage',        zone: 'Zone B — Dairy & Eggs',        capacity: 88, max_capacity: 100, stored: 'Milk, Cheese, Yoghurt, Eggs' },
  { id: 'zone_003', warehouse: 'Sydney Cold Storage',        zone: 'Zone C — Meat & Seafood',      capacity: 65, max_capacity: 100, stored: 'Beef, Chicken, Salmon, Prawns' },
  { id: 'zone_004', warehouse: 'Melbourne Ambient Store',    zone: 'Zone D — Pantry & Dry Goods',  capacity: 45, max_capacity: 100, stored: 'Rice, Pasta, Canned Goods, Cereals' },
  { id: 'zone_005', warehouse: 'Brisbane Dry Goods Depot',   zone: 'Zone E — Beverages',           capacity: 58, max_capacity: 100, stored: 'Juice, Soft Drinks, Water, Milk Alternatives' },
  { id: 'zone_006', warehouse: 'Sydney Cold Storage',        zone: 'Zone F — Frozen Foods',        capacity: 91, max_capacity: 100, stored: 'Frozen Meals, Ice Cream, Frozen Veg' },
  { id: 'zone_007', warehouse: 'Melbourne Ambient Store',    zone: 'Zone G — Snacks & Confectionery', capacity: 33, max_capacity: 100, stored: 'Chips, Chocolate, Biscuits, Lollies' },
  { id: 'zone_008', warehouse: 'Brisbane Dry Goods Depot',   zone: 'Zone H — Cleaning & Health',   capacity: 28, max_capacity: 100, stored: 'Detergent, Personal Care, Vitamins' },
]

// ── Product definitions per category ─────────────────────────────────────────
const PRODUCT_DEFS = {
  'Fresh Produce': {
    items: ['Apple','Banana','Mango','Strawberry','Blueberry','Grapes','Watermelon','Pineapple',
            'Orange','Lemon','Avocado','Peach','Pear','Plum','Cherry','Kiwi','Papaya','Guava',
            'Carrot','Broccoli','Spinach','Lettuce','Tomato','Cucumber','Potato','Onion',
            'Garlic','Ginger','Zucchini','Pumpkin','Eggplant','Bell Pepper','Celery','Beetroot',
            'Radish','Sweet Corn','Cabbage','Cauliflower','Asparagus','Green Beans'],
    variants: ['Organic','Premium','Fresh','Washed','Baby','Mini','Local Farm','Imported','Seasonal'],
    unit: ['kg','g','bunch','piece','bag','punnet'],
    costRange: [0.5, 8], priceRange: [1, 15],
    supplier: 'FreshFarm Co.', catId: 'cat_001',
  },
  'Dairy & Eggs': {
    items: ['Whole Milk','Skim Milk','2% Milk','Butter','Salted Butter','Unsalted Butter',
            'Cheddar Cheese','Mozzarella','Brie','Parmesan','Gouda','Swiss Cheese','Cream Cheese',
            'Greek Yogurt','Plain Yogurt','Strawberry Yogurt','Vanilla Yogurt','Sour Cream',
            'Heavy Cream','Whipping Cream','Half and Half','Cottage Cheese','Ricotta',
            'Free-Range Eggs','Organic Eggs','Large Eggs','Extra Large Eggs','Duck Eggs',
            'Oat Milk','Almond Milk','Soy Milk','Coconut Milk','Lactose-Free Milk'],
    variants: ['1L','2L','500ml','250g','1kg','500g','Organic','Low-Fat','Full-Fat','Extra Creamy'],
    unit: ['L','ml','kg','g','dozen','pack'],
    costRange: [1, 12], priceRange: [2, 20],
    supplier: 'PremiumDairy Inc.', catId: 'cat_002',
  },
  'Meat & Seafood': {
    items: ['Chicken Breast','Chicken Thigh','Whole Chicken','Ground Beef','Beef Steak','Beef Ribs',
            'Pork Chops','Pork Belly','Bacon','Ham','Lamb Chops','Lamb Shoulder','Veal Cutlets',
            'Salmon Fillet','Tuna Steak','Cod Fillet','Tilapia','Shrimp','Prawns','Lobster',
            'Crab Meat','Scallops','Mussels','Oysters','Squid','Sardines',
            'Turkey Breast','Duck Breast','Sausages','Chorizo','Salami'],
    variants: ['Fresh','Frozen','Boneless','Skin-On','Wild-Caught','Farm-Raised','Marinated','Smoked'],
    unit: ['kg','g','piece','pack','lb'],
    costRange: [3, 40], priceRange: [6, 80],
    supplier: 'OceanBest Seafood', catId: 'cat_003',
  },
  'Bakery & Bread': {
    items: ['White Bread','Whole Wheat Bread','Sourdough Loaf','Rye Bread','Multigrain Bread',
            'Baguette','Ciabatta','Focaccia','Pita Bread','Naan','Croissant','Danish Pastry',
            'Chocolate Muffin','Blueberry Muffin','Banana Bread','Cornbread',
            'Cinnamon Roll','Dinner Rolls','Hamburger Buns','Hot Dog Buns','Bagel','English Muffin',
            'Flatbread','Tortillas','Wraps','Gluten-Free Bread','Brioche','Challah'],
    variants: ['Sliced','Unsliced','Thick-Cut','Thin-Cut','Small','Large','Mini','Jumbo','Multigrain'],
    unit: ['loaf','pack','piece','dozen','kg'],
    costRange: [1, 6], priceRange: [2, 12],
    supplier: 'SunBake Wholesale', catId: 'cat_004',
  },
  'Beverages': {
    items: ['Orange Juice','Apple Juice','Grape Juice','Mango Juice','Pineapple Juice',
            'Lemonade','Iced Tea','Green Tea','Black Tea','Chamomile Tea','Herbal Tea',
            'Coffee Beans','Ground Coffee','Instant Coffee','Cold Brew Coffee','Espresso Pods',
            'Sparkling Water','Still Water','Coconut Water','Sports Drink','Energy Drink',
            'Cola','Diet Cola','Ginger Ale','Root Beer','Tonic Water','Club Soda',
            'Kombucha','Smoothie','Protein Shake','Chocolate Milk','Strawberry Milk'],
    variants: ['1L','500ml','330ml','250ml','2L','6-Pack','12-Pack','24-Pack','Organic','No Sugar'],
    unit: ['L','ml','can','bottle','pack','carton'],
    costRange: [0.5, 8], priceRange: [1, 15],
    supplier: 'BevWorld Distributors', catId: 'cat_005',
  },
  'Snacks & Confectionery': {
    items: ['Potato Chips','Tortilla Chips','Pretzels','Popcorn','Rice Cakes','Granola Bar',
            'Protein Bar','Gummy Bears','Gummy Worms','Jelly Beans','Hard Candy',
            'Chocolate Bar','Milk Chocolate','Dark Chocolate','White Chocolate','Truffles',
            'Cookies','Oreos','Digestive Biscuits','Graham Crackers','Wafers','Crackers',
            'Trail Mix','Mixed Nuts','Cashews','Almonds','Peanuts','Pistachios','Walnuts',
            'Dried Cranberries','Raisins','Dried Apricots','Fruit and Nut Mix','Marshmallows'],
    variants: ['Original','BBQ','Sour Cream','Sea Salt','Lightly Salted','Honey','Dark','Milk','White'],
    unit: ['g','kg','pack','box','bag','piece'],
    costRange: [1, 10], priceRange: [2, 18],
    supplier: 'SnackKing Corp.', catId: 'cat_006',
  },
  'Canned & Packaged': {
    items: ['Canned Tomatoes','Canned Corn','Canned Peas','Canned Beans','Chickpeas',
            'Lentils','Split Peas','Kidney Beans','Black Beans','Pinto Beans',
            'Canned Tuna','Canned Salmon','Canned Sardines','Canned Mackerel',
            'Coconut Milk Canned','Pumpkin Puree','Tomato Paste','Tomato Sauce',
            'Beef Stew','Chicken Soup','Vegetable Soup','Minestrone','Clam Chowder',
            'Pasta Spaghetti','Pasta Penne','Pasta Fusilli','Pasta Rigatoni',
            'White Rice','Brown Rice','Jasmine Rice','Basmati Rice','Quinoa','Couscous',
            'Oats','Barley','Polenta','Bread Crumbs','Panko'],
    variants: ['400g','800g','2kg','500g','1kg','No Salt Added','Organic','Low Sodium'],
    unit: ['can','kg','g','pack','bag'],
    costRange: [0.8, 6], priceRange: [1.5, 12],
    supplier: 'GlobalGrocer Ltd.', catId: 'cat_007',
  },
  'Frozen Foods': {
    items: ['Frozen Pizza','Frozen Lasagna','Frozen Burritos','Frozen Stir Fry','Frozen Pot Pie',
            'Frozen Waffles','Frozen Pancakes','Frozen French Toast',
            'Frozen Edamame','Frozen Peas','Frozen Corn','Frozen Broccoli','Frozen Spinach',
            'Frozen Mixed Vegetables','Frozen Stir-Fry Blend','Frozen Mango Chunks',
            'Frozen Berries','Frozen Strawberries','Frozen Blueberries',
            'Ice Cream Vanilla','Ice Cream Chocolate','Ice Cream Strawberry','Sorbet',
            'Frozen Shrimp','Frozen Fish Fillets','Frozen Chicken Nuggets','Frozen Burger Patties',
            'Frozen Fries','Frozen Onion Rings','Frozen Dumplings','Frozen Spring Rolls'],
    variants: ['500g','1kg','2kg','Family Pack','Mini','Regular','Organic','Extra Large'],
    unit: ['kg','g','pack','box','piece'],
    costRange: [2, 18], priceRange: [4, 35],
    supplier: 'FrozenPlus Group', catId: 'cat_008',
  },
  'Condiments & Sauces': {
    items: ['Ketchup','Mustard','Mayonnaise','Ranch Dressing','Caesar Dressing','Balsamic Vinegar',
            'Apple Cider Vinegar','Soy Sauce','Worcestershire Sauce','Hot Sauce','Sriracha',
            'Teriyaki Sauce','Oyster Sauce','Fish Sauce','Hoisin Sauce','Peanut Sauce',
            'Barbecue Sauce','Salsa','Guacamole','Hummus','Tzatziki','Tahini',
            'Olive Oil','Vegetable Oil','Coconut Oil','Sesame Oil','Avocado Oil',
            'Honey','Maple Syrup','Agave Nectar','Jam','Jelly','Marmalade','Peanut Butter',
            'Almond Butter','Nutella','Vanilla Extract','Baking Powder','Baking Soda'],
    variants: ['250ml','500ml','1L','200g','400g','Organic','Original','Spicy','Mild'],
    unit: ['ml','L','g','kg','bottle','jar'],
    costRange: [1, 12], priceRange: [2, 22],
    supplier: 'GlobalGrocer Ltd.', catId: 'cat_009',
  },
  'Cereals & Breakfast': {
    items: ['Corn Flakes','Bran Flakes','Frosted Flakes','Honey Nut Cheerios','Original Cheerios',
            'Rice Crispies','Granola','Muesli','Overnight Oats','Steel Cut Oats','Rolled Oats',
            'Porridge Mix','Weetabix','Shredded Wheat','Mini Wheats','Raisin Bran',
            'Cocoa Puffs','Cinnamon Toast Crunch','Froot Loops',
            'Pancake Mix','Waffle Mix','Breakfast Bars','Pop Tarts',
            'Instant Oatmeal Apple Cinnamon','Instant Oatmeal Brown Sugar','Quinoa Flakes'],
    variants: ['500g','1kg','800g','300g','Family Size','Original','Honey','Chocolate','Berry'],
    unit: ['g','kg','pack','box'],
    costRange: [2, 10], priceRange: [4, 18],
    supplier: 'GlobalGrocer Ltd.', catId: 'cat_010',
  },
  'Personal Care': {
    items: ['Shampoo','Conditioner','Body Wash','Bar Soap','Face Wash','Facial Moisturizer',
            'Sunscreen SPF 50','Lip Balm','Deodorant','Antiperspirant','Toothpaste','Toothbrush',
            'Mouthwash','Dental Floss','Razor','Shaving Cream','Aftershave','Hand Sanitizer',
            'Lotion','Body Butter','Eye Cream','Nail Polish Remover','Hair Gel','Hair Spray',
            'Cotton Buds','Cotton Pads','Tissues','Wet Wipes','Baby Wipes'],
    variants: ['250ml','500ml','1L','200ml','50ml','Regular','Sensitive','Hydrating','Whitening'],
    unit: ['ml','L','g','piece','pack','bottle'],
    costRange: [1, 20], priceRange: [2, 40],
    supplier: 'Unilever Trade', catId: 'cat_011',
  },
  'Household & Cleaning': {
    items: ['Dishwashing Liquid','Dishwasher Tablets','Laundry Detergent','Fabric Softener',
            'Bleach','All-Purpose Cleaner','Bathroom Cleaner','Toilet Cleaner','Glass Cleaner',
            'Floor Cleaner','Oven Cleaner','Drain Unclogger','Mold Remover',
            'Paper Towels','Toilet Paper','Garbage Bags','Zip-Lock Bags','Cling Wrap',
            'Aluminium Foil','Baking Paper','Sponge','Scrub Pads','Rubber Gloves',
            'Air Freshener','Candles','Dishcloths'],
    variants: ['500ml','1L','2L','100-Pack','Regular','Concentrated','Lemon','Lavender','Unscented'],
    unit: ['ml','L','piece','pack','roll','box'],
    costRange: [1, 15], priceRange: [2, 30],
    supplier: 'Unilever Trade', catId: 'cat_012',
  },
  'Baby & Toddler': {
    items: ['Baby Formula Stage 1','Baby Formula Stage 2','Baby Formula Stage 3',
            'Baby Food Carrot Puree','Baby Food Apple Puree','Baby Food Banana Puree',
            'Baby Food Sweet Potato','Baby Cereal','Teething Biscuits','Baby Snacks',
            'Diapers Newborn','Diapers Size 1','Diapers Size 2','Diapers Size 3','Diapers Size 4',
            'Baby Wipes Sensitive','Baby Wipes Fragrance-Free',
            'Baby Shampoo','Baby Body Wash','Baby Lotion','Baby Powder','Nappy Rash Cream',
            'Sippy Cup','Baby Bottle','Pacifier','Teether','Baby Spoon Set'],
    variants: ['Small','Medium','Large','Stage 1','Stage 2','Stage 3','Organic','Hypoallergenic'],
    unit: ['pack','piece','g','ml','box'],
    costRange: [2, 30], priceRange: [4, 60],
    supplier: 'GlobalGrocer Ltd.', catId: 'cat_013',
  },
  'Health & Wellness': {
    items: ['Vitamin C 1000mg','Vitamin D3','Multivitamin','Fish Oil Omega-3','Magnesium',
            'Zinc Supplement','Probiotics','Collagen Powder','Protein Powder Vanilla',
            'Protein Powder Chocolate','Whey Protein','Plant-Based Protein',
            'Melatonin','Elderberry Syrup','Echinacea','Turmeric Capsules','Ashwagandha',
            'Apple Cider Vinegar Capsules','Biotin','Iron Supplement',
            'Bandages','Antiseptic Cream','Pain Relief Gel','Cough Syrup','Throat Lozenges',
            'Thermometer','Hand Sanitizer Medical'],
    variants: ['30-Count','60-Count','90-Count','120-Count','500mg','1000mg','Regular Strength'],
    unit: ['pack','bottle','capsule','g','piece'],
    costRange: [3, 40], priceRange: [6, 80],
    supplier: 'NaturePure Organics', catId: 'cat_014',
  },
  'International Foods': {
    items: ['Basmati Rice Indian','Jasmine Rice Thai','Sushi Rice','Miso Paste',
            'Soy Sauce Japanese','Ponzu Sauce','Dashi Stock','Nori Sheets','Panko Breadcrumbs',
            'Mirin Cooking','Kimchi','Gochujang Paste','Sesame Seeds',
            'Tahini Paste Lebanese','Zaatar Spice','Pomegranate Molasses',
            'Harissa Paste','Preserved Lemons',
            'Coconut Cream','Galangal Paste','Lemongrass Paste','Thai Curry Paste',
            'Pad Thai Sauce','Mango Chutney','Masala Spice Mix','Ghee','Paneer',
            'Enchilada Sauce','Mole Paste','Chipotle in Adobo','Tortilla Chips Mexican'],
    variants: ['200g','400g','500ml','1L','Mild','Medium','Hot','Organic','Authentic'],
    unit: ['g','ml','kg','pack','jar','can'],
    costRange: [1.5, 15], priceRange: [3, 28],
    supplier: 'GlobalGrocer Ltd.', catId: 'cat_015',
  },
}

const CAT_NAMES = Object.keys(PRODUCT_DEFS)

// Status values match frontend badge maps: 'active', 'low', 'out'
const STATUSES = ['active','active','active','active','active','low','low','out']

const LOCATIONS = ['A1','A2','A3','B1','B2','B3','C1','C2','C3','D1','D2','D3','E1','E2','E3']

// ── Build 4,000 products ──────────────────────────────────────────────────────
function buildProducts(count = 4000) {
  const products = []
  let skuCounter = 1

  while (products.length < count) {
    const catName = CAT_NAMES[products.length % CAT_NAMES.length]
    const def = PRODUCT_DEFS[catName]
    const item = pick(def.items)
    const variant = pick(def.variants)
    const sku = `SKU-${pad(skuCounter++, 7)}`
    const productName = `${item} ${variant}`
    const unitCost = parseFloat((Math.random() * (def.costRange[1] - def.costRange[0]) + def.costRange[0]).toFixed(2))
    const sellingPrice = parseFloat((unitCost * (1.25 + Math.random() * 0.6)).toFixed(2))
    const status = pick(STATUSES)
    const qty = status === 'out' ? 0 : status === 'low' ? rnd(1, 15) : rnd(20, 500)
    const reorderLevel = rnd(10, 100)
    const warehouse = pick(WAREHOUSES)
    const barcode = `${rnd(1000000000000, 9999999999999)}`

    products.push({
      id: uid('prod'),
      sku,
      product_name: productName,
      category_id: def.catId,
      category: catName,
      supplier: def.supplier,
      unit_cost: unitCost,
      selling_price: sellingPrice,
      reorder_level: reorderLevel,
      quantity: qty,
      status,
      warehouse: warehouse.name,
      location: `${warehouse.code}-${pick(LOCATIONS)}`,
      batch: `BATCH-${pad(rnd(1, 9999), 4)}`,
      unit: pick(def.unit),
      barcode,
    })
  }
  return products
}

// ── Stakeholder users ─────────────────────────────────────────────────────────
const STAKEHOLDER_USERS = [
  {
    id: uid('usr'),
    name: 'Alex Administrator',
    emp_id: 'EMP-0001',
    email: 'admin@moonlight.wms',
    phone: '+1-555-0001',
    role: 'Admin',
    site: 'Main Warehouse',
    department: 'Administration',
    status: 'Active',
    password: 'Admin@1234',
  },
  {
    id: uid('usr'),
    name: 'Morgan Manager',
    emp_id: 'EMP-0002',
    email: 'manager@moonlight.wms',
    phone: '+1-555-0002',
    role: 'Manager',
    site: 'Main Warehouse',
    department: 'Operations',
    status: 'Active',
    password: 'Manager@1234',
  },
  {
    id: uid('usr'),
    name: 'Sam SiteManager',
    emp_id: 'EMP-0003',
    email: 'sitemanager@moonlight.wms',
    phone: '+1-555-0003',
    role: 'Site Manager',
    site: 'East Distribution',
    department: 'Site Operations',
    status: 'Active',
    password: 'SiteMgr@1234',
  },
  {
    id: uid('usr'),
    name: 'Evan Employee',
    emp_id: 'EMP-0004',
    email: 'employee@moonlight.wms',
    phone: '+1-555-0004',
    role: 'Employee',
    site: 'Main Warehouse',
    department: 'Warehouse',
    status: 'Active',
    password: 'Employee@1234',
  },
]

// ── Stock movements (demo data) ───────────────────────────────────────────────
function buildMovements(products) {
  const types = ['Stock In', 'Stock Out', 'Transfer', 'Adjustment']
  const users = ['Alex Administrator', 'Morgan Manager', 'Evan Employee']
  const movements = []
  const sample = products.slice(0, 50)

  for (let i = 0; i < 80; i++) {
    const p = pick(sample)
    const type = pick(types)
    const qty = rnd(1, 100)
    const daysAgo = rnd(0, 30)
    const date = new Date(Date.now() - daysAgo * 86400000).toISOString().split('T')[0]
    const descriptions = {
      'Stock In':   `Received ${qty} units from supplier`,
      'Stock Out':  `Dispatched ${qty} units to store`,
      'Transfer':   `Transferred ${qty} units between zones`,
      'Adjustment': `Inventory adjustment of ${qty} units`,
    }
    movements.push({
      id: uid('mov'),
      date,
      product: p.product_name,
      sku: p.sku,
      type,
      quantity: qty,
      warehouse: p.warehouse,
      description: descriptions[type],
      user_name: pick(users),
    })
  }
  return movements.sort((a, b) => b.date.localeCompare(a.date))
}

// ── Alerts (demo data) ────────────────────────────────────────────────────────
function buildAlerts(products) {
  const lowProducts = products.filter(p => p.status === 'low').slice(0, 10)
  const outProducts = products.filter(p => p.status === 'out').slice(0, 5)
  const alerts = []

  for (const p of lowProducts) {
    const daysAgo = rnd(0, 7)
    alerts.push({
      id: uid('alrt'),
      product: p.product_name,
      type: 'Low Stock',
      priority: 'Warning',
      message: `${p.product_name} (${p.sku}) is running low — only ${p.quantity} ${p.unit} remaining`,
      status: 'Active',
      created: new Date(Date.now() - daysAgo * 86400000).toISOString().split('T')[0],
    })
  }
  for (const p of outProducts) {
    alerts.push({
      id: uid('alrt'),
      product: p.product_name,
      type: 'Out of Stock',
      priority: 'Critical',
      message: `${p.product_name} (${p.sku}) is out of stock — reorder immediately`,
      status: 'Active',
      created: new Date(Date.now() - rnd(0, 3) * 86400000).toISOString().split('T')[0],
    })
  }
  return alerts
}

// ── Batches (derived from products) ──────────────────────────────────────────
function buildBatches(products) {
  const batches = []
  const sample = products.slice(0, 60)
  for (const p of sample) {
    const daysAgo = rnd(0, 60)
    const mfgDate = new Date(Date.now() - daysAgo * 86400000)
    const shelfDays = rnd(7, 730)
    const expiryDate = new Date(mfgDate.getTime() + shelfDays * 86400000)
    const today = Date.now()
    const daysToExpiry = Math.round((expiryDate.getTime() - today) / 86400000)
    const status = daysToExpiry < 0 ? 'Expired' : daysToExpiry <= 7 ? 'Expiring Soon' : 'OK'
    batches.push({
      id: uid('bat'),
      product: p.product_name,
      sku: p.sku,
      batch_number: p.batch,
      manufacture_date: mfgDate.toISOString().split('T')[0],
      expiry_date: expiryDate.toISOString().split('T')[0],
      location: p.location,
      quantity: p.quantity,
      status,
    })
  }
  return batches
}

// ── Audit logs ────────────────────────────────────────────────────────────────
function buildAuditLogs(products, users) {
  const actions = [
    { action: 'Stock Updated',  type: 'Inventory' },
    { action: 'Stock Out',      type: 'Inventory' },
    { action: 'Stock Transfer', type: 'Inventory' },
    { action: 'Adjustment',     type: 'Inventory' },
    { action: 'Product Updated',type: 'Product' },
    { action: 'Report Exported',type: 'Report' },
    { action: 'Supplier Added', type: 'Supplier' },
    { action: 'Alert Resolved', type: 'System' },
  ]
  const logs = []
  const sample = products.slice(0, 30)
  for (let i = 0; i < 50; i++) {
    const p = pick(sample)
    const u = pick(users)
    const a = pick(actions)
    const daysAgo = rnd(0, 30)
    const minsAgo = rnd(0, 1440)
    const dt = new Date(Date.now() - daysAgo * 86400000 - minsAgo * 60000)
    const time = `${dt.toISOString().split('T')[0]} ${dt.toTimeString().slice(0, 5)}`
    const details = {
      'Stock Updated':  `Added ${rnd(10,200)} units — ${p.product_name} (${p.sku})`,
      'Stock Out':      `Dispatched ${rnd(5,100)}x ${p.product_name}`,
      'Stock Transfer': `Transferred ${rnd(5,50)}x ${p.product_name} — ${p.location}`,
      'Adjustment':     `Removed ${rnd(1,10)}x ${p.product_name} — damaged`,
      'Product Updated':`Selling price updated — ${p.product_name}`,
      'Report Exported':'Exported Inventory Report (CSV)',
      'Supplier Added': `Added new supplier: ${p.supplier}`,
      'Alert Resolved': `Resolved alert — ${p.product_name}`,
    }
    logs.push({ id: uid('log'), time, user: u.name, action: a.action, type: a.type, detail: details[a.action] })
  }
  return logs.sort((a, b) => b.time.localeCompare(a.time))
}

// ── Notifications ─────────────────────────────────────────────────────────────
function buildNotifications(alerts, movements) {
  const notes = []
  for (const a of alerts.slice(0, 3)) {
    notes.push({
      id: uid('notif'),
      title: a.type === 'Out of Stock' ? 'Out of Stock Alert' : 'Low Stock Alert',
      message: a.message,
      time: `${rnd(1,12)} hours ago`,
      read: false,
    })
  }
  for (const m of movements.slice(0, 3)) {
    notes.push({
      id: uid('notif'),
      title: 'Stock Movement Recorded',
      message: `${m.type}: ${m.product} — ${m.description}`,
      time: `${rnd(1,3)} days ago`,
      read: rnd(0,1) === 1,
    })
  }
  notes.push({
    id: uid('notif'),
    title: 'Monthly Report Ready',
    message: `Inventory summary report for ${new Date().toLocaleString('en-AU', { month: 'long', year: 'numeric' })} is ready for download.`,
    time: '1 day ago',
    read: true,
  })
  return notes
}

// ── Main seeder ───────────────────────────────────────────────────────────────
async function seed() {
  console.log('🌱  Moonlight WMS — Database Seeder')
  console.log('   Connecting to database...')

  try {
    await q('SELECT 1')
    console.log('Connected.\n')
  } catch (err) {
    console.error('Connection failed:', err.message)
    process.exit(1)
  }

  // Categories
  console.log('Seeding categories...')
  for (const c of CATEGORIES) {
    await q(
      `INSERT INTO categories (id, name, icon, product_count, is_active)
       VALUES ($1,$2,$3,$4,TRUE)
       ON CONFLICT (id) DO UPDATE SET name=$2, icon=$3`,
      [c.id, c.name, c.icon, 0]
    )
  }
  console.log(`  ${CATEGORIES.length} categories done.`)

  // Suppliers
  console.log('Seeding suppliers...')
  for (const s of SUPPLIERS) {
    await q(
      `INSERT INTO suppliers (id, supplier_code, supplier_name, email, phone, address, status)
       VALUES ($1,$2,$3,$4,$5,$6,'active')
       ON CONFLICT (id) DO NOTHING`,
      [s.id, s.code, s.name, s.email, s.phone, s.address]
    )
  }
  console.log(`  ${SUPPLIERS.length} suppliers done.`)

  // Warehouses
  console.log('Seeding warehouses...')
  for (const w of WAREHOUSES) {
    await q(
      `INSERT INTO warehouses (id, warehouse_code, warehouse_name, status)
       VALUES ($1,$2,$3,'active')
       ON CONFLICT (warehouse_code) DO UPDATE SET warehouse_name=EXCLUDED.warehouse_name, id=EXCLUDED.id`,
      [w.id, w.code, w.name]
    )
  }
  console.log(`  ${WAREHOUSES.length} warehouses done.`)

  // Warehouse zones
  console.log('Seeding warehouse zones...')
  for (const z of ZONES) {
    await q(
      `INSERT INTO warehouse_zones (id, warehouse, zone, capacity, max_capacity, stored)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (id) DO NOTHING`,
      [z.id, z.warehouse, z.zone, z.capacity, z.max_capacity, z.stored]
    )
  }
  console.log(`  ${ZONES.length} zones done.`)

  // Products (batched inserts)
  console.log('\nGenerating 4,000 products... (~10s)')
  const products = buildProducts(4000)
  const BATCH = 500
  let inserted = 0

  for (let i = 0; i < products.length; i += BATCH) {
    const chunk = products.slice(i, i + BATCH)
    const vals = []
    const placeholders = chunk.map((p, j) => {
      const b = j * 16
      vals.push(
        p.id, p.sku, p.product_name, p.category_id, p.category,
        p.supplier, p.unit_cost, p.selling_price, p.reorder_level,
        p.quantity, p.status, p.warehouse, p.location, p.batch, p.unit, p.barcode
      )
      return `($${b+1},$${b+2},$${b+3},$${b+4},$${b+5},$${b+6},$${b+7},$${b+8},$${b+9},$${b+10},$${b+11},$${b+12},$${b+13},$${b+14},$${b+15},$${b+16})`
    })
    await q(
      `INSERT INTO products
         (id,sku,product_name,category_id,category,supplier,unit_cost,selling_price,
          reorder_level,quantity,status,warehouse,location,batch,unit,barcode)
       VALUES ${placeholders.join(',')}
       ON CONFLICT (sku) DO NOTHING`,
      vals
    )
    inserted += chunk.length
    process.stdout.write(`\r  ${inserted}/4000 products inserted...`)
  }
  console.log(`\n  Done — ${inserted} products seeded.`)

  // Update category product_count
  await q(`
    UPDATE categories c
    SET product_count = (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id)
  `)

  // Stock movements
  console.log('\nSeeding stock movements...')
  const movements = buildMovements(products)
  for (const m of movements) {
    await q(
      `INSERT INTO stock_movements (id, date, product, sku, type, quantity, warehouse, description, user_name)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (id) DO NOTHING`,
      [m.id, m.date, m.product, m.sku, m.type, m.quantity, m.warehouse, m.description, m.user_name]
    )
  }
  console.log(`  ${movements.length} movements done.`)

  // Alerts
  console.log('Seeding alerts...')
  const alerts = buildAlerts(products)
  for (const a of alerts) {
    await q(
      `INSERT INTO alerts (id, product, type, priority, message, status, created)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT (id) DO NOTHING`,
      [a.id, a.product, a.type, a.priority, a.message, a.status, a.created]
    )
  }
  console.log(`  ${alerts.length} alerts done.`)

  // Batches
  console.log('Seeding batches...')
  const batches = buildBatches(products)
  for (const b of batches) {
    await q(
      `INSERT INTO batches (id, product, sku, batch_number, manufacture_date, expiry_date, location, quantity, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (id) DO NOTHING`,
      [b.id, b.product, b.sku, b.batch_number, b.manufacture_date, b.expiry_date, b.location, b.quantity, b.status]
    )
  }
  console.log(`  ${batches.length} batches done.`)

  // Stakeholder users
  console.log('\nSeeding users...')
  console.log('  ---------------------------------------------------------------')
  for (const u of STAKEHOLDER_USERS) {
    const hash = hashPassword(u.password)
    await q(
      `INSERT INTO app_users
         (id, name, emp_id, email, phone, role, site, department, status, locked, password_hash, approved_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,FALSE,$10,NOW())
       ON CONFLICT (email) DO UPDATE SET
         password_hash=$10, role=$6, status=$9, locked=FALSE, name=$2`,
      [u.id, u.name, u.emp_id, u.email, u.phone, u.role, u.site, u.department, u.status, hash]
    )
    console.log(`  ${u.role.padEnd(14)} | ${u.email.padEnd(32)} | ${u.password}`)
  }
  console.log('  ---------------------------------------------------------------\n')

  // Audit logs
  console.log('Seeding audit logs...')
  const auditLogs = buildAuditLogs(products, STAKEHOLDER_USERS)
  for (const l of auditLogs) {
    await q(
      `INSERT INTO audit_logs (id, time, "user", action, type, detail)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (id) DO NOTHING`,
      [l.id, l.time, l.user, l.action, l.type, l.detail]
    )
  }
  console.log(`  ${auditLogs.length} audit logs done.`)

  // Notifications
  console.log('Seeding notifications...')
  const notifications = buildNotifications(alerts, movements)
  for (const n of notifications) {
    await q(
      `INSERT INTO notifications (id, title, message, time, read)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (id) DO NOTHING`,
      [n.id, n.title, n.message, n.time, n.read]
    )
  }
  console.log(`  ${notifications.length} notifications done.`)

  console.log('Seed complete!\n')
  console.log('  Login credentials:')
  console.log('  Role           | Email                            | Password')
  console.log('  ---------------------------------------------------------------')
  for (const u of STAKEHOLDER_USERS) {
    console.log(`  ${u.role.padEnd(14)} | ${u.email.padEnd(32)} | ${u.password}`)
  }
  console.log('')

  writeFileSync(resolve(__dirname, '.seeded'), new Date().toISOString())
  await pool.end()
}

seed().catch(err => {
  console.error('\nSeed failed:', err.message)
  pool.end()
  process.exit(1)
})
