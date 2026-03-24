// market_data.js - Shared market prices logic
// This file serves consistent district-based mock prices to the Market Dashboard and Farmer Dashboard

// Define comprehensive real-world crop lists for each of the 31 Karnataka districts
const districtMasterCrops = {
    "Bagalkote": [
        { crop: "Maize", base: 1950 }, { crop: "Sugarcane", base: 2900 }, { crop: "Cotton", base: 6500 },
        { crop: "Jowar", base: 2400 }, { crop: "Onion", base: 1200 }, { crop: "Bengal Gram", base: 5200 },
        { crop: "Wheat", base: 2600 }, { crop: "Sunflower", base: 4600 }, { crop: "Pomegranate", base: 6500 },
        { crop: "Grapes", base: 4500 }, { crop: "Sorghum", base: 2300 }, { crop: "Bajra", base: 2100 },
        { crop: "Groundnut", base: 5800 }, { crop: "Red Chilli", base: 18000 }, { crop: "Tur Dal", base: 8100 },
        { crop: "Green Gram", base: 7500 }, { crop: "Lime", base: 2500 }, { crop: "Guava", base: 3200 },
        { crop: "Papaya", base: 1200 }, { crop: "Tomato", base: 1200 }, { crop: "Brinjal", base: 1300 },
        { crop: "Bhendi (Okra)", base: 1500 }, { crop: "Cabbage", base: 800 }, { crop: "Coriander", base: 7200 },
        { crop: "Garlic", base: 8000 }, { crop: "Sweet Potato", base: 1400 }, { crop: "Watermelon", base: 900 }
    ],
    "Ballari": [
        { crop: "Rice", base: 2850 }, { crop: "Maize", base: 1950 }, { crop: "Cotton", base: 6500 },
        { crop: "Groundnut", base: 5800 }, { crop: "Sunflower", base: 4600 }, { crop: "Chilli (Dry)", base: 18000 },
        { crop: "Jowar", base: 2400 }, { crop: "Bajra", base: 2100 }, { crop: "Bengal Gram", base: 5200 },
        { crop: "Sugarcane", base: 2900 }, { crop: "Fig (Anjeer)", base: 8500 }, { crop: "Pomegranate", base: 6500 },
        { crop: "Onion", base: 1200 }, { crop: "Tomato", base: 1200 }, { crop: "Brinjal", base: 1300 },
        { crop: "Bhendi (Okra)", base: 1500 }, { crop: "Cabbage", base: 800 }, { crop: "Cauliflower", base: 1100 },
        { crop: "Carrot", base: 1800 }, { crop: "Radish", base: 700 }, { crop: "Spinach", base: 1200 },
        { crop: "Mint", base: 3000 }, { crop: "Coriander Leaves", base: 4000 }, { crop: "Garlic", base: 8000 },
        { crop: "Ginger", base: 3500 }, { crop: "Banana", base: 1800 }, { crop: "Papaya", base: 1200 }
    ],
    "Belagavi": [
        { crop: "Sugarcane", base: 2900 }, { crop: "Maize", base: 1950 }, { crop: "Rice", base: 2850 },
        { crop: "Soybean", base: 4300 }, { crop: "Tobacco", base: 12000 }, { crop: "Groundnut", base: 5800 },
        { crop: "Drumstick", base: 2200 }, { crop: "Jowar", base: 2400 }, { crop: "Wheat", base: 2600 },
        { crop: "Cotton", base: 6500 }, { crop: "Bengal Gram", base: 5200 }, { crop: "Tur Dal", base: 8100 },
        { crop: "Onion", base: 1200 }, { crop: "Potato", base: 1400 }, { crop: "Tomato", base: 1200 },
        { crop: "Cabbage", base: 800 }, { crop: "Cauliflower", base: 1100 }, { crop: "Carrot", base: 1800 },
        { crop: "Capsicum", base: 2500 }, { crop: "Green Chilli", base: 3500 }, { crop: "Ginger", base: 3500 },
        { crop: "Garlic", base: 8000 }, { crop: "Mango", base: 4500 }, { crop: "Banana", base: 1800 },
        { crop: "Grapes", base: 4500 }, { crop: "Sapota", base: 2800 }, { crop: "Guava", base: 3200 }
    ],
    "Bengaluru": [
        { crop: "Ragi", base: 3200 }, { crop: "Rice", base: 2850 }, { crop: "Maize", base: 1950 },
        { crop: "Tomato", base: 800 }, { crop: "Potato", base: 1400 }, { crop: "Onion", base: 1200 },
        { crop: "Carrot", base: 1800 }, { crop: "Cabbage", base: 800 }, { crop: "Cauliflower", base: 1100 },
        { crop: "Capsicum", base: 2500 }, { crop: "Beans", base: 3200 }, { crop: "Peas", base: 4500 },
        { crop: "Marigold", base: 4500 }, { crop: "Rose", base: 8000 }, { crop: "Jasmine", base: 16000 },
        { crop: "Chrysanthemum", base: 6000 }, { crop: "Coconut", base: 18000 }, { crop: "Arecanut", base: 45000 },
        { crop: "Banana", base: 1800 }, { crop: "Mango", base: 4500 }, { crop: "Papaya", base: 1200 },
        { crop: "Guava", base: 3200 }, { crop: "Jackfruit", base: 2000 }, { crop: "Spinach", base: 1200 },
        { crop: "Mint", base: 3000 }, { crop: "Coriander", base: 4000 }, { crop: "Cucumber", base: 900 }
    ],
    "Bidar": [
        { crop: "Tur Dal", base: 8100 }, { crop: "Maize", base: 1950 }, { crop: "Green Gram", base: 7500 },
        { crop: "Wheat", base: 2600 }, { crop: "Sugarcane", base: 2900 }, { crop: "Jowar", base: 2400 },
        { crop: "Bengal Gram", base: 5200 }, { crop: "Black Gram", base: 6800 }, { crop: "Soybean", base: 4300 },
        { crop: "Safflower", base: 4200 }, { crop: "Sunflower", base: 4600 }, { crop: "Groundnut", base: 5800 },
        { crop: "Onion", base: 1200 }, { crop: "Tomato", base: 1200 }, { crop: "Brinjal", base: 1300 },
        { crop: "Bhendi (Okra)", base: 1500 }, { crop: "Red Chilli", base: 18000 }, { crop: "Garlic", base: 8000 },
        { crop: "Ginger", base: 3500 }, { crop: "Mango", base: 4500 }, { crop: "Banana", base: 1800 },
        { crop: "Papaya", base: 1200 }, { crop: "Guava", base: 3200 }, { crop: "Lemon", base: 2500 },
        { crop: "Coriander", base: 7200 }, { crop: "Watermelon", base: 900 }, { crop: "Cucumber", base: 900 }
    ],
    "Byadgi": [
        { crop: "Red Chilli (Byadgi)", base: 55000 }, { crop: "Cotton", base: 6500 }, { crop: "Maize", base: 1950 },
        { crop: "Groundnut", base: 5800 }, { crop: "Jowar", base: 2400 }, { crop: "Onion", base: 1200 },
        { crop: "Tomato", base: 1200 }, { crop: "Garlic", base: 8000 }, { crop: "Ginger", base: 3500 },
        { crop: "Coriander", base: 7200 }, { crop: "Turmeric", base: 7200 }, { crop: "Bengal Gram", base: 5200 },
        { crop: "Green Gram", base: 7500 }, { crop: "Black Gram", base: 6800 }, { crop: "Soybean", base: 4300 },
        { crop: "Wheat", base: 2600 }, { crop: "Sugarcane", base: 2900 }, { crop: "Banana", base: 1800 },
        { crop: "Mango", base: 4500 }, { crop: "Papaya", base: 1200 }, { crop: "Guava", base: 3200 },
        { crop: "Sapota", base: 2800 }, { crop: "Brinjal", base: 1300 }, { crop: "Cabbage", base: 800 },
        { crop: "Cauliflower", base: 1100 }, { crop: "Carrot", base: 1800 }, { crop: "Sweet Potato", base: 1400 }
    ],
    "Chamarajanagar": [
        { crop: "Turmeric", base: 7200 }, { crop: "Maize", base: 1950 }, { crop: "Sugarcane", base: 2900 },
        { crop: "Banana", base: 1800 }, { crop: "Coconut", base: 18000 }, { crop: "Ragi", base: 3200 },
        { crop: "Jowar", base: 2400 }, { crop: "Horse Gram", base: 4500 }, { crop: "Cowpea", base: 5600 },
        { crop: "Groundnut", base: 5800 }, { crop: "Sesame", base: 11000 }, { crop: "Cotton", base: 6500 },
        { crop: "Onion", base: 1200 }, { crop: "Tomato", base: 1200 }, { crop: "Brinjal", base: 1300 },
        { crop: "Bhendi (Okra)", base: 1500 }, { crop: "Cabbage", base: 800 }, { crop: "Cauliflower", base: 1100 },
        { crop: "Garlic", base: 8000 }, { crop: "Ginger", base: 3500 }, { crop: "Mango", base: 4500 },
        { crop: "Papaya", base: 1200 }, { crop: "Arecanut", base: 45000 }, { crop: "Coffee", base: 22000 },
        { crop: "Pepper", base: 38000 }, { crop: "Cardamom", base: 150000 }, { crop: "Marigold", base: 4500 }
    ],
    "Chikkaballapura": [
        { crop: "Tomato", base: 800 }, { crop: "Ragi", base: 3200 }, { crop: "Maize", base: 1950 },
        { crop: "Groundnut", base: 5800 }, { crop: "Capsicum", base: 2500 }, { crop: "Cauliflower", base: 900 },
        { crop: "Cabbage", base: 800 }, { crop: "Potato", base: 1400 }, { crop: "Onion", base: 1200 },
        { crop: "Carrot", base: 1800 }, { crop: "Beans", base: 3200 }, { crop: "Peas", base: 4500 },
        { crop: "Mango", base: 4500 }, { crop: "Grapes", base: 4500 }, { crop: "Guava", base: 3200 },
        { crop: "Papaya", base: 1200 }, { crop: "Banana", base: 1800 }, { crop: "Rose", base: 8000 },
        { crop: "Marigold", base: 4500 }, { crop: "Chrysanthemum", base: 6000 }, { crop: "Jasmine", base: 16000 },
        { crop: "Silk", base: 48000 }, { crop: "Garlic", base: 8000 }, { crop: "Ginger", base: 3500 },
        { crop: "Tur Dal", base: 8100 }, { crop: "Horse Gram", base: 4500 }, { crop: "Cowpea", base: 5600 }
    ],
    "Chikkamagaluru": [
        { crop: "Coffee (Robusta)", base: 22000 }, { crop: "Coffee (Arabica)", base: 28000 }, { crop: "Pepper", base: 38000 },
        { crop: "Cardamom", base: 150000 }, { crop: "Ginger", base: 3500 }, { crop: "Arecanut", base: 45000 },
        { crop: "Rice", base: 2850 }, { crop: "Maize", base: 1950 }, { crop: "Ragi", base: 3200 },
        { crop: "Coconut", base: 18000 }, { crop: "Banana", base: 1800 }, { crop: "Orange", base: 3200 },
        { crop: "Tea", base: 25000 }, { crop: "Cocoa", base: 18000 }, { crop: "Vanilla", base: 350000 },
        { crop: "Turmeric", base: 7200 }, { crop: "Tomato", base: 1200 }, { crop: "Onion", base: 1200 },
        { crop: "Potato", base: 1400 }, { crop: "Cabbage", base: 800 }, { crop: "Cauliflower", base: 1100 },
        { crop: "Carrot", base: 1800 }, { crop: "Beans", base: 3200 }, { crop: "Peas", base: 4500 },
        { crop: "Chilli (Green)", base: 3500 }, { crop: "Garlic", base: 8000 }, { crop: "Sweet Potato", base: 1400 }
    ],
    "Chitradurga": [
        { crop: "Groundnut", base: 5800 }, { crop: "Maize", base: 1950 }, { crop: "Cotton", base: 6500 },
        { crop: "Sunflower", base: 4600 }, { crop: "Onion", base: 1200 }, { crop: "Pomegranate", base: 6500 },
        { crop: "Ragi", base: 3200 }, { crop: "Jowar", base: 2400 }, { crop: "Bengal Gram", base: 5200 },
        { crop: "Tur Dal", base: 8100 }, { crop: "Green Gram", base: 7500 }, { crop: "Castor Seed", base: 5400 },
        { crop: "Tomato", base: 1200 }, { crop: "Brinjal", base: 1300 }, { crop: "Bhendi (Okra)", base: 1500 },
        { crop: "Cabbage", base: 800 }, { crop: "Cauliflower", base: 1100 }, { crop: "Carrot", base: 1800 },
        { crop: "Coconut", base: 18000 }, { crop: "Arecanut", base: 45000 }, { crop: "Banana", base: 1800 },
        { crop: "Mango", base: 4500 }, { crop: "Papaya", base: 1200 }, { crop: "Guava", base: 3200 },
        { crop: "Sapota", base: 2800 }, { crop: "Garlic", base: 8000 }, { crop: "Ginger", base: 3500 }
    ],
    "Dakshina Kannada": [
        { crop: "Coconut", base: 18000 }, { crop: "Arecanut", base: 45000 }, { crop: "Cashew Nut", base: 75000 },
        { crop: "Rubber", base: 15000 }, { crop: "Cocoa", base: 18000 }, { crop: "Nutmeg", base: 55000 },
        { crop: "Rice", base: 2850 }, { crop: "Pepper", base: 38000 }, { crop: "Banana", base: 1800 },
        { crop: "Pineapple", base: 2800 }, { crop: "Mango", base: 4500 }, { crop: "Jackfruit", base: 2000 },
        { crop: "Sweet Potato", base: 1400 }, { crop: "Tapioca", base: 1100 }, { crop: "Ginger", base: 3500 },
        { crop: "Turmeric", base: 7200 }, { crop: "Cardamom", base: 150000 }, { crop: "Vanilla", base: 350000 },
        { crop: "Cucumber", base: 900 }, { crop: "Ash Gourd", base: 700 }, { crop: "Bitter Gourd", base: 1200 },
        { crop: "Snake Gourd", base: 1000 }, { crop: "Ridge Gourd", base: 1100 }, { crop: "Amaranthus", base: 1200 },
        { crop: "Drumstick", base: 2200 }, { crop: "Papaya", base: 1200 }, { crop: "Guava", base: 3200 }
    ],
    "Davangere": [
        { crop: "Maize", base: 1950 }, { crop: "Rice", base: 2850 }, { crop: "Sugarcane", base: 2900 },
        { crop: "Cotton", base: 6500 }, { crop: "Lemon", base: 2500 }, { crop: "Onion", base: 1200 },
        { crop: "Jowar", base: 2400 }, { crop: "Ragi", base: 3200 }, { crop: "Groundnut", base: 5800 },
        { crop: "Sunflower", base: 4600 }, { crop: "Tur Dal", base: 8100 }, { crop: "Bengal Gram", base: 5200 },
        { crop: "Tomato", base: 1200 }, { crop: "Brinjal", base: 1300 }, { crop: "Bhendi (Okra)", base: 1500 },
        { crop: "Cabbage", base: 800 }, { crop: "Cauliflower", base: 1100 }, { crop: "Carrot", base: 1800 },
        { crop: "Garlic", base: 8000 }, { crop: "Ginger", base: 3500 }, { crop: "Coriander", base: 7200 },
        { crop: "Arecanut", base: 45000 }, { crop: "Coconut", base: 18000 }, { crop: "Banana", base: 1800 },
        { crop: "Mango", base: 4500 }, { crop: "Papaya", base: 1200 }, { crop: "Pomegranate", base: 6500 }
    ],
    "Dharwad": [
        { crop: "Cotton", base: 6500 }, { crop: "Maize", base: 1950 }, { crop: "Bengal Gram", base: 5200 },
        { crop: "Wheat", base: 2600 }, { crop: "Cowpea", base: 5600 }, { crop: "Soybean", base: 4300 },
        { crop: "Jowar", base: 2400 }, { crop: "Groundnut", base: 5800 }, { crop: "Sunflower", base: 4600 },
        { crop: "Safflower", base: 4200 }, { crop: "Tur Dal", base: 8100 }, { crop: "Green Gram", base: 7500 },
        { crop: "Black Gram", base: 6800 }, { crop: "Onion", base: 1200 }, { crop: "Potato", base: 1400 },
        { crop: "Tomato", base: 1200 }, { crop: "Brinjal", base: 1300 }, { crop: "Cabbage", base: 800 },
        { crop: "Cauliflower", base: 1100 }, { crop: "Garlic", base: 8000 }, { crop: "Chilli (Dry)", base: 18000 },
        { crop: "Ginger", base: 3500 }, { crop: "Mango", base: 4500 }, { crop: "Sapota", base: 2800 },
        { crop: "Guava", base: 3200 }, { crop: "Banana", base: 1800 }, { crop: "Papaya", base: 1200 }
    ],
    "Gadag": [
        { crop: "Cotton", base: 6500 }, { crop: "Sunflower", base: 4600 }, { crop: "Maize", base: 1950 },
        { crop: "Wheat", base: 2600 }, { crop: "Garlic", base: 8000 }, { crop: "Coriander", base: 7200 },
        { crop: "Jowar", base: 2400 }, { crop: "Bengal Gram", base: 5200 }, { crop: "Tur Dal", base: 8100 },
        { crop: "Green Gram", base: 7500 }, { crop: "Black Gram", base: 6800 }, { crop: "Groundnut", base: 5800 },
        { crop: "Safflower", base: 4200 }, { crop: "Onion", base: 1200 }, { crop: "Tomato", base: 1200 },
        { crop: "Brinjal", base: 1300 }, { crop: "Bhendi (Okra)", base: 1500 }, { crop: "Cabbage", base: 800 },
        { crop: "Red Chilli", base: 18000 }, { crop: "Ginger", base: 3500 }, { crop: "Turmeric", base: 7200 },
        { crop: "Mango", base: 4500 }, { crop: "Banana", base: 1800 }, { crop: "Papaya", base: 1200 },
        { crop: "Guava", base: 3200 }, { crop: "Lemon", base: 2500 }, { crop: "Pomegranate", base: 6500 }
    ],
    "Hassan": [
        { crop: "Coffee (Robusta)", base: 22000 }, { crop: "Ragi", base: 3200 }, { crop: "Potato", base: 1400 },
        { crop: "Ginger", base: 3500 }, { crop: "Coconut", base: 18000 }, { crop: "Green Peas", base: 4500 },
        { crop: "Maize", base: 1950 }, { crop: "Rice", base: 2850 }, { crop: "Arecanut", base: 45000 },
        { crop: "Pepper", base: 38000 }, { crop: "Cardamom", base: 150000 }, { crop: "Vanilla", base: 350000 },
        { crop: "Tomato", base: 1200 }, { crop: "Onion", base: 1200 }, { crop: "Cabbage", base: 800 },
        { crop: "Cauliflower", base: 1100 }, { crop: "Carrot", base: 1800 }, { crop: "Beans", base: 3200 },
        { crop: "Capsicum", base: 2500 }, { crop: "Garlic", base: 8000 }, { crop: "Turmeric", base: 7200 },
        { crop: "Banana", base: 1800 }, { crop: "Mango", base: 4500 }, { crop: "Papaya", base: 1200 },
        { crop: "Orange", base: 3200 }, { crop: "Jackfruit", base: 2000 }, { crop: "Sweet Potato", base: 1400 }
    ],
    "Haveri": [
        { crop: "Maize", base: 1950 }, { crop: "Cotton", base: 6500 }, { crop: "Sugarcane", base: 2900 },
        { crop: "Arecanut", base: 45000 }, { crop: "Rice", base: 2850 }, { crop: "Ridge Gourd", base: 1200 },
        { crop: "Jowar", base: 2400 }, { crop: "Wheat", base: 2600 }, { crop: "Groundnut", base: 5800 },
        { crop: "Sunflower", base: 4600 }, { crop: "Soybean", base: 4300 }, { crop: "Tur Dal", base: 8100 },
        { crop: "Bengal Gram", base: 5200 }, { crop: "Red Chilli (Byadgi)", base: 55000 }, { crop: "Onion", base: 1200 },
        { crop: "Tomato", base: 1200 }, { crop: "Brinjal", base: 1300 }, { crop: "Cabbage", base: 800 },
        { crop: "Garlic", base: 8000 }, { crop: "Ginger", base: 3500 }, { crop: "Coriander", base: 7200 },
        { crop: "Mango", base: 4500 }, { crop: "Banana", base: 1800 }, { crop: "Papaya", base: 1200 },
        { crop: "Sapota", base: 2800 }, { crop: "Guava", base: 3200 }, { crop: "Coconut", base: 18000 }
    ],
    "Kalaburagi": [
        { crop: "Tur Dal", base: 8100 }, { crop: "Black Gram", base: 6800 }, { crop: "Maize", base: 1950 },
        { crop: "Jowar", base: 2400 }, { crop: "Safflower", base: 4200 }, { crop: "Green Gram", base: 7500 },
        { crop: "Bengal Gram", base: 5200 }, { crop: "Wheat", base: 2600 }, { crop: "Sunflower", base: 4600 },
        { crop: "Groundnut", base: 5800 }, { crop: "Soybean", base: 4300 }, { crop: "Sugarcane", base: 2900 },
        { crop: "Cotton", base: 6500 }, { crop: "Onion", base: 1200 }, { crop: "Tomato", base: 1200 },
        { crop: "Brinjal", base: 1300 }, { crop: "Bhendi (Okra)", base: 1500 }, { crop: "Cabbage", base: 800 },
        { crop: "Garlic", base: 8000 }, { crop: "Ginger", base: 3500 }, { crop: "Red Chilli", base: 18000 },
        { crop: "Mango", base: 4500 }, { crop: "Banana", base: 1800 }, { crop: "Papaya", base: 1200 },
        { crop: "Guava", base: 3200 }, { crop: "Lemon", base: 2500 }, { crop: "Watermelon", base: 900 }
    ],
    "Kodagu": [
        { crop: "Coffee (Robusta)", base: 22000 }, { crop: "Coffee (Arabica)", base: 28000 }, { crop: "Pepper", base: 38000 },
        { crop: "Cardamom", base: 150000 }, { crop: "Vanilla", base: 350000 }, { crop: "Cinnamon", base: 42000 },
        { crop: "Clove", base: 85000 }, { crop: "Nutmeg", base: 55000 }, { crop: "Orange", base: 3200 },
        { crop: "Honey", base: 25000 }, { crop: "Rice", base: 2850 }, { crop: "Arecanut", base: 45000 },
        { crop: "Banana", base: 1800 }, { crop: "Pineapple", base: 2800 }, { crop: "Mango", base: 4500 },
        { crop: "Jackfruit", base: 2000 }, { crop: "Ginger", base: 3500 }, { crop: "Turmeric", base: 7200 },
        { crop: "Tomato", base: 1200 }, { crop: "Cabbage", base: 800 }, { crop: "Cauliflower", base: 1100 },
        { crop: "Carrot", base: 1800 }, { crop: "Beans", base: 3200 }, { crop: "Peas", base: 4500 },
        { crop: "Sweet Potato", base: 1400 }, { crop: "Tapioca", base: 1100 }, { crop: "Green Chilli", base: 3500 }
    ],
    "Kolar": [
        { crop: "Tomato", base: 800 }, { crop: "Mango", base: 4500 }, { crop: "Ragi", base: 3200 },
        { crop: "Potato", base: 1400 }, { crop: "Silk", base: 48000 }, { crop: "Maize", base: 1950 },
        { crop: "Groundnut", base: 5800 }, { crop: "Tur Dal", base: 8100 }, { crop: "Horse Gram", base: 4500 },
        { crop: "Cowpea", base: 5600 }, { crop: "Beans", base: 3200 }, { crop: "Peas", base: 4500 },
        { crop: "Cabbage", base: 800 }, { crop: "Cauliflower", base: 1100 }, { crop: "Carrot", base: 1800 },
        { crop: "Beetroot", base: 1100 }, { crop: "Capsicum", base: 2500 }, { crop: "Onion", base: 1200 },
        { crop: "Garlic", base: 8000 }, { crop: "Ginger", base: 3500 }, { crop: "Grapes", base: 4500 },
        { crop: "Papaya", base: 1200 }, { crop: "Guava", base: 3200 }, { crop: "Banana", base: 1800 },
        { crop: "Rose", base: 8000 }, { crop: "Marigold", base: 4500 }, { crop: "Chrysanthemum", base: 6000 }
    ],
    "Koppal": [
        { crop: "Paddy (IR-64)", base: 2200 }, { crop: "Maize", base: 1950 }, { crop: "Cotton", base: 6500 },
        { crop: "Sunflower", base: 4600 }, { crop: "Groundnut", base: 5800 }, { crop: "Pomegranate", base: 6500 },
        { crop: "Fig (Anjeer)", base: 8500 }, { crop: "Jowar", base: 2400 }, { crop: "Bajra", base: 2100 },
        { crop: "Tur Dal", base: 8100 }, { crop: "Bengal Gram", base: 5200 }, { crop: "Green Gram", base: 7500 },
        { crop: "Onion", base: 1200 }, { crop: "Tomato", base: 1200 }, { crop: "Brinjal", base: 1300 },
        { crop: "Bhendi (Okra)", base: 1500 }, { crop: "Cabbage", base: 800 }, { crop: "Red Chilli", base: 18000 },
        { crop: "Garlic", base: 8000 }, { crop: "Ginger", base: 3500 }, { crop: "Banana", base: 1800 },
        { crop: "Mango", base: 4500 }, { crop: "Papaya", base: 1200 }, { crop: "Guava", base: 3200 },
        { crop: "Sweet Orange", base: 3200 }, { crop: "Lemon", base: 2500 }, { crop: "Watermelon", base: 900 }
    ],
    "Mandya": [
        { crop: "Sugarcane", base: 2900 }, { crop: "Rice", base: 2850 }, { crop: "Ragi", base: 3200 },
        { crop: "Coconut", base: 18000 }, { crop: "Arecanut", base: 45000 }, { crop: "Banana", base: 1800 },
        { crop: "Horse Gram", base: 4500 }, { crop: "Cowpea", base: 5600 }, { crop: "Tomato", base: 1200 },
        { crop: "Onion", base: 1200 }, { crop: "Brinjal", base: 1300 }, { crop: "Bhendi (Okra)", base: 1500 },
        { crop: "Cucumber", base: 900 }, { crop: "Bottle Gourd", base: 800 }, { crop: "Ridge Gourd", base: 1100 },
        { crop: "Bitter Gourd", base: 1200 }, { crop: "Snake Gourd", base: 1000 }, { crop: "Ash Gourd", base: 700 },
        { crop: "Beans", base: 3200 }, { crop: "Peas", base: 4500 }, { crop: "Garlic", base: 8000 },
        { crop: "Ginger", base: 3500 }, { crop: "Mango", base: 4500 }, { crop: "Papaya", base: 1200 },
        { crop: "Guava", base: 3200 }, { crop: "Watermelon", base: 900 }, { crop: "Muskmelon", base: 1500 }
    ],
    "Mysuru": [
        { crop: "Rice", base: 2850 }, { crop: "Ragi", base: 3200 }, { crop: "Sugarcane", base: 2900 },
        { crop: "Tobacco", base: 12000 }, { crop: "Cotton", base: 6500 }, { crop: "Coconut", base: 18000 },
        { crop: "Banana", base: 1800 }, { crop: "Mango", base: 4500 }, { crop: "Tomato", base: 1200 },
        { crop: "Onion", base: 1200 }, { crop: "Potato", base: 1400 }, { crop: "Brinjal", base: 1300 },
        { crop: "Bhendi (Okra)", base: 1500 }, { crop: "Beans", base: 3200 }, { crop: "Peas", base: 4500 },
        { crop: "Cabbage", base: 800 }, { crop: "Cauliflower", base: 1100 }, { crop: "Carrot", base: 1800 },
        { crop: "Garlic", base: 8000 }, { crop: "Ginger", base: 3500 }, { crop: "Turmeric", base: 7200 },
        { crop: "Horse Gram", base: 4500 }, { crop: "Cowpea", base: 5600 }, { crop: "Papaya", base: 1200 },
        { crop: "Guava", base: 3200 }, { crop: "Jasmine", base: 16000 }, { crop: "Marigold", base: 4500 }
    ],
    "Raichur": [
        { crop: "Paddy (IR-64)", base: 2200 }, { crop: "Cotton", base: 6500 }, { crop: "Tur Dal", base: 8100 },
        { crop: "Groundnut", base: 5800 }, { crop: "Sunflower", base: 4600 }, { crop: "Castor Seed", base: 5400 },
        { crop: "Jowar", base: 2400 }, { crop: "Bajra", base: 2100 }, { crop: "Maize", base: 1950 },
        { crop: "Bengal Gram", base: 5200 }, { crop: "Green Gram", base: 7500 }, { crop: "Wheat", base: 2600 },
        { crop: "Onion", base: 1200 }, { crop: "Tomato", base: 1200 }, { crop: "Brinjal", base: 1300 },
        { crop: "Bhendi (Okra)", base: 1500 }, { crop: "Cabbage", base: 800 }, { crop: "Red Chilli", base: 18000 },
        { crop: "Garlic", base: 8000 }, { crop: "Ginger", base: 3500 }, { crop: "Mango", base: 4500 },
        { crop: "Banana", base: 1800 }, { crop: "Papaya", base: 1200 }, { crop: "Guava", base: 3200 },
        { crop: "Lemon", base: 2500 }, { crop: "Sweet Orange", base: 3200 }, { crop: "Watermelon", base: 900 }
    ],
    "Ramanagara": [
        { crop: "Silk", base: 48000 }, { crop: "Mango", base: 4500 }, { crop: "Ragi", base: 3200 },
        { crop: "Rice", base: 2850 }, { crop: "Coconut", base: 18000 }, { crop: "Banana", base: 1800 },
        { crop: "Tomato", base: 800 }, { crop: "Onion", base: 1200 }, { crop: "Brinjal", base: 1300 },
        { crop: "Bhendi (Okra)", base: 1500 }, { crop: "Beans", base: 3200 }, { crop: "Peas", base: 4500 },
        { crop: "Cabbage", base: 800 }, { crop: "Cauliflower", base: 1100 }, { crop: "Carrot", base: 1800 },
        { crop: "Capsicum", base: 2500 }, { crop: "Garlic", base: 8000 }, { crop: "Ginger", base: 3500 },
        { crop: "Papaya", base: 1200 }, { crop: "Guava", base: 3200 }, { crop: "Sapota", base: 2800 },
        { crop: "Jackfruit", base: 2000 }, { crop: "Rose", base: 8000 }, { crop: "Marigold", base: 4500 },
        { crop: "Jasmine", base: 16000 }, { crop: "Chrysanthemum", base: 6000 }, { crop: "Cucumber", base: 900 }
    ],
    "Shimoga": [
        { crop: "Arecanut", base: 45000 }, { crop: "Rice", base: 2850 }, { crop: "Maize", base: 1950 },
        { crop: "Sugarcane", base: 2900 }, { crop: "Ginger", base: 3500 }, { crop: "Pepper", base: 38000 },
        { crop: "Vanilla", base: 350000 }, { crop: "Coconut", base: 18000 }, { crop: "Banana", base: 1800 },
        { crop: "Pineapple", base: 2800 }, { crop: "Mango", base: 4500 }, { crop: "Jackfruit", base: 2000 },
        { crop: "Turmeric", base: 7200 }, { crop: "Cotton", base: 6500 }, { crop: "Tomato", base: 1200 },
        { crop: "Onion", base: 1200 }, { crop: "Brinjal", base: 1300 }, { crop: "Bhendi (Okra)", base: 1500 },
        { crop: "Cabbage", base: 800 }, { crop: "Cauliflower", base: 1100 }, { crop: "Carrot", base: 1800 },
        { crop: "Beans", base: 3200 }, { crop: "Peas", base: 4500 }, { crop: "Garlic", base: 8000 },
        { crop: "Sweet Potato", base: 1400 }, { crop: "Papaya", base: 1200 }, { crop: "Guava", base: 3200 }
    ],
    "Tumakuru": [
        { crop: "Coconut", base: 18000 }, { crop: "Ragi", base: 3200 }, { crop: "Groundnut", base: 5800 },
        { crop: "Arecanut", base: 45000 }, { crop: "Rice", base: 2850 }, { crop: "Maize", base: 1950 },
        { crop: "Tur Dal", base: 8100 }, { crop: "Horse Gram", base: 4500 }, { crop: "Cowpea", base: 5600 },
        { crop: "Tomato", base: 1200 }, { crop: "Onion", base: 1200 }, { crop: "Brinjal", base: 1300 },
        { crop: "Bhendi (Okra)", base: 1500 }, { crop: "Cabbage", base: 800 }, { crop: "Cauliflower", base: 1100 },
        { crop: "Carrot", base: 1800 }, { crop: "Beans", base: 3200 }, { crop: "Peas", base: 4500 },
        { crop: "Garlic", base: 8000 }, { crop: "Ginger", base: 3500 }, { crop: "Tamarind", base: 6000 },
        { crop: "Mango", base: 4500 }, { crop: "Banana", base: 1800 }, { crop: "Papaya", base: 1200 },
        { crop: "Guava", base: 3200 }, { crop: "Jackfruit", base: 2000 }, { crop: "Marigold", base: 4500 }
    ],
    "Udupi": [
        { crop: "Rice", base: 2850 }, { crop: "Coconut", base: 18000 }, { crop: "Arecanut", base: 45000 },
        { crop: "Cashew Nut", base: 75000 }, { crop: "Pepper", base: 38000 }, { crop: "Rubber", base: 15000 },
        { crop: "Cocoa", base: 18000 }, { crop: "Vanilla", base: 350000 }, { crop: "Banana", base: 1800 },
        { crop: "Pineapple", base: 2800 }, { crop: "Mango", base: 4500 }, { crop: "Jackfruit", base: 2000 },
        { crop: "Sweet Potato", base: 1400 }, { crop: "Tapioca", base: 1100 }, { crop: "Ginger", base: 3500 },
        { crop: "Turmeric", base: 7200 }, { crop: "Cucumber", base: 900 }, { crop: "Ash Gourd", base: 700 },
        { crop: "Bitter Gourd", base: 1200 }, { crop: "Snake Gourd", base: 1000 }, { crop: "Ridge Gourd", base: 1100 },
        { crop: "Amaranthus", base: 1200 }, { crop: "Drumstick", base: 2200 }, { crop: "Papaya", base: 1200 },
        { crop: "Guava", base: 3200 }, { crop: "Green Chilli", base: 3500 }, { crop: "Tomato", base: 1200 }
    ],
    "Uttara Kannada": [
        { crop: "Arecanut", base: 45000 }, { crop: "Coconut", base: 18000 }, { crop: "Rice", base: 2850 },
        { crop: "Pepper", base: 38000 }, { crop: "Cashew Nut", base: 75000 }, { crop: "Vanilla", base: 350000 },
        { crop: "Cocoa", base: 18000 }, { crop: "Nutmeg", base: 55000 }, { crop: "Cardamom", base: 150000 },
        { crop: "Banana", base: 1800 }, { crop: "Pineapple", base: 2800 }, { crop: "Mango", base: 4500 },
        { crop: "Jackfruit", base: 2000 }, { crop: "Sweet Potato", base: 1400 }, { crop: "Tapioca", base: 1100 },
        { crop: "Ginger", base: 3500 }, { crop: "Turmeric", base: 7200 }, { crop: "Cucumber", base: 900 },
        { crop: "Ash Gourd", base: 700 }, { crop: "Bitter Gourd", base: 1200 }, { crop: "Snake Gourd", base: 1000 },
        { crop: "Ridge Gourd", base: 1100 }, { crop: "Drumstick", base: 2200 }, { crop: "Papaya", base: 1200 },
        { crop: "Guava", base: 3200 }, { crop: "Green Chilli", base: 3500 }, { crop: "Tomato", base: 1200 }
    ],
    "Vijayapura": [
        { crop: "Grapes", base: 4500 }, { crop: "Maize", base: 1950 }, { crop: "Sugarcane", base: 2900 },
        { crop: "Jowar", base: 2400 }, { crop: "Tur Dal", base: 8100 }, { crop: "Linseed", base: 5800 },
        { crop: "Bajra", base: 2100 }, { crop: "Wheat", base: 2600 }, { crop: "Bengal Gram", base: 5200 },
        { crop: "Groundnut", base: 5800 }, { crop: "Sunflower", base: 4600 }, { crop: "Safflower", base: 4200 },
        { crop: "Cotton", base: 6500 }, { crop: "Onion", base: 1200 }, { crop: "Tomato", base: 1200 },
        { crop: "Brinjal", base: 1300 }, { crop: "Bhendi (Okra)", base: 1500 }, { crop: "Cabbage", base: 800 },
        { crop: "Red Chilli", base: 18000 }, { crop: "Garlic", base: 8000 }, { crop: "Ginger", base: 3500 },
        { crop: "Lime", base: 2500 }, { crop: "Pomegranate", base: 6500 }, { crop: "Fig (Anjeer)", base: 8500 },
        { crop: "Banana", base: 1800 }, { crop: "Papaya", base: 1200 }, { crop: "Watermelon", base: 900 }
    ],
    "Yadgir": [
        { crop: "Tur Dal", base: 8100 }, { crop: "Rice", base: 2850 }, { crop: "Cotton", base: 6500 },
        { crop: "Jowar", base: 2400 }, { crop: "Maize", base: 1950 }, { crop: "Green Gram", base: 7500 },
        { crop: "Bajra", base: 2100 }, { crop: "Bengal Gram", base: 5200 }, { crop: "Black Gram", base: 6800 },
        { crop: "Wheat", base: 2600 }, { crop: "Groundnut", base: 5800 }, { crop: "Sunflower", base: 4600 },
        { crop: "Safflower", base: 4200 }, { crop: "Sugarcane", base: 2900 }, { crop: "Onion", base: 1200 },
        { crop: "Tomato", base: 1200 }, { crop: "Brinjal", base: 1300 }, { crop: "Bhendi (Okra)", base: 1500 },
        { crop: "Cabbage", base: 800 }, { crop: "Garlic", base: 8000 }, { crop: "Ginger", base: 3500 },
        { crop: "Red Chilli", base: 18000 }, { crop: "Mango", base: 4500 }, { crop: "Banana", base: 1800 },
        { crop: "Papaya", base: 1200 }, { crop: "Guava", base: 3200 }, { crop: "Lemon", base: 2500 }
    ]
};

