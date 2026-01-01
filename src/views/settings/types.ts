export interface SettingsGroup {
  id: string;
  title?: string;
  items: ISettingsItem[];
}

export type SettingsItemType =
  | 'navigation'
  | 'toggle'
  | 'action'
  | 'info'
  | 'profile'
  | 'userType';

export interface ISettingsItem {
  id: string;
  type: SettingsItemType;
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  iconBgColor?: string;
  value?: string | boolean;
  badge?: string | number;
  destructive?: boolean;
  withdraw?: boolean;
  onPress?: () => void;
  href?: string;
}
