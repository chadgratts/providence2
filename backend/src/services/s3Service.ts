import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

export class S3Service {
  private bucketName: string | undefined;
  private s3Client: S3Client;
  private endpoint: string | undefined;
  private region: string | undefined;

  constructor() {
    this.bucketName = process.env.S3_BUCKET_NAME;
    this.endpoint = process.env.S3_ENDPOINT;
    this.region = process.env.S3_REGION;

    const accessKeyId = process.env.S3_ACCESS_KEY;
    const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

    if (!accessKeyId || !secretAccessKey) {
      throw new Error('S3 access key or secret access key is not defined');
    }

    this.s3Client = new S3Client({
      endpoint: this.endpoint, // Set for MinIO, leave undefined for AWS S3
      region: this.region,
      credentials: {
        accessKeyId: accessKeyId as string,
        secretAccessKey: secretAccessKey as string,
      },
      forcePathStyle: true, // Needed for MinIO, doesn't affect S3
    });
  }

  getFile = async (fileName: string) => { // Promise<string>
    const params = {
      Bucket: this.bucketName,
      Key: fileName,
    };

    try {
      const command = new GetObjectCommand(params);
      const response = await this.s3Client.send(command);

      if (!response.Body) {
        throw new Error('File body is empty');
      }

      const stream = response.Body as Readable;
      const chunks: Buffer[] = [];

      for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
      }

      const fileContent = Buffer.concat(chunks).toString('utf-8');
      console.log('File downloaded from S3 successfully:', fileContent);
      return fileContent;
    } catch (error) {
      console.error('Error downloading file from S3:', error);
      throw error;
    }
  }

  addFile = async (fileName: string, fileContent: string) => { // Promise<string
    const params = {
      Bucket: this.bucketName,
      Key: fileName,  
      Body: JSON.stringify(fileContent),
      ContentType: 'application/json',
    };

    try {
      console.log('Uploading file to S3:', fileName);
      const command = new PutObjectCommand(params);
      await this.s3Client.send(command);
      // Construct the URL
      const location = this.constructS3Url(fileName);
      console.log(`File uploaded successful to S3 at: ${location}`);
      return location;
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw error;
    }
  }

  private constructS3Url(fileName: string): string {
    if (this.endpoint) {
      // For MinIO
      return `${this.endpoint}/${this.bucketName}/${fileName}`;
    } else {
      // For S3
      return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${fileName}`;
    }
  }
}