const genericSurplusCrops = [
    { crop: "Tomato", base: 1200 }, { crop: "Potato", base: 1400 },
    { crop: "Onion", base: 1600 }, { crop: "Garlic", base: 8000 },
    { crop: "Green Chilli", base: 3500 }, { crop: "Carrot", base: 1800 },
    { crop: "Cabbage", base: 800 }, { crop: "Cauliflower", base: 1100 },
    { crop: "Brinjal", base: 1300 }, { crop: "Lady Finger", base: 1500 },
    { crop: "Cucumber", base: 900 }, { crop: "Spinach", base: 1200 },
    { crop: "Radish", base: 700 }, { crop: "Pumpkin", base: 600 },
    { crop: "Bottle Gourd", base: 800 }, { crop: "Bitter Gourd", base: 1200 },
    { crop: "Ridge Gourd", base: 1100 }, { crop: "Snake Gourd", base: 1000 },
    { crop: "Ash Gourd", base: 700 }, { crop: "Capsicum", base: 2500 },
    { crop: "Mint Leaves", base: 3000 }, { crop: "Coriander Leaves", base: 4000 },
    { crop: "Curry Leaves", base: 3500 }, { crop: "Drumstick", base: 2200 },
    { crop: "Sweet Potato", base: 1400 }, { crop: "Beetroot", base: 1100 },
    { crop: "Green Peas", base: 4500 }, { crop: "French Beans", base: 3200 },
    { crop: "Broad Beans", base: 3500 }, { crop: "Cluster Beans", base: 2800 },
    { crop: "Ginger", base: 3500 }, { crop: "Lemon", base: 2500 },
    { crop: "Turmeric", base: 7200 }, { crop: "Coriander", base: 7200 },
    { crop: "Green Gram", base: 7500 }, { crop: "Black Gram", base: 6800 },
    { crop: "Bengal Gram", base: 5200 }, { crop: "Horse Gram", base: 4500 },
    { crop: "Cowpea", base: 5600 }, { crop: "Soybean", base: 4300 },
    { crop: "Groundnut", base: 5800 }, { crop: "Sunflower", base: 4600 },
    { crop: "Safflower", base: 4200 }, { crop: "Castor Seed", base: 5400 },
    { crop: "Sesame", base: 11000 }, { crop: "Linseed", base: 5800 },
    { crop: "Banana", base: 1800 }, { crop: "Mango", base: 4500 },
    { crop: "Papaya", base: 1200 }, { crop: "Guava", base: 3200 },
    { crop: "Sapota", base: 2800 }, { crop: "Pomegranate", base: 6500 },
    { crop: "Grapes", base: 4500 }, { crop: "Fig (Anjeer)", base: 8500 },
    { crop: "Watermelon", base: 900 }, { crop: "Muskmelon", base: 1500 },
    { crop: "Jackfruit", base: 2000 }, { crop: "Pineapple", base: 2800 },
    { crop: "Sweet Orange", base: 3200 }, { crop: "Lime", base: 2500 },
    { crop: "Maize", base: 1950 }, { crop: "Sugarcane", base: 2900 },
    { crop: "Cotton", base: 6500 }, { crop: "Jowar", base: 2400 },
    { crop: "Wheat", base: 2600 }, { crop: "Sorghum", base: 2300 },
    { crop: "Bajra", base: 2100 }, { crop: "Red Chilli", base: 18000 },
    { crop: "Tur Dal", base: 8100 }, { crop: "Rice", base: 2850 },
    { crop: "Tobacco", base: 12000 }, { crop: "Ragi", base: 3200 },
    { crop: "Beans", base: 3200 }, { crop: "Peas", base: 4500 },
    { crop: "Marigold", base: 4500 }, { crop: "Rose", base: 8000 },
    { crop: "Jasmine", base: 16000 }, { crop: "Chrysanthemum", base: 6000 },
    { crop: "Coconut", base: 18000 }, { crop: "Arecanut", base: 45000 },
    { crop: "Red Chilli (Byadgi)", base: 55000 }, { crop: "Coffee", base: 22000 },
    { crop: "Pepper", base: 38000 }, { crop: "Cardamom", base: 150000 },
    { crop: "Coffee (Robusta)", base: 22000 }, { crop: "Coffee (Arabica)", base: 28000 },
    { crop: "Tea", base: 25000 }, { crop: "Cocoa", base: 18000 },
    { crop: "Vanilla", base: 350000 }, { crop: "Chilli (Green)", base: 3500 },
    { crop: "Cashew Nut", base: 75000 }, { crop: "Rubber", base: 15000 },
    { crop: "Nutmeg", base: 55000 }, { crop: "Tapioca", base: 1100 },
    { crop: "Amaranthus", base: 1200 }, { crop: "Chilli (Dry)", base: 18000 },
    { crop: "Orange", base: 3200 }, { crop: "Honey", base: 25000 },
    { crop: "Sweet Orange", base: 3200 }, { crop: "Silk", base: 48000 },
    { crop: "Paddy (IR-64)", base: 2200 }, { crop: "Mulberry Silk", base: 48000 },
    { crop: "Little Millet", base: 4000 }, { crop: "Betel Leaf", base: 12000 },
    { crop: "Clove", base: 85000 }, { crop: "Foxtail Millet", base: 3800 },
    { crop: "Tamarind", base: 6000 }
];


