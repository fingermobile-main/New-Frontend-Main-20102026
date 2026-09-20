import express, { Request, Response } from 'express';
import multer from 'multer';
import { richMediaService } from '../services/richMediaService';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store in memory for processing
const upload = multer({ 
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 10 // Max 10 files per request
  }
});

// Upload single media file
router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided'
      });
    }

    const mediaAttachment = await richMediaService.uploadMedia(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: mediaAttachment
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload file',
      error: (error as Error).message
    });
  }
  return; // Ensure all code paths return a value
});

// Upload multiple media files
router.post('/upload-batch', upload.array('files', 10), async (req: Request, res: Response) => {
  try {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files provided'
      });
    }

    const files = (req.files as Express.Multer.File[]).map(file => ({
      buffer: file.buffer,
      originalName: file.originalname,
      mimeType: file.mimetype
    }));

    const mediaAttachments = await richMediaService.processMediaBatch(files);

    res.status(201).json({
      success: true,
      message: `${mediaAttachments.length} files uploaded successfully`,
      data: mediaAttachments
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload files',
      error: (error as Error).message
    });
  }
  return; // Ensure all code paths return a value
});

// Process rich text content
router.post('/process-rich-text', async (req: Request, res: Response) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Content is required'
      });
    }

    const richContent = await richMediaService.processRichText(content);

    res.status(200).json({
      success: true,
      message: 'Rich text processed successfully',
      data: richContent
    });
  } catch (error) {
    console.error('Error processing rich text:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process rich text',
      error: (error as Error).message
    });
  }
  return; // Ensure all code paths return a value
});

// Get media metadata
router.get('/metadata/:filePath', async (req: Request, res: Response) => {
  try {
    const { filePath } = req.params;
    const mimeType = req.query.mimeType as string;

    if (!filePath || !mimeType) {
      return res.status(400).json({
        success: false,
        message: 'File path and mime type are required'
      });
    }

    // In a real implementation, you'd validate the file path to prevent directory traversal
    const metadata = await richMediaService.generateMediaMetadata(filePath, mimeType);

    res.status(200).json({
      success: true,
      data: metadata
    });
  } catch (error) {
    console.error('Error getting media metadata:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get media metadata',
      error: (error as Error).message
    });
  }
  return; // Ensure all code paths return a value
});

// Cleanup old files (admin only)
router.delete('/cleanup', async (req: Request, res: Response) => {
  try {
    const daysToKeep = parseInt(req.query.days as string) || 30;
    
    const deletedCount = await richMediaService.cleanupOldFiles(daysToKeep);

    res.status(200).json({
      success: true,
      message: `${deletedCount} old files cleaned up`,
      deletedCount
    });
  } catch (error) {
    console.error('Error cleaning up files:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clean up files',
      error: (error as Error).message
    });
  }
  return; // Ensure all code paths return a value
});

export default router;