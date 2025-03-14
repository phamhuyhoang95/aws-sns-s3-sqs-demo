
# AWS Demo Project

A Node.js demo showcasing basic interactions with AWS SNS, SQS, and S3 using Express.js. This project demonstrates publishing messages to SNS, sending/receiving messages with SQS (including a worker), and uploading/downloading files with S3 (including streaming).

## Project Structure
```
aws-demo/
├── config/
│   └── aws.js              # AWS SDK configuration
├── src/
│   ├── controllers/
│   │   └── awsController.js # API logic
│   ├── routes/
│   │   └── awsRoutes.js    # API routes with Multer
│   ├── services/
│   │   ├── snsService.js   # SNS operations
│   │   ├── sqsService.js   # SQS operations
│   │   └── s3Service.js    # S3 operations
│   ├── worker/
│   │   └── sqsWorker.js    # SQS message worker
│   └── app.js              # Express app setup
├── .env                    # Environment variables
├── .gitignore              # Git ignore file
├── package.json            # Dependencies and scripts
└── README.md               # Project documentation
```

## Prerequisites
- Node.js (v14 or higher)
- AWS account with SNS, SQS, and S3 configured
- An `uploads/` directory in the project root for file uploads (auto-created if configured)

## Setup
1. **Clone the repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd aws-demo
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   - Create a `.env` file in the project root.
   - Copy the sample below and replace with your AWS credentials and resource details.

4. **Run the server**:
   ```bash
   npm start
   ```

5. **Run the SQS worker** (in a separate terminal):
   ```bash
   npm run worker
   ```

## Sample `.env`
```plaintext
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
S3_BUCKET_NAME=my-aws-demo-bucket-2023
SQS_QUEUE_URL=https://sqs.us-east-1.amazonaws.com/123456789012/my-demo-queue
SNS_TOPIC_ARN=arn:aws:sns:us-east-1:123456789012:my-demo-topic
PORT=3000
```
- **Notes**:
  - `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`: Obtain from AWS IAM user with SNS, SQS, and S3 permissions.
  - `AWS_REGION`: Choose your AWS region (e.g., `us-east-1`).
  - `S3_BUCKET_NAME`: Create a unique S3 bucket in AWS Console.
  - `SQS_QUEUE_URL`: Get from SQS queue details after creation.
  - `SNS_TOPIC_ARN`: Get from SNS topic details after creation.

## API Endpoints

### SNS Endpoints
1. **`POST /api/sns/publish`**
   - **Description**: Publish a simple message to an SNS Topic.
   - **Request** (Body: `application/json`):
     ```json
     {
       "message": "Hello from SNS"
     }
     ```
   - **Response**:
     ```json
     { "success": true, "messageId": "123e4567-e89b-12d3-a456-426614174000" }
     ```

2. **`POST /api/sns/create-topic`**
   - **Description**: Create a new SNS Topic.
   - **Request** (Body: `application/json`):
     ```json
     {
       "topicName": "MyNewTopic"
     }
     ```
   - **Response**:
     ```json
     { "success": true, "topicArn": "arn:aws:sns:us-east-1:123456789012:MyNewTopic" }
     ```

3. **`POST /api/sns/subscribe`**
   - **Description**: Subscribe an endpoint (e.g., email) to a Topic.
   - **Request** (Body: `application/json`):
     ```json
     {
       "topicArn": "arn:aws:sns:us-east-1:123456789012:MyNewTopic",
       "protocol": "email",
       "endpoint": "example@email.com"
     }
     ```
   - **Response**:
     ```json
     { "success": true, "subscriptionArn": "arn:aws:sns:us-east-1:123456789012:MyNewTopic:pending" }
     ```

4. **`POST /api/sns/publish-attributes`**
   - **Description**: Publish a message with attributes to an SNS Topic.
   - **Request** (Body: `application/json`):
     ```json
     {
       "message": "Hello with attributes",
       "attributes": {
         "priority": { "DataType": "String", "StringValue": "high" }
       }
     }
     ```
   - **Response**:
     ```json
     { "success": true, "messageId": "123e4567-e89b-12d3-a456-426614174000" }
     ```

