-- =============================================
-- CAFM System - Add File Attachments Support
-- =============================================
-- This script adds file attachment functionality to the CAFM system
-- Run this script on your CAFMSystem database

USE CAFMSystem;
GO

-- Check if TicketAttachments table already exists
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[TicketAttachments]') AND type in (N'U'))
BEGIN
    PRINT 'Creating TicketAttachments table...';
    
    CREATE TABLE [dbo].[TicketAttachments] (
        [Id] int IDENTITY(1,1) NOT NULL,
        [TicketId] int NOT NULL,
        [FileName] nvarchar(255) NOT NULL,
        [OriginalFileName] nvarchar(255) NOT NULL,
        [FilePath] nvarchar(500) NOT NULL,
        [ContentType] nvarchar(100) NOT NULL,
        [FileSize] bigint NOT NULL,
        [UploadedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
        [UploadedById] nvarchar(450) NOT NULL,
        
        CONSTRAINT [PK_TicketAttachments] PRIMARY KEY CLUSTERED ([Id] ASC),
        
        CONSTRAINT [FK_TicketAttachments_Tickets_TicketId] 
            FOREIGN KEY([TicketId]) REFERENCES [dbo].[Tickets] ([Id]) ON DELETE CASCADE,
            
        CONSTRAINT [FK_TicketAttachments_AspNetUsers_UploadedById] 
            FOREIGN KEY([UploadedById]) REFERENCES [dbo].[AspNetUsers] ([Id]) ON DELETE NO ACTION
    );
    
    -- Create indexes for better performance
    CREATE NONCLUSTERED INDEX [IX_TicketAttachments_TicketId] 
        ON [dbo].[TicketAttachments]([TicketId] ASC);
        
    CREATE NONCLUSTERED INDEX [IX_TicketAttachments_UploadedById] 
        ON [dbo].[TicketAttachments]([UploadedById] ASC);
        
    CREATE NONCLUSTERED INDEX [IX_TicketAttachments_UploadedAt] 
        ON [dbo].[TicketAttachments]([UploadedAt] ASC);
    
    PRINT 'TicketAttachments table created successfully!';
END
ELSE
BEGIN
    PRINT 'TicketAttachments table already exists.';
END

-- Check if OnBehalfOf column exists in Tickets table
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Tickets]') AND name = 'OnBehalfOf')
BEGIN
    PRINT 'Adding OnBehalfOf column to Tickets table...';
    
    ALTER TABLE [dbo].[Tickets] 
    ADD [OnBehalfOf] nvarchar(200) NULL;
    
    PRINT 'OnBehalfOf column added successfully!';
END
ELSE
BEGIN
    PRINT 'OnBehalfOf column already exists in Tickets table.';
END

-- Create uploads directory structure (informational)
PRINT '';
PRINT '=== IMPORTANT: Manual Setup Required ===';
PRINT 'Please create the following directory structure in your CAFMSystem.API project:';
PRINT '  CAFMSystem.API/uploads/tickets/';
PRINT '';
PRINT 'This directory will store uploaded files organized by ticket ID.';
PRINT 'Example structure:';
PRINT '  CAFMSystem.API/uploads/tickets/1/ticket_1_20231212_143022_abc12345.pdf';
PRINT '  CAFMSystem.API/uploads/tickets/2/ticket_2_20231212_143055_def67890.jpg';
PRINT '';

-- Verify the setup
PRINT '=== Verification ===';
PRINT 'Checking table structure...';

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[TicketAttachments]') AND type in (N'U'))
    PRINT '✅ TicketAttachments table exists';
ELSE
    PRINT '❌ TicketAttachments table missing';

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Tickets]') AND name = 'OnBehalfOf')
    PRINT '✅ OnBehalfOf column exists in Tickets table';
ELSE
    PRINT '❌ OnBehalfOf column missing in Tickets table';

-- Show table structure
PRINT '';
PRINT 'TicketAttachments table structure:';
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'TicketAttachments'
ORDER BY ORDINAL_POSITION;

PRINT '';
PRINT '=== File Attachment Setup Complete! ===';
PRINT 'You can now:';
PRINT '1. Upload multiple files when creating tickets';
PRINT '2. View file attachments in ticket details';
PRINT '3. Download and preview files (images)';
PRINT '4. Delete files (with proper permissions)';
PRINT '5. Role-based access control for file operations';
PRINT '';
PRINT 'Supported file types:';
PRINT '- Images: JPEG, PNG, GIF, BMP, WebP';
PRINT '- Documents: PDF, Word, Excel, PowerPoint';
PRINT '- Text: Plain text, CSV';
PRINT '- Archives: ZIP, RAR';
PRINT '';
PRINT 'Maximum file size: 10MB per file';
PRINT 'Maximum files per ticket: 5 files';
