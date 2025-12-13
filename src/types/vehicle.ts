export interface VehicleType {
  id: string;
  name: string;
  icon?: string;
  categories: VehicleCategory[];
}

export interface VehicleCategory {
  id: string;
  name: string;
  subcategories: VehicleSubcategory[];
}

export interface VehicleSubcategory {
  id: string;
  name: string;
  description?: string;
}

export interface ChassisInfo {
  chassisManufacturer?: string;
  chassisModel?: string;
  bodyworkManufacturer?: string;
  bodyworkModel?: string;
}

export interface VehicleData {
  manufactureYear?: number;
  modelYear?: number;
  salePrice?: number;
  costPrice?: number;
  mileage?: number;
  licensePlate?: string;
  renavam?: string;
  chassisNumber?: string;
  busPrefix?: string;
  availableQuantity?: number;
  internalNotes?: string;
}

export interface ProductIdentification {
  productTitle?: string;
}

export interface SecondaryInfo {
  passengerCapacity?: number;
  condition?: 'new' | 'semiNew' | 'used';
  fuelType?: string;
  steeringType?: 'assisted' | 'hydraulic' | 'mechanical';
  singleOwner?: boolean;
  description?: string;
}

export type SeatType = 'conventional' | 'executive' | 'semiSleeper' | 'sleeper' | 'sleeperBed' | 'fixed';

export type SeatLocation = 'lowerFloor' | 'upperFloor' | 'front' | 'middle' | 'rear';

export interface SeatCompositionDetail {
  type: SeatType;
  quantity: number;
  location?: SeatLocation;
  notes?: string;
}

export interface SeatConfiguration {
  conventional?: number;
  executive?: number;
  semiSleeper?: number;
  sleeper?: number;
  sleeperBed?: number;
  fixed?: number;
}

export interface SeatComposition extends SeatConfiguration {
  totalCapacity?: number;
  compositionText?: string;
  compositionDetails?: SeatCompositionDetail[];
}

export interface VehicleOptionals {
  airConditioning?: boolean;
  legSupport?: boolean;
  curtain?: boolean;
  usb?: boolean;
  soundSystem?: boolean;
  monitor?: boolean;
  wifi?: boolean;
  packageHolder?: boolean;
  bathroom?: boolean;
  cabin?: boolean;
  coffeeMaker?: boolean;
  accessibility?: boolean;
  factoryRetarder?: boolean;
  optionalRetarder?: boolean;
  glasType?: 'glued' | 'tilting' | '';
}

export interface LocationInfo {
  address?: string;
  neighborhood?: string;
  cep?: string;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
}

export interface MediaUpload {
  interiorPhotos?: File[];
  exteriorPhotos?: File[];
  instrumentPhotos?: File[];
  treatedPhotos?: File[];
  documentPhotos?: File[];
  video?: File;
  videoUrl?: string;

  internalPhotos?: File[];
  externalPhotos?: File[];
}

export interface MediaUploadUrls {
  interiorPhotosUrls?: string[];
  exteriorPhotosUrls?: string[];
  instrumentPhotosUrls?: string[];
  treatedPhotosUrls?: string[];
  documentPhotosUrls?: string[];
  videoUrl?: string;
}

export interface UploadedMediaUrls {
  internalPhotosUrls?: string[];
  externalPhotosUrls?: string[];
  instrumentPhotosUrls?: string[];
  treatedPhotosUrls?: string[];
  documentPhotosUrls?: string[];
  videoUrl?: string;
}

