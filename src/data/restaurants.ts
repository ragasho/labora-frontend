import type { Restaurant, FlowerBox, MonthlyBasket } from '../types';

// Restaurants Data for Wow Food Service
export const restaurants: Restaurant[] = [
    {
        id: 'rest1',
        name: 'Saravana Bhavan',
        nameTamil: 'சரவணா பவன்',
        image: 'https://images.unsplash.com/photo-1567337712385-b51ebebb2bf1?w=400&h=300&fit=crop',
        rating: 4.5,
        reviewCount: 1250,
        cuisine: ['South Indian', 'Vegetarian'],
        deliveryTime: '25-35 mins',
        deliveryFee: 30,
        minOrder: 150,
        isOpen: true,
        distance: '1.2 km',
        offers: ['20% off on orders above ₹300', 'Free delivery on orders above ₹500'],
        location: {
            type: 'restaurant' as const,
            address: 'T. Nagar, Chennai'
        },
        categories: [
            {
                id: 'breakfast',
                name: 'Breakfast',
                nameTamil: 'காலை உணவு',
                items: [
                    {
                        id: 'idli',
                        name: 'Idli (4 pcs)',
                        nameTamil: 'இட்லி (4 துண்டு)',
                        description: 'Soft steamed rice cakes served with sambar and chutneys',
                        descriptionTamil: 'சாம்பார் மற்றும் சட்னிகளுடன் பரிமாறப்படும் மென்மையான அவித்த அரிசி கேக்குகள்',
                        price: 60,
                        image: 'https://images.unsplash.com/photo-1589301773806-d7b68766c1ee?w=300&h=300&fit=crop',
                        isVeg: true,
                        spiceLevel: 'mild' as const,
                        preparationTime: '10-15 mins',
                        calories: 150,
                        gstPercentage: 5,
                        gstAmount: 3,
                        finalPrice: 63,
                        isPopular: true
                    },
                    {
                        id: 'dosa',
                        name: 'Masala Dosa',
                        nameTamil: 'மசாலா தோசை',
                        description: 'Crispy rice crepe filled with spiced potato curry',
                        descriptionTamil: 'மசாலா உருளைக்கிழங்கு கறியால் நிரப்பப்பட்ட கொறிக்கும் அரிசி கிரெப்',
                        price: 80,
                        image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&h=300&fit=crop',
                        isVeg: true,
                        spiceLevel: 'medium' as const,
                        preparationTime: '15-20 mins',
                        calories: 250,
                        gstPercentage: 5,
                        gstAmount: 4,
                        finalPrice: 84,
                        isPopular: true
                    }
                ]
            },
            {
                id: 'rice',
                name: 'Rice Varieties',
                nameTamil: 'சாதம் வகைகள்',
                items: [
                    {
                        id: 'sambar-rice',
                        name: 'Sambar Rice',
                        nameTamil: 'சாம்பார் சாதம்',
                        description: 'Steamed rice mixed with lentil curry and vegetables',
                        descriptionTamil: 'பருப்பு கறி மற்றும் காய்கறிகளுடன் கலந்த அவித்த சாதம்',
                        price: 120,
                        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=300&fit=crop',
                        isVeg: true,
                        spiceLevel: 'medium' as const,
                        preparationTime: '10-15 mins',
                        calories: 300,
                        gstPercentage: 5,
                        gstAmount: 6,
                        finalPrice: 126
                    }
                ]
            }
        ]
    },
    {
        id: 'rest2',
        name: 'Amma Unavagam',
        nameTamil: 'அம்மா உணவகம்',
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
        rating: 4.2,
        reviewCount: 850,
        cuisine: ['Tamil Nadu', 'Home Style'],
        deliveryTime: '20-30 mins',
        deliveryFee: 25,
        minOrder: 100,
        isOpen: true,
        distance: '2.1 km',
        isHomemaker: true,
        isCloudKitchen: true,
        location: {
            type: 'cloud_kitchen' as const,
            address: 'Adyar, Chennai'
        },
        categories: [
            {
                id: 'home-style',
                name: 'Home Style Meals',
                nameTamil: 'வீட்டு பாணி உணவுகள்',
                items: [
                    {
                        id: 'curd-rice',
                        name: 'Curd Rice',
                        nameTamil: 'தயிர் சாதம்',
                        description: 'Comfort food - rice mixed with fresh curd and seasoning',
                        descriptionTamil: 'ஆறுதல் அளிக்கும் உணவு - புதிய தயிர் மற்றும் தாளிப்புடன் கலந்த சாதம்',
                        price: 70,
                        image: 'https://images.unsplash.com/photo-1596040033206-febce04dcf11?w=300&h=300&fit=crop',
                        isVeg: true,
                        spiceLevel: 'mild' as const,
                        preparationTime: '5-10 mins',
                        calories: 180,
                        gstPercentage: 5,
                        gstAmount: 3.5,
                        finalPrice: 73.5
                    }
                ]
            }
        ]
    },
    {
        id: 'rest3',
        name: 'Highway Dhaba Express',
        nameTamil: 'ஹைவே தாபா எக்ஸ்பிரஸ்',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
        rating: 4.0,
        reviewCount: 450,
        cuisine: ['North Indian', 'Punjabi'],
        deliveryTime: '35-45 mins',
        deliveryFee: 40,
        minOrder: 200,
        isOpen: true,
        distance: '5.5 km',
        location: {
            type: 'highway' as const,
            address: 'Chennai-Bangalore Highway, Sriperumbudur'
        },
        categories: [
            {
                id: 'north-indian',
                name: 'North Indian',
                nameTamil: 'வட இந்திய உணவுகள்',
                items: [
                    {
                        id: 'butter-chicken',
                        name: 'Butter Chicken',
                        nameTamil: 'பட்டர் சிக்கன்',
                        description: 'Creamy tomato-based chicken curry with Indian spices',
                        descriptionTamil: 'இந்திய மசாலாக்களுடன் கிரீமி தக்காளி அடிப்படையிலான சிக்கன் கறி',
                        price: 280,
                        image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=300&h=300&fit=crop',
                        isVeg: false,
                        spiceLevel: 'medium' as const,
                        preparationTime: '20-25 mins',
                        calories: 450,
                        gstPercentage: 5,
                        gstAmount: 14,
                        finalPrice: 294
                    }
                ]
            }
        ]
    },
    {
        id: 'rest4',
        name: 'Fitness Food Corner',
        nameTamil: 'ஃபிட்னஸ் ஃபூட் கார்னர்',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
        rating: 4.7,
        reviewCount: 650,
        cuisine: ['Healthy', 'Salads', 'Protein'],
        deliveryTime: '15-25 mins',
        deliveryFee: 35,
        minOrder: 180,
        isOpen: true,
        distance: '1.8 km',
        location: {
            type: 'restaurant' as const,
            address: 'Anna Nagar, Chennai'
        },
        categories: [
            {
                id: 'fitness-meals',
                name: 'Fitness Meals',
                nameTamil: 'ஃபிட்னஸ் உணவுகள்',
                items: [
                    {
                        id: 'protein-bowl',
                        name: 'High Protein Bowl',
                        nameTamil: 'உயர் புரதம் பவுல்',
                        description: 'Quinoa, grilled chicken, vegetables with yogurt dressing',
                        descriptionTamil: 'கினோவா, கிரில்ட் சிக்கன், காய்கறிகள் மற்றும் தயிர் ட்ரெசிங்',
                        price: 320,
                        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=300&fit=crop',
                        isVeg: false,
                        spiceLevel: 'mild' as const,
                        preparationTime: '12-18 mins',
                        calories: 380,
                        gstPercentage: 5,
                        gstAmount: 16,
                        finalPrice: 336,
                        isFitness: true,
                        isPopular: true
                    }
                ]
            }
        ]
    },
    {
        id: 'rest5',
        name: 'Railway Platform Canteen',
        nameTamil: 'ரயில்வே பிளாட்ஃபார்ம் கேன்டீன்',
        image: 'https://images.unsplash.com/photo-1563379091339-03246963d96a?w=400&h=300&fit=crop',
        rating: 3.8,
        reviewCount: 320,
        cuisine: ['Fast Food', 'Snacks'],
        deliveryTime: '10-20 mins',
        deliveryFee: 20,
        minOrder: 80,
        isOpen: true,
        distance: '3.2 km',
        location: {
            type: 'railway_platform' as const,
            address: 'Chennai Central Railway Station'
        },
        categories: [
            {
                id: 'railway-snacks',
                name: 'Railway Snacks',
                nameTamil: 'ரயில்வே சிற்றுண்டிகள்',
                items: [
                    {
                        id: 'vada-pav',
                        name: 'Vada Pav',
                        nameTamil: 'வடா பாவ்',
                        description: 'Mumbai style potato fritter burger with chutneys',
                        descriptionTamil: 'சட்னிகளுடன் மும்பை பாணி உருளைக்கிழங்கு பஜ்ஜி பர்கர்',
                        price: 45,
                        image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300&h=300&fit=crop',
                        isVeg: true,
                        spiceLevel: 'medium' as const,
                        preparationTime: '5-10 mins',
                        calories: 280,
                        gstPercentage: 5,
                        gstAmount: 2.25,
                        finalPrice: 47.25
                    }
                ]
            }
        ]
    }
];