### SQS Endpoints
5. **`POST /api/sqs/send`**
   - **Description**: Send a message to an SQS Queue.
   - **Request** (Body: `application/json`):
     ```json
     {
       "message": "Hello from SQS"
     }
     ```
   - **Response**:
     ```json
     { "success": true, "messageId": "abcdef12-3456-7890-abcd-ef1234567890" }
     ```

6. **`GET /api/sqs/receive`**
   - **Description**: Receive a message from an SQS Queue (for manual testing).
   - **Request**: `GET /api/sqs/receive` (no body).
   - **Response**:
     ```json
     {
       "MessageId": "abcdef12-3456-7890-abcd-ef1234567890",
       "ReceiptHandle": "AQEB...==",
       "Body": "{\"message\": \"Hello from SQS\"}"
     }
     ```
     or:
     ```json
     { "message": "No messages in queue" }
     ```

### S3 Endpoints
7. **`POST /api/s3/upload`**
   - **Description**: Upload a file to S3 using stream from disk.
   - **Request** (Body: `multipart/form-data`):
     - Key: `file`
     - Value: Select a file (e.g., `test.txt` with content "Hello S3").
   - **Response**:
     ```json
     { "success": true, "url": "https://my-aws-demo-bucket-2023.s3.amazonaws.com/test.txt" }
     ```

8. **`GET /api/s3/get`**
   - **Description**: Download a file from S3 directly.
   - **Request**: `GET /api/s3/get?fileName=test.txt`
   - **Response**: File content streamed directly (e.g., "Hello S3" in `test.txt`), with headers:
     ```
     Content-Disposition: attachment; filename="test.txt"
     Content-Type: application/octet-stream
     ```

9. **`POST /api/s3/stream-upload`**
   - **Description**: Upload a file to S3 using stream from disk.
   - **Request** (Body: `multipart/form-data`):
     - Key: `file`
     - Value: Select a file (e.g., `test-stream.txt` with content "Stream upload").
   - **Response**:
     ```json
     { "success": true, "url": "https://my-aws-demo-bucket-2023.s3.amazonaws.com/test-stream.txt" }
     ```

10. **`GET /api/s3/stream-download`**
    - **Description**: Download a file from S3 using stream.
    - **Request**: `GET /api/s3/stream-download?fileName=test-stream.txt`
    - **Response**: File content streamed directly (e.g., "Stream upload" in `test-stream.txt`), with headers:
      ```
      Content-Disposition: attachment; filename="test-stream.txt"
      Content-Type: application/octet-stream
      ```

11. **`DELETE /api/s3/delete`**
    - **Description**: Delete a file from S3.
    - **Request**: `DELETE /api/s3/delete?fileName=test-stream.txt`
    - **Response**:
      ```json
      { "success": true, "message": "File test-stream.txt deleted" }
      ```

## Testing with Postman
- **SNS and SQS JSON APIs**: Use `POST` with `Content-Type: application/json` and body as shown.
- **S3 Upload APIs**:
  - Use `POST`, select `form-data`, add key `file`, and choose a file.
- **S3 Download/Delete APIs**:
  - Use `GET` or `DELETE` with query parameter `fileName` (e.g., `?fileName=test.txt`).

## Notes
- **Multer**: File uploads (`/s3/upload` and `/s3/stream-upload`) use `multer.diskStorage`, requiring an `uploads/` directory in the project root. Ensure it exists or configure auto-creation in `awsRoutes.js`.
- **Worker**: The SQS worker (`src/worker/sqsWorker.js`) runs continuously to process messages from the queue.
- **Streaming**: Both `uploadToS3` and `streamUploadToS3` use streams from disk for efficient handling of large files.
- **Dependencies**: Ensure all dependencies are installed (`express`, `aws-sdk`, `dotenv`, `multer`, `fs`).

## Troubleshooting
- **File upload errors**: Check if `uploads/` directory exists and is writable.
- **AWS errors**: Verify `.env` values match your AWS resources and IAM user has sufficient permissions.
- **Worker not processing**: Ensure `SQS_QUEUE_URL` is correct and worker is running.

```