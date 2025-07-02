# 🔄 **NEW ROLE STRUCTURE - ONE-TO-ONE DEPARTMENT MAPPING**

## **📋 OVERVIEW**

The CAFM system has been restructured to implement **one-to-one mapping** between departments and ticket categories, eliminating the previous overlap where multiple roles could see "Maintenance" tickets.

---

## **🎯 NEW ROLE → CATEGORY MAPPING**

| **Role** | **Department** | **Ticket Categories** | **Description** |
|----------|----------------|----------------------|-----------------|
| `Admin` | Administration | **ALL** | Full system access |
| `Manager` | Facilities | **ALL** | Management oversight |
| `Engineer` | Maintenance | Maintenance + Safety | Technical/Engineering tickets |
| `Plumber` | **Plumbing** | **Plumbing ONLY** | Plumbing-specific tickets |
| `Electrician` | **Electrical** | **Electrical ONLY** | Electrical-specific tickets |
| `Cleaner` | Cleaning | **Cleaning ONLY** | Cleaning-specific tickets |
| `HVACTechnician` | **HVAC** | **HVAC ONLY** | HVAC-specific tickets |
| `SecurityPersonnel` | Security | **Security ONLY** | Security-specific tickets |
| `ITSupport` | IT | **IT ONLY** | IT-specific tickets |
| `EndUser` | General/Finance/HR | **Own tickets only** | Limited access |

---

## **🔧 KEY CHANGES IMPLEMENTED**

### **1. Department-Role Auto-Assignment**
- **Registration now automatically assigns roles** based on department selection
- **No manual role selection** required during registration
- **Consistent mapping** ensures proper ticket routing

### **2. Eliminated Cross-Category Access**
- **REMOVED**: Plumbers seeing HVAC/Maintenance tickets
- **REMOVED**: Electricians seeing Maintenance tickets  
- **REMOVED**: Cleaners seeing Maintenance tickets
- **RESULT**: Clear departmental boundaries

### **3. New Service Classes**
- **`DepartmentRoleMappingService`**: Handles department-to-role mapping
- **Updated `TicketAccessService`**: Implements one-to-one category access
- **Enhanced `AuthService`**: Auto-assigns roles during registration

### **4. Updated Frontend**
- **Registration form** shows role assignments for each department
- **Visibility messages** reflect new one-to-one mapping
- **Navigation** updated for new role structure

---

## **👥 SAMPLE USERS (Updated)**

| **Email** | **Password** | **Role** | **Department** | **Can See** |
|-----------|--------------|----------|----------------|-------------|
| `admin@cafm.com` | `Admin123!` | Admin | Administration | ALL tickets |
| `manager@cafm.com` | `Manager123!` | Manager | Facilities | ALL tickets |
| `engineer@cafm.com` | `Engineer123!` | Engineer | Maintenance | Maintenance + Safety |
| `plumber@cafm.com` | `Plumber123!` | Plumber | **Plumbing** | Plumbing only |
| `electrician@cafm.com` | `Electric123!` | Electrician | **Electrical** | Electrical only |
| `cleaner@cafm.com` | `Cleaner123!` | Cleaner | Cleaning | Cleaning only |
| `hvac@cafm.com` | `HVAC123!` | HVACTechnician | HVAC | HVAC only |
| `security@cafm.com` | `Security123!` | SecurityPersonnel | Security | Security only |
| `it@cafm.com` | `IT123!` | ITSupport | IT | IT only |
| `user@cafm.com` | `User123!` | EndUser | General | Own tickets only |

---

## **🎯 BENEFITS**

### **✅ Clear Responsibility**
- Each ticket type has **one responsible department**
- **No confusion** about who should handle what
- **Improved accountability** and tracking

### **✅ Better Deliverability**
- **Direct routing** to appropriate department
- **No overlap** or missed tickets
- **Faster response times**

### **✅ Simplified Management**
- **Easy to understand** role structure
- **Predictable access patterns**
- **Reduced training requirements**

### **✅ Scalable Structure**
- **Easy to add new departments/roles**
- **Consistent mapping logic**
- **Maintainable codebase**

---

## **🔄 MIGRATION NOTES**

### **Existing Users**
- **Existing users will keep their current roles** until manually updated
- **New registrations** will use the new department-role mapping
- **AssetManager role** is replaced by **Manager role**

### **Database Changes**
- **New roles added** to AspNetRoles table
- **Sample users created** for each new role
- **Existing data preserved** for backward compatibility

### **Frontend Updates**
- **Registration form** updated with role descriptions
- **Navigation** updated for new roles
- **Visibility messages** reflect new structure

---

## **🚀 TESTING THE NEW STRUCTURE**

1. **Register a new user** with different departments
2. **Verify role auto-assignment** works correctly
3. **Login as different roles** and check ticket visibility
4. **Create tickets** in different categories
5. **Verify only appropriate roles** can see each ticket type

---

## **📝 NEXT STEPS**

1. **Test the new role structure** thoroughly
2. **Update documentation** as needed
3. **Train users** on new department boundaries
4. **Monitor ticket routing** for any issues
5. **Gather feedback** and adjust if necessary

---

**🎉 The new role structure provides clear departmental boundaries and eliminates ticket routing confusion!**
