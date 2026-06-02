/** A material section. Each section is shown as its own tab in the UI. */
export type MaterialGroup = 'pipe' | 'other' | 'ventilation' | 'isolation';

export interface Material {
  id: string;
  group: MaterialGroup;
  diameter?: string;
  kind?: string;
  grade?: string;
  name?: string;
  category?: string;
  shape?: 'round' | 'rect';
  width?: string;
  height?: string;
  thickness?: string;
  stock: number;
  /** Optional minimum stock. When undefined the material is not low-stock tracked. */
  minimum?: number;
  unit: string;
}

export interface Worker {
  id: string;
  name: string;
  specialty: string;
  startDate: string;
}

export interface Movement {
  id: string;
  materialId: string;
  workerId?: string;
  type: 'delivery' | 'usage';
  quantity: number;
  date: string;
  supplier?: string;
  receiptNo?: string;
  jobDescription?: string;
  note?: string;
  batchId?: string;
}

export type Role = 'admin' | 'normal';

export interface PublicUser {
  id: string;
  username: string;
  name: string;
  role: Role;
}

export type OrderStatus = 'pending' | 'approved';

export interface OrderItem {
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  status: OrderStatus;
  orderDate: string;
  supplier?: string;
  note?: string;
  createdBy: string;
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
}

export type CatalogField = 'diameter' | 'kind' | 'grade' | 'category' | 'unit' | 'thickness';

export interface CatalogEntry {
  id: string;
  section: MaterialGroup;
  field: CatalogField;
  value: string;
}

export interface MaterialsResponse {
  pipeFittings: Material[];
  otherMaterials: Material[];
  ventilation: Material[];
  isolation: Material[];
}

export interface MovementResult {
  movement: Movement;
  updatedMaterial: Material;
}

export interface BatchUsageResult {
  movements: Movement[];
  updatedMaterials: Material[];
}

export type Page = 'stock' | 'workers' | 'usages' | 'orders' | 'catalog' | 'users';

export type ModalKind =
  | 'delivery'
  | 'usage'
  | 'batch-usage'
  | 'new-material'
  | 'edit-material'
  | 'new-worker'
  | 'edit-worker'
  | 'new-order'
  | 'new-user'
  | 'edit-user';

export interface ModalState {
  kind: ModalKind;
  id?: string;
}

export interface RouteState {
  kind: 'detail';
  id: string;
}