export interface Vehicle extends
  ChassisInfo,
  VehicleData,
  ProductIdentification,
  SecondaryInfo,
  SeatComposition,
  VehicleOptionals,
  LocationInfo,
  MediaUpload {
  id?: string;
  vehicleType?: VehicleType;
  category?: VehicleCategory;
  subcategory?: VehicleSubcategory;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface VehiclePayload extends
  ChassisInfo,
  VehicleData,
  ProductIdentification,
  SecondaryInfo,
  SeatComposition,
  VehicleOptionals,
  LocationInfo,
  MediaUploadUrls {
  id?: string;
  vehicleTypeId?: string;
  categoryId?: string;
  subcategoryId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WizardStep {
  number: number;
  title: string;
  isValid: boolean;
  isCompleted: boolean;
}

export const getAllOriginalPhotosUrls = (media: MediaUploadUrls | UploadedMediaUrls): string[] => {
  const urls: string[] = [];

  if ('interiorPhotosUrls' in media && media.interiorPhotosUrls) {
    urls.push(...media.interiorPhotosUrls);
  }
  if ('internalPhotosUrls' in media && media.internalPhotosUrls) {
    urls.push(...media.internalPhotosUrls);
  }
  if ('exteriorPhotosUrls' in media && media.exteriorPhotosUrls) {
    urls.push(...media.exteriorPhotosUrls);
  }
  if ('externalPhotosUrls' in media && media.externalPhotosUrls) {
    urls.push(...media.externalPhotosUrls);
  }
  if ('instrumentPhotosUrls' in media && media.instrumentPhotosUrls) {
    urls.push(...media.instrumentPhotosUrls);
  }
  if ('documentPhotosUrls' in media && media.documentPhotosUrls) {
    urls.push(...media.documentPhotosUrls);
  }

  return urls;
};

export const getAllOriginalPhotosFiles = (media: MediaUpload): File[] => {
  const files: File[] = [];

  if (media.interiorPhotos) files.push(...media.interiorPhotos);
  if (media.internalPhotos) files.push(...media.internalPhotos);
  if (media.exteriorPhotos) files.push(...media.exteriorPhotos);
  if (media.externalPhotos) files.push(...media.externalPhotos);
  if (media.instrumentPhotos) files.push(...media.instrumentPhotos);
  if (media.documentPhotos) files.push(...media.documentPhotos);

  return files;
};

export const toVehiclePayload = (vehicle: Vehicle, uploadedUrls: MediaUploadUrls): VehiclePayload => {
  return {
    id: vehicle.id,
    vehicleTypeId: vehicle.vehicleType?.id,
    categoryId: vehicle.category?.id,
    subcategoryId: vehicle.subcategory?.id,
    chassisManufacturer: vehicle.chassisManufacturer,
    chassisModel: vehicle.chassisModel,
    bodyworkManufacturer: vehicle.bodyworkManufacturer,
    bodyworkModel: vehicle.bodyworkModel,
    manufactureYear: vehicle.manufactureYear,
    modelYear: vehicle.modelYear,
    salePrice: vehicle.salePrice,
    costPrice: vehicle.costPrice,
    mileage: vehicle.mileage,
    licensePlate: vehicle.licensePlate,
    renavam: vehicle.renavam,
    chassisNumber: vehicle.chassisNumber,
    busPrefix: vehicle.busPrefix,
    availableQuantity: vehicle.availableQuantity,
    internalNotes: vehicle.internalNotes,
    productTitle: vehicle.productTitle,
    passengerCapacity: vehicle.passengerCapacity,
    condition: vehicle.condition,
    fuelType: vehicle.fuelType,
    steeringType: vehicle.steeringType,
    singleOwner: vehicle.singleOwner,
    description: vehicle.description,
    conventional: vehicle.conventional,
    executive: vehicle.executive,
    semiSleeper: vehicle.semiSleeper,
    sleeper: vehicle.sleeper,
    sleeperBed: vehicle.sleeperBed,
    fixed: vehicle.fixed,
    totalCapacity: vehicle.totalCapacity,
    compositionText: vehicle.compositionText,
    compositionDetails: vehicle.compositionDetails,
    airConditioning: vehicle.airConditioning,
    legSupport: vehicle.legSupport,
    curtain: vehicle.curtain,
    usb: vehicle.usb,
    soundSystem: vehicle.soundSystem,
    monitor: vehicle.monitor,
    wifi: vehicle.wifi,
    packageHolder: vehicle.packageHolder,
    bathroom: vehicle.bathroom,
    cabin: vehicle.cabin,
    coffeeMaker: vehicle.coffeeMaker,
    accessibility: vehicle.accessibility,
    factoryRetarder: vehicle.factoryRetarder,
    optionalRetarder: vehicle.optionalRetarder,
    glasType: vehicle.glasType,
    address: vehicle.address,
    neighborhood: vehicle.neighborhood,
    cep: vehicle.cep,
    city: vehicle.city,
    state: vehicle.state,
    latitude: vehicle.latitude,
    longitude: vehicle.longitude,
    ...uploadedUrls,
    createdAt: vehicle.createdAt?.toISOString(),
    updatedAt: vehicle.updatedAt?.toISOString(),
  };
};
