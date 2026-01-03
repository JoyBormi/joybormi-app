import * as ImagePicker from 'expo-image-picker';

export interface UploadedFile {
  uri: string;
  name: string;
  type: string;
  size?: number;
}

export interface ImagePickerOptions {
  allowsEditing?: boolean;
  aspect?: [number, number];
  quality?: number;
  allowsMultipleSelection?: boolean;
  selectionLimit?: number;
}

/**
 * Request camera permissions
 */
export const requestCameraPermission = async (): Promise<boolean> => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  return status === 'granted';
};

/**
 * Request media library permissions
 */
export const requestMediaLibraryPermission = async (): Promise<boolean> => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return status === 'granted';
};

/**
 * Pick a single image from the media library
 */
export const pickImage = async (
  options: ImagePickerOptions = {},
): Promise<UploadedFile | null> => {
  const hasPermission = await requestMediaLibraryPermission();
  if (!hasPermission) {
    throw new Error('Media library permission denied');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: options.allowsEditing ?? true,
    aspect: options.aspect ?? [1, 1],
    quality: options.quality ?? 0.8,
    allowsMultipleSelection: false,
  });

  if (result.canceled || !result.assets[0]) {
    return null;
  }

  const asset = result.assets[0];
  return {
    uri: asset.uri,
    name: asset.fileName || `image-${Date.now()}.jpg`,
    type: asset.mimeType || 'image/jpeg',
    size: asset.fileSize,
  };
};

/**
 * Pick multiple images from the media library
 */
export const pickMultipleImages = async (
  options: ImagePickerOptions = {},
): Promise<UploadedFile[]> => {
  const hasPermission = await requestMediaLibraryPermission();
  if (!hasPermission) {
    throw new Error('Media library permission denied');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: false,
    quality: options.quality ?? 0.8,
    allowsMultipleSelection: true,
    selectionLimit: options.selectionLimit ?? 10,
  });

  if (result.canceled || !result.assets.length) {
    return [];
  }

  return result.assets.map((asset, index) => ({
    uri: asset.uri,
    name: asset.fileName || `image-${Date.now()}-${index}.jpg`,
    type: asset.mimeType || 'image/jpeg',
    size: asset.fileSize,
  }));
};

/**
 * Take a photo with the camera
 */
export const takePhoto = async (
  options: ImagePickerOptions = {},
): Promise<UploadedFile | null> => {
  const hasPermission = await requestCameraPermission();
  if (!hasPermission) {
    throw new Error('Camera permission denied');
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: options.allowsEditing ?? true,
    aspect: options.aspect ?? [1, 1],
    quality: options.quality ?? 0.8,
  });

  if (result.canceled || !result.assets[0]) {
    return null;
  }

  const asset = result.assets[0];
  return {
    uri: asset.uri,
    name: asset.fileName || `photo-${Date.now()}.jpg`,
    type: asset.mimeType || 'image/jpeg',
    size: asset.fileSize,
  };
};

/**
 * Upload file to server
 * @param file - File to upload
 * @param endpoint - API endpoint
 * @param fieldName - Form field name (default: 'file')
 */
export const uploadFile = async (
  file: UploadedFile,
  endpoint: string,
  fieldName: string = 'file',
): Promise<{ url: string }> => {
  const formData = new FormData();

  // @ts-expect-error - FormData accepts this format in React Native
  formData.append(fieldName, {
    uri: file.uri,
    name: file.name,
    type: file.type,
  });

  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  if (!response.ok) {
    throw new Error('File upload failed');
  }

  return await response.json();
};

/**
 * Upload multiple files to server
 */
export const uploadMultipleFiles = async (
  files: UploadedFile[],
  endpoint: string,
  fieldName: string = 'files',
): Promise<{ urls: string[] }> => {
  const formData = new FormData();

  files.forEach((file, index) => {
    // @ts-expect-error - FormData accepts this format in React Native
    formData.append(`${fieldName}[${index}]`, {
      uri: file.uri,
      name: file.name,
      type: file.type,
    });
  });

  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  if (!response.ok) {
    throw new Error('Files upload failed');
  }

  return await response.json();
};
