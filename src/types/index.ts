import { languages } from "@/config/languages";

export type LanguageCode = keyof typeof languages;
export type Translations = (typeof languages)[LanguageCode] & Record<string, string>;

export interface ApiMeta {
  business_code: number;
  message?: string;
}

export interface GenericResponse<T = unknown> {
  meta?: ApiMeta;
  business_code?: number;
  message?: string;
  data?: T;
  access_token?: string;
}

export interface RepositoryResult<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  token?: string;
  userData?: Record<string, unknown>;
  needsVerification?: boolean;
}

export interface Business {
  id?: number;
  business_id?: number;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  subscriber_id?: number;
  status?: string;
  created_date?: string;
  updated_date?: string;
  last_modified_date?: string;
  inactive_retention_expires_at?: string;
}

export interface ProductExtraParameters {
  is_new_item?: boolean;
  is_campaign?: boolean;
  is_favorite?: boolean;
  discount?: string;
}

export interface ProductMaterial {
  material_id: number;
  material_name?: string;
  quantity: number;
  unit: string;
}

export type StockMaterial = Material;

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  category?: string;
  is_available?: boolean;
  business_id?: number;
  subscriber_id?: number;
  images?: ProductImage[];
  product_image?: ProductImage[];
  allergenNames?: string[];
  allergens?: string[];
  extra_parameters?: ProductExtraParameters;
  stock_quantity?: number;
  track_stock?: boolean;
  materials?: ProductMaterial[];
  measurement_unit?: string;
}

export interface ProductImage {
  id: number;
  url?: string;
  image_url?: string;
}

export interface DigitalMenu {
  id: string;
  name: string;
  business_id?: number;
  subscriber_id?: number;
  business_name?: string | null;
  is_available?: boolean;
  theme?: string;
  currency?: string;
  social_media?: string | null;
  image_url?: string;
  images?: DigitalMenuImage[];
  digital_menu_image?: DigitalMenuImage[];
  is_active?: boolean;
}

export interface DigitalMenuImage {
  id: number;
  url?: string;
  image_url?: string;
}

export interface OrderItem {
  id: number;
  productId?: number;
  product_id?: number;
  productName?: string;
  product_name?: string;
  quantity: number;
  unitPrice?: number;
  price?: number;
  totalPrice?: number;
  status?: string;
  note?: string;
  deliveredQuantity?: number;
  delivered_quantity?: number;
  paidQuantity?: number;
  paid_quantity?: number;
  isPaid?: boolean;
}

export interface Order {
  id: number;
  orderNumber?: string;
  tableId?: number;
  table_id?: number;
  tableNumber?: string;
  table_number?: string;
  areaName?: string;
  waitTimeSeconds?: number;
  business_id?: number;
  status: string;
  totalAmount?: number;
  total_amount?: number;
  paidAmount?: number;
  paid_amount?: number;
  waiterName?: string;
  customerNote?: string;
  items?: OrderItem[];
  created_date?: string;
  updated_date?: string;
}

export interface TableArea {
  id: number;
  name: string;
  business_id?: number;
  table_count?: number;
  tableCount?: number;
}

export interface CafeTable {
  id: number;
  tableNumber: string;
  capacity?: number;
  status?: string;
  areaId?: number;
  business_id?: number;
  reservationNote?: string;
}

export interface Employee {
  id: number;
  name: string;
  role?: string;
  permissions?: string[];
  phoneNumber?: string;
  accessCode?: string;
  access_code?: string;
  business_id?: number;
  is_active?: boolean;
}

export interface EmployeeSessionData {
  employeeId: number;
  name: string;
  role?: string;
  permissions?: string[];
  businessId?: number;
  businessName?: string;
  employerId?: number;
  employerName?: string;
}

export interface Material {
  id: number;
  name: string;
  unit?: string;
  current_stock?: number;
  initial_stock?: number;
  stock_percentage?: number;
  created_date?: string;
  last_modified_date?: string;
  business_id?: number;
}

export interface StockMovement {
  id: number;
  movement_type?: string;
  quantity?: number;
  unit?: string;
  note?: string;
  created_date?: string;
}

export interface ProductStockItem {
  product_id: number;
  product_name: string;
  stock_quantity?: number;
  track_stock?: boolean;
  stock_percentage?: number;
  materials?: Array<{
    material_id: number;
    material_name: string;
    quantity: number;
    unit: string;
  }>;
}

export interface StockSummary {
  total_materials: number;
  low_stock_materials: number;
  total_tracked_products: number;
  low_stock_products: number;
}

export interface Feedback {
  id: number;
  message?: string;
  rating?: number;
  read?: boolean;
  created_date?: string;
  business_id?: number;
}

export interface SubscriptionModule {
  id?: number;
  code: string;
  name?: string;
  price?: number;
}

export interface SubscriptionData {
  status?: string;
  end_date?: string;
}

export interface Payment {
  id: number;
  order_id?: number;
  amount?: number;
  method?: string;
  status?: string;
  created_date?: string;
}

export interface SubscriberProfile {
  id: number;
  name?: string;
  email?: string;
  msisdn?: string;
  currency?: string;
  language?: string;
}

export interface WebImageFile {
  file: File;
  name?: string;
  type?: string;
}

export type ImageUploadInput = File | WebImageFile;

export interface NetworkErrorEntry {
  status: number;
  message: string;
  timestamp: string;
  url: string;
}

export interface ApiErrorPayload {
  status: number;
  message: string;
  url: string;
}

export interface UserState {
  email: string;
  password: string;
  name: string;
  msisdn: string;
  language: LanguageCode;
  translations: Translations;
  isAuthenticated: boolean;
  accessToken: string | null;
  subscriberId: number | null;
  theme: "dark" | "light";
  currency: string;
  hasActiveSubscription: boolean;
  subscriptionData: SubscriptionData | null;
  is_trial_enable: boolean;
  subscribedModules: SubscriptionModule[];
  subscriptionEndDate: string | null;
  trialStartDate: string | null;
  trialEndDate: string | null;
  trialDaysRemaining: number;
  unreadFeedbackCount: number;
  isCheckingSubscription: boolean;
  is_first_login: boolean;
  isEmployee: boolean;
  employeeData: EmployeeSessionData | null;
}

export interface ApiStatusState {
  isLoading: boolean;
  lastApiStatus: number | null;
  lastApiError: ApiErrorPayload | null;
  networkErrors: NetworkErrorEntry[];
  isNetworkError: boolean;
  errorPopupVisible: boolean;
}

export interface RootState {
  user: UserState;
  apiStatus: ApiStatusState;
}
