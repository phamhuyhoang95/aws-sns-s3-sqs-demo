const { s3 } = require('../../config/aws');
const fs = require('fs');

class S3Service {
  async uploadFile(fileName, path) {
    const fileContent = fs.readFileSync(path)
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
      Body: fileContent,
    };

    try {
      const result = await s3.upload(params).promise();
      return { success: true, url: result.Location };
    } catch (error) {
      throw new Error(`S3 Upload Error: ${error.message}`);
    }
  }

  async getFile(fileName) {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
    };

    try {
      return s3.getObject(params).createReadStream()
    } catch (error) {
      throw new Error(`S3 Get Error: ${error.message}`);
    }
  }

  async streamUpload(fileName, filePath) {
    const fileStream = fs.createReadStream(filePath);
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
      Body: fileStream,
    };
    
    try {
      const result = await s3.upload(params).promise();
      require('fs').unlinkSync(filePath);
      return result
    } catch (error) {
      throw new Error(`S3 Stream Upload Error: ${error.message}`);
    }
  }
  
  async deleteFile(fileName) {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
    };

    try {
      await s3.deleteObject(params).promise();
      return { success: true, message: `File ${fileName} deleted` };
    } catch (error) {
      throw new Error(`S3 Delete Error: ${error.message}`);
    }
  }
}

module.exports = new S3Service();