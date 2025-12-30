export enum Major {
  BeautySalon = 'beautySalon',
  NailSalon = 'nailSalon',
  Spa = 'spa',
  MakeupArtist = 'makeupArtist',
  Barber = 'barber',
  HairSalon = 'hairSalon',
  MassageStudio = 'massageStudio',
  DentalClinic = 'dentalClinic',
  GeneralDoctor = 'generalDoctor',
  Dermatologist = 'dermatologist',
  Psychologist = 'psychologist',
  DiagnosticCenter = 'diagnosticCenter',
  LanguageTutor = 'languageTutor',
  Photographer = 'photographer',
  Videographer = 'videographer',
}

/**
 * Optimized Configuration
 */
export const EMOJI_MAP: Record<string, string> = {
  all: '✨',
  [Major.BeautySalon]: '💇‍♀️',
  [Major.NailSalon]: '💅',
  [Major.Spa]: '🧖‍♀️',
  [Major.MakeupArtist]: '💄',
  [Major.Barber]: '💇‍♂️',
  [Major.HairSalon]: '💇‍♀️',
  [Major.MassageStudio]: '💆',
  [Major.DentalClinic]: '🦷',
  [Major.GeneralDoctor]: '👨‍⚕️',
  [Major.Dermatologist]: '🧴',
  [Major.Psychologist]: '🧠',
  [Major.DiagnosticCenter]: '🧷',
  [Major.LanguageTutor]: '🗣️',
  [Major.Photographer]: '📸',
  [Major.Videographer]: '🎥',
};
