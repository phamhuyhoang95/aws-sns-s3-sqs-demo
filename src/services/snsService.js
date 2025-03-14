const { sns } = require('../../config/aws');

class SnsService {
  async publishMessage(message) {
    const params = {
      Message: message,
      TopicArn: process.env.SNS_TOPIC_ARN,
    };

    try {
      const result = await sns.publish(params).promise();
      return { success: true, messageId: result.MessageId };
    } catch (error) {
      throw new Error(`SNS Publish Error: ${error.message}`);
    }
  }

  async createTopic(topicName) {
    const params = {
      Name: topicName,
    };

    try {
      const result = await sns.createTopic(params).promise();
      return { success: true, topicArn: result.TopicArn };
    } catch (error) {
      throw new Error(`SNS Create Topic Error: ${error.message}`);
    }
  }

  async subscribeToTopic(topicArn, protocol, endpoint) {
    const params = {
      TopicArn: topicArn || process.env.SNS_TOPIC_ARN,
      Protocol: protocol,
      Endpoint: endpoint,
    };

    try {
      const result = await sns.subscribe(params).promise();
      return { success: true, subscriptionArn: result.SubscriptionArn };
    } catch (error) {
      throw new Error(`SNS Subscribe Error: ${error.message}`);
    }
  }

  async publishWithAttributes(message, attributes) {
    const params = {
      Message: message,
      TopicArn: process.env.SNS_TOPIC_ARN,
      MessageAttributes: attributes,
    };

    try {
      const result = await sns.publish(params).promise();
      return { success: true, messageId: result.MessageId };
    } catch (error) {
      throw new Error(`SNS Publish Attributes Error: ${error.message}`);
    }
  }
}

module.exports = new SnsService();