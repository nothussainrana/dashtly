import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const spacesEndpoint = process.env.DO_SPACES_ORIGIN_ENDPOINT;
const spacesKey = process.env.DO_SPACES_KEY;
const spacesSecret = process.env.DO_SPACES_SECRET;
const spacesBucket = process.env.DO_SPACE_BUCKET_NAME;
const spacesCdnDomain = process.env.DO_SPACES_CDN_DOMAIN;

if (!spacesEndpoint || !spacesKey || !spacesSecret || !spacesBucket || !spacesCdnDomain) {
  throw new Error('Missing required environment variables for Digital Ocean Spaces');
}

const s3Client = new S3Client({
  endpoint: spacesEndpoint,
  region: 'us-east-1',
  credentials: {
    accessKeyId: spacesKey,
    secretAccessKey: spacesSecret,
  },
  forcePathStyle: false,
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const key = `products/${session.user.id}/${Date.now()}-${file.name}`;

    const command = new PutObjectCommand({
      Bucket: spacesBucket,
      Key: key,
      Body: Buffer.from(buffer),
      ContentType: file.type,
      ACL: 'public-read',
    });

    await s3Client.send(command);

    const imageUrl = `https://${spacesBucket}.${spacesCdnDomain}/${key}`;

    return NextResponse.json({ imageUrl });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
} 