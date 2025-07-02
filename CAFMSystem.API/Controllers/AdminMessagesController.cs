using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CAFMSystem.API.Services;
using CAFMSystem.API.DTOs;
using System.Security.Claims;

namespace CAFMSystem.API.Controllers
{
    [ApiController]
    [Route("api/admin/[controller]")]
    [Authorize]
    public class AdminMessagesController : ControllerBase
    {
        private readonly IAdminUserService _adminUserService;
        private readonly ILogger<AdminMessagesController> _logger;

        public AdminMessagesController(IAdminUserService adminUserService, ILogger<AdminMessagesController> logger)
        {
            _adminUserService = adminUserService;
            _logger = logger;
        }

        /// <summary>
        /// Send message to user (Admin only)
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<AdminMessageDto>> SendMessage([FromBody] CreateMessageDto messageDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var fromUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(fromUserId))
                {
                    return Unauthorized();
                }

                _logger.LogInformation("Admin {AdminId} sending message to user {UserId}", fromUserId, messageDto.ToUserId);

                var message = await _adminUserService.SendMessageToUserAsync(fromUserId, messageDto);
                return CreatedAtAction(nameof(GetMessage), new { messageId = message.Id }, message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending message to user {UserId}", messageDto.ToUserId);
                return StatusCode(500, new { message = "An error occurred while sending message" });
            }
        }

        /// <summary>
        /// Get message by ID
        /// </summary>
        [HttpGet("{messageId}")]
        public async Task<ActionResult<AdminMessageDto>> GetMessage(int messageId)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var isAdmin = User.IsInRole("Admin");

                // Users can only see their own messages, admins can see all
                var messages = isAdmin 
                    ? await _adminUserService.GetSentMessagesAsync(userId!, 1, 1000) // Get all sent messages for admin
                    : await _adminUserService.GetUserMessagesAsync(userId!, false, 1, 1000); // Get all received messages for user

                var message = messages.FirstOrDefault(m => m.Id == messageId);
                if (message == null)
                {
                    return NotFound(new { message = "Message not found" });
                }

                return Ok(message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving message {MessageId}", messageId);
                return StatusCode(500, new { message = "An error occurred while retrieving message" });
            }
        }

        /// <summary>
        /// Get messages for current user
        /// </summary>
        [HttpGet("inbox")]
        public async Task<ActionResult<IEnumerable<AdminMessageDto>>> GetUserMessages(
            [FromQuery] bool unreadOnly = false,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var messages = await _adminUserService.GetUserMessagesAsync(userId, unreadOnly, pageNumber, pageSize);
                return Ok(messages);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving messages for user");
                return StatusCode(500, new { message = "An error occurred while retrieving messages" });
            }
        }

        /// <summary>
        /// Get sent messages (Admin only)
        /// </summary>
        [HttpGet("sent")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<AdminMessageDto>>> GetSentMessages(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var messages = await _adminUserService.GetSentMessagesAsync(userId, pageNumber, pageSize);
                return Ok(messages);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving sent messages for admin");
                return StatusCode(500, new { message = "An error occurred while retrieving sent messages" });
            }
        }

        /// <summary>
        /// Mark message as read
        /// </summary>
        [HttpPatch("{messageId}/read")]
        public async Task<ActionResult> MarkMessageAsRead(int messageId)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var success = await _adminUserService.MarkMessageAsReadAsync(messageId, userId);
                if (!success)
                {
                    return NotFound(new { message = "Message not found or access denied" });
                }

                return Ok(new { message = "Message marked as read" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error marking message {MessageId} as read", messageId);
                return StatusCode(500, new { message = "An error occurred while marking message as read" });
            }
        }

        /// <summary>
        /// Get unread message count for current user
        /// </summary>
        [HttpGet("unread-count")]
        public async Task<ActionResult<int>> GetUnreadMessageCount()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var count = await _adminUserService.GetUnreadMessageCountAsync(userId);
                return Ok(new { count });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving unread message count for user");
                return StatusCode(500, new { message = "An error occurred while retrieving unread message count" });
            }
        }
    }
}
