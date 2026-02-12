import {
  BottomSheetModal,
  useBottomSheetTimingConfigs,
} from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import React, {
  forwardRef,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Dimensions, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScrollSheet } from '@/components/bottom-sheet';
import Icons from '@/components/icons';
import { Button, Text } from '@/components/ui';
import { IMAGE_CATEGORIES } from '@/constants/global.constants';
import { cn } from '@/lib/utils';
import { IFile } from '@/types/file.type';
import {
  DEFAULT_PROFILE_PHOTO_CATEGORIES,
  ProfilePhotoCategory,
  ProfilePhotoCategoryOption,
} from '@/views/profile/constants';

interface UploadPhotosSheetProps {
  onUpload: (photos: { uri: string; category: ProfilePhotoCategory }[]) => void;
  onDelete?: (fileId: string) => void;
  onReplace?: (fileId: string) => void;
  value?: IFile | null;
  setValue?: (photo: IFile | null) => void;
  categories?: ProfilePhotoCategoryOption[];
  allowMultiple?: boolean;
}

export const UploadPhotosSheet = forwardRef<
  BottomSheetModal,
  UploadPhotosSheetProps
>(
  (
    {
      onUpload,
      onDelete,
      onReplace,
      value,
      setValue,
      categories,
      allowMultiple = true,
    },
    ref,
  ) => {
    const insets = useSafeAreaInsets();
    const animationConfigs = useBottomSheetTimingConfigs({ duration: 150 });
    const pickerWidth = Dimensions.get('window').width - 48;
    const thumbSize = (pickerWidth - 16) / 3;

    const isEditMode = Boolean(value);

    const resolvedCategories = categories ?? DEFAULT_PROFILE_PHOTO_CATEGORIES;
    const defaultCategory =
      resolvedCategories.find(
        (category) => category.value === IMAGE_CATEGORIES.other,
      )?.value ??
      resolvedCategories[0]?.value ??
      IMAGE_CATEGORIES.other;

    const [selectedPhotos, setSelectedPhotos] = useState<
      { uri: string; category: ProfilePhotoCategory }[]
    >([]);

    const [selectedPhoto, setSelectedPhoto] = useState<{
      uri: string;
      category: ProfilePhotoCategory;
    } | null>(null);

    const [selectedCategory, setSelectedCategory] =
      useState<ProfilePhotoCategory>(defaultCategory);
    const categoryLabelMap = useMemo(
      () =>
        resolvedCategories.reduce(
          (acc, category) => ({ ...acc, [category.value]: category.label }),
          {} as Record<ProfilePhotoCategory, string>,
        ),
      [resolvedCategories],
    );

    /* -------------------- sync value -------------------- */

    useEffect(() => {
      if (value) {
        setSelectedPhoto({
          uri: value.url,
          category: value.category as ProfilePhotoCategory,
        });
        setSelectedCategory(value.category as ProfilePhotoCategory);
        setSelectedPhotos([]);
      } else {
        setSelectedPhoto(null);
        setSelectedPhotos([]);
        setSelectedCategory(defaultCategory);
      }
    }, [value, defaultCategory]);

    /* -------------------- handlers -------------------- */

    const handleClose = useCallback(() => {
      (ref as React.RefObject<BottomSheetModal>).current?.dismiss();
      setSelectedPhotos([]);
      setSelectedPhoto(null);
      setSelectedCategory(defaultCategory);
      setValue?.(null);
    }, [defaultCategory, ref, setValue]);

    const pickImages = useCallback(async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: !isEditMode && allowMultiple,
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
          if (!allowMultiple) {
            setSelectedPhotos(newPhotos.slice(0, 1));
            return;
          }
          setSelectedPhotos((prev) => {
            const existingUris = new Set(prev.map((photo) => photo.uri));
            const deduped = newPhotos.filter(
              (photo) => !existingUris.has(photo.uri),
            );
            return [...prev, ...deduped];
          });
        }
      }
    }, [allowMultiple, isEditMode, selectedCategory]);

    const handleRemovePhoto = useCallback((index: number) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setSelectedPhotos((prev) => prev.filter((_, i) => i !== index));
    }, []);

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
      <ScrollSheet
        ref={ref}
        index={0}
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

          {/* Category (ALWAYS visible) */}
          <View className="flex-row flex-wrap gap-2">
            {resolvedCategories.map((cat) => {
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

          {/* Image / Picker */}
          {isEditMode ? (
            selectedPhoto ? (
              <Pressable
                onPress={pickImages}
                className="relative overflow-hidden rounded-2xl"
                style={{ width: 208, height: 208, alignSelf: 'center' }}
              >
                <Image
                  source={{ uri: selectedPhoto.uri }}
                  style={{ width: 208, height: 208, borderRadius: 16 }}
                  contentFit="cover"
                />
                <View className="absolute bottom-2 right-2 bg-black/60 rounded-full p-2">
                  <Icons.Pencil size={16} className="text-white" />
                </View>
              </Pressable>
            ) : (
              <Pressable
                onPress={pickImages}
                className="items-center justify-center rounded-2xl border-2 border-dashed border-primary/30 self-center"
                style={{ width: 208, height: 208 }}
              >
                <Icons.Plus size={32} className="text-primary" />
                <Text className="font-subtitle text-foreground mt-2">
                  Select Photos
                </Text>
              </Pressable>
            )
          ) : (
            <View className="gap-3">
              {/* Selected photos grid with remove */}
              {selectedPhotos.length > 0 ? (
                <View className="flex-row flex-wrap gap-2">
                  {selectedPhotos.map((photo, index) => (
                    <View
                      key={`${photo.uri}-${index}`}
                      className="relative"
                      style={{ width: thumbSize, height: thumbSize }}
                    >
                      <Image
                        source={{ uri: photo.uri }}
                        style={{
                          width: thumbSize,
                          height: thumbSize,
                          borderRadius: 12,
                        }}
                        contentFit="cover"
                      />
                      <View className="absolute left-1.5 top-1.5 rounded-full bg-black/70 px-2 py-0.5">
                        <Text className="text-[10px] font-subtitle text-white">
                          {categoryLabelMap[photo.category]}
                        </Text>
                      </View>
                      <Pressable
                        onPress={() => handleRemovePhoto(index)}
                        className="absolute -top-1.5 -right-1.5 bg-destructive rounded-full p-1"
                      >
                        <Icons.X
                          size={12}
                          className="text-destructive-foreground"
                        />
                      </Pressable>
                    </View>
                  ))}
                </View>
              ) : null}

              {/* Add more / initial picker */}
              <Pressable
                onPress={pickImages}
                className="flex-row items-center justify-center gap-2 rounded-lg border-2 border-dashed border-primary/30 py-5"
                style={{ width: pickerWidth }}
              >
                <Icons.Plus size={20} className="text-primary" />
                <Text className="font-subtitle text-primary">
                  {selectedPhotos.length > 0 && allowMultiple
                    ? 'Add More'
                    : selectedPhotos.length > 0
                      ? 'Replace Photo'
                      : 'Select Photos'}
                </Text>
              </Pressable>
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
      </ScrollSheet>
    );
  },
);

UploadPhotosSheet.displayName = 'UploadPhotosSheet';
