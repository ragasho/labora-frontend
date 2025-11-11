import type { DeliveryLocation, Category, Product } from '../types';

export const deliveryLocations: DeliveryLocation[] = [
  {
    id: '1',
    name: 'Koramangala',
    address: '1st Block, Koramangala, Bangalore',
    deliveryTime: '8-15 mins'
  },
  {
    id: '2',
    name: 'Indiranagar',
    address: '100 Feet Road, Indiranagar, Bangalore',
    deliveryTime: '10-18 mins'
  },
  {
    id: '3',
    name: 'HSR Layout',
    address: 'Sector 7, HSR Layout, Bangalore',
    deliveryTime: '12-20 mins'
  },
  {
    id: '4',
    name: 'Whitefield',
    address: 'ITPL Main Road, Whitefield, Bangalore',
    deliveryTime: '15-25 mins'
  }
];

export const categories: Category[] = [
  {
    id: '1',
    name: '74f82f2f-5cd9-4ed7-a514-e87f42e21cf8',
    image: 'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=200&h=200&fit=crop',
    icon: '🥬'
  },
  {
    id: '2',
    name: '69cc9cbf-84a5-4533-8fe8-c644876d6c0b',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&h=200&fit=crop',
    icon: '🥛'
  },
  {
    id: '3',
    name: 'd8eb25c8-6e25-4741-b2cb-316bb1c887ee',
    image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=200&h=200&fit=crop',
    icon: '🍿'
  },
  {
    id: '4',
    name: '3b6c159d-b0eb-4a4e-b13d-7c7c3a31ee63',
    image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=200&h=200&fit=crop',
    icon: '🥤'
  },
  {
    id: '5',
    name: '3d9848f9-ce79-47e5-bab8-fa0a634e49c4',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop',
    icon: '🍕'
  },
  {
    id: '6',
    name: 'a7056ee7-789a-4a04-8d78-bbc35caa3eaa',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop',
    icon: '☕'
  },
  {
    id: '7',
    name: '51a63b0c-6400-4c35-b223-f0ce5c794280',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop',
    icon: '🍞'
  },
  {
    id: '8',
    name: '550e8400-e29b-41d4-a716-446655440007',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop',
    icon: '🍭'
  }
];

