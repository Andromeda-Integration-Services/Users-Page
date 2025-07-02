# CAFM System - Role-Based Ticket Filtering Fix

## Problem Identified
The main issue was that **tickets were always being created with `TicketCategory.General`** instead of using the category detected by the frontend service detection.

## Root Cause Analysis
1. **Frontend was detecting categories correctly** - The service detection was working and showing "Predicted Category: Electrical" 
2. **Frontend was NOT sending the category to backend** - The `ticketData` object in CreateTicketForm.tsx was missing the `category` field
3. **Backend was ignoring detection** - The CreateTicket method was hardcoded to use `TicketCategory.General`

## Fix Implementation

### 1. Updated Backend (CAFMSystem.API)

#### A. Enhanced CreateTicketDto
```csharp
public class CreateTicketDto
{
    // ... existing fields ...
    public int? Category { get; set; } // Optional - will be auto-detected if not provided
}
```

#### B. Enhanced Ticket Creation Logic
```csharp
// Determine ticket category - use provided category or auto-detect
TicketCategory ticketCategory = TicketCategory.General; // Default

if (createTicketDto.Category.HasValue)
{
    // Use category provided by frontend
    ticketCategory = (TicketCategory)createTicketDto.Category.Value;
    _logger.LogInformation("Using provided category: {Category}", ticketCategory);
}
else
{
    // Auto-detect category using service detection
    var detectionText = $"{createTicketDto.Title} {createTicketDto.Description}";
    var detectionResults = await _serviceDetectionService.AnalyzeServiceRequestAsync(detectionText);
    
    if (detectionResults.Any())
    {
        var bestMatch = detectionResults.First();
        ticketCategory = bestMatch.Category;
        _logger.LogInformation("Auto-detected category: {Category} with confidence: {Confidence}%", 
            ticketCategory, bestMatch.Confidence);
    }
}

var ticket = new Ticket
{
    // ... other fields ...
    Category = ticketCategory, // Use detected or provided category
};
```

### 2. Updated Frontend (cafm-system-frontend)

#### A. Enhanced CreateTicketRequest Interface
```typescript
export interface CreateTicketRequest {
  // ... existing fields ...
  category?: number; // Optional - will be auto-detected if not provided
}
```

#### B. Enhanced Category Detection and Sending
```typescript
// Helper function to convert category text to category ID
const getCategoryIdFromText = (categoryText: string): number => {
  const categoryMap: Record<string, number> = {
    'General': 1,
    'Maintenance': 2,
    'Plumbing': 3,
    'Electrical': 4,
    'Cleaning': 5,
    'HVAC': 6,
    'Security': 7,
    'IT': 8,
    // ... more categories
  };
  
  return categoryMap[categoryText] || 1; // Default to General if not found
};

// In ticket creation:
// Convert predicted category to category ID
let categoryId: number | undefined = undefined;
if (predictedCategory) {
  categoryId = getCategoryIdFromText(predictedCategory);
}

const ticketData = {
  // ... other fields ...
  category: categoryId, // Include detected category
};
```

## Expected Behavior After Fix

### Before Fix:
1. User types "electrical outlet not working"
2. Frontend shows "Predicted Category: Electrical" ✅
3. Frontend sends ticket data WITHOUT category field ❌
4. Backend creates ticket with `TicketCategory.General` ❌
5. Plumber role cannot see the ticket because it's not in Plumbing category ❌

### After Fix:
1. User types "electrical outlet not working"
2. Frontend shows "Predicted Category: Electrical" ✅
3. Frontend converts "Electrical" to category ID 4 and includes it ✅
4. Backend receives category ID 4 and creates ticket with `TicketCategory.Electrical` ✅
5. Electrician role can see the ticket because it matches their allowed category ✅

## Role-Based Access Control

The existing role mapping is working correctly:
- **Plumber** role → can see `TicketCategory.Plumbing` tickets
- **Electrician** role → can see `TicketCategory.Electrical` tickets  
- **Cleaner** role → can see `TicketCategory.Cleaning` tickets
- **Admin/Manager** roles → can see ALL tickets

## Testing the Fix

1. **Create an electrical ticket:**
   - Type: "electrical outlet not working in room 101"
   - Expected: Category should be detected as "Electrical" and ticket created with `TicketCategory.Electrical`

2. **Login as Electrician:**
   - Should see the electrical ticket in their list

3. **Login as Plumber:**
   - Should NOT see the electrical ticket (only plumbing tickets)

4. **Login as Admin:**
   - Should see ALL tickets including the electrical one

## Additional Improvements Made

1. **Enhanced Logging:** Added detailed logging to track category detection and assignment
2. **Fallback Logic:** If frontend doesn't send category, backend auto-detects using ServiceDetectionService
3. **Type Safety:** Added proper TypeScript interfaces for category field
4. **Backward Compatibility:** Made category field optional to maintain compatibility

## Files Modified

### Backend:
- `CAFMSystem.API/DTOs/AuthDTOs.cs` - Added Category field to CreateTicketDto
- `CAFMSystem.API/Controllers/TicketsController.cs` - Enhanced ticket creation logic

### Frontend:
- `cafm-system-frontend/src/api/ticketService.ts` - Added category to CreateTicketRequest
- `cafm-system-frontend/src/components/tickets/CreateTicketForm.tsx` - Added category detection and sending logic

This fix ensures that the role-based ticket filtering works correctly by making sure tickets are created with the proper category that matches the user's role permissions.
