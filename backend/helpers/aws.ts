import { randomUUID } from 'crypto';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const IMAGE_BUCKET = 'recipestoreimages';

const REGION = 'ap-southeast-2';

const BUCKET_URL = 'https://recipestoreimages.s3.ap-southeast-2.amazonaws.com/';

const client = new S3Client({ region: REGION });

/**
 * Converst the provided data URL to a binary image, uploads this image to S3
 * then calls the callback with the uploaded URL or an error message.
 *
 * @param dataUrl Data URL of the image to upload.
 * @param callback Called with uploaded URL and error.
 */
export function uploadImage(
  dataUrl: string,
  callback: (url: string | null, err: string | null) => void
) {
  let uuid = randomUUID();
  let request = new PutObjectCommand({
    Body: Buffer.from(dataUrl, 'base64url'),
    Bucket: IMAGE_BUCKET,
    Key: uuid,
  });

  client
    .send(request)
    .then((resp) => {
      if (resp['$metadata'].httpStatusCode != 200) {
        callback(null, resp['Code']);
      } else {
        callback(BUCKET_URL + uuid, null);
      }
    })
    .catch((err) => callback(null, String(err)));
}

export function ensureUploaded(
  url: string,
  callback: (url: string | null, err: string | null) => void
) {
  if (process.env.NODE_ENV != 'TESTING' && url.startsWith('data:')) {
    uploadImage(url, callback);
  } else {
    callback(url, null);
  }
}
