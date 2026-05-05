import { Platform } from 'react-native';
import CloudinaryService from '../services/cloudinary';

export const uploadImage = async (
  imageUri: string,
  type: 'task' | 'avatar' | 'reward' | 'goal',
  id: string
): Promise<string> => {
  try {
    let uploadedUrl: string;

    switch (type) {
      case 'task':
        uploadedUrl = await CloudinaryService.uploadTaskPhoto(id, imageUri);
        break;
      case 'avatar':
        uploadedUrl = await CloudinaryService.uploadKidAvatar(id, imageUri);
        break;
      case 'reward':
        uploadedUrl = await CloudinaryService.uploadRewardImage(id, imageUri);
        break;
      case 'goal':
        uploadedUrl = await CloudinaryService.uploadGoalImage(id, imageUri);
        break;
      default:
        throw new Error('Invalid upload type');
    }

    return uploadedUrl;
  } catch (error) {
    console.error('Image upload failed:', error);
    throw error;
  }
};

export const getOptimizedImageUrl = (imageUrl: string): string => {
  return CloudinaryService.getOptimizedUrl(imageUrl);
};

export const getThumbnailUrl = (imageUrl: string, size: number = 200): string => {
  return CloudinaryService.getThumbnailUrl(imageUrl, size, size);
};

// Validate image before upload
export const validateImage = (imageUri: string): boolean => {
  if (!imageUri) return false;
  
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const extension = imageUri.toLowerCase().substring(imageUri.lastIndexOf('.'));
  
  return validExtensions.includes(extension);
};

// Get file size (requires react-native-fs or similar)
export const getImageSize = async (imageUri: string): Promise<number> => {
  // Placeholder - implement with react-native-fs if needed
  return 0;
};

// Compress image before upload (optional)
export const compressImage = async (imageUri: string): Promise<string> => {
  // Placeholder - implement with react-native-image-resizer if needed
  return imageUri;
};
