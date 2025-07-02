import React, { useState, useRef } from 'react';
import { Card, Button, Alert, Badge, ProgressBar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUpload, 
  faFile, 
  faImage, 
  faFilePdf, 
  faFileWord, 
  faFileExcel, 
  faTrash,
  faCloudUpload
} from '@fortawesome/free-solid-svg-icons';

export interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  allowedTypes?: string[];
  disabled?: boolean;
  className?: string;
}

interface FileWithPreview extends File {
  id: string;
  preview?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  maxFiles = 5,
  maxFileSize = 10,
  allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp',
    'application/pdf', 'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain', 'text/csv'
  ],
  disabled = false,
  className = ''
}) => {
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return `File type "${file.type}" is not allowed`;
    }
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size exceeds ${maxFileSize}MB limit`;
    }
    return null;
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles: FileWithPreview[] = [];
    const errors: string[] = [];

    Array.from(files).forEach(file => {
      const validationError = validateFile(file);
      if (validationError) {
        errors.push(`${file.name}: ${validationError}`);
        return;
      }

      if (selectedFiles.length + newFiles.length >= maxFiles) {
        errors.push(`Maximum ${maxFiles} files allowed`);
        return;
      }

      const fileWithPreview: FileWithPreview = Object.assign(file, {
        id: `${Date.now()}-${Math.random()}`,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
      });

      newFiles.push(fileWithPreview);
    });

    if (errors.length > 0) {
      setError(errors.join(', '));
    } else {
      setError('');
    }

    if (newFiles.length > 0) {
      const updatedFiles = [...selectedFiles, ...newFiles];
      setSelectedFiles(updatedFiles);
      onFilesSelected(updatedFiles);
    }
  };

  const removeFile = (fileId: string) => {
    const updatedFiles = selectedFiles.filter(file => file.id !== fileId);
    setSelectedFiles(updatedFiles);
    onFilesSelected(updatedFiles);
    setError('');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (!disabled) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return faImage;
    if (file.type === 'application/pdf') return faFilePdf;
    if (file.type.includes('word')) return faFileWord;
    if (file.type.includes('excel') || file.type.includes('spreadsheet')) return faFileExcel;
    return faFile;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={className}>
      <Card className="border-2 border-dashed" style={{ borderColor: dragOver ? '#007bff' : '#dee2e6' }}>
        <Card.Body>
          <div
            className={`text-center p-4 ${dragOver ? 'bg-light' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
            onClick={() => !disabled && fileInputRef.current?.click()}
          >
            <FontAwesomeIcon 
              icon={faCloudUpload} 
              size="3x" 
              className={`mb-3 ${disabled ? 'text-muted' : 'text-primary'}`} 
            />
            <h5 className={disabled ? 'text-muted' : 'text-primary'}>
              {dragOver ? 'Drop files here' : 'Click to upload or drag and drop'}
            </h5>
            <p className="text-muted mb-0">
              Maximum {maxFiles} files, up to {maxFileSize}MB each
            </p>
            <p className="text-muted small">
              Supported: Images, PDF, Word, Excel, Text files
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={allowedTypes.join(',')}
            onChange={(e) => handleFileSelect(e.target.files)}
            style={{ display: 'none' }}
            disabled={disabled}
          />

          {error && (
            <Alert variant="danger" className="mt-3 mb-0">
              {error}
            </Alert>
          )}

          {selectedFiles.length > 0 && (
            <div className="mt-3">
              <h6>Selected Files ({selectedFiles.length}/{maxFiles})</h6>
              {selectedFiles.map(file => (
                <div key={file.id} className="d-flex align-items-center justify-content-between p-2 border rounded mb-2">
                  <div className="d-flex align-items-center">
                    <FontAwesomeIcon 
                      icon={getFileIcon(file)} 
                      className="me-2 text-primary" 
                    />
                    <div>
                      <div className="fw-bold">{file.name}</div>
                      <small className="text-muted">{formatFileSize(file.size)}</small>
                    </div>
                  </div>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    disabled={disabled}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default FileUpload;