window.generatePricesForDistrict = function(districtName) {
    let generatedPrices = [];
    const districtKey = districtName.includes('(') ? districtName.split(' (')[0] : districtName;
    const districtCrops = districtMasterCrops[districtKey];
    
    // Fall back to a generic global generation if district is invalid
    if (!districtCrops || districtCrops.length === 0) {
        const today = new Date();
        const seed = today.getFullYear() * 1000 + today.getDate() + 99; // Arbitrary seed
        generatedPrices = genericSurplusCrops.map((c, i) => {
            const random = Math.sin(seed + (i + 50) * 200) * 10000;
            const percentChange = ((random - Math.floor(random)) * 0.1) - 0.05;
            return {
                crop: c.crop,
                market: "Karnataka",
                price: Math.round(c.base * (1 + percentChange)),
                unit: "Quintal",
                trend: percentChange > 0 ? 'up' : (percentChange < 0 ? 'down' : 'stable'),
                date: today
            };
        });
        return generatedPrices.slice(0, 100);
    }

    const today = new Date();
    const seed = today.getFullYear() * 1000 + today.getDate() + districtName.charCodeAt(0);

    // 1. Map real district crops
    generatedPrices = districtCrops.map((c, i) => {
        const random = Math.sin(seed + i * 200) * 10000;
        const percentChange = ((random - Math.floor(random)) * 0.1) - 0.05;
        const currentPrice = Math.round(c.base * (1 + percentChange));

        return {
            crop: c.crop,
            market: districtName + (districtName.toLowerCase().includes('apmc') ? '' : ' APMC'),
            price: currentPrice,
            unit: "Quintal",
            trend: percentChange > 0 ? 'up' : (percentChange < 0 ? 'down' : 'stable'),
            date: today,
            isMajor: true // Flag to identify it as a specific district crop
        };
    });

    // 2. Pad to 100 minimum with surplus crops
    const existingCropNames = new Set(generatedPrices.map(p => p.crop.toLowerCase()));

    for (let i = 0; i < genericSurplusCrops.length && generatedPrices.length < 100; i++) {
        const c = genericSurplusCrops[i];
        if (!existingCropNames.has(c.crop.toLowerCase())) {
            const random = Math.sin(seed + (i + 50) * 200) * 10000;
            const percentChange = ((random - Math.floor(random)) * 0.1) - 0.05;
            generatedPrices.push({
                crop: c.crop,
                market: districtName + " Region", // Minor distinction
                price: Math.round(c.base * (1 + percentChange)),
                unit: "Quintal",
                trend: percentChange > 0 ? 'up' : (percentChange < 0 ? 'down' : 'stable'),
                date: today,
                isMajor: false 
            });
        }
    }

    return generatedPrices;
}