// Flower Boxes Data
export const flowerBoxes: FlowerBox[] = [
    {
        id: 'fb1',
        name: 'Wedding Special',
        nameTamil: 'திருமண சிறப்பு',
        image: 'https://images.unsplash.com/photo-1563155352-c6b331aa8495?w=400&h=300&fit=crop',
        price: 2500,
        description: 'Premium flower arrangement for wedding ceremonies',
        descriptionTamil: 'திருமண விழாக்களுக்கு பிரீமியம் பூ அலங்காரம்',
        occasionType: 'Wedding',
        flowers: ['Rose', 'Jasmine', 'Marigold', 'Lotus'],
        size: 'large',
        customizable: true
    },
    {
        id: 'fb2',
        name: 'Festival Celebration',
        nameTamil: 'திருவிழா கொண்டாட்டம்',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        price: 1200,
        description: 'Colorful flowers for festival decorations',
        descriptionTamil: 'திருவிழா அலங்காரங்களுக்கு வண்ணமயமான பூக்கள்',
        occasionType: 'Festival',
        flowers: ['Marigold', 'Rose', 'Chrysanthemum'],
        size: 'medium',
        customizable: true
    },
    {
        id: 'fb3',
        name: 'Birthday Bouquet',
        nameTamil: 'பிறந்தநாள் பூங்கொத்து',
        image: 'https://images.unsplash.com/photo-1563514227147-6d2ff665b8d4?w=400&h=300&fit=crop',
        price: 800,
        description: 'Beautiful bouquet for birthday celebrations',
        descriptionTamil: 'பிறந்தநாள் கொண்டாட்டங்களுக்கு அழகான பூங்கொத்து',
        occasionType: 'Birthday',
        flowers: ['Roses', 'Carnations', 'Baby\'s Breath'],
        size: 'small',
        customizable: false
    },
    {
        id: 'fb4',
        name: 'Temple Offering',
        nameTamil: 'கோவில் காணிக்கை',
        image: 'https://images.unsplash.com/photo-1578852612717-5f6f9c34ec1b?w=400&h=300&fit=crop',
        price: 300,
        description: 'Traditional flowers for temple prayers',
        descriptionTamil: 'கோவில் பிரார்த்தனைகளுக்கு பாரம்பரிய பூக்கள்',
        occasionType: 'Religious',
        flowers: ['Jasmine', 'Rose', 'Hibiscus'],
        size: 'small',
        customizable: false
    }
];

