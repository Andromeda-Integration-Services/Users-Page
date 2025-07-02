using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using CAFMSystem.API.Data;
using CAFMSystem.API.Models;
using CAFMSystem.API.DTOs;

namespace CAFMSystem.API.Services
{
    public class AdminUserService : IAdminUserService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<AdminUserService> _logger;

        public AdminUserService(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            ILogger<AdminUserService> logger)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
        }

        public async Task<IEnumerable<AdminUserDto>> GetAllUsersAsync(int pageNumber = 1, int pageSize = 10, string? searchTerm = null, string? department = null, string? role = null)
        {
            var query = _userManager.Users.AsQueryable();

            // Apply filters
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                query = query.Where(u => u.FirstName.Contains(searchTerm) ||
                                        u.LastName.Contains(searchTerm) ||
                                        u.Email.Contains(searchTerm) ||
                                        u.EmployeeId.Contains(searchTerm));
            }

            if (!string.IsNullOrWhiteSpace(department))
            {
                query = query.Where(u => u.Department == department);
            }

            var users = await query
                .OrderBy(u => u.FirstName)
                .ThenBy(u => u.LastName)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var adminUserDtos = new List<AdminUserDto>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                
                // Skip if role filter is specified and user doesn't have that role
                if (!string.IsNullOrWhiteSpace(role) && !roles.Contains(role))
                    continue;

                // Get user statistics
                var ticketsCreated = await _context.Tickets.CountAsync(t => t.CreatedById == user.Id);
                var ticketsAssigned = await _context.Tickets.CountAsync(t => t.AssignedToId == user.Id);
                var ticketsCompleted = await _context.Tickets.CountAsync(t => t.AssignedToId == user.Id && t.Status == TicketStatus.Resolved);
                var unreadMessages = await _context.AdminMessages.CountAsync(m => m.ToUserId == user.Id && !m.IsRead && !m.IsDeleted);
                var lastActivity = await _context.UserActivities
                    .Where(a => a.UserId == user.Id)
                    .OrderByDescending(a => a.Timestamp)
                    .Select(a => a.Timestamp)
                    .FirstOrDefaultAsync();

                adminUserDtos.Add(new AdminUserDto
                {
                    Id = user.Id,
                    Email = user.Email!,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    FullName = user.FullName,
                    Department = user.Department,
                    EmployeeId = user.EmployeeId,
                    Roles = roles.ToList(),
                    CreatedAt = user.CreatedAt,
                    LastLoginAt = user.LastLoginAt,
                    IsActive = user.IsActive,
                    TotalTicketsCreated = ticketsCreated,
                    TotalTicketsAssigned = ticketsAssigned,
                    TotalTicketsCompleted = ticketsCompleted,
                    UnreadMessages = unreadMessages,
                    LastActivityAt = lastActivity
                });
            }

            return adminUserDtos;
        }

        public async Task<AdminUserDto?> GetUserByIdAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return null;

            var roles = await _userManager.GetRolesAsync(user);
            
            // Get detailed statistics
            var ticketsCreated = await _context.Tickets.CountAsync(t => t.CreatedById == user.Id);
            var ticketsAssigned = await _context.Tickets.CountAsync(t => t.AssignedToId == user.Id);
            var ticketsCompleted = await _context.Tickets.CountAsync(t => t.AssignedToId == user.Id && t.Status == TicketStatus.Resolved);
            var unreadMessages = await _context.AdminMessages.CountAsync(m => m.ToUserId == user.Id && !m.IsRead && !m.IsDeleted);
            var lastActivity = await _context.UserActivities
                .Where(a => a.UserId == user.Id)
                .OrderByDescending(a => a.Timestamp)
                .Select(a => a.Timestamp)
                .FirstOrDefaultAsync();

            return new AdminUserDto
            {
                Id = user.Id,
                Email = user.Email!,
                FirstName = user.FirstName,
                LastName = user.LastName,
                FullName = user.FullName,
                Department = user.Department,
                EmployeeId = user.EmployeeId,
                Roles = roles.ToList(),
                CreatedAt = user.CreatedAt,
                LastLoginAt = user.LastLoginAt,
                IsActive = user.IsActive,
                TotalTicketsCreated = ticketsCreated,
                TotalTicketsAssigned = ticketsAssigned,
                TotalTicketsCompleted = ticketsCompleted,
                UnreadMessages = unreadMessages,
                LastActivityAt = lastActivity
            };
        }

        public async Task<AdminUserDto> CreateUserAsync(CreateUserDto createUserDto)
        {
            var user = new ApplicationUser
            {
                UserName = createUserDto.Email,
                Email = createUserDto.Email,
                FirstName = createUserDto.FirstName,
                LastName = createUserDto.LastName,
                Department = createUserDto.Department,
                EmployeeId = createUserDto.EmployeeId,
                EmailConfirmed = true,
                IsActive = createUserDto.IsActive
            };

            var result = await _userManager.CreateAsync(user, createUserDto.Password);
            if (!result.Succeeded)
            {
                throw new InvalidOperationException($"Failed to create user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }

            // Assign roles
            if (createUserDto.Roles.Any())
            {
                await _userManager.AddToRolesAsync(user, createUserDto.Roles);
            }

            _logger.LogInformation("User {Email} created successfully by admin", createUserDto.Email);

            return await GetUserByIdAsync(user.Id) ?? throw new InvalidOperationException("Failed to retrieve created user");
        }

        public async Task<AdminUserDto> UpdateUserAsync(string userId, UpdateUserDto updateUserDto)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                throw new ArgumentException("User not found", nameof(userId));

            // Update user properties
            user.FirstName = updateUserDto.FirstName;
            user.LastName = updateUserDto.LastName;
            user.Department = updateUserDto.Department;
            user.EmployeeId = updateUserDto.EmployeeId;
            user.IsActive = updateUserDto.IsActive;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                throw new InvalidOperationException($"Failed to update user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }

            // Update roles
            var currentRoles = await _userManager.GetRolesAsync(user);
            var rolesToRemove = currentRoles.Except(updateUserDto.Roles).ToList();
            var rolesToAdd = updateUserDto.Roles.Except(currentRoles).ToList();

            if (rolesToRemove.Any())
            {
                await _userManager.RemoveFromRolesAsync(user, rolesToRemove);
            }

            if (rolesToAdd.Any())
            {
                await _userManager.AddToRolesAsync(user, rolesToAdd);
            }

            _logger.LogInformation("User {UserId} updated successfully by admin", userId);

            return await GetUserByIdAsync(userId) ?? throw new InvalidOperationException("Failed to retrieve updated user");
        }

        public async Task<bool> DeleteUserAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return false;

            // Soft delete by deactivating the user instead of hard delete
            user.IsActive = false;
            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                _logger.LogInformation("User {UserId} deactivated successfully by admin", userId);
                return true;
            }

            return false;
        }

        public async Task<bool> ToggleUserStatusAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return false;

            user.IsActive = !user.IsActive;
            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                _logger.LogInformation("User {UserId} status toggled to {Status} by admin", userId, user.IsActive ? "Active" : "Inactive");
                return true;
            }

            return false;
        }

        public async Task<IEnumerable<UserLoginHistoryDto>> GetUserLoginHistoryAsync(string userId, int pageNumber = 1, int pageSize = 20)
        {
            var loginHistory = await _context.UserLoginHistories
                .Where(h => h.UserId == userId)
                .OrderByDescending(h => h.LoginTime)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Include(h => h.User)
                .ToListAsync();

            return loginHistory.Select(h => new UserLoginHistoryDto
            {
                Id = h.Id,
                UserId = h.UserId,
                UserName = h.User.FullName,
                LoginTime = h.LoginTime,
                IpAddress = h.IpAddress,
                UserAgent = h.UserAgent,
                IsSuccessful = h.IsSuccessful
            });
        }

        public async Task<IEnumerable<UserActivityDto>> GetUserActivityAsync(string userId, int pageNumber = 1, int pageSize = 20)
        {
            var activities = await _context.UserActivities
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.Timestamp)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Include(a => a.User)
                .ToListAsync();

            return activities.Select(a => new UserActivityDto
            {
                UserId = a.UserId,
                UserName = a.User.FullName,
                ActivityType = a.ActivityType,
                Description = a.Description,
                Timestamp = a.Timestamp,
                RelatedEntityId = a.RelatedEntityId,
                RelatedEntityType = a.RelatedEntityType
            });
        }

        public async Task LogUserActivityAsync(string userId, string activityType, string description, string? relatedEntityId = null, string? relatedEntityType = null, string? ipAddress = null, string? userAgent = null)
        {
            var activity = new UserActivity
            {
                UserId = userId,
                ActivityType = activityType,
                Description = description,
                RelatedEntityId = relatedEntityId,
                RelatedEntityType = relatedEntityType,
                IpAddress = ipAddress,
                UserAgent = userAgent,
                Timestamp = DateTime.UtcNow
            };

            _context.UserActivities.Add(activity);
            await _context.SaveChangesAsync();
        }

        public async Task<AdminMessageDto> SendMessageToUserAsync(string fromUserId, CreateMessageDto messageDto)
        {
            var message = new AdminMessage
            {
                FromUserId = fromUserId,
                ToUserId = messageDto.ToUserId,
                Subject = messageDto.Subject,
                Message = messageDto.Message,
                MessageType = messageDto.MessageType,
                CreatedAt = DateTime.UtcNow
            };

            _context.AdminMessages.Add(message);
            await _context.SaveChangesAsync();

            // Log activity
            await LogUserActivityAsync(fromUserId, "MessageSent", $"Sent message to user: {messageDto.Subject}", message.Id.ToString(), "AdminMessage");

            // Get the created message with user details
            var createdMessage = await _context.AdminMessages
                .Include(m => m.FromUser)
                .Include(m => m.ToUser)
                .FirstAsync(m => m.Id == message.Id);

            return new AdminMessageDto
            {
                Id = createdMessage.Id,
                FromUserId = createdMessage.FromUserId,
                FromUserName = createdMessage.FromUser.FullName,
                ToUserId = createdMessage.ToUserId,
                ToUserName = createdMessage.ToUser.FullName,
                Subject = createdMessage.Subject,
                Message = createdMessage.Message,
                CreatedAt = createdMessage.CreatedAt,
                IsRead = createdMessage.IsRead,
                ReadAt = createdMessage.ReadAt,
                MessageType = createdMessage.MessageType
            };
        }

        public async Task<IEnumerable<AdminMessageDto>> GetUserMessagesAsync(string userId, bool unreadOnly = false, int pageNumber = 1, int pageSize = 20)
        {
            var query = _context.AdminMessages
                .Where(m => m.ToUserId == userId && !m.IsDeleted);

            if (unreadOnly)
            {
                query = query.Where(m => !m.IsRead);
            }

            var messages = await query
                .OrderByDescending(m => m.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Include(m => m.FromUser)
                .Include(m => m.ToUser)
                .ToListAsync();

            return messages.Select(m => new AdminMessageDto
            {
                Id = m.Id,
                FromUserId = m.FromUserId,
                FromUserName = m.FromUser.FullName,
                ToUserId = m.ToUserId,
                ToUserName = m.ToUser.FullName,
                Subject = m.Subject,
                Message = m.Message,
                CreatedAt = m.CreatedAt,
                IsRead = m.IsRead,
                ReadAt = m.ReadAt,
                MessageType = m.MessageType
            });
        }

        public async Task<IEnumerable<AdminMessageDto>> GetSentMessagesAsync(string fromUserId, int pageNumber = 1, int pageSize = 20)
        {
            var messages = await _context.AdminMessages
                .Where(m => m.FromUserId == fromUserId && !m.IsDeleted)
                .OrderByDescending(m => m.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Include(m => m.FromUser)
                .Include(m => m.ToUser)
                .ToListAsync();

            return messages.Select(m => new AdminMessageDto
            {
                Id = m.Id,
                FromUserId = m.FromUserId,
                FromUserName = m.FromUser.FullName,
                ToUserId = m.ToUserId,
                ToUserName = m.ToUser.FullName,
                Subject = m.Subject,
                Message = m.Message,
                CreatedAt = m.CreatedAt,
                IsRead = m.IsRead,
                ReadAt = m.ReadAt,
                MessageType = m.MessageType
            });
        }

        public async Task<bool> MarkMessageAsReadAsync(int messageId, string userId)
        {
            var message = await _context.AdminMessages
                .FirstOrDefaultAsync(m => m.Id == messageId && m.ToUserId == userId);

            if (message == null) return false;

            message.IsRead = true;
            message.ReadAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Log activity
            await LogUserActivityAsync(userId, "MessageRead", $"Read message: {message.Subject}", messageId.ToString(), "AdminMessage");

            return true;
        }

        public async Task<int> GetUnreadMessageCountAsync(string userId)
        {
            return await _context.AdminMessages
                .CountAsync(m => m.ToUserId == userId && !m.IsRead && !m.IsDeleted);
        }

        public async Task<object> GetUserStatisticsAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return new { };

            var ticketsCreated = await _context.Tickets.CountAsync(t => t.CreatedById == userId);
            var ticketsAssigned = await _context.Tickets.CountAsync(t => t.AssignedToId == userId);
            var ticketsCompleted = await _context.Tickets.CountAsync(t => t.AssignedToId == userId && t.Status == TicketStatus.Resolved);
            var totalMessages = await _context.AdminMessages.CountAsync(m => m.ToUserId == userId && !m.IsDeleted);
            var unreadMessages = await _context.AdminMessages.CountAsync(m => m.ToUserId == userId && !m.IsRead && !m.IsDeleted);
            var totalLogins = await _context.UserLoginHistories.CountAsync(h => h.UserId == userId && h.IsSuccessful);
            var lastLogin = await _context.UserLoginHistories
                .Where(h => h.UserId == userId && h.IsSuccessful)
                .OrderByDescending(h => h.LoginTime)
                .Select(h => h.LoginTime)
                .FirstOrDefaultAsync();

            return new
            {
                UserId = userId,
                UserName = user.FullName,
                TicketsCreated = ticketsCreated,
                TicketsAssigned = ticketsAssigned,
                TicketsCompleted = ticketsCompleted,
                CompletionRate = ticketsAssigned > 0 ? (double)ticketsCompleted / ticketsAssigned * 100 : 0,
                TotalMessages = totalMessages,
                UnreadMessages = unreadMessages,
                TotalLogins = totalLogins,
                LastLogin = lastLogin,
                AccountAge = DateTime.UtcNow.Subtract(user.CreatedAt).Days
            };
        }

        public async Task<object> GetSystemStatisticsAsync()
        {
            var totalUsers = await _userManager.Users.CountAsync();
            var activeUsers = await _userManager.Users.CountAsync(u => u.IsActive);
            var totalTickets = await _context.Tickets.CountAsync();
            var totalMessages = await _context.AdminMessages.CountAsync(m => !m.IsDeleted);
            var unreadMessages = await _context.AdminMessages.CountAsync(m => !m.IsRead && !m.IsDeleted);
            var todayLogins = await _context.UserLoginHistories
                .CountAsync(h => h.LoginTime.Date == DateTime.UtcNow.Date && h.IsSuccessful);

            var departmentStats = await _userManager.Users
                .Where(u => u.IsActive && !string.IsNullOrEmpty(u.Department))
                .GroupBy(u => u.Department)
                .Select(g => new { Department = g.Key, Count = g.Count() })
                .ToListAsync();

            return new
            {
                TotalUsers = totalUsers,
                ActiveUsers = activeUsers,
                InactiveUsers = totalUsers - activeUsers,
                TotalTickets = totalTickets,
                TotalMessages = totalMessages,
                UnreadMessages = unreadMessages,
                TodayLogins = todayLogins,
                DepartmentStats = departmentStats
            };
        }

        public async Task<IEnumerable<string>> GetDepartmentsAsync()
        {
            var departments = await _userManager.Users
                .Where(u => !string.IsNullOrEmpty(u.Department))
                .Select(u => u.Department)
                .Distinct()
                .OrderBy(d => d)
                .ToListAsync();

            return departments;
        }

        public async Task<IEnumerable<string>> GetRolesAsync()
        {
            var roles = await _context.Roles
                .Select(r => r.Name)
                .Where(name => name != null)
                .OrderBy(name => name)
                .ToListAsync();

            return roles!;
        }

        public async Task<BulkUpdateResult> BulkUpdateUserStatusAsync(List<string> userIds, bool isActive)
        {
            var result = new BulkUpdateResult();

            foreach (var userId in userIds)
            {
                try
                {
                    var user = await _userManager.FindByIdAsync(userId);
                    if (user != null)
                    {
                        user.IsActive = isActive;
                        var updateResult = await _userManager.UpdateAsync(user);

                        if (updateResult.Succeeded)
                        {
                            result.UpdatedCount++;

                            // Log the activity
                            await LogUserActivityAsync(userId, "StatusChanged",
                                $"User status changed to {(isActive ? "Active" : "Inactive")}",
                                userId, "User");
                        }
                        else
                        {
                            result.FailedCount++;
                            result.Errors.Add($"Failed to update user {user.Email}: {string.Join(", ", updateResult.Errors.Select(e => e.Description))}");
                        }
                    }
                    else
                    {
                        result.FailedCount++;
                        result.Errors.Add($"User with ID {userId} not found");
                    }
                }
                catch (Exception ex)
                {
                    result.FailedCount++;
                    result.Errors.Add($"Error updating user {userId}: {ex.Message}");
                    _logger.LogError(ex, "Error updating user status for user {UserId}", userId);
                }
            }

            return result;
        }

        public async Task<byte[]> ExportUsersAsync(string? searchTerm = null, string? department = null, string? role = null)
        {
            var users = await GetAllUsersAsync(1, int.MaxValue, searchTerm, department, role);

            var csv = new System.Text.StringBuilder();

            // Add header
            csv.AppendLine("ID,Email,First Name,Last Name,Department,Employee ID,Roles,Status,Created At,Last Login,Tickets Created,Tickets Assigned,Tickets Completed,Unread Messages");

            // Add data rows
            foreach (var user in users)
            {
                var roles = string.Join(";", user.Roles);
                var lastLogin = user.LastLoginAt?.ToString("yyyy-MM-dd HH:mm:ss") ?? "Never";
                var createdAt = user.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss");
                var status = user.IsActive ? "Active" : "Inactive";

                csv.AppendLine($"\"{user.Id}\",\"{user.Email}\",\"{user.FirstName}\",\"{user.LastName}\",\"{user.Department}\",\"{user.EmployeeId}\",\"{roles}\",\"{status}\",\"{createdAt}\",\"{lastLogin}\",{user.TotalTicketsCreated},{user.TotalTicketsAssigned},{user.TotalTicketsCompleted},{user.UnreadMessages}");
            }

            return System.Text.Encoding.UTF8.GetBytes(csv.ToString());
        }
    }
}
