const AWS = require("aws-sdk");

class AWSHelper {
  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  async uploadFile(file, fileName, ContentType = "image/jpeg") {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: file,
      ContentEncoding: "base64",
      ContentType,
    };

    return this.s3.upload(params).promise();
  }

  async deleteFile(fileName) {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
    };
    return this.s3.deleteObject(params).promise();
  }

  async deleteFiles(fileNames, bucketName) {
    const params = {
      Bucket: bucketName,
      Delete: {
        Objects: fileNames.map((fileName) => ({ Key: fileName })),
      },
    };
    return this.s3.deleteObjects(params).promise();
  }
}

module.exports = AWSHelper;
