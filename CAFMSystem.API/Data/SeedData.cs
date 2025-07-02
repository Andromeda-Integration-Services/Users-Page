using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using CAFMSystem.API.Models;

namespace CAFMSystem.API.Data
{
    public static class SeedData
    {
        public static async Task Initialize(IServiceProvider serviceProvider,
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager)
        {
            // Create roles - Department-specific roles for one-to-one mapping
            string[] roleNames = {
                "Admin", "Manager", "Engineer",
                "Plumber", "Electrician", "Cleaner", "HVACTechnician", "SecurityPersonnel", "ITSupport",
                "EndUser"
            };
            
            foreach (var roleName in roleNames)
            {
                var roleExist = await roleManager.RoleExistsAsync(roleName);
                if (!roleExist)
                {
                    await roleManager.CreateAsync(new IdentityRole(roleName));
                }
            }

            // Create Admin user
            var adminUser = await userManager.FindByEmailAsync("admin@cafm.com");
            if (adminUser == null)
            {
                adminUser = new ApplicationUser
                {
                    UserName = "admin@cafm.com",
                    Email = "admin@cafm.com",
                    FirstName = "System",
                    LastName = "Administrator",
                    Department = "IT",
                    EmployeeId = "ADMIN001",
                    EmailConfirmed = true,
                    IsActive = true
                };

                var result = await userManager.CreateAsync(adminUser, "Admin123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                }
            }

            // Create Manager user
            var manager = await userManager.FindByEmailAsync("manager@cafm.com");
            if (manager == null)
            {
                manager = new ApplicationUser
                {
                    UserName = "manager@cafm.com",
                    Email = "manager@cafm.com",
                    FirstName = "Facility",
                    LastName = "Manager",
                    Department = "Facilities",
                    EmployeeId = "MGR001",
                    EmailConfirmed = true,
                    IsActive = true
                };

                var result = await userManager.CreateAsync(manager, "Manager123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(manager, "Manager");
                }
            }

            // Create Plumber user
            var plumber = await userManager.FindByEmailAsync("plumber@cafm.com");
            if (plumber == null)
            {
                plumber = new ApplicationUser
                {
                    UserName = "plumber@cafm.com",
                    Email = "plumber@cafm.com",
                    FirstName = "John",
                    LastName = "Plumber",
                    Department = "Plumbing",
                    EmployeeId = "PLB001",
                    EmailConfirmed = true,
                    IsActive = true
                };

                var result = await userManager.CreateAsync(plumber, "Plumber123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(plumber, "Plumber");
                }
            }

            // Create Electrician user
            var electrician = await userManager.FindByEmailAsync("electrician@cafm.com");
            if (electrician == null)
            {
                electrician = new ApplicationUser
                {
                    UserName = "electrician@cafm.com",
                    Email = "electrician@cafm.com",
                    FirstName = "Mike",
                    LastName = "Electrician",
                    Department = "Electrical",
                    EmployeeId = "ELC001",
                    EmailConfirmed = true,
                    IsActive = true
                };

                var result = await userManager.CreateAsync(electrician, "Electric123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(electrician, "Electrician");
                }
            }

            // Create End User
            var endUser = await userManager.FindByEmailAsync("user@cafm.com");
            if (endUser == null)
            {
                endUser = new ApplicationUser
                {
                    UserName = "user@cafm.com",
                    Email = "user@cafm.com",
                    FirstName = "Regular",
                    LastName = "User",
                    Department = "General",
                    EmployeeId = "USR001",
                    EmailConfirmed = true,
                    IsActive = true
                };

                var result = await userManager.CreateAsync(endUser, "User123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(endUser, "EndUser");
                }
            }

            // Create Cleaner user
            var cleaner = await userManager.FindByEmailAsync("cleaner@cafm.com");
            if (cleaner == null)
            {
                cleaner = new ApplicationUser
                {
                    UserName = "cleaner@cafm.com",
                    Email = "cleaner@cafm.com",
                    FirstName = "Sarah",
                    LastName = "Cleaner",
                    Department = "Cleaning",
                    EmployeeId = "CLN001",
                    EmailConfirmed = true,
                    IsActive = true
                };

                var result = await userManager.CreateAsync(cleaner, "Cleaner123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(cleaner, "Cleaner");
                }
            }

            // Create Engineer user
            var engineer = await userManager.FindByEmailAsync("engineer@cafm.com");
            if (engineer == null)
            {
                engineer = new ApplicationUser
                {
                    UserName = "engineer@cafm.com",
                    Email = "engineer@cafm.com",
                    FirstName = "Mike",
                    LastName = "Engineer",
                    Department = "Maintenance",
                    EmployeeId = "ENG001",
                    EmailConfirmed = true,
                    IsActive = true
                };

                var result = await userManager.CreateAsync(engineer, "Engineer123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(engineer, "Engineer");
                }
            }

            // Create HVAC Technician user
            var hvacTech = await userManager.FindByEmailAsync("hvac@cafm.com");
            if (hvacTech == null)
            {
                hvacTech = new ApplicationUser
                {
                    UserName = "hvac@cafm.com",
                    Email = "hvac@cafm.com",
                    FirstName = "Tom",
                    LastName = "HVAC",
                    Department = "HVAC",
                    EmployeeId = "HVAC001",
                    EmailConfirmed = true,
                    IsActive = true
                };

                var result = await userManager.CreateAsync(hvacTech, "HVAC123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(hvacTech, "HVACTechnician");
                }
            }

            // Create Security Personnel user
            var security = await userManager.FindByEmailAsync("security@cafm.com");
            if (security == null)
            {
                security = new ApplicationUser
                {
                    UserName = "security@cafm.com",
                    Email = "security@cafm.com",
                    FirstName = "Bob",
                    LastName = "Security",
                    Department = "Security",
                    EmployeeId = "SEC001",
                    EmailConfirmed = true,
                    IsActive = true
                };

                var result = await userManager.CreateAsync(security, "Security123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(security, "SecurityPersonnel");
                }
            }

            // Create IT Support user
            var itSupport = await userManager.FindByEmailAsync("it@cafm.com");
            if (itSupport == null)
            {
                itSupport = new ApplicationUser
                {
                    UserName = "it@cafm.com",
                    Email = "it@cafm.com",
                    FirstName = "Alice",
                    LastName = "IT",
                    Department = "IT",
                    EmployeeId = "IT001",
                    EmailConfirmed = true,
                    IsActive = true
                };

                var result = await userManager.CreateAsync(itSupport, "IT123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(itSupport, "ITSupport");
                }
            }

            // Seed sample tickets
            await SeedSampleTickets(serviceProvider, userManager);
        }

        private static async Task SeedSampleTickets(IServiceProvider serviceProvider, UserManager<ApplicationUser> userManager)
        {
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            // Check if tickets already exist
            if (await context.Tickets.AnyAsync())
            {
                return; // Tickets already seeded
            }

            // Get users for ticket assignment
            var adminUser = await userManager.FindByEmailAsync("admin@cafm.com");
            var managerUser = await userManager.FindByEmailAsync("manager@cafm.com");
            var plumberUser = await userManager.FindByEmailAsync("plumber@cafm.com");
            var electricianUser = await userManager.FindByEmailAsync("electrician@cafm.com");
            var cleanerUser = await userManager.FindByEmailAsync("cleaner@cafm.com");
            var endUser = await userManager.FindByEmailAsync("user@cafm.com");

            if (adminUser == null || managerUser == null || plumberUser == null ||
                electricianUser == null || cleanerUser == null || endUser == null)
            {
                return; // Users not found, skip ticket seeding
            }

            var sampleTickets = new List<Ticket>
            {
                // Plumbing Tickets
                new Ticket
                {
                    Title = "(Service Request) Water leak in main lobby restroom",
                    Description = "Water is leaking from the ceiling in the main lobby men's restroom. The leak appears to be coming from the pipe above the sink area. Water is pooling on the floor creating a slip hazard.",
                    Status = TicketStatus.InProgress,
                    Priority = TicketPriority.Critical,
                    Category = TicketCategory.Plumbing,
                    Type = TicketType.Service,
                    Location = "Main Lobby - Men's Restroom",
                    CreatedAt = DateTime.UtcNow.AddHours(-2),
                    UpdatedAt = DateTime.UtcNow.AddHours(-1),
                    CreatedById = endUser.Id,
                    AssignedToId = plumberUser.Id
                },
                new Ticket
                {
                    Title = "(Service Request) Clogged drain in kitchen sink",
                    Description = "The kitchen sink in the employee break room is completely clogged. Water is backing up and not draining at all. Staff cannot wash dishes or prepare food properly.",
                    Status = TicketStatus.InProgress,
                    Priority = TicketPriority.High,
                    Category = TicketCategory.Plumbing,
                    Type = TicketType.Service,
                    Location = "Employee Break Room - Kitchen",
                    CreatedAt = DateTime.UtcNow.AddHours(-6),
                    UpdatedAt = DateTime.UtcNow.AddHours(-4),
                    CreatedById = managerUser.Id,
                    AssignedToId = plumberUser.Id
                },
                new Ticket
                {
                    Title = "(Service Request) Low water pressure in 3rd floor bathrooms",
                    Description = "Multiple users have reported very low water pressure in all bathrooms on the 3rd floor. Both hot and cold water are affected. The issue started yesterday morning.",
                    Status = TicketStatus.Open,
                    Priority = TicketPriority.Medium,
                    Category = TicketCategory.Plumbing,
                    Type = TicketType.Service,
                    Location = "3rd Floor - All Bathrooms",
                    CreatedAt = DateTime.UtcNow.AddDays(-1),
                    CreatedById = endUser.Id,
                    AssignedToId = plumberUser.Id
                },

                // Electrical Tickets
                new Ticket
                {
                    Title = "(Service Request) Power outage in conference room B",
                    Description = "Complete power outage in conference room B. No lights, no outlets working. Important client meeting scheduled for tomorrow morning.",
                    Status = TicketStatus.Open,
                    Priority = TicketPriority.Critical,
                    Category = TicketCategory.Electrical,
                    Type = TicketType.Service,
                    Location = "Conference Room B",
                    CreatedAt = DateTime.UtcNow.AddHours(-1),
                    CreatedById = managerUser.Id,
                    AssignedToId = electricianUser.Id
                },
                new Ticket
                {
                    Title = "(Material Request) Flickering lights in hallway corridor",
                    Description = "The fluorescent lights in the main hallway corridor are flickering constantly. It's causing eye strain for employees walking through the area. Need replacement fluorescent bulbs.",
                    Status = TicketStatus.Open,
                    Priority = TicketPriority.Medium,
                    Category = TicketCategory.Electrical,
                    Type = TicketType.Material,
                    Location = "Main Hallway Corridor",
                    CreatedAt = DateTime.UtcNow.AddHours(-4),
                    CreatedById = endUser.Id,
                    AssignedToId = electricianUser.Id
                },

                // HVAC Tickets
                new Ticket
                {
                    Title = "(Service Request) Air conditioning not cooling in open office",
                    Description = "The air conditioning system in the main open office area is running but not cooling effectively. Temperature is consistently 78°F despite thermostat set to 72°F.",
                    Status = TicketStatus.InProgress,
                    Priority = TicketPriority.High,
                    Category = TicketCategory.HVAC,
                    Type = TicketType.Service,
                    Location = "Main Open Office Area",
                    CreatedAt = DateTime.UtcNow.AddDays(-2),
                    UpdatedAt = DateTime.UtcNow.AddDays(-1),
                    CreatedById = managerUser.Id
                },
                new Ticket
                {
                    Title = "(Service Request) Heating system not working in north wing",
                    Description = "The heating system in the north wing is completely non-functional. Employees are complaining about cold temperatures.",
                    Status = TicketStatus.Open,
                    Priority = TicketPriority.High,
                    Category = TicketCategory.HVAC,
                    Type = TicketType.Service,
                    Location = "North Wing - All Offices",
                    CreatedAt = DateTime.UtcNow.AddHours(-8),
                    CreatedById = endUser.Id
                },

                // Cleaning Tickets
                new Ticket
                {
                    Title = "(Service Request) Carpet stain removal needed in reception",
                    Description = "Large coffee stain on the carpet in the main reception area. The stain is very visible and needs professional cleaning.",
                    Status = TicketStatus.Open,
                    Priority = TicketPriority.Medium,
                    Category = TicketCategory.Cleaning,
                    Type = TicketType.Service,
                    Location = "Main Reception Area",
                    CreatedAt = DateTime.UtcNow.AddHours(-3),
                    CreatedById = endUser.Id,
                    AssignedToId = cleanerUser.Id
                },
                new Ticket
                {
                    Title = "(Material Request) Restroom supplies need restocking",
                    Description = "All restrooms on the 2nd floor are out of paper towels and toilet paper. Hand soap dispensers are also empty.",
                    Status = TicketStatus.Resolved,
                    Priority = TicketPriority.Low,
                    Category = TicketCategory.Cleaning,
                    Type = TicketType.Material,
                    Location = "2nd Floor - All Restrooms",
                    CreatedAt = DateTime.UtcNow.AddDays(-1),
                    UpdatedAt = DateTime.UtcNow.AddHours(-2),
                    CompletedAt = DateTime.UtcNow.AddHours(-2),
                    CreatedById = endUser.Id,
                    AssignedToId = cleanerUser.Id
                }
            };

            context.Tickets.AddRange(sampleTickets);
            await context.SaveChangesAsync();
        }
    }
}
