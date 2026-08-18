# ImageKit.io Configuration Guide

## Configuration Details

The application is configured to use ImageKit.io for image uploads and optimization.

### Configuration Values

\`\`\`typescript
export const IMAGEKIT_CONFIG = {
  publicKey: "public_DCAr0Ht+qi8o+ZpjRo3vbWV3rR8=",
  urlEndpoint: "https://ik.imagekit.io/aurigaracing",
  imagekitId: "aurigaracing",
}
\`\`\`

### Environment Variable Required

Add this to your Vercel project environment variables:

\`\`\`
IMAGEKIT_PRIVATE_KEY=private_4FsQZjjuYP+kssHxDqrMbbU5iPs=
\`\`\`

## How It Works

1. **Authentication Flow**:
   - Client requests auth parameters from `/api/imagekit-auth`
   - Server generates signature using private key
   - Client uploads image to ImageKit with auth parameters

2. **Upload Process**:
   - User selects an image file
   - File is validated (type and size)
   - Auth parameters are fetched from server
   - File is uploaded to ImageKit with signature
   - ImageKit returns the uploaded file URL

3. **Components Using ImageKit**:
   - `components/imagekit-upload.tsx` - Reusable upload component
   - `components/product-form.tsx` - Product images
   - `components/category-form.tsx` - Category images

## Testing Upload

1. Go to Admin → Products → New Product
2. Click on the "Main Product Image" upload area
3. Select an image file
4. Wait for upload to complete
5. Image URL should appear in the preview

## Troubleshooting

If uploads fail, check:
- Environment variable `IMAGEKIT_PRIVATE_KEY` is set in Vercel
- Public key matches in `lib/imagekit.ts`
- Console logs show auth parameters being generated
- Network tab shows successful API calls

## Console Logs

The upload process includes debug logs prefixed with `[v0]`:
- `[v0] Starting ImageKit upload...`
- `[v0] Got auth data:`
- `[v0] Uploading to ImageKit...`
- `[v0] Upload successful:`

Check browser console for these logs during upload.
