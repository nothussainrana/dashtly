import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const spacesOriginEndpoint = process.env.DO_SPACES_ORIGIN_ENDPOINT;
const spacesKey = process.env.DO_SPACES_KEY;
const spacesSecret = process.env.DO_SPACES_SECRET;
const spacesBucket = process.env.DO_SPACES_BUCKET;

if (!spacesOriginEndpoint || !spacesKey || !spacesSecret || !spacesBucket) {
  throw new Error('Missing Digital Ocean Spaces configuration');
}

const s3Client = new S3Client({
  endpoint: spacesOriginEndpoint,
  region: 'us-east-1',
  credentials: {
    accessKeyId: spacesKey,
    secretAccessKey: spacesSecret,
  },
});

export async function uploadToSpaces(file: File, key: string): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const command = new PutObjectCommand({
    Bucket: spacesBucket,
    Key: key,
    Body: buffer,
    ContentType: file.type,
    ACL: 'public-read',
  });

  await s3Client.send(command);
  
  // Return the CDN URL for viewing
  return `${process.env.NEXT_PUBLIC_DO_SPACES_CDN_ENDPOINT}/${spacesBucket}/${key}`;
}

export async function deleteFromSpaces(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: spacesBucket,
    Key: key,
  });

  await s3Client.send(command);
}

export async function getSignedUploadUrl(key: string, contentType: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: spacesBucket,
    Key: key,
    ContentType: contentType,
    ACL: 'public-read',
  });

  return getSignedUrl(s3Client, command, { expiresIn: 3600 });
} 