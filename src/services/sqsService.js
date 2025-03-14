const { sqs } = require('../../config/aws');

class SqsService {
  async sendMessage(message) {
    const params = {
      QueueUrl: process.env.SQS_QUEUE_URL,
      MessageBody: JSON.stringify(message),
    };

    try {
      const result = await sqs.sendMessage(params).promise();
      return { success: true, messageId: result.MessageId };
    } catch (error) {
      throw new Error(`SQS Error: ${error.message}`);
    }
  }

  async receiveMessage() {
    const params = {
      QueueUrl: process.env.SQS_QUEUE_URL,
      MaxNumberOfMessages: 1,
    };

    try {
      const result = await sqs.receiveMessage(params).promise();
      return result.Messages ? result.Messages[0] : null;
    } catch (error) {
      throw new Error(`SQS Receive Error: ${error.message}`);
    }
  }
}

module.exports = new SqsService();