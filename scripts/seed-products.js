const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

// Firebase configuration - replace with your actual config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const products = [
  // Water Purifiers (15 items)
  {
    name: "AquaGuard RO+UV+UF Water Purifier",
    price: 15999,
    wholesalePrice: 12799,
    category: "purifier",
    imageUrl: "https://images.unsplash.com/photo-1585771724684-382c148a18b4?w=400",
    description: "7-stage purification with RO, UV, and UF technology"
  },
  {
    name: "PureLife Advanced RO System",
    price: 12999,
    wholesalePrice: 10399,
    category: "purifier",
    imageUrl: "https://images.unsplash.com/photo-1635356004754-c373c922254f?w=400",
    description: "Advanced RO membrane with mineral enhancer"
  },
  {
    name: "HydroFresh 6-Stage Purifier",
    price: 11999,
    wholesalePrice: 9599,
    category: "purifier",
    imageUrl: "https://images.unsplash.com/photo-1621252179027-94459d27d3ee?w=400",
    description: "6-stage purification with TDS controller"
  },
  {
    name: "CrystalClear RO Water Purifier",
    price: 13999,
    wholesalePrice: 11199,
    category: "purifier",
    imageUrl: "https://images.unsplash.com/photo-1558332457-0504994c09e2?w=400",
    description: "Crystal clear water with multi-stage filtration"
  },
  {
    name: "AquaMax UV Water Purifier",
    price: 9999,
    wholesalePrice: 7999,
    category: "purifier",
    imageUrl: "https://images.unsplash.com/photo-1520342868574-5fa3804e551c?w=400",
    description: "UV purification for bacteria-free water"
  },
  {
    name: "FreshFlow 8-Liter Purifier",
    price: 14599,
    wholesalePrice: 11679,
    category: "purifier",
    imageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400",
    description: "8-liter storage with copper infuser"
  },
  {
    name: "WaterShield RO+Mineral",
    price: 16999,
    wholesalePrice: 13599,
    category: "purifier",
    imageUrl: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400",
    description: "RO purification with essential minerals"
  },
  {
    name: "PureDroplets Alkaline Purifier",
    price: 18999,
    wholesalePrice: 15199,
    category: "purifier",
    imageUrl: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400",
    description: "Alkaline water for better health"
  },
  {
    name: "AquaElite 10-Liter System",
    price: 17999,
    wholesalePrice: 14399,
    category: "purifier",
    imageUrl: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=400",
    description: "10-liter capacity with smart display"
  },
  {
    name: "HydroPure Compact Purifier",
    price: 10999,
    wholesalePrice: 8799,
    category: "purifier",
    imageUrl: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400",
    description: "Compact design for small spaces"
  },
  {
    name: "WaterWise UF Purifier",
    price: 8999,
    wholesalePrice: 7199,
    category: "purifier",
    imageUrl: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400",
    description: "UF filtration without electricity"
  },
  {
    name: "CrystalBlue RO System",
    price: 14999,
    wholesalePrice: 11999,
    category: "purifier",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    description: "6-stage RO with zero water wastage"
  },
  {
    name: "AquaGold Premium Purifier",
    price: 21999,
    wholesalePrice: 17599,
    category: "purifier",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
    description: "Premium purification with gold coating"
  },
  {
    name: "PureStream Wall-Mount Purifier",
    price: 9999,
    wholesalePrice: 7999,
    category: "purifier",
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400",
    description: "Wall-mount design saves space"
  },
  {
    name: "HydroMagic RO+UV System",
    price: 13599,
    wholesalePrice: 10879,
    category: "purifier",
    imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400",
    description: "Combined RO and UV purification"
  },

  // Water Dispensers (10 items)
  {
    name: "AquaCool Tabletop Dispenser",
    price: 7999,
    wholesalePrice: 6399,
    category: "dispenser",
    imageUrl: "https://images.unsplash.com/photo-1563906267088-b029e7101112?w=400",
    description: "Compact tabletop water dispenser"
  },
  {
    name: "ColdStream Floor Dispenser",
    price: 12999,
    wholesalePrice: 10399,
    category: "dispenser",
    imageUrl: "https://images.unsplash.com/photo-1542384740-4a8430198865?w=400",
    description: "Hot and cold water floor dispenser"
  },
  {
    name: "PureChill Bottom-Load Dispenser",
    price: 11999,
    wholesalePrice: 9599,
    category: "dispenser",
    imageUrl: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400",
    description: "Bottom-load design for easy refill"
  },
  {
    name: "HydroFrost 3-Tap Dispenser",
    price: 14999,
    wholesalePrice: 11999,
    category: "dispenser",
    imageUrl: "https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=400",
    description: "Hot, cold, and room temperature options"
  },
  {
    name: "WaterBreeze Desktop Dispenser",
    price: 6999,
    wholesalePrice: 5599,
    category: "dispenser",
    imageUrl: "https://images.unsplash.com/photo-1580464279660-e13ceef6865a?w=400",
    description: "Desktop water dispenser with cooling"
  },
  {
    name: "AquaFlow Commercial Dispenser",
    price: 19999,
    wholesalePrice: 15999,
    category: "dispenser",
    imageUrl: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400",
    description: "High-capacity commercial dispenser"
  },
  {
    name: "CrystalCool Mini Dispenser",
    price: 5999,
    wholesalePrice: 4799,
    category: "dispenser",
    imageUrl: "https://images.unsplash.com/photo-1561585840-dca35465a481?w=400",
    description: "Mini dispenser for personal use"
  },
  {
    name: "PureTemp Touch Dispenser",
    price: 16999,
    wholesalePrice: 13599,
    category: "dispenser",
    imageUrl: "https://images.unsplash.com/photo-1524813686514-a57563d77965?w=400",
    description: "Touch control with temperature display"
  },
  {
    name: "HydroQuench Bottleless Dispenser",
    price: 24999,
    wholesalePrice: 19999,
    category: "dispenser",
    imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400",
    description: "Direct plumbing connection, no bottles"
  },
  {
    name: "WaterPro Dual-Tap Dispenser",
    price: 9999,
    wholesalePrice: 7999,
    category: "dispenser",
    imageUrl: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400",
    description: "Hot and cold water dual tap"
  },

  // Water Pumps (8 items)
  {
    name: "AquaForce Booster Pump",
    price: 4999,
    wholesalePrice: 3999,
    category: "pump",
    imageUrl: "https://images.unsplash.com/photo-1504198266287-1659872e6590?w=400",
    description: "High-pressure booster pump"
  },
  {
    name: "PureJet Submersible Pump",
    price: 7999,
    wholesalePrice: 6399,
    category: "pump",
    imageUrl: "https://images.unsplash.com/photo-1581094287339-7a59b43e06ce?w=400",
    description: "Submersible pump for deep wells"
  },
  {
    name: "HydroPower Centrifugal Pump",
    price: 5999,
    wholesalePrice: 4799,
    category: "pump",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400",
    description: "Centrifugal pump for residential use"
  },
  {
    name: "WaterMax Jet Pump",
    price: 6999,
    wholesalePrice: 5599,
    category: "pump",
    imageUrl: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400",
    description: "Jet pump for high-rise buildings"
  },
  {
    name: "AquaDrain Sump Pump",
    price: 8999,
    wholesalePrice: 7199,
    category: "pump",
    imageUrl: "https://images.unsplash.com/photo-1564419320461-6870880221ad?w=400",
    description: "Sump pump for drainage"
  },
  {
    name: "PureFlow Pressure Pump",
    price: 5499,
    wholesalePrice: 4399,
    category: "pump",
    imageUrl: "https://images.unsplash.com/photo-1531297461136-82af022f5b42?w=400",
    description: "Pressure pump for consistent flow"
  },
  {
    name: "HyroLift Solar Pump",
    price: 14999,
    wholesalePrice: 11999,
    category: "pump",
    imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400",
    description: "Solar-powered water pump"
  },
  {
    name: "WaterSpeed Inline Pump",
    price: 4499,
    wholesalePrice: 3599,
    category: "pump",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400",
    description: "Inline pump for compact spaces"
  },

  // Water Filters (12 items)
  {
    name: "AquaFilter Carbon Filter",
    price: 1499,
    wholesalePrice: 1199,
    category: "filter",
    imageUrl: "https://images.unsplash.com/photo-1562937812-3723b8abb131?w=400",
    description: "Activated carbon filter for taste"
  },
  {
    name: "PureSediment Sediment Filter",
    price: 999,
    wholesalePrice: 799,
    category: "filter",
    imageUrl: "https://images.unsplash.com/photo-1562795350-c8966699d4b6?w=400",
    description: "5-micron sediment filter"
  },
  {
    name: "HyroClean UF Filter",
    price: 1999,
    wholesalePrice: 1599,
    category: "filter",
    imageUrl: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400",
    description: "Ultrafiltration membrane"
  },
  {
    name: "WaterBlock Sediment Filter",
    price: 899,
    wholesalePrice: 719,
    category: "filter",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400",
    description: "Block sediment filter cartridge"
  },
  {
    name: "AquaActive Carbon Block",
    price: 1799,
    wholesalePrice: 1439,
    category: "filter",
    imageUrl: "https://images.unsplash.com/photo-1581092160481-6ddbf4c08979?w=400",
    description: "Carbon block for chlorine removal"
  },
  {
    name: "PureGuard Pre-Filter",
    price: 799,
    wholesalePrice: 639,
    category: "filter",
    imageUrl: "https://images.unsplash.com/photo-1581092160242-f9abbe7cd2da?w=400",
    description: "Pre-filter for coarse particles"
  },
  {
    name: "HyroTaste Taste Filter",
    price: 1299,
    wholesalePrice: 1039,
    category: "filter",
    imageUrl: "https://images.unsplash.com/photo-1581092160589-d91885695d94?w=400",
    description: "Improves water taste and odor"
  },
  {
    name: "WaterSoft Softener Filter",
    price: 2499,
    wholesalePrice: 1999,
    category: "filter",
    imageUrl: "https://images.unsplash.com/photo-1581092160219-76c23e446514?w=400",
    description: "Water softener for hard water"
  },
  {
    name: "AquaMineral Mineral Filter",
    price: 1599,
    wholesalePrice: 1279,
    category: "filter",
    imageUrl: "https://images.unsplash.com/photo-1581092160250-4129699338e0?w=400",
    description: "Adds essential minerals"
  },
  {
    name: "PureNano Nanofilter",
    price: 2999,
    wholesalePrice: 2399,
    category: "filter",
    imageUrl: "https://images.unsplash.com/photo-1581092160460-8e5c644d9b53?w=400",
    description: "Nanofiltration membrane"
  },
  {
    name: "HyroScale Anti-Filter",
    price: 1899,
    wholesalePrice: 1519,
    category: "filter",
    imageUrl: "https://images.unsplash.com/photo-1581092160580-5e3b7964d0a3?w=400",
    description: "Anti-scaling filter"
  },
  {
    name: "WaterBacteria UV Filter",
    price: 2299,
    wholesalePrice: 1839,
    category: "filter",
    imageUrl: "https://images.unsplash.com/photo-1581092160481-6870880221ad?w=400",
    description: "UV sterilization filter"
  },

  // Spares & Accessories (10 items)
  {
    name: "AquaMembrane RO Membrane",
    price: 2999,
    wholesalePrice: 2399,
    category: "spare",
    imageUrl: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400",
    description: "Replacement RO membrane"
  },
  {
    name: "PurePipe Connectors Set",
    price: 499,
    wholesalePrice: 399,
    category: "spare",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400",
    description: "Set of pipe connectors"
  },
  {
    name: "HyroTap Faucet Adapter",
    price: 799,
    wholesalePrice: 639,
    category: "spare",
    imageUrl: "https://images.unsplash.com/photo-1581092160481-6ddbf4c08979?w=400",
    description: "Faucet adapter for purifiers"
  },
  {
    name: "WaterValve Solenoid Valve",
    price: 1299,
    wholesalePrice: 1039,
    category: "spare",
    imageUrl: "https://images.unsplash.com/photo-1581092160242-f9abbe7cd2da?w=400",
    description: "Solenoid valve replacement"
  },
  {
    name: "AquaHose Flexible Hose",
    price: 399,
    wholesalePrice: 319,
    category: "spare",
    imageUrl: "https://images.unsplash.com/photo-1581092160589-d91885695d94?w=400",
    description: "Flexible hose for connections"
  },
  {
    name: "PureTank Storage Tank",
    price: 1999,
    wholesalePrice: 1599,
    category: "spare",
    imageUrl: "https://images.unsplash.com/photo-1581092160219-76c23e446514?w=400",
    description: "Replacement storage tank"
  },
  {
    name: "HyroFilter Filter Housing",
    price: 899,
    wholesalePrice: 719,
    category: "spare",
    imageUrl: "https://images.unsplash.com/photo-1581092160250-4129699338e0?w=400",
    description: "Filter housing replacement"
  },
  {
    name: "WaterFloat Float Valve",
    price: 599,
    wholesalePrice: 479,
    category: "spare",
    imageUrl: "https://images.unsplash.com/photo-1581092160460-8e5c644d9b53?w=400",
    description: "Float valve for tank"
  },
  {
    name: "AquaSeal O-Ring Set",
    price: 299,
    wholesalePrice: 239,
    category: "spare",
    imageUrl: "https://images.unsplash.com/photo-1581092160580-5e3b7964d0a3?w=400",
    description: "Set of O-rings for seals"
  },
  {
    name: "PureUV UV Lamp",
    price: 1599,
    wholesalePrice: 1279,
    category: "spare",
    imageUrl: "https://images.unsplash.com/photo-1581092160481-6870880221ad?w=400",
    description: "UV lamp replacement"
  }
];

async function seedProducts() {
  console.log('Starting to seed products...');
  
  for (const product of products) {
    try {
      await addDoc(collection(db, 'products'), {
        ...product,
        dealerId: 'admin',
        createdAt: new Date().toISOString(),
        stock: Math.floor(Math.random() * 50) + 10
      });
      console.log(`Added: ${product.name}`);
    } catch (error) {
      console.error(`Error adding ${product.name}:`, error);
    }
  }
  
  console.log('Seeding complete!');
}

seedProducts();
