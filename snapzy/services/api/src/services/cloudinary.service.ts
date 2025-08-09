import crypto from 'crypto';

export function signUpload(params: Record<string, string | number>) {
  const secret = process.env.CLOUDINARY_API_SECRET as string;
  if (!secret) throw new Error('CLOUDINARY_API_SECRET missing');
  const sorted = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&');
  const toSign = `${sorted}${secret ? `&${''}` : ''}`.replace(/&$/, '');
  // Cloudinary signature: sha1 of query string + secret
  const signature = crypto.createHash('sha1').update(`${sorted}${secret}`).digest('hex');
  return signature;
}