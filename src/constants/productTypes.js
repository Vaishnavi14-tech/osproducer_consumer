// Product Types, Catalog, Scenarios & Constants for Warehouse OS Simulation

export const PRODUCT_CATEGORIES = [
  {
    id: 'electronics',
    name: 'Electronics',
    code: 'ELX',
    icon: 'Cpu',
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.15)',
    priority: 'Normal',
    sampleItems: [
      'Smart 4K OLED TV',
      'Laptop Pro M3',
      'Smartphone Ultra 5G',
      'Wireless Noise-Canceling Headphones',
      'Gaming Graphics Card GPU',
      'Microcontroller Dev Board',
      'Smartwatch GPS Fitness',
      'Mechanical Keyboard RGB'
    ]
  },
  {
    id: 'food',
    name: 'Food',
    code: 'FOD',
    icon: 'Apple',
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.15)',
    priority: 'Normal',
    sampleItems: [
      'Organic Arabica Coffee Beans',
      'Artisanal Olive Oil Extra Virgin',
      'Fresh Hydroponic Strawberries',
      'Organic Rolled Oats 2kg',
      'Pasteurized Almond Milk',
      'Raw Honey Wildflower 1kg',
      'Gourmet Dark Chocolate 85%',
      'Himalayan Pink Rock Salt'
    ]
  },
  {
    id: 'furniture',
    name: 'Furniture',
    code: 'FUR',
    icon: 'Armchair',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.15)',
    priority: 'Low',
    sampleItems: [
      'Ergonomic Mesh Office Chair',
      'Motorized Standing Desk 60"',
      'Modular Leather Recliner Sofa',
      'Solid Oak Dining Table',
      'Minimalist Bedside Nightstand',
      'Multi-Tier Industrial Bookshelf',
      'Memory Foam Queen Mattress',
      'Adjustable Drafting Stool'
    ]
  },
  {
    id: 'clothing',
    name: 'Clothing',
    code: 'CLO',
    icon: 'Shirt',
    color: '#ec4899',
    bgColor: 'rgba(236, 72, 153, 0.15)',
    priority: 'Normal',
    sampleItems: [
      'Waterproof Winter Parka Jacket',
      'Breathable Athletic Running Tee',
      'Slim-Fit Denim Jeans Indigo',
      'Organic Merino Wool Sweater',
      'Trail Hiking Boots Vibram',
      'Formal Cotton Oxford Shirt',
      'Thermal Fleece Mid-Layer',
      'Anodized Polarized Sunglasses'
    ]
  },
  {
    id: 'medicines',
    name: 'Medicines',
    code: 'MED',
    icon: 'Pill',
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.15)',
    priority: 'Urgent',
    sampleItems: [
      'Cold-Chain Insulin Ampoules',
      'Broad-Spectrum Antibiotics 500mg',
      'Emergency Epinephrine Auto-Injector',
      'Antiviral Oral Suspension',
      'Surgical Sterile Dressing Kits',
      'Cardiac Beta-Blockers Pack',
      'Pulse Oximeter Digital Monitor',
      'First-Aid Trauma Emergency Kit'
    ]
  },
  {
    id: 'books',
    name: 'Books',
    code: 'BOK',
    icon: 'BookOpen',
    color: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.15)',
    priority: 'Low',
    sampleItems: [
      'Operating System Concepts (Silberschatz)',
      'Modern Operating Systems (Tanenbaum)',
      'Designing Data-Intensive Applications',
      'Introduction to Algorithms (CLRS)',
      'Computer Networking: Top-Down Approach',
      'Clean Architecture (Robert Martin)',
      'Database System Concepts 7th Ed',
      'Distributed Systems: Principles & Paradigms'
    ]
  },
  {
    id: 'household',
    name: 'Household Products',
    code: 'HOU',
    icon: 'Home',
    color: '#06b6d4',
    bgColor: 'rgba(6, 182, 212, 0.15)',
    priority: 'Normal',
    sampleItems: [
      'HEPA Air Purifier True Filter',
      'Robotic Vacuum Cleaner LiDAR',
      'Cordless Cyclonic Stick Vacuum',
      'Stainless Steel Induction Cookware',
      'Smart Ultrasonic Humidifier',
      'High-Pressure Steam Iron',
      'Compact Countertop Dishwasher',
      'UV-C Sanitizer Box 20L'
    ]
  }
];

export const SYNCHRONIZATION_MODES = {
  SEMAPHORE: 'SEMAPHORE',
  MUTEX_LOCK: 'MUTEX_LOCK',
  MONITOR: 'MONITOR'
};

export const SIMULATION_EXECUTION_MODES = {
  NORMAL: 'NORMAL',
  STEP_BY_STEP: 'STEP_BY_STEP',
  RACE_CONDITION: 'RACE_CONDITION',
  DEADLOCK_DEMO: 'DEADLOCK_DEMO'
};

