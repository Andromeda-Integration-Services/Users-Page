import React, { useState } from 'react';
import { Card, Button, Badge, Alert, Modal, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDownload, 
  faTrash, 
  faFile, 
  faImage, 
  faFilePdf, 
  faFileWord, 
  faFileExcel,
  faEye,
  faCalendarAlt,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import type { TicketAttachment } from '../../api/ticketService';
import ticketService from '../../api/ticketService';

export interface FileAttachmentsProps {
  attachments: TicketAttachment[];
  canDelete?: boolean;
  onFileDeleted?: (attachmentId: number) => void;
  className?: string;
}

const FileAttachments: React.FC<FileAttachmentsProps> = ({
  attachments,
  canDelete = false,
  onFileDeleted,
  className = ''
}) => {
  const [downloading, setDownloading] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);

  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith('image/')) return faImage;
    if (contentType === 'application/pdf') return faFilePdf;
    if (contentType.includes('word')) return faFileWord;
    if (contentType.includes('excel') || contentType.includes('spreadsheet')) return faFileExcel;
    return faFile;
  };

  const handleDownload = async (attachment: TicketAttachment) => {
    try {
      setDownloading(attachment.id);
      setError('');

      const blob = await ticketService.downloadFile(attachment.id);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = attachment.originalFileName;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (err: any) {
      console.error('Error downloading file:', err);
      setError(`Failed to download ${attachment.originalFileName}: ${err.message || 'Unknown error'}`);
    } finally {
      setDownloading(null);
    }
  };

  const handleDelete = async (attachmentId: number) => {
    try {
      setDeleting(attachmentId);
      setError('');

      await ticketService.deleteFile(attachmentId);
      
      if (onFileDeleted) {
        onFileDeleted(attachmentId);
      }
      
      setShowDeleteModal(null);
    } catch (err: any) {
      console.error('Error deleting file:', err);
      setError(`Failed to delete file: ${err.message || 'Unknown error'}`);
    } finally {
      setDeleting(null);
    }
  };

  const handlePreview = async (attachment: TicketAttachment) => {
    if (attachment.isImage) {
      try {
        setDownloading(attachment.id);
        const blob = await ticketService.downloadFile(attachment.id);
        const url = window.URL.createObjectURL(blob);
        
        // Open in new window for preview
        const newWindow = window.open();
        if (newWindow) {
          newWindow.document.write(`
            <html>
              <head><title>${attachment.originalFileName}</title></head>
              <body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f8f9fa;">
                <img src="${url}" style="max-width:100%;max-height:100vh;object-fit:contain;" alt="${attachment.originalFileName}" />
              </body>
            </html>
          `);
        }
      } catch (err: any) {
        console.error('Error previewing file:', err);
        setError(`Failed to preview ${attachment.originalFileName}: ${err.message || 'Unknown error'}`);
      } finally {
        setDownloading(null);
      }
    } else {
      // For non-images, just download
      handleDownload(attachment);
    }
  };

  if (attachments.length === 0) {
    return (
      <Card className={className}>
        <Card.Body className="text-center text-muted py-4">
          <FontAwesomeIcon icon={faFile} size="2x" className="mb-2" />
          <p className="mb-0">No files attached to this ticket</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div className={className}>
      <Card>
        <Card.Header className="bg-light">
          <h6 className="mb-0">
            <FontAwesomeIcon icon={faFile} className="me-2" />
            File Attachments ({attachments.length})
          </h6>
        </Card.Header>
        <Card.Body>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          <div className="row">
            {attachments.map(attachment => (
              <div key={attachment.id} className="col-md-6 col-lg-4 mb-3">
                <Card className="h-100 border">
                  <Card.Body className="d-flex flex-column">
                    <div className="text-center mb-3">
                      <FontAwesomeIcon 
                        icon={getFileIcon(attachment.contentType)} 
                        size="2x" 
                        className="text-primary" 
                      />
                    </div>
                    
                    <div className="flex-grow-1">
                      <h6 className="card-title text-truncate" title={attachment.originalFileName}>
                        {attachment.originalFileName}
                      </h6>
                      
                      <div className="small text-muted mb-2">
                        <div>
                          <FontAwesomeIcon icon={faUser} className="me-1" />
                          {attachment.uploadedByName}
                        </div>
                        <div>
                          <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                          {new Date(attachment.uploadedAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <Badge bg="secondary" className="mb-2">
                        {attachment.fileSizeFormatted}
                      </Badge>
                    </div>
                    
                    <div className="d-flex gap-2 mt-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handlePreview(attachment)}
                        disabled={downloading === attachment.id}
                        className="flex-grow-1"
                      >
                        {downloading === attachment.id ? (
                          <Spinner size="sm" />
                        ) : (
                          <>
                            <FontAwesomeIcon icon={attachment.isImage ? faEye : faDownload} className="me-1" />
                            {attachment.isImage ? 'Preview' : 'Download'}
                          </>
                        )}
                      </Button>
                      
                      {canDelete && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => setShowDeleteModal(attachment.id)}
                          disabled={deleting === attachment.id}
                        >
                          {deleting === attachment.id ? (
                            <Spinner size="sm" />
                          ) : (
                            <FontAwesomeIcon icon={faTrash} />
                          )}
                        </Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal !== null} onHide={() => setShowDeleteModal(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this file? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(null)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={() => showDeleteModal && handleDelete(showDeleteModal)}
            disabled={deleting !== null}
          >
            {deleting !== null ? (
              <>
                <Spinner size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              'Delete File'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FileAttachments;
