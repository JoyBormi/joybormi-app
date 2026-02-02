import {
  BottomSheetModal,
  useBottomSheetTimingConfigs,
} from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import React, {
  forwardRef,
  Fragment,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Image, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Icons from '@/components/icons';
import CustomBottomSheet from '@/components/shared/bottom-sheet';
import { Button, Text } from '@/components/ui';
import { IMAGE_CATEGORIES } from '@/constants/global.constants';
import { cn } from '@/lib/utils';
import { IFile } from '@/types/file.type';

type PhotoCategory = (typeof IMAGE_CATEGORIES)[keyof typeof IMAGE_CATEGORIES];

interface UploadPhotosSheetProps {
  onUpload: (photos: { uri: string; category: PhotoCategory }[]) => void;
  onDelete?: (fileId: string) => void;
  onReplace?: (fileId: string) => void;
  value?: IFile | null;
  setValue?: (photo: IFile) => void;
}

export const UploadPhotosSheet = forwardRef<
  BottomSheetModal,
  UploadPhotosSheetProps
>(({ onUpload, onDelete, onReplace, value }, ref) => {
  const insets = useSafeAreaInsets();
  const animationConfigs = useBottomSheetTimingConfigs({ duration: 150 });

  const isEditMode = Boolean(value);

  const [selectedPhotos, setSelectedPhotos] = useState<
    { uri: string; category: PhotoCategory }[]
  >([]);

  const [selectedPhoto, setSelectedPhoto] = useState<{
    uri: string;
    category: PhotoCategory;
  } | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<PhotoCategory>(
    IMAGE_CATEGORIES.other,
  );

  const categories = [
    { value: IMAGE_CATEGORIES.interior, label: 'Interior', icon: 'Home' },
    { value: IMAGE_CATEGORIES.exterior, label: 'Exterior', icon: 'Store' },
    { value: IMAGE_CATEGORIES.service, label: 'Service', icon: 'Scissors' },
    { value: IMAGE_CATEGORIES.team, label: 'Team', icon: 'Users' },
    { value: IMAGE_CATEGORIES.other, label: 'Other', icon: 'Image' },
  ];

  /* -------------------- sync value -------------------- */

  useEffect(() => {
    if (value) {
      setSelectedPhoto({
        uri: value.url,
        category: value.category as PhotoCategory,
      });
      setSelectedCategory(value.category as PhotoCategory);
      setSelectedPhotos([]);
    } else {
      setSelectedPhoto(null);
      setSelectedPhotos([]);
      setSelectedCategory(IMAGE_CATEGORIES.other);
    }
  }, [value]);

  /* -------------------- handlers -------------------- */

  const handleClose = useCallback(() => {
    (ref as React.RefObject<BottomSheetModal>).current?.dismiss();
    setSelectedPhotos([]);
    setSelectedPhoto(null);
    setSelectedCategory(IMAGE_CATEGORIES.other);
  }, [ref]);

  const pickImages = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: !isEditMode,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      if (isEditMode) {
        setSelectedPhoto({
          uri: result.assets[0].uri,
          category: selectedCategory,
        });
      } else {
        const newPhotos = result.assets.map((asset) => ({
          uri: asset.uri,
          category: selectedCategory,
        }));
        setSelectedPhotos((prev) => [...prev, ...newPhotos]);
      }
    }
  }, [isEditMode, selectedCategory]);

  /**
   * Upload photos
   */
  const handleUpload = useCallback(() => {
    if (selectedPhotos.length === 0) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onUpload(selectedPhotos);
    handleClose();
  }, [selectedPhotos, onUpload, handleClose]);

  /**
   * Replace photo
   */
  /**
   * Replace photo (smart: meta-only vs full upload)
   */
  const handleReplace = useCallback(() => {
    if (!value || !selectedPhoto) return;

    const imageChanged = selectedPhoto.uri !== value.url;
    const categoryChanged = selectedCategory !== value.category;

    // nothing changed → do nothing
    if (!imageChanged && !categoryChanged) {
      handleClose();
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // image changed → full upload
    if (imageChanged) {
      onUpload([
        {
          uri: selectedPhoto.uri,
          category: selectedCategory,
        },
      ]);
      handleClose();
      return;
    }

    // only metadata changed → replace (no upload)
    if (categoryChanged) {
      onReplace?.(value.id);
      handleClose();
    }
  }, [
    value,
    selectedPhoto,
    selectedCategory,
    onUpload,
    onReplace,
    handleClose,
  ]);

  /**
   * Delete photo
   */
  const handleDelete = useCallback(() => {
    if (!value || !onDelete) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onDelete(value.id);
    handleClose();
  }, [value, onDelete, handleClose]);

  /* -------------------- render -------------------- */

  return (
    <CustomBottomSheet
      ref={ref}
      index={0}
      scrollEnabled
      snapPoints={['90%']}
      animationConfigs={animationConfigs}
      scrollConfig={{
        contentContainerStyle: {
          paddingBottom: insets.bottom + 80,
        },
      }}
      onDismiss={handleClose}
    >
      <View className="gap-6 pt-4">
        {/* Header */}
        <Text className="font-heading text-foreground">
          {isEditMode ? 'Edit Photo' : 'Upload Photos'}
        </Text>

        {/* Image / Picker */}
        <Pressable
          onPress={pickImages}
          className={cn(
            'self-center items-center justify-center',
            isEditMode
              ? 'w-52 h-52'
              : 'w-52 h-52 rounded-2xl border-2 border-dashed border-primary/30',
          )}
        >
          {isEditMode && selectedPhoto ? (
            <View className="relative">
              <Image
                source={{ uri: selectedPhoto.uri }}
                className="w-52 h-52 rounded-2xl"
              />
              {/* Pen icon */}
              <View className="absolute bottom-2 right-2 bg-black/60 rounded-full p-2">
                <Icons.Pencil size={16} className="text-white" />
              </View>
            </View>
          ) : (
            <>
              <Icons.Plus size={32} className="text-primary" />
              <Text className="font-subtitle text-foreground mt-2">
                Select Photos
              </Text>
            </>
          )}
        </Pressable>

        {/* Category (ALWAYS visible) */}
        <View className="flex-row flex-wrap gap-2">
          {categories.map((cat) => {
            const Icon = Icons[
              cat.icon as keyof typeof Icons
            ] as React.ComponentType<{ size: number; className: string }>;
            const isSelected = selectedCategory === cat.value;

            return (
              <Pressable
                key={cat.value}
                onPress={() => setSelectedCategory(cat.value)}
                className={cn(
                  'flex-row items-center gap-2 px-2.5 py-1.5 rounded-xl border',
                  isSelected
                    ? 'bg-primary/10 border-primary'
                    : 'bg-card/50 border-border/50',
                )}
              >
                <Icon
                  size={18}
                  className={cn(
                    isSelected ? 'text-primary' : 'text-muted-foreground',
                  )}
                />
                <Text
                  className={cn(
                    'font-subtitle',
                    isSelected ? 'text-primary' : 'text-foreground',
                  )}
                >
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Grid (upload mode only) */}
        {!isEditMode && selectedPhotos.length > 0 && (
          <View className="flex-row flex-wrap gap-2">
            {selectedPhotos.map((photo, index) => (
              <Image
                key={index}
                source={{ uri: photo.uri }}
                className="w-[31%] aspect-square rounded-xl"
              />
            ))}
          </View>
        )}

        {/* Actions (flex row) */}
        <View className="flex-row gap-3 mt-10">
          {!isEditMode && selectedPhotos.length > 0 && (
            <Button size="lg" className="flex-1" onPress={handleUpload}>
              <Text>Upload</Text>
            </Button>
          )}

          {isEditMode && (
            <Fragment>
              {onDelete && (
                <Button
                  size="lg"
                  variant="destructive"
                  className="flex-1"
                  onPress={handleDelete}
                >
                  <Text>Delete</Text>
                </Button>
              )}

              <Button size="lg" className="flex-1" onPress={handleReplace}>
                <Text>Replace</Text>
              </Button>
            </Fragment>
          )}
        </View>
      </View>
    </CustomBottomSheet>
  );
});

UploadPhotosSheet.displayName = 'UploadPhotosSheet';