export const products: Product[] = [
  // 74f82f2f-5cd9-4ed7-a514-e87f42e21cf8
  {
    id: '1',
    name: 'Fresh Bananas',
    price: 40,
    originalPrice: 50,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop',
    category_id: '74f82f2f-5cd9-4ed7-a514-e87f42e21cf8',
    unit: '1 dozen',
    in_stock: true,
    discount: 20,
    description: 'Fresh, ripe bananas perfect for breakfast or snacking. Rich in potassium and naturally sweet.',
    brand: 'Farm Fresh',
    weight: '1.2 kg approx',
    nutritional_info: {
      calories: '89 per 100g',
      protein: '1.1g',
      carbs: '23g',
      fat: '0.3g',
      fiber: '2.6g',
      potassium: '358mg'
    },
    ingredients: ['Fresh Bananas'],
    allergens: [],
    storage_instructions: 'Store at room temperature. Refrigerate once ripe to extend shelf life.',
    country_of_origin: 'India',
    ratings: {
      average: 4.5,
      count: 234
    },
    features: ['Rich in Potassium', 'Natural Energy Boost', 'High in Fiber']
  },
  {
    id: '2',
    name: 'Organic Tomatoes',
    price: 60,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&h=300&fit=crop',
    category: '74f82f2f-5cd9-4ed7-a514-e87f42e21cf8',
    unit: '500g',
    inStock: true,
    description: 'Juicy, organic tomatoes grown without pesticides. Perfect for salads, cooking, and sandwiches.',
    brand: 'Organic Farms',
    weight: '500g',
    nutritionalInfo: {
      calories: '18 per 100g',
      protein: '0.9g',
      carbs: '3.9g',
      fat: '0.2g',
      fiber: '1.2g',
      vitamin_c: '14mg'
    },
    ingredients: ['Organic Tomatoes'],
    allergens: [],
    storageInstructions: 'Store at room temperature until ripe, then refrigerate.',
    countryOfOrigin: 'India',
    ratings: {
      average: 4.3,
      count: 156
    },
    features: ['Pesticide Free', 'Rich in Lycopene', 'Vitamin C']
  },

  // 69cc9cbf-84a5-4533-8fe8-c644876d6c0b
  {
    id: '3',
    name: 'Fresh Milk',
    price: 28,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=300&fit=crop',
    category: '69cc9cbf-84a5-4533-8fe8-c644876d6c0b',
    unit: '500ml',
    inStock: true,
    description: 'Pure, fresh cow milk sourced from local dairy farms. Rich in calcium and protein.',
    brand: 'Daily Fresh',
    weight: '500ml',
    nutritionalInfo: {
      calories: '42 per 100ml',
      protein: '3.4g',
      carbs: '4.8g',
      fat: '1g',
      calcium: '113mg',
      vitamin_d: '0.1mcg'
    },
    ingredients: ['Fresh Cow Milk'],
    allergens: ['Milk'],
    storageInstructions: 'Refrigerate immediately. Consume within 2 days of opening.',
    countryOfOrigin: 'India',
    ratings: {
      average: 4.7,
      count: 891
    },
    features: ['Farm Fresh', 'Rich in Calcium', 'High Protein']
  },
  {
    id: '4',
    name: 'Whole Wheat Bread',
    price: 35,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop',
    category: '69cc9cbf-84a5-4533-8fe8-c644876d6c0b',
    unit: '400g',
    inStock: true,
    description: 'Soft, fresh whole wheat bread perfect for breakfast and sandwiches. Made with 100% whole wheat flour.',
    brand: 'Baker\'s Best',
    weight: '400g',
    nutritionalInfo: {
      calories: '247 per 100g',
      protein: '13g',
      carbs: '41g',
      fat: '4.2g',
      fiber: '7g',
      iron: '3.6mg'
    },
    ingredients: ['Whole Wheat Flour', 'Water', 'Yeast', 'Salt', 'Sugar'],
    allergens: ['Gluten'],
    storageInstructions: 'Store in a cool, dry place. Best consumed within 3 days.',
    countryOfOrigin: 'India',
    ratings: {
      average: 4.4,
      count: 445
    },
    features: ['100% Whole Wheat', 'High Fiber', 'No Preservatives']
  },

  // d8eb25c8-6e25-4741-b2cb-316bb1c887ee
  {
    id: '5',
    name: 'Classic Potato Chips',
    price: 20,
    originalPrice: 25,
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&h=300&fit=crop',
    category: 'd8eb25c8-6e25-4741-b2cb-316bb1c887ee',
    unit: '50g',
    inStock: true,
    discount: 20,
    description: 'Crispy, golden potato chips with the perfect amount of salt. A classic snack for any time.',
    brand: 'Crispy Crunch',
    weight: '50g',
    nutritionalInfo: {
      calories: '536 per 100g',
      protein: '6g',
      carbs: '50g',
      fat: '35g',
      sodium: '525mg',
      fiber: '4g'
    },
    ingredients: ['Potatoes', 'Vegetable Oil', 'Salt'],
    allergens: [],
    storageInstructions: 'Store in a cool, dry place. Consume within 30 days of opening.',
    countryOfOrigin: 'India',
    ratings: {
      average: 4.2,
      count: 1203
    },
    features: ['Crispy Texture', 'Perfect Salt Balance', 'Family Favorite']
  },

  // 3b6c159d-b0eb-4a4e-b13d-7c7c3a31ee63
  {
    id: '6',
    name: 'Fresh Orange Juice',
    price: 45,
    image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=300&h=300&fit=crop',
    category: '3b6c159d-b0eb-4a4e-b13d-7c7c3a31ee63',
    unit: '200ml',
    inStock: true,
    description: 'Freshly squeezed orange juice packed with Vitamin C. No added sugar or preservatives.',
    brand: 'Pure Squeeze',
    weight: '200ml',
    nutritionalInfo: {
      calories: '45 per 100ml',
      protein: '0.7g',
      carbs: '10.4g',
      fat: '0.2g',
      vitamin_c: '50mg',
      folate: '25mcg'
    },
    ingredients: ['Fresh Orange Juice'],
    allergens: [],
    storageInstructions: 'Refrigerate and consume within 24 hours of opening.',
    countryOfOrigin: 'India',
    ratings: {
      average: 4.6,
      count: 567
    },
    features: ['100% Natural', 'Rich in Vitamin C', 'No Added Sugar']
  },

  // a7056ee7-789a-4a04-8d78-bbc35caa3eaa
  {
    id: '7',
    name: 'Premium Green Tea',
    price: 150,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=300&fit=crop',
    category: 'a7056ee7-789a-4a04-8d78-bbc35caa3eaa',
    unit: '100g',
    inStock: true,
    description: 'Premium quality green tea leaves rich in antioxidants. Perfect for a healthy lifestyle.',
    brand: 'Zen Tea',
    weight: '100g',
    nutritionalInfo: {
      calories: '2 per cup',
      protein: '0g',
      carbs: '0g',
      fat: '0g',
      caffeine: '25mg',
      antioxidants: 'High'
    },
    ingredients: ['Green Tea Leaves'],
    allergens: [],
    storageInstructions: 'Store in an airtight container in a cool, dry place.',
    countryOfOrigin: 'India',
    ratings: {
      average: 4.5,
      count: 789
    },
    features: ['Rich in Antioxidants', 'Natural Caffeine', 'Weight Management']
  },

  // 51a63b0c-6400-4c35-b223-f0ce5c794280
  {
    id: '8',
    name: 'Chocolate Cookies',
    price: 80,
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=300&h=300&fit=crop',
    category: '51a63b0c-6400-4c35-b223-f0ce5c794280',
    unit: '200g',
    inStock: true,
    description: 'Delicious chocolate chip cookies baked fresh daily. Perfect with tea or coffee.',
    brand: 'Sweet Treats',
    weight: '200g',
    nutritionalInfo: {
      calories: '502 per 100g',
      protein: '6g',
      carbs: '64g',
      fat: '25g',
      sugar: '28g',
      fiber: '3g'
    },
    ingredients: ['Wheat Flour', 'Chocolate Chips', 'Butter', 'Sugar', 'Eggs'],
    allergens: ['Gluten', 'Milk', 'Eggs'],
    storageInstructions: 'Store in an airtight container. Best consumed within 1 week.',
    countryOfOrigin: 'India',
    ratings: {
      average: 4.8,
      count: 1456
    },
    features: ['Fresh Baked', 'Real Chocolate Chips', 'Perfect Tea Time Snack']
  },

  // 550e8400-e29b-41d4-a716-446655440007
  {
    id: '9',
    name: 'Dark Chocolate Bar',
    price: 120,
    image: 'https://images.unsplash.com/photo-1549007953-2f2dc0b24019?w=300&h=300&fit=crop',
    category: '550e8400-e29b-41d4-a716-446655440007',
    unit: '100g',
    inStock: true,
    description: 'Premium dark chocolate with 70% cocoa content. Rich, intense flavor for chocolate lovers.',
    brand: 'Choco Divine',
    weight: '100g',
    nutritionalInfo: {
      calories: '546 per 100g',
      protein: '7.8g',
      carbs: '45.9g',
      fat: '31.3g',
      sugar: '24g',
      iron: '11.9mg'
    },
    ingredients: ['Cocoa Mass', 'Sugar', 'Cocoa Butter', 'Vanilla'],
    allergens: ['May contain Milk', 'May contain Nuts'],
    storageInstructions: 'Store in a cool, dry place below 18°C.',
    countryOfOrigin: 'India',
    ratings: {
      average: 4.7,
      count: 892
    },
    features: ['70% Cocoa', 'Rich Antioxidants', 'Premium Quality']
  },

  // More 74f82f2f-5cd9-4ed7-a514-e87f42e21cf8
  {
    id: '10',
    name: 'Fresh Apples',
    price: 120,
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300&h=300&fit=crop',
    category: '74f82f2f-5cd9-4ed7-a514-e87f42e21cf8',
    unit: '1kg',
    inStock: true,
    description: 'Crisp, sweet red apples perfect for snacking. Rich in fiber and natural vitamins.',
    brand: 'Orchard Fresh',
    weight: '1kg',
    nutritionalInfo: {
      calories: '52 per 100g',
      protein: '0.3g',
      carbs: '14g',
      fat: '0.2g',
      fiber: '2.4g',
      vitamin_c: '4.6mg'
    },
    ingredients: ['Fresh Apples'],
    allergens: [],
    storageInstructions: 'Store in refrigerator for longer freshness.',
    countryOfOrigin: 'India',
    ratings: {
      average: 4.4,
      count: 678
    },
    features: ['High in Fiber', 'Natural Sweetness', 'Vitamin Rich']
  },

  // More 3d9848f9-ce79-47e5-bab8-fa0a634e49c4
  {
    id: '11',
    name: 'Instant Noodles',
    price: 25,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=300&fit=crop',
    category: '3d9848f9-ce79-47e5-bab8-fa0a634e49c4',
    unit: '70g',
    inStock: true,
    description: 'Quick and tasty instant noodles ready in just 2 minutes. Perfect for a quick meal.',
    brand: 'Quick Bite',
    weight: '70g',
    nutritionalInfo: {
      calories: '426 per 100g',
      protein: '9.4g',
      carbs: '58.5g',
      fat: '17.4g',
      sodium: '1040mg',
      fiber: '2.1g'
    },
    ingredients: ['Wheat Flour', 'Palm Oil', 'Salt', 'Spices', 'Flavor Enhancer'],
    allergens: ['Gluten'],
    storageInstructions: 'Store in a cool, dry place.',
    countryOfOrigin: 'India',
    ratings: {
      average: 4.1,
      count: 2341
    },
    features: ['Ready in 2 Minutes', 'Spicy Flavor', 'Convenient Meal']
  },

  // More Cold Drinks
  {
    id: '12',
    name: 'Sparkling Water',
    price: 35,
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=300&h=300&fit=crop',
    category: '3b6c159d-b0eb-4a4e-b13d-7c7c3a31ee63',
    unit: '500ml',
    inStock: true,
    description: 'Refreshing sparkling water with natural bubbles. Zero calories, pure refreshment.',
    brand: 'Bubble Fresh',
    weight: '500ml',
    nutritionalInfo: {
      calories: '0',
      protein: '0g',
      carbs: '0g',
      fat: '0g',
      sodium: '2mg'
    },
    ingredients: ['Carbonated Water', 'Natural Minerals'],
    allergens: [],
    storageInstructions: 'Store in a cool place. Best served chilled.',
    countryOfOrigin: 'India',
    ratings: {
      average: 4.3,
      count: 445
    },
    features: ['Zero Calories', 'Natural Bubbles', 'Refreshing']
  }
];