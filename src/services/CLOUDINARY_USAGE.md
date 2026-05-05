# Cloudinary Usage Guide

## Configuration
- Cloud Name: dfhgqw25v
- Upload Preset: expo_unsigned
- API Key: 3dqO4faUhy9QksZYN4HpsHxdPng

## Features
✅ Free tier: 25GB storage + 25GB bandwidth/month
✅ No authentication required (unsigned uploads)
✅ Automatic image optimization
✅ On-the-fly transformations
✅ CDN delivery worldwide

## Usage Examples

### 1. Upload Task Photo
```typescript
import CloudinaryService from '../services/cloudinary';

const handleUploadTaskPhoto = async (taskId: string, imageUri: string) => {
  try {
    const url = await CloudinaryService.uploadTaskPhoto(taskId, imageUri);
    console.log('Uploaded URL:', url);
    // Save URL to Firestore
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### 2. Upload Kid Avatar
```typescript
const handleUploadAvatar = async (kidId: string, imageUri: string) => {
  const url = await CloudinaryService.uploadKidAvatar(kidId, imageUri);
  // Update kid document with avatar URL
};
```

### 3. Get Thumbnail (Optimized for Lists)
```typescript
const thumbnailUrl = CloudinaryService.getThumbnailUrl(originalUrl, 200, 200);
// Use thumbnailUrl in FlatList for better performance
```

### 4. Get Optimized URL
```typescript
const optimizedUrl = CloudinaryService.getOptimizedUrl(originalUrl);
// Auto quality + format optimization
```

## Image Transformations

### Thumbnail (200x200, cropped)
```
Original: https://res.cloudinary.com/dfhgqw25v/image/upload/v123/image.jpg
Thumbnail: https://res.cloudinary.com/dfhgqw25v/image/upload/w_200,h_200,c_fill/v123/image.jpg
```

### Optimized (auto quality + format)
```
https://res.cloudinary.com/dfhgqw25v/image/upload/q_auto,f_auto/v123/image.jpg
```

### Custom Size
```
https://res.cloudinary.com/dfhgqw25v/image/upload/w_500,h_300,c_scale/v123/image.jpg
```

## Folder Structure
- chorequest/tasks/ - Task completion photos
- chorequest/avatars/kids/ - Kid profile pictures
- chorequest/avatars/parents/ - Parent profile pictures
- chorequest/rewards/ - Reward images
- chorequest/goals/ - Goal images

## Best Practices
1. Always use thumbnails in lists (better performance)
2. Use optimized URLs for detail views
3. Validate images before upload
4. Handle upload errors gracefully
5. Show loading states during upload

## Error Handling
```typescript
try {
  const url = await CloudinaryService.uploadImage(uri, 'tasks');
} catch (error) {
  if (error.message.includes('network')) {
    // Show network error
  } else if (error.message.includes('size')) {
    // Show size limit error
  } else {
    // Generic error
  }
}
```

## Free Tier Limits
- Storage: 25GB
- Bandwidth: 25GB/month
- Transformations: 25,000/month
- Image uploads: Unlimited
- Video: Not included in free tier

For ChoreQuest, this is more than enough for thousands of users!
