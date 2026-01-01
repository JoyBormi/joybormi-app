import { Dispatch, RefObject, SetStateAction } from 'react';
import { SearchBarCommands, SearchBarProps } from 'react-native-screens';

import { ThemeHex } from '@/styles/themes';

interface ISearchBox {
  ref: RefObject<SearchBarCommands>;
  showSearch: boolean;
  setShowSearch: Dispatch<SetStateAction<boolean>>;
  colors: ThemeHex['dark']['colors'];
}

export function searchbox({
  ref,
  colors,
  showSearch,
  setShowSearch,
}: ISearchBox): SearchBarProps | undefined {
  const hideSearch = () => {
    setShowSearch(false);
  };

  return showSearch
    ? {
        ref,
        placement: 'stacked',
        shouldShowHintSearchIcon: true,
        inputType: 'text',
        placeholder: 'Search...',
        cancelButtonText: 'Cancel',
        autoFocus: true,
        autoCapitalize: 'none',
        disableBackButtonOverride: false,
        tintColor: colors.primary,
        hideWhenScrolling: true,
        onBlur: hideSearch,
        onCancelButtonPress: hideSearch,
        onSearchButtonPress: hideSearch,
      }
    : undefined;
}
