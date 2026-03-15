import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const bucketName = process.env.CF_BUCKET_NAME!;

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.CF_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.CF_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CF_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToR2(
  file: Buffer,
  key: string,
  contentType: string
) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: file,
    ContentType: contentType,
  });

  await r2Client.send(command);

  // If CF_PUBLIC_DOMAIN is provided, use it. 
  // Otherwise, default to the R2 endpoint structure if applicable, 
  // but usually a public domain is required for browser access.
  const domain = process.env.CF_PUBLIC_DOMAIN || `https://${bucketName}.r2.cloudflarestorage.com`;
  
  return `${domain}/${key}`;
}

export async function deleteFromR2(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  await r2Client.send(command);
}
