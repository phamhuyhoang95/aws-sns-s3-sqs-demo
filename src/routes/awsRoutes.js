const express = require('express');
const multer = require('multer');
const awsController = require('../controllers/awsController');

const upload = multer({ dest: 'uploads/' })

  
  const router = express.Router();

// SNS Routes
router.post('/sns/publish', awsController.publishToSns);
router.post('/sns/create-topic', awsController.createSnsTopic);
router.post('/sns/subscribe', awsController.subscribeSns);
router.post('/sns/publish-attributes', awsController.publishWithAttributes);

// SQS Routes
router.post('/sqs/send', awsController.sendToSqs);
router.get('/sqs/receive', awsController.receiveFromSqs);

// S3 Routes
router.post('/s3/upload', upload.single('file'), awsController.uploadToS3);
router.get('/s3/get', awsController.getFromS3);
router.post('/s3/stream-upload', upload.single('file'), awsController.streamUploadToS3);
router.delete('/s3/delete', awsController.deleteFromS3);

module.exports = router;