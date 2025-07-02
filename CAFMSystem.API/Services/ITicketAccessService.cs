using CAFMSystem.API.Models;

namespace CAFMSystem.API.Services
{
    /// <summary>
    /// Service interface for managing role-based ticket access control
    /// </summary>
    public interface ITicketAccessService
    {
        /// <summary>
        /// Apply role-based filtering to a ticket query
        /// </summary>
        /// <param name="query">The base ticket query</param>
        /// <param name="currentUserId">The ID of the current user</param>
        /// <param name="userRoles">The roles of the current user</param>
        /// <returns>Filtered query based on user's access rights</returns>
        IQueryable<Ticket> ApplyAccessFilter(IQueryable<Ticket> query, string currentUserId, IList<string> userRoles);

        /// <summary>
        /// Check if a user can view a specific ticket
        /// </summary>
        /// <param name="ticket">The ticket to check access for</param>
        /// <param name="currentUserId">The ID of the current user</param>
        /// <param name="userRoles">The roles of the current user</param>
        /// <returns>True if the user can view the ticket, false otherwise</returns>
        bool CanViewTicket(Ticket ticket, string currentUserId, IList<string> userRoles);

        /// <summary>
        /// Check if a user can update a specific ticket
        /// </summary>
        /// <param name="ticket">The ticket to check update access for</param>
        /// <param name="currentUserId">The ID of the current user</param>
        /// <param name="userRoles">The roles of the current user</param>
        /// <returns>True if the user can update the ticket, false otherwise</returns>
        bool CanUpdateTicket(Ticket ticket, string currentUserId, IList<string> userRoles);

        /// <summary>
        /// Check if a user can assign tickets to others
        /// </summary>
        /// <param name="userRoles">The roles of the current user</param>
        /// <returns>True if the user can assign tickets, false otherwise</returns>
        bool CanAssignTickets(IList<string> userRoles);
    }
}
