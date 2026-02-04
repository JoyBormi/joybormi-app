import * as Haptics from 'expo-haptics';

export class Feedback {
  static light() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  static medium() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  static heavy() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }

  static soft() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
  }

  static success() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  static warning() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }

  static error() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }

  static selection() {
    Haptics.selectionAsync();
  }
}
