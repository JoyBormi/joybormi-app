export interface IWorkingDayBreak {
  id: string;
  workingDayId: string;
  startTime: string; // Time string format "HH:mm:ss"
  endTime: string; // Time string format "HH:mm:ss"
  createdAt: string;
}

export interface IWorkingDay {
  id: string;
  scheduleId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // Time string format "HH:mm:ss"
  endTime: string; // Time string format "HH:mm:ss"
  createdAt: string;
  breaks?: IWorkingDayBreak[];
}

export interface ISpecialDayOff {
  id: string;
  scheduleId: string;
  year: number;
  month: number;
  day: number;
  startTime: string; // Time string format "HH:mm:ss"
  endTime: string; // Time string format "HH:mm:ss"
  createdAt: string;
}

export interface ISchedule {
  id: string;
  ownerUserId: string;
  ownerBrandId: string;
  createdAt: string;
  updatedAt: string;
  workingDays?: IWorkingDay[];
  daysOff?: ISpecialDayOff[];
}

export interface CreateWorkingDayPayload {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  breaks?: {
    startTime: string;
    endTime: string;
  }[];
}

export interface UpdateWorkingDayPayload {
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
  breaks?: {
    id?: string;
    startTime: string;
    endTime: string;
  }[];
}

export interface CreateSpecialDayOffPayload {
  year: number;
  month: number;
  day: number;
  startTime: string;
  endTime: string;
}

export interface UpdateSchedulePayload {
  workingDays?: CreateWorkingDayPayload[];
  daysOff?: CreateSpecialDayOffPayload[];
}