// Thread Lifecycle States as required by Operating System Principles
export const THREAD_STATES = {
  RUNNING: 'Running',
  WAITING: 'Waiting',
  BLOCKED: 'Blocked',
  READY: 'Ready',
  SLEEPING: 'Sleeping'
};

// The 7 Standard Simulation Scenarios required by the specification
export const SIMULATION_SCENARIOS = [
  {
    id: 'SCENARIO_1',
    name: 'Scenario 1: Production Rate = Consumption Rate',
    statusText: 'Balanced Warehouse',
    description: 'Producers and Consumers operate at matched cycle speeds. Storage occupancy hovers steadily around 40-60%.',
    badgeColor: '#10b981',
    producerCount: 3,
    consumerCount: 3,
    producerSpeedMs: 1800,
    consumerSpeedMs: 1800,
    capacity: 60
  },
  {
    id: 'SCENARIO_2',
    name: 'Scenario 2: Production Rate > Consumption Rate',
    statusText: 'Overstock Condition',
    description: 'High supplier output floods the warehouse while consumer dispatch lags behind, pushing buffer toward capacity.',
    badgeColor: '#f59e0b',
    producerCount: 5,
    consumerCount: 2,
    producerSpeedMs: 900,
    consumerSpeedMs: 3200,
    capacity: 60
  },
  {
    id: 'SCENARIO_3',
    name: 'Scenario 3: Production Rate < Consumption Rate',
    statusText: 'Shortage Condition',
    description: 'Aggressive consumption rapidly drains inventory while supply replenishment struggles to keep pace.',
    badgeColor: '#ef4444',
    producerCount: 2,
    consumerCount: 5,
    producerSpeedMs: 3400,
    consumerSpeedMs: 900,
    capacity: 60
  },
  {
    id: 'SCENARIO_4',
    name: 'Scenario 4: Warehouse Full',
    statusText: 'Producer Blocked',
    description: 'Storage buffer fills to 100% capacity. Empty Semaphore drops to 0, forcing all Producers into BLOCKED state.',
    badgeColor: '#dc2626',
    producerCount: 6,
    consumerCount: 0,
    producerSpeedMs: 700,
    consumerSpeedMs: 5000,
    capacity: 50
  },
  {
    id: 'SCENARIO_5',
    name: 'Scenario 5: Warehouse Empty',
    statusText: 'Consumer Blocked',
    description: 'Storage inventory is completely depleted. Full Semaphore drops to 0, forcing all Consumers into BLOCKED state.',
    badgeColor: '#6366f1',
    producerCount: 0,
    consumerCount: 6,
    producerSpeedMs: 5000,
    consumerSpeedMs: 700,
    capacity: 50
  },
  {
    id: 'SCENARIO_6',
    name: 'Scenario 6: Emergency Orders',
    statusText: 'Priority Consumption',
    description: 'Critical hospital and medical supply requisitions inject urgent priority consumers that preempt standard queues.',
    badgeColor: '#ec4899',
    producerCount: 3,
    consumerCount: 4,
    producerSpeedMs: 1600,
    consumerSpeedMs: 1200,
    capacity: 60,
    emergencyMode: true
  },
  {
    id: 'SCENARIO_7',
    name: 'Scenario 7: High Demand Festival Season',
    statusText: 'Rapid Consumption',
    description: 'Holiday surge with intense burst consumer dispatches, testing bounded buffer replenishment resilience.',
    badgeColor: '#a855f7',
    producerCount: 4,
    consumerCount: 7,
    producerSpeedMs: 1400,
    consumerSpeedMs: 800,
    capacity: 80
  }
];

export function generateRandomProduct(counter = 1, categoryId = null) {
  const cat = categoryId
    ? PRODUCT_CATEGORIES.find(c => c.id === categoryId) || PRODUCT_CATEGORIES[0]
    : PRODUCT_CATEGORIES[Math.floor(Math.random() * PRODUCT_CATEGORIES.length)];

  const randomItemName = cat.sampleItems[Math.floor(Math.random() * cat.sampleItems.length)];
  const serial = String(counter).padStart(4, '0');
  const productId = `${cat.code}-${serial}`;
  const batchId = 'BAT-' + Math.floor(100 + Math.random() * 900);
  const quantity = Math.floor(Math.random() * 8) + 1; // 1 to 8 units

  const now = new Date();
  const entryTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return {
    productId,
    id: productId, // alias
    productName: randomItemName,
    name: randomItemName, // alias
    category: cat.id,
    categoryName: cat.name,
    code: cat.code,
    icon: cat.icon,
    color: cat.color,
    bgColor: cat.bgColor,
    quantity,
    entryTime,
    exitTime: null,
    trackingStatus: 'STORED_IN_RACK', // 'IN_TRANSIT_INBOUND', 'STORED_IN_RACK', 'DISPATCHED_TO_CONSUMER'
    slotIndex: null,
    batchId,
    timestamp: Date.now(),
    producedBy: null,
    consumedBy: null
  };
}