// Milk Subscription Plans
export const milkSubscriptionPlans = [
    {
        id: 'milk-daily',
        name: 'Daily Fresh Milk',
        nameTamil: 'தினசரி புதிய பால்',
        volume: '500ml',
        price: 30,
        monthlyPrice: 900,
        description: 'Fresh cow milk delivered daily to your doorstep',
        descriptionTamil: 'உங்கள் வீட்டு வாசலுக்கு தினசரி டெலிவரி செய்யப்படும் புதிய பசும்பால்',
        availableSchedules: [
            { time: '06:00 AM', nameTamil: 'காலை 6:00' },
            { time: '07:00 AM', nameTamil: 'காலை 7:00' },
            { time: '06:00 PM', nameTamil: 'மாலை 6:00' }
        ]
    },
    {
        id: 'milk-alt-days',
        name: 'Alternate Days Milk',
        nameTamil: 'மாற்று நாள் பால்',
        volume: '1L',
        price: 55,
        monthlyPrice: 825,
        description: 'Fresh milk delivered on alternate days',
        descriptionTamil: 'மாற்று நாட்களில் டெலிவரி செய்யப்படும் புதிய பால்',
        availableSchedules: [
            { time: '06:30 AM', nameTamil: 'காலை 6:30' },
            { time: '07:30 AM', nameTamil: 'காலை 7:30' }
        ]
    }
];

// Monthly Baskets
export const monthlyBaskets: MonthlyBasket[] = [
    {
        id: 'family-basic',
        name: 'Family Basic Basket',
        nameTamil: 'குடும்ப அடிப்படை கூடை',
        description: 'Essential groceries for a family of 4',
        descriptionTamil: '4 பேர் குடும்பத்திற்கு அத்தியாவசிய மளிகை பொருட்கள்',
        items: [],
        totalPrice: 1500,
        deliverySchedule: {
            frequency: 'monthly',
            preferredDay: 1,
            preferredTime: '10:00 AM'
        },
        customizable: true,
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop'
    },
    {
        id: 'premium-family',
        name: 'Premium Family Basket',
        nameTamil: 'பிரீமியம் குடும்ப கூடை',
        description: 'Premium quality groceries with organic options',
        descriptionTamil: 'ஆர்கானிக் விருப்பங்களுடன் பிரீமியம் தரமான மளிகை பொருட்கள்',
        items: [],
        totalPrice: 2800,
        deliverySchedule: {
            frequency: 'monthly',
            preferredDay: 5,
            preferredTime: '11:00 AM'
        },
        customizable: true,
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop'
    }
];