export interface BlogType {
  _id?: string;
  title?: string;
  shortDescription?: string;
  author?: string;
  estReadTime?: number;
  cover: {
    url: string;
    fileName: string;
    imageId: string;
  } | null;
  content?: string;
  status: "Draft" | "Published";
}

interface actionStateOk {
  ok?: boolean;
  message: string;
}
interface actionStateErr {
  error: string;
}

export type ActionStateType = actionStateOk | actionStateErr | null;

export interface ServiceAddonType {
  _id?: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  status: "active" | "on hold";
}

export interface ServiceType extends ServiceAddonType {
  addons: ServiceAddonType[];
}

export type DraftImgType = { url: string; imageId: string; fileName: string };

export interface LoyaltyPointType {
  bookingsForPoint: number;
  referralsForPoint: number;
  pointValue: number;
  isActive: boolean;
}

export interface BlogType {
  _id?: string;
  title?: string;
  shortDescription?: string;
  author?: string;
  estReadTime?: number;
  cover: {
    url: string;
    fileName: string;
    imageId: string;
  } | null;
  content?: string;
  status: "Draft" | "Published";
}

export interface LateestBlogType {
  _id: string;
  title: string;
  shortDescription: string;
  cover: {
    url?: string;
    imageId?: string;
    fileName?: string;
  };
  createdAt: Date;
}

export interface blogType {
  _id: string;
  admin: string;
  title?: string;
  shortDescription?: string;
  author?: string;
  estReadTime?: number;
  cover?: {
    url?: string;
    imageId?: string;
    fileName?: string;
  };
  content?: string;
  status: "Draft" | "Published";
  createdAt: Date;
  updatedAt: Date;
}

export interface UserData {
  fname: string;
  lname: string;
  email: string;
  phone: string;
  password: string;
  role: "customer";
}

export interface ClientDetails {
  fname: string;
  lname: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  emergencyContact: string;
  medicalConditions?: string;
  medications?: string;
  injuries?: string;
  massagePressure?: string;
  focusAreas?: string;
  allergies?: string;
  consent: boolean;
}

export interface CustomerAddonType {
  _id: string;
  name: string;
  description?: string;
  price: number;
  duration?: number;
  status?: "active" | "on hold";
}

export interface CustomerServiceType {
  _id: string;
  name: string;
  description?: string;
  price: number;
  duration?: number;
  status?: "active" | "on hold";
  addons: CustomerAddonType[];
}

export interface CustomerAptType {
  _id: string;
  client: string;
  service: {
    bookedService: string;
    name: string;
    description: string;
    price: number;
    duration?: number;
  };
  addons: {
    bookedAddon: string;
    name: string;
    description?: string;
    price: number;
    duration?: number;
  }[];
  date: string; // ISO date (YYYY-MM-DD)
  bookedTime: { from: string; to: string };
  discount: number;
  price: number;
  status: "pending" | "completed" | "cancelled";
  note?: string;
  reschedule: {
    isRescheduled: boolean;
    previousDates: [{ date: string; bookedTime: { from: string; to: string } }];
  };
  createdAt: Date;
}

export interface LoyaltyPointType {
  _id: string;
  client: string;
  referralLink: string;
  totalEarned: number;
  totalRedeemed: number;
  currentBalance: number;
  transactions: {
    type: "earn" | "redeem";
    source: "referral" | "booking";
    points: number;
    date: Date;
    details?: string;
  }[];
  createdAt: Date;
}

export interface AppointmentType {
  _id: string;
  admin: string;
  client: { _id: string; fname: string; lname: string };
  service: {
    bookedService: string;
    name: string;
    description: string;
    price: number;
    duration?: number;
  };
  addons: {
    bookedAddon: string;
    name: string;
    description?: string;
    price: number;
    duration?: number;
  }[];
  date: string; // ISO date (YYYY-MM-DD)
  bookedTime: { from: string; to: string };
  price: number;
  discount: number;
  status: "pending" | "completed" | "cancelled";
  note?: string;
  reschedule: {
    isRescheduled: boolean;
    previousDates: [{ date: string; bookedTime: { from: string; to: string } }];
  };
  datetime?: Date; // New computed field
  createdAt: Date;
}

export interface ClientDataType {
  admin: string;
  fname: string;
  lname: string;
  email: string;
  phone: string;
  dob: Date;
  gender: "Male" | "Female" | "Other";
  emergencyContact: string;
  medicalConditions?: string;
  medications?: string;
  injuries?: string;
  massagePressure?: "Light" | "Medium" | "Deep Tissue";
  focusAreas?: string;
  allergies?: string;
  consent: boolean;
}

export interface SOAPDataType {
  _id: string;
  appointment: string;
  client: string;
  admin: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  createdAt: Date;
}

export interface CouponType {
  _id: string;
  code: string;
  admin: string;
  client: string;
  pointsUsed: number;
  value: number;
  used: boolean;
}
