export interface TicketSuggestion {
  id: string;
  text: string;
  category: string;
}

export const ticketSuggestions: TicketSuggestion[] = [
  // Electrical Issues
  { id: 'elec_001', text: 'Power outage in office area', category: 'Electrical' },
  { id: 'elec_002', text: 'Electrical socket not working', category: 'Electrical' },
  { id: 'elec_003', text: 'Light bulb replacement needed', category: 'Electrical' },
  { id: 'elec_004', text: 'Flickering lights in hallway', category: 'Electrical' },
  { id: 'elec_005', text: 'Circuit breaker keeps tripping', category: 'Electrical' },
  { id: 'elec_006', text: 'Emergency lighting not working', category: 'Electrical' },
  { id: 'elec_007', text: 'Power fluctuation issues', category: 'Electrical' },
  { id: 'elec_008', text: 'Electrical panel inspection needed', category: 'Electrical' },
  { id: 'elec_009', text: 'UPS battery replacement', category: 'Electrical' },
  { id: 'elec_010', text: 'Generator maintenance required', category: 'Electrical' },

  // Plumbing Issues
  { id: 'plumb_001', text: 'Water leak from ceiling', category: 'Plumbing' },
  { id: 'plumb_002', text: 'Water leakage under sink', category: 'Plumbing' },
  { id: 'plumb_003', text: 'Water leak detector alarm', category: 'Plumbing' },
  { id: 'plumb_004', text: 'Toilet not flushing properly', category: 'Plumbing' },
  { id: 'plumb_005', text: 'Faucet dripping continuously', category: 'Plumbing' },
  { id: 'plumb_006', text: 'Low water pressure in restroom', category: 'Plumbing' },
  { id: 'plumb_007', text: 'Blocked drain in kitchen', category: 'Plumbing' },
  { id: 'plumb_008', text: 'Hot water not available', category: 'Plumbing' },
  { id: 'plumb_009', text: 'Pipe burst in basement', category: 'Plumbing' },
  { id: 'plumb_010', text: 'Water heater malfunction', category: 'Plumbing' },
  { id: 'plumb_011', text: 'Sewage backup in restroom', category: 'Plumbing' },
  { id: 'plumb_012', text: 'Water meter reading abnormal', category: 'Plumbing' },

  // HVAC Issues
  { id: 'hvac_001', text: 'Air conditioning not cooling', category: 'HVAC' },
  { id: 'hvac_002', text: 'Heating system not working', category: 'HVAC' },
  { id: 'hvac_003', text: 'Strange noise from AC unit', category: 'HVAC' },
  { id: 'hvac_004', text: 'Air filter replacement needed', category: 'HVAC' },
  { id: 'hvac_005', text: 'Temperature control not responding', category: 'HVAC' },
  { id: 'hvac_006', text: 'Poor air circulation in office', category: 'HVAC' },
  { id: 'hvac_007', text: 'Ventilation fan not working', category: 'HVAC' },
  { id: 'hvac_008', text: 'Thermostat calibration needed', category: 'HVAC' },
  { id: 'hvac_009', text: 'Ductwork cleaning required', category: 'HVAC' },
  { id: 'hvac_010', text: 'Refrigerant leak suspected', category: 'HVAC' },

  // Cleaning Issues
  { id: 'clean_001', text: 'Restroom cleaning required', category: 'Cleaning' },
  { id: 'clean_002', text: 'Carpet cleaning needed', category: 'Cleaning' },
  { id: 'clean_003', text: 'Window cleaning service', category: 'Cleaning' },
  { id: 'clean_004', text: 'Floor mopping and sanitization', category: 'Cleaning' },
  { id: 'clean_005', text: 'Trash removal from office', category: 'Cleaning' },
  { id: 'clean_006', text: 'Deep cleaning of conference room', category: 'Cleaning' },
  { id: 'clean_007', text: 'Sanitization of common areas', category: 'Cleaning' },
  { id: 'clean_008', text: 'Cleaning supplies restocking', category: 'Cleaning' },
  { id: 'clean_009', text: 'Graffiti removal needed', category: 'Cleaning' },
  { id: 'clean_010', text: 'Pressure washing of exterior', category: 'Cleaning' },

  // Security Issues
  { id: 'sec_001', text: 'Security camera not working', category: 'Security' },
  { id: 'sec_002', text: 'Access card reader malfunction', category: 'Security' },
  { id: 'sec_003', text: 'Door lock mechanism broken', category: 'Security' },
  { id: 'sec_004', text: 'Alarm system false triggering', category: 'Security' },
  { id: 'sec_005', text: 'Emergency exit door stuck', category: 'Security' },
  { id: 'sec_006', text: 'Security patrol request', category: 'Security' },
  { id: 'sec_007', text: 'Visitor management system down', category: 'Security' },
  { id: 'sec_008', text: 'Perimeter fence damage', category: 'Security' },
  { id: 'sec_009', text: 'Fire alarm system check', category: 'Security' },
  { id: 'sec_010', text: 'Security lighting replacement', category: 'Security' },

  // General Maintenance
  { id: 'maint_001', text: 'Furniture repair needed', category: 'Maintenance' },
  { id: 'maint_002', text: 'Paint touch-up required', category: 'Maintenance' },
  { id: 'maint_003', text: 'Ceiling tile replacement', category: 'Maintenance' },
  { id: 'maint_004', text: 'Door handle loose or broken', category: 'Maintenance' },
  { id: 'maint_005', text: 'Window blind repair', category: 'Maintenance' },
  { id: 'maint_006', text: 'Floor tile cracked or missing', category: 'Maintenance' },
  { id: 'maint_007', text: 'Wall damage repair needed', category: 'Maintenance' },
  { id: 'maint_008', text: 'Elevator maintenance required', category: 'Maintenance' },
  { id: 'maint_009', text: 'Stairway handrail loose', category: 'Maintenance' },
  { id: 'maint_010', text: 'Parking lot pothole repair', category: 'Maintenance' },

  // IT Issues
  { id: 'it_001', text: 'Network connectivity issues', category: 'IT' },
  { id: 'it_002', text: 'Printer not working properly', category: 'IT' },
  { id: 'it_003', text: 'Computer hardware malfunction', category: 'IT' },
  { id: 'it_004', text: 'Software installation request', category: 'IT' },
  { id: 'it_005', text: 'Phone system not working', category: 'IT' },
  { id: 'it_006', text: 'Projector setup assistance', category: 'IT' },
  { id: 'it_007', text: 'WiFi signal weak or absent', category: 'IT' },
  { id: 'it_008', text: 'Server room temperature alert', category: 'IT' },
  { id: 'it_009', text: 'Backup system failure', category: 'IT' },
  { id: 'it_010', text: 'Audio visual equipment repair', category: 'IT' },

  // Emergency Issues
  { id: 'emerg_001', text: 'Fire safety equipment check', category: 'Security' },
  { id: 'emerg_002', text: 'Emergency evacuation drill', category: 'Security' },
  { id: 'emerg_003', text: 'First aid kit restocking', category: 'Maintenance' },
  { id: 'emerg_004', text: 'Emergency lighting test', category: 'Electrical' },
  { id: 'emerg_005', text: 'Spill cleanup required', category: 'Cleaning' },

  // Landscaping & Exterior
  { id: 'land_001', text: 'Lawn mowing and trimming', category: 'Maintenance' },
  { id: 'land_002', text: 'Tree pruning required', category: 'Maintenance' },
  { id: 'land_003', text: 'Irrigation system repair', category: 'Plumbing' },
  { id: 'land_004', text: 'Outdoor lighting maintenance', category: 'Electrical' },
  { id: 'land_005', text: 'Parking lot line painting', category: 'Maintenance' },

  // Office Equipment
  { id: 'office_001', text: 'Copier machine jam or error', category: 'IT' },
  { id: 'office_002', text: 'Conference room equipment setup', category: 'IT' },
  { id: 'office_003', text: 'Office chair repair', category: 'Maintenance' },
  { id: 'office_004', text: 'Desk lamp not working', category: 'Electrical' },
  { id: 'office_005', text: 'Whiteboard cleaning needed', category: 'Cleaning' }
];

// Helper function to search suggestions
export const searchSuggestions = (query: string): TicketSuggestion[] => {
  if (!query || query.length < 2) return [];
  
  const lowercaseQuery = query.toLowerCase();
  return ticketSuggestions.filter(suggestion =>
    suggestion.text.toLowerCase().includes(lowercaseQuery) ||
    suggestion.category.toLowerCase().includes(lowercaseQuery)
  );
};

// Helper function to get suggestions by category
export const getSuggestionsByCategory = (category: string): TicketSuggestion[] => {
  return ticketSuggestions.filter(suggestion =>
    suggestion.category.toLowerCase() === category.toLowerCase()
  );
};

// Get all unique categories
export const getCategories = (): string[] => {
  const categories = [...new Set(ticketSuggestions.map(s => s.category))];
  return categories.sort();
};
