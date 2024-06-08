import { StaticImageData } from "next/image";

export type TPropertyServiceTypes =
  | "property"
  | "property/roomConfig"
  | "property/roomConfig/remove"
  | "property/service/remove"
  | "property/remove"
  | "bedrooms"
  | "commons"
  | "services";

export type TPhotoVideo = {
  url: string;
  filename: string;
  fileExtension: string;
};

export type TProperty = {
  userId: string;
  id: number;
  title: string;
  body: string;
};

export type TStatus = {
  type: string;
  date: string;
};

export type TPropertyRoomDefaults = string;

export type TPropertyOption = {
  type: "bedroom" | "kitchen" | "dining" | "laundry-area" | "living-room";
  choices: {
    type: string;
    label: string;
    list: {
      id: string;
      value: string;
      label: string;
    }[];
  }[];
};

export type TPropertyDetail = {
  uuid: string;
  name: string;
  title?: string;
  address: string;
  developer: string;
  totalUnits: string;
  region: string;
  facilities: string[];
  aroundTheArea: string[];
  subletting: boolean;
  blockNumber: string;
  description: string;
  postalCode: string;
  floorNumber: string;
  floorPlan: TPhotoVideo;
  coverPhoto: TPhotoVideo;
  videoWalkthrough: TPhotoVideo;
  liftLobby: string;
  nearestGate: string;
  unitNumber: string;
  unitSize: string;
  isPublished: boolean;
  entireHousePrice?: {
    currency: string;
    amount: string;
  };
  landlordMonthlyRental?: {
    currency: string;
    amount: string;
  };
  bedrooms: TPropertyBedroom[];
  commons: TPropertyCommon[];
  services: TPropertyOthersService[];
  status: TStatus[];
  roomDefaults?: TPropertyRoomDefaults;
  whatsInside?: {
    bedrooms: number;
    bathrooms: number;
  };
};

export type TPropertyState = {
  type: "";
  loading: boolean;
  creating: boolean;
  created: boolean;
  updating: boolean;
  updated: boolean;
  removing: boolean;
  removed: boolean;
  user: {
    fetched: boolean;
    new: TPropertyDetail;
    properties: TPropertyDetail[];
  };
  error?: {
    code: string;
    message: string;
    value?: string;
  } | null;
  available: {
    name: string;
    address: string;
    developer: string;
    completionYear?: string;
    totalUnits: string;
    region: string;
    facilities: string[];
    aroundTheArea: string[];
  }[];
};

export type TPropertyBedroom = {
  uuid: string;
  title: string;
  furnitures: string[];
  bathrooms: string[];
  description: string;
  rented?: boolean;
  availableFrom?: string;
  capacity?: string;
  roomPhoto: TPhotoVideo[];
  roomVideo: TPhotoVideo[];
  roomPrice?: {
    amount: string;
    currency: string;
  };
  contract?: TODO;
  status: TStatus[];
};

export type TPropertyCommon = {
  uuid: string;
  type: string;
  name: string;
  facilities?: string[];
  roomPhoto?: TPhotoVideo[];
  roomVideo?: TPhotoVideo[];
};

export type TPropertyOthersService = {
  uuid: string;
  type: string;
  name: string;
  ssid?: string;
  maxAmountCovered?: string;
  housekeepingRecurrences?: string;
  password?: string;
};

export type TPropertyService =
  | TPropertyBedroom
  | TPropertyOthersService
  | TPropertyCommon;

export type TPropertyBedroomPayload = {
  uuid: string;
  type: string;
  title: string;
  description: string;
  bathroom: string[];
  furnituresFittings: string[];
  capacity: string;
  roomPrice: {
    currency: string;
    amount: string;
  };
  roomPhoto?: TPhotoVideo[];
  roomVideo?: TPhotoVideo[];
};

export type TPropertyCommonPayload = {
  name: string;
  type: string;
  facilities?: string[];
};

export type TPropertyMiscPayload = {
  name: string;
  ssid?: string;
  password?: string;
};

export type TPropertyRemovePayload = {
  serviceType?: string;
  uuid?: string;
  roomType?: string;
  choiceType?: string;
};

export interface IPropertyServicePayload {
  propertyId: string;
  type: TPropertyServiceTypes;
  input: TPropertyServiceInput;
}

export interface IPropertyPayload {
  uuid?: string;
  name: string;
  address: string;
  blockNumber: string;
  developer: string;
  totalUnits: string;
  region: string;
  facilities: string[];
  aroundTheArea: string[];
  postalCode: string;
  floorNumber: string;
  unitNumber: string;
  description: string;
  liftLobby: string;
  nearestGate: string;
  unitSize: string;
  coverPhoto: TPhotoVideo;
  floorPlan: TPhotoVideo;
  videoWalkthrough: TPhotoVideo;
  isPublished: boolean;
  entireHousePrice: {
    currency?: string;
    amount?: string;
  };
  landlordMonthlyRental: {
    currency?: string;
    amount?: string;
  };
  bedrooms: {
    uuid: string;
    title: string;
    furnitures: string[];
    bathrooms: string[];
    description: string;
  }[];
  commons: TPropertyCommon[];
  services: TPropertyOthersService[];
}

export type TPropertyServiceInput =
  | TPropertyBedroomPayload
  | TPropertyCommonPayload
  | TPropertyMiscPayload
  | TPropertyRemovePayload;

export interface IValidationErrors {
  errorMessage: string;
  field_errors: Record<string, string>;
}

export interface ICreateUserPropertyResponse {
  user: IPropertyPayload;
  success: boolean;
}
