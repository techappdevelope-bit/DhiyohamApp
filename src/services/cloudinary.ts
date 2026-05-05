class CloudinaryService {
  private cloudName = 'daankr2yg';
  private uploadPreset = 'dhiyoham_kids';
  private apiKey = '321649769298428';

  // Upload image to Cloudinary
  async uploadImage(imageUri: string, folder: string = 'chorequest'): Promise<string> {
    try {
      const formData = new FormData();
      
      // Extract filename from URI
      const filename = imageUri.split('/').pop() || 'image.jpg';
      
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: filename,
      } as any);
      
      formData.append('upload_preset', this.uploadPreset);
      formData.append('folder', folder);
      formData.append('api_key', this.apiKey);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return data.secure_url; // Return the HTTPS URL
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload image');
    }
  }

  // Upload task photo
  async uploadTaskPhoto(taskId: string, imageUri: string): Promise<string> {
    return this.uploadImage(imageUri, 'chorequest/tasks');
  }

  // Upload kid avatar
  async uploadKidAvatar(kidId: string, imageUri: string): Promise<string> {
    return this.uploadImage(imageUri, 'chorequest/avatars/kids');
  }

  // Upload parent avatar
  async uploadParentAvatar(parentId: string, imageUri: string): Promise<string> {
    return this.uploadImage(imageUri, 'chorequest/avatars/parents');
  }

  // Upload reward image
  async uploadRewardImage(rewardId: string, imageUri: string): Promise<string> {
    return this.uploadImage(imageUri, 'chorequest/rewards');
  }

  // Upload goal image
  async uploadGoalImage(goalId: string, imageUri: string): Promise<string> {
    return this.uploadImage(imageUri, 'chorequest/goals');
  }

  // Get thumbnail URL (Cloudinary transformation)
  getThumbnailUrl(imageUrl: string, width: number = 200, height: number = 200): string {
    // Insert transformation parameters into the URL
    return imageUrl.replace(
      '/upload/',
      `/upload/w_${width},h_${height},c_fill/`
    );
  }

  // Get optimized URL
  getOptimizedUrl(imageUrl: string): string {
    return imageUrl.replace(
      '/upload/',
      '/upload/q_auto,f_auto/'
    );
  }

  // Delete image (optional - requires authentication)
  async deleteImage(publicId: string): Promise<void> {
    // Note: Deletion requires server-side implementation with API secret
    // For unsigned uploads, you can't delete from client
    // Just keep this as a placeholder
    console.log('Delete image:', publicId);
  }
}

export default new CloudinaryService();
