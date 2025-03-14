const stream = require('stream');
const snsService = require('../services/snsService');
const sqsService = require('../services/sqsService');
const s3Service = require('../services/s3Service');

class AwsController {
  // SNS
  async publishToSns(req, res) {
    try {
      const {
        message
      } = req.body;
      const result = await snsService.publishMessage(message);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  }

  async createSnsTopic(req, res) {
    try {
      const {
        topicName
      } = req.body;
      const result = await snsService.createTopic(topicName);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  }

  async subscribeSns(req, res) {
    try {
      const {
        topicArn,
        protocol,
        endpoint
      } = req.body;
      const result = await snsService.subscribeToTopic(topicArn, protocol, endpoint);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  }

  async publishWithAttributes(req, res) {
    try {
      const {
        message,
        attributes
      } = req.body;
      const result = await snsService.publishWithAttributes(message, attributes);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  }

  // SQS
  async sendToSqs(req, res) {
    try {
      const {
        message
      } = req.body;
      const result = await sqsService.sendMessage(message);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  }

  async receiveFromSqs(req, res) {
    try {
      const result = await sqsService.receiveMessage();
      res.json(result || {
        message: 'No messages in queue'
      });
    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  }

  // S3
  async uploadToS3(req, res) {
    try {
      if (!req.file) throw new Error('No file uploaded');
      const {
        originalname,
        path
      } = req.file;
      const result = await s3Service.uploadFile(originalname, path);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  }

  async getFromS3(req, res) {
    try {
      const {
        fileName
      } = req.query;
      const fileStream = await s3Service.getFile(fileName);
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Type', 'application/octet-stream');
      fileStream.pipe(res);
      fileStream.on('error', (error) => {
        res.status(500).json({
          error: error.message
        });
      });
    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  }

  async streamUploadToS3(req, res) {
    try {
      if (!req.file) throw new Error('No file uploaded');
      const {
        originalname,
        path
      } = req.file;
      console.log(req.file)
      const result = await s3Service.streamUpload(originalname, path)
      res.json({
        success: true,
        url: result.Location
      });
    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  }

  async deleteFromS3(req, res) {
    try {
      const {
        fileName
      } = req.query;
      const result = await s3Service.deleteFile(fileName);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  }
}

module.exports = new AwsController();