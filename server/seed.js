// Populates MongoDB with a 50-item Tamil Nadu menu.
// Run with: npm run seed

require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("./config/db");
const MenuItem = require("./models/MenuItem");
const User = require("./models/User");

// ============================================================
// ADMIN ACCOUNT
// ============================================================

const ADMIN_EMAIL =
  process.env.SEED_ADMIN_EMAIL || "admin@healthyfood.com";

const ADMIN_PASSWORD =
  process.env.SEED_ADMIN_PASSWORD || "Admin@12345";

// ============================================================
// WIKIMEDIA COMMONS IMAGE HELPER
// ============================================================

// Special:FilePath resolves the exact Wikimedia Commons filename
// to the current image URL.
const commons = (fileName) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
    fileName
  )}`;

// ============================================================
// IMAGE MAP
// ============================================================

const IMG = {
  // Breakfast & Tiffin
  Idli: commons("Idly.jpg"),
  SadaDosai: commons("Plain dosa.jpg"),
  MasalaDosa: commons(
    "Masala Dosa as served in Tamil Nadu,India.JPG"
  ),
  RavaDosa: commons("Rava Dosa.jpg"),
  MeduVada: commons("Idly sambar vada.JPG"),
  VenPongal: commons("Ven Pongal.jpg"),
  Uttapam: commons("Uttapam.jpg"),
  Idiyappam: commons("Idiyappam.jpg"),
  Adai: commons("Adai dosai.jpg"),
  KuzhiPaniyaram: commons("Kuzhi Paniyaram.jpg"),

  // Rice
  ThayirSadam: commons("Curd Rice ThayirSaadam.JPG"),
  LemonRice: commons("Lemon Rice.JPG"),
  Puliyodarai: commons("Tamarind Rice (Puliyogare).jpg"),
  CoconutRice: commons("Coconut rice.jpg"),
  TomatoRice: commons("Tomato Rice.jpg"),
  VegetableBiryani: commons("Vegetable-biryani.jpg"),
  AmburChickenBiryani: commons("Ambur Briyani.jpg"),

  // Kuzhambu & Curries
  Sambar: commons("Sambar.JPG"),
  Rasam: commons("Rasam.JPG"),
  MorKuzhambu: commons(
    "Butter milk kuzhambu aka Moru curry.jpg"
  ),
  KaraKuzhambu: commons(
    "Chettinad Garlic Kara Kuzhambu Paste The Grand Sweets And Snacks.jpg"
  ),
  VathaKuzhambu: commons(
    "Manathakkalikkai vathakuzhambu.jpg"
  ),
  BeansPoriyal: commons("BeansPoriyal.JPG"),
  MixedVegKootu: commons("Cabbage kootu.jpg"),
  Aviyal: commons("Aviyal,Kerala cuisine.jpg"),

  // Non-Veg Specials
  ChickenChettinad: commons("Chicken Chettinad.jpg"),
  MuttonChukka: commons("Mutton Chettinad.jpg"),
  MeenKuzhambu: commons("Tamil Nadu Fish Curry.jpg"),
  PrawnMasala: commons("Chettinad Prawn Masala.JPG"),
  Kalaki: commons(
    "Kalaki (An Omelette half cooked with chicken curry on it) as served in Chennai,Tamil Nadu..jpg"
  ),
  Chicken65: commons("Chicken 65.jpg"),

  // Snacks
  Murukku: commons("Murukku.jpg"),
  MeduBonda: commons("Indian Boonda.jpg"),
  OnionBajji: commons("Onion Bajji.jpg"),
  MysoreBonda: commons("Mysore Bajji.jpg"),
  BananaChips: commons("Banana Chips from India.jpg"),
  Thattai: commons("Thattai Image.jpg"),

  // Sweets
  SemiyaPayasam: commons("Semiya Payasam.jpg"),
  SakkaraiPongal: commons("Sakkarai pongal.jpg"),
  MysorePak: commons("Mysore Pak.jpg"),
  Adhirasam: commons("Adhirasam Picture.JPG"),
  RavaKesari: commons("Rava Kesari.jpg"),
  Kozhukattai: commons("Kozhukattai.jpeg"),

  // Beverages
  FilterCoffee: commons("Filter coffee.jpg"),
  Jigarthanda: commons("Jigarthanda.JPG"),
  NannariSarbath: commons(
    "Nannari sarbath with Sabja seeds.jpg"
  ),
  Panagam: commons("Panagam picture.JPG"),
  SukkuMalliCoffee: commons(
    "Sukkumalli Coffee or Dry Ginger Coffee.jpg"
  ),
  NeerMor: commons("Drinking buttermilk.jpg"),
  TenderCoconutWater: commons(
    "Tender Coconut Water.jpg"
  ),
};

// ============================================================
// NOTES
// ============================================================
//
// A few menu names do not have an exact Commons file title.
// The closest relevant Commons image/style is used:
//
// Mutton Chukka
//   -> Mutton Chettinad
//
// Kara Kuzhambu
//   -> Chettinad Garlic Kara Kuzhambu
//
// Medu Bonda
//   -> Indian Boonda
//
// Neer Mor
//   -> Drinking buttermilk
//
// All image URLs use Wikimedia Commons Special:FilePath.
// ============================================================


// ============================================================
// 50 MENU ITEMS
// ============================================================

const items = [

  // ==========================================================
  // BREAKFAST & TIFFIN
  // ==========================================================

  {
    name: "Idli",
    tamilName: "இட்லி",
    description:
      "Steamed rice-lentil cakes, served with sambar and coconut chutney",
    price: 50,
    category: "Breakfast & Tiffin",
    calories: 140,
    tags: ["Steamed", "Breakfast"],
    isVeg: true,
    spiceLevel: "Mild",
    image: IMG.Idli,
  },

  {
    name: "Sada Dosai",
    tamilName: "சாதா தோசை",
    description:
      "Classic thin fermented rice-lentil crepe, crisp at the edges",
    price: 60,
    category: "Breakfast & Tiffin",
    calories: 170,
    tags: ["Breakfast"],
    isVeg: true,
    spiceLevel: "Mild",
    image: IMG.SadaDosai,
  },

  {
    name: "Masala Dosa",
    tamilName: "மசாலா தோசை",
    description:
      "Crisp dosa folded over spiced potato masala, sambar & chutney",
    price: 90,
    category: "Breakfast & Tiffin",
    calories: 260,
    tags: ["Breakfast", "Popular"],
    isVeg: true,
    spiceLevel: "Medium",
    image: IMG.MasalaDosa,
  },

  {
    name: "Rava Dosa",
    tamilName: "ரவா தோசை",
    description:
      "Lacy, crisp semolina crepe with onion and cumin",
    price: 85,
    category: "Breakfast & Tiffin",
    calories: 210,
    tags: ["Breakfast", "Crispy"],
    isVeg: true,
    spiceLevel: "Mild",
    image: IMG.RavaDosa,
  },

  {
    name: "Medu Vada",
    tamilName: "மெதுவடை",
    description:
      "Crisp-fried urad dal doughnuts, served with sambar and chutney",
    price: 55,
    category: "Breakfast & Tiffin",
    calories: 180,
    tags: ["Fried", "Breakfast"],
    isVeg: true,
    spiceLevel: "Mild",
    image: IMG.MeduVada,
  },

  {
    name: "Ven Pongal",
    tamilName: "வெண் பொங்கல்",
    description:
      "Creamy rice and moong dal, tempered with pepper, cumin and ghee",
    price: 65,
    category: "Breakfast & Tiffin",
    calories: 300,
    tags: ["Comfort Food"],
    isVeg: true,
    spiceLevel: "Mild",
    image: IMG.VenPongal,
  },

  {
    name: "Uttapam",
    tamilName: "உத்தப்பம்",
    description:
      "Thick savoury pancake topped with onion, tomato and green chilli",
    price: 75,
    category: "Breakfast & Tiffin",
    calories: 230,
    tags: ["Breakfast"],
    isVeg: true,
    spiceLevel: "Mild",
    image: IMG.Uttapam,
  },

  {
    name: "Idiyappam",
    tamilName: "இடியாப்பம்",
    description:
      "Steamed rice-flour noodle nests, served with coconut milk stew",
    price: 70,
    category: "Breakfast & Tiffin",
    calories: 190,
    tags: ["Steamed", "Light"],
    isVeg: true,
    spiceLevel: "Mild",
    image: IMG.Idiyappam,
  },

  {
    name: "Adai",
    tamilName: "அடை",
    description:
      "Thick, protein-rich crepe of mixed lentils, served with jaggery & butter",
    price: 70,
    category: "Breakfast & Tiffin",
    calories: 250,
    tags: ["High Protein"],
    isVeg: true,
    spiceLevel: "Medium",
    image: IMG.Adai,
  },

  {
    name: "Kuzhi Paniyaram",
    tamilName: "குழி பணியாரம்",
    description:
      "Bite-sized fermented batter balls, pan-roasted in a paniyaram griddle",
    price: 65,
    category: "Breakfast & Tiffin",
    calories: 210,
    tags: ["Snack-style"],
    isVeg: true,
    spiceLevel: "Mild",
    image: IMG.KuzhiPaniyaram,
  },


  // ==========================================================
  // RICE
  // ==========================================================

  {
    name: "Thayir Sadam",
    tamilName: "தயிர் சாதம்",
    description:
      "Cooling curd rice tempered with mustard seed, curry leaf and pomegranate",
    price: 80,
    category: "Rice",
    calories: 260,
    tags: ["Cooling", "Comfort Food"],
    isVeg: true,
    spiceLevel: "Mild",
    image: IMG.ThayirSadam,
  },

  {
    name: "Lemon Rice",
    tamilName: "எலுமிச்சை சாதம்",
    description:
      "Tangy rice tempered with mustard, peanuts, curry leaf and turmeric",
    price: 90,
    category: "Rice",
    calories: 290,
    tags: ["Tangy"],
    isVeg: true,
    spiceLevel: "Mild",
    image: IMG.LemonRice,
  },

  {
    name: "Puliyodarai",
    tamilName: "புளியோதரை",
    description:
      "Tamarind rice with roasted sesame and a bold South Indian spice mix",
    price: 95,
    category: "Rice",
    calories: 310,
    tags: ["Tangy", "Temple Food"],
    isVeg: true,
    spiceLevel: "Medium",
    image: IMG.Puliyodarai,
  },

  {
    name: "Coconut Rice",
    tamilName: "தேங்காய் சாதம்",
    description:
      "Fragrant rice tossed with fresh grated coconut, cashew and curry leaf",
    price: 90,
    category: "Rice",
    calories: 300,
    tags: ["Mild"],
    isVeg: true,
    spiceLevel: "Mild",
    image: IMG.CoconutRice,
  },

  {
    name: "Tomato Rice",
    tamilName: "தக்காளி சாதம்",
    description:
      "One-pot rice simmered with tomato, onion and whole spices",
    price: 90,
    category: "Rice",
    calories: 280,
    tags: ["Tangy"],
    isVeg: true,
    spiceLevel: "Medium",
    image: IMG.TomatoRice,
  },

  {
    name: "Vegetable Biryani",
    tamilName: "காய்கறி பிரியாணி",
    description:
      "Layered basmati rice with mixed vegetables, whole spices and saffron",
    price: 160,
    category: "Rice",
    calories: 420,
    tags: ["Festive"],
    isVeg: true,
    spiceLevel: "Medium",
    image: IMG.VegetableBiryani,
  },

  {
    name: "Ambur Chicken Biryani",
    tamilName: "ஆம்பூர் சிக்கன் பிரியாணி",
    description:
      "Seeraga samba rice biryani in the Ambur style, with tender chicken",
    price: 220,
    category: "Rice",
    calories: 560,
    tags: ["Popular", "Chef's Special"],
    isVeg: false,
    spiceLevel: "Spicy",
    image: IMG.AmburChickenBiryani,
  },


  // ==========================================================
  // KUZHAMBU & CURRIES
  // ==========================================================

  {
    name: "Sambar",
    tamilName: "சாம்பார்",
    description:
      "Toor dal and vegetable stew simmered with tamarind and sambar powder",
    price: 60,
    category: "Kuzhambu & Curries",
    calories: 150,
    tags: ["Everyday Classic"],
    isVeg: true,
    spiceLevel: "Medium",
    image: IMG.Sambar,
  },

  {
    name: "Rasam",
    tamilName: "ரசம்",
    description:
      "Peppery tamarind broth with tomato, garlic and curry leaf tempering",
    price: 55,
    category: "Kuzhambu & Curries",
    calories: 90,
    tags: ["Digestive"],
    isVeg: true,
    spiceLevel: "Medium",
    image: IMG.Rasam,
  },

  {
    name: "Mor Kuzhambu",
    tamilName: "மோர் குழம்பு",
    description:
      "Buttermilk-based curry with vegetable fritters and coconut paste",
    price: 75,
    category: "Kuzhambu & Curries",
    calories: 170,
    tags: ["Cooling"],
    isVeg: true,
    spiceLevel: "Mild",
    image: IMG.MorKuzhambu,
  },

  {
    name: "Kara Kuzhambu",
    tamilName: "காரக் குழம்பு",
    description:
      "Fiery tamarind gravy with brinjal and drumstick, roasted spice base",
    price: 80,
    category: "Kuzhambu & Curries",
    calories: 190,
    tags: ["Spicy"],
    isVeg: true,
    spiceLevel: "Spicy",
    image: IMG.KaraKuzhambu,
  },

  {
    name: "Vatha Kuzhambu",
    tamilName: "வத்தக் குழம்பு",
    description:
      "Sun-dried vegetable and tamarind curry, a Tamil pantry staple",
    price: 75,
    category: "Kuzhambu & Curries",
    calories: 180,
    tags: ["Traditional"],
    isVeg: true,
    spiceLevel: "Medium",
    image: IMG.VathaKuzhambu,
  },

  {
    name: "Beans Poriyal",
    tamilName: "பீன்ஸ் பொரியல்",
    description:
      "Stir-fried green beans with mustard seed, curry leaf and fresh coconut",
    price: 65,
    category: "Kuzhambu & Curries",
    calories: 120,
    tags: ["Side Dish"],
    isVeg: true,
    spiceLevel: "Mild",
    image: IMG.BeansPoriyal,
  },

  {
    name: "Mixed Veg Kootu",
    tamilName: "கூட்டு",
    description:
      "Lentils and vegetables simmered with coconut-cumin paste",
    price: 75,
    category: "Kuzhambu & Curries",
    calories: 160,
    tags: ["Comfort Food"],
    isVeg: true,
    spiceLevel: "Mild",
    image: IMG.MixedVegKootu,
  },

  {
    name: "Aviyal",
    tamilName: "அவியல்",
    description:
      "Mixed vegetables in a thick coconut-yogurt gravy, finished with coconut oil",
    price: 85,
    category: "Kuzhambu & Curries",
    calories: 200,
    tags: ["Traditional"],
    isVeg: true,
    spiceLevel: "Mild",
    image: IMG.Aviyal,
  },


  // ==========================================================
  // NON-VEG SPECIALS
  // ==========================================================

  {
    name: "Chicken Chettinad",
    tamilName: "செட்டிநாடு கோழி",
    description:
      "Chicken simmered in roasted Chettinad spices, coconut and shallots",
    price: 240,
    category: "Non-Veg Specials",
    calories: 480,
    tags: ["Chettinad", "Popular"],
    isVeg: false,
    spiceLevel: "Spicy",
    image: IMG.ChickenChettinad,
  },

  {
    name: "Mutton Chukka",
    tamilName: "மட்டன் சுக்கா",
    description:
      "Dry-roasted mutton with crushed spices, curry leaf and coconut slivers",
    price: 280,
    category: "Non-Veg Specials",
    calories: 520,
    tags: ["Chef's Special"],
    isVeg: false,
    spiceLevel: "Spicy",
    image: IMG.MuttonChukka,
  },

  {
    name: "Meen Kuzhambu",
    tamilName: "மீன் குழம்பு",
    description:
      "Tamarind fish curry cooked in a clay-pot style spice base",
    price: 230,
    category: "Non-Veg Specials",
    calories: 380,
    tags: ["Coastal"],
    isVeg: false,
    spiceLevel: "Spicy",
    image: IMG.MeenKuzhambu,
  },

  {
    name: "Prawn Masala",
    tamilName: "இறால் மசாலா",
    description:
      "Prawns tossed in a thick onion-tomato masala with curry leaf",
    price: 260,
    category: "Non-Veg Specials",
    calories: 410,
    tags: ["Coastal"],
    isVeg: false,
    spiceLevel: "Medium",
    image: IMG.PrawnMasala,
  },

  {
    name: "Kalaki",
    tamilName: "கலாக்கி",
    description:
      "Chennai-style half-cooked omelette served under a spiced chicken curry",
    price: 190,
    category: "Non-Veg Specials",
    calories: 400,
    tags: ["Street Food"],
    isVeg: false,
    spiceLevel: "Medium",
    image: IMG.Kalaki,
  },

  {
    name: "Chicken 65",
    tamilName: "சிக்கன் 65",
    description:
      "Deep-fried spiced chicken bites, curry leaf tempered, Chennai style",
    price: 200,
    category: "Non-Veg Specials",
    calories: 430,
    tags: ["Starter", "Popular"],
    isVeg: false,
    spiceLevel: "Spicy",
    image: IMG.Chicken65,
  },


  // ==========================================================
  // SNACKS
  // ==========================================================

  {
    name: "Murukku",
    tamilName: "முறுக்கு",
    description:
      "Crunchy spiral rice-lentil flour snack, deep fried",
    price: 50,
    category: "Snacks",
    calories: 220,
    tags: ["Tea-time"],
    isVeg: true,
    spiceLevel: "Mild",
    image: IMG.Murukku,
  },

  {
    name: "Medu Bonda",
    tamilName: "மெதுவடை பொண்டா",
    description:
      "Deep-fried urad dal fritters, crisp outside and soft within",
    price: 55,
    category: "Snacks",
    calories: 210,
    tags: ["Fried"],
    isVeg: true,
    spiceLevel: "Mild",
    image: IMG.MeduBonda,
  },

  {
    name: "Onion Bajji",
    tamilName: "வெங்காய பஜ்ஜி",
    description:
      "Sliced onions dipped in gram flour batter, deep fried till golden",
    price: 50,
    category: "Snacks",
    calories: 200,
    tags: ["Rainy-day Snack"],
    isVeg: true,
    spiceLevel: "Mild",
    image: IMG.OnionBajji,
  },

  {
    name: "Mysore Bonda",
    tamilName: "மைசூர் பொண்டா",
    description:
      "Fluffy deep-fried maida-and-curd dumplings, a classic tea-time snack",
    price: 55,
    category: "Snacks",
    calories: 230,
    tags: ["Fried"],
    isVeg: true,
    spiceLevel: "Mild",
    image: IMG.MysoreBonda,
  },

  {
    name: "Banana Chips",
    tamilName: "வாழைக்காய் சிப்ஸ்",
    description:
      "Thin-sliced raw banana, deep fried in coconut oil with turmeric and salt",
    price: 45,
    category: "Snacks",
    calories: 250,
    tags: ["Crispy"],
    isVeg: true,
    spiceLevel: "Mild",
    image: IMG.BananaChips,
  },

  {
    name: "Thattai",
    tamilName: "தட்டை",
    description:
      "Crisp savoury rice crackers with chana dal, peanut and curry leaf",
    price: 45,
    category: "Snacks",
    calories: 190,
    tags: ["Tea-time"],
    isVeg: true,
    spiceLevel: "Mild",
    image: IMG.Thattai,
  },


  // ==========================================================
  // SWEETS
  // ==========================================================

  {
    name: "Semiya Payasam",
    tamilName: "சேமியா பாயசம்",
    description:
      "Vermicelli simmered in milk with cardamom, cashew and raisins",
    price: 70,
    category: "Sweets",
    calories: 260,
    tags: ["Festive", "Dessert"],
    isVeg: true,
    spiceLevel: "Mild",
    image: IMG.SemiyaPayasam,
  },

  {
    name: "Sakkarai Pongal",
    tamilName: "சர்க்கரை பொங்கல்",
    description:
      "Sweet rice and jaggery pongal, finished with ghee-roasted cashew",
    price: 75,
    category: "Sweets",
    calories: 320,
    tags: ["Festive"],
    isVeg: true,
    spiceLevel: "Mild",
    image: IMG.SakkaraiPongal,
  },

  {
    name: "Mysore Pak",
    tamilName: "மைசூர் பாக்",
    description:
      "Rich gram-flour and ghee fudge, melt-in-the-mouth sweet",
    price: 90,
    category: "Sweets",
    calories: 340,
    tags: ["Dessert"],
    isVeg: true,
    spiceLevel: "Mild",
    image: IMG.MysorePak,
  },

  {
    name: "Adhirasam",
    tamilName: "அதிரசம்",
    description:
      "Deep-fried jaggery-rice-flour sweet, a Tamil festival favourite",
    price: 85,
    category: "Sweets",
    calories: 300,
    tags: ["Festive", "Traditional"],
    isVeg: true,
    spiceLevel: "Mild",
    image: IMG.Adhirasam,
  },

  {
    name: "Rava Kesari",
    tamilName: "ரவா கேசரி",
    description:
      "Semolina halwa with ghee, saffron and roasted nuts",
    price: 65,
    category: "Sweets",
    calories: 280,
    tags: ["Dessert"],
    isVeg: true,
    spiceLevel: "Mild",
    image: IMG.RavaKesari,
  },

  {
    name: "Kozhukattai",
    tamilName: "கொழுக்கட்டை",
    description:
      "Steamed rice-flour dumplings filled with jaggery and coconut",
    price: 70,
    category: "Sweets",
    calories: 230,
    tags: ["Steamed", "Festive"],
    isVeg: true,
    spiceLevel: "Mild",
    image: IMG.Kozhukattai,
  },


  // ==========================================================
  // BEVERAGES
  // ==========================================================

  {
    name: "Filter Coffee",
    tamilName: "காபி",
    description:
      "Strong decoction coffee frothed with milk, served in davara-tumbler",
    price: 40,
    category: "Beverages",
    calories: 60,
    tags: ["Signature"],
    isVeg: true,
    spiceLevel: "Mild",
    image: IMG.FilterCoffee,
  },

  {
    name: "Jigarthanda",
    tamilName: "ஜிகர்தண்டா",
    description:
      "Madurai-style chilled milk drink with nannari syrup, basil seeds and ice cream",
    price: 80,
    category: "Beverages",
    calories: 250,
    tags: ["Chilled", "Madurai Special"],
    isVeg: true,
    spiceLevel: "Mild",
    image: IMG.Jigarthanda,
  },

  {
    name: "Nannari Sarbath",
    tamilName: "நன்னாரி சர்பத்",
    description:
      "Cooling sarsaparilla-root sherbet, a Tamil Nadu summer classic",
    price: 45,
    category: "Beverages",
    calories: 110,
    tags: ["Cooling"],
    isVeg: true,
    spiceLevel: "Mild",
    image: IMG.NannariSarbath,
  },

  {
    name: "Panagam",
    tamilName: "பானகம்",
    description:
      "Jaggery and lime water infused with cardamom and dry ginger",
    price: 35,
    category: "Beverages",
    calories: 90,
    tags: ["Festive", "Traditional"],
    isVeg: true,
    spiceLevel: "Mild",
    image: IMG.Panagam,
  },

  {
    name: "Sukku Malli Coffee",
    tamilName: "சுக்கு மல்லி காபி",
    description:
      "Dry ginger and coriander decoction, a home remedy-turned-beverage",
    price: 40,
    category: "Beverages",
    calories: 40,
    tags: ["Digestive"],
    isVeg: true,
    spiceLevel: "Mild",
    image: IMG.SukkuMalliCoffee,
  },

  {
    name: "Neer Mor",
    tamilName: "நீர் மோர்",
    description:
      "Spiced buttermilk with ginger, curry leaf, green chilli and asafoetida",
    price: 35,
    category: "Beverages",
    calories: 50,
    tags: ["Cooling", "Digestive"],
    isVeg: true,
    spiceLevel: "Mild",
    image: IMG.NeerMor,
  },

  {
    name: "Tender Coconut Water",
    tamilName: "இளநீர்",
    description:
      "Fresh, naturally sweet coconut water served straight from the shell",
    price: 50,
    category: "Beverages",
    calories: 45,
    tags: ["Natural", "Cooling"],
    isVeg: true,
    spiceLevel: "Mild",
    image: IMG.TenderCoconutWater,
  },
];


// ============================================================
// SEED DATABASE
// ============================================================

(async () => {
  try {
    // Connect MongoDB
    await connectDB();

    console.log("Connected to MongoDB");

    // ----------------------------------------------------------
    // Remove existing menu items
    // ----------------------------------------------------------

    await MenuItem.deleteMany({});

    console.log("Existing menu items removed");

    // ----------------------------------------------------------
    // Insert 50 menu items
    // ----------------------------------------------------------

    await MenuItem.insertMany(items);

    console.log(
      `Seeded ${items.length} Tamil Nadu menu items with images.`
    );

    // ----------------------------------------------------------
    // Reset admin account
    // ----------------------------------------------------------

    await User.deleteOne({
      email: ADMIN_EMAIL,
    });

    await User.create({
      name: "Admin",
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: "admin",
    });

    console.log("Seeded 1 admin account:");
    console.log(`  email:    ${ADMIN_EMAIL}`);
    console.log(`  password: ${ADMIN_PASSWORD}`);

    // ----------------------------------------------------------
    // Close database connection
    // ----------------------------------------------------------

    await mongoose.connection.close();

    console.log("MongoDB connection closed");
    console.log("Seed completed successfully!");

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);

    await mongoose.connection.close();

    process.exit(1);
  }
})();