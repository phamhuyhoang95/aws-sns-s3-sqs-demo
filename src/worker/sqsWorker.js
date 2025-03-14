const { sqs } = require('../../config/aws');

class SqsWorker {
  async start() {
    console.log('SQS Worker started...');
    this.pollQueue();
  }

  async pollQueue() {
    const params = {
      QueueUrl: process.env.SQS_QUEUE_URL,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 20,
    };

    while (true) {
      try {
        const data = await sqs.receiveMessage(params).promise();
        if (data.Messages) {
          for (const message of data.Messages) {
            await this.processMessage(message);
            await this.deleteMessage(message.ReceiptHandle);
          }
        } else {
          console.log('No messages to process');
        }
      } catch (error) {
        console.error(`Worker Error: ${error.message}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  async processMessage(message) {
    const body = JSON.parse(message.Body);
    console.log('Processing message:', body);
  }

  async deleteMessage(receiptHandle) {
    const params = {
      QueueUrl: process.env.SQS_QUEUE_URL,
      ReceiptHandle: receiptHandle,
    };

    try {
      await sqs.deleteMessage(params).promise();
      console.log('Message deleted');
    } catch (error) {
      throw new Error(`Delete Message Error: ${error.message}`);
    }
  }
}

const worker = new SqsWorker();
worker.start();