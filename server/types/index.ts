/** A material section. Each section is shown as its own tab in the UI. */
export type MaterialGroup = 'pipe' | 'other' | 'ventilation' | 'isolation';

export interface Material {
  id: string;
  group: MaterialGroup;
  /** Pipe / fitting / ventilation properties */
  diameter?: string;
  kind?: string;
  grade?: string;
  /** Free-text special size, used in place of diameter for non-standard items. */
  size?: string;
  /** Other-material properties */
  name?: string;
  category?: string;
  /** Isolation properties */
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
  /** Groups movements recorded together in a single multi-material usage. */
  batchId?: string;
}

export type Role = 'admin' | 'normal';

export interface User {
  id: string;
  username: string;
  name: string;
  role: Role;
  /** Stored as "saltHex:hashHex". Never sent to the client. */
  passwordHash: string;
  createdAt: string;
}

/** A user object safe to expose to the client (no password material). */
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
  /** Requested delivery date (YYYY-MM-DD). Cannot be in the past. */
  orderDate: string;
  supplier?: string;
  note?: string;
  /** Display name of the user who created the order. */
  createdBy: string;
  /** Id of the user who created the order. Used for permission checks on delete. */
  createdById?: string;
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

export interface IMaterialRepository {
  findAll(): Promise<MaterialsResponse>;
  findById(id: string): Promise<Material | null>;
  create(data: Partial<Material>): Promise<Material>;
  update(id: string, data: Partial<Material>): Promise<Material | null>;
  delete(id: string): Promise<void>;
  checkDuplicate(query: Partial<Material>): Promise<Material | null>;
  updateStock(id: string, newStock: number): Promise<Material>;
}

export interface IWorkerRepository {
  findAll(): Promise<Worker[]>;
  findById(id: string): Promise<Worker | null>;
  create(data: Partial<Worker>): Promise<Worker>;
  update(id: string, data: Partial<Worker>): Promise<Worker | null>;
  delete(id: string): Promise<void>;
}

export interface IMovementRepository {
  findAll(): Promise<Movement[]>;
  findByMaterialId(materialId: string): Promise<Movement[]>;
  findByWorkerId(workerId: string): Promise<Movement[]>;
  create(data: Movement): Promise<Movement>;
  countByMaterialId(materialId: string): Promise<number>;
  countByWorkerId(workerId: string): Promise<number>;
}

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  create(data: User): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<void>;
  count(): Promise<number>;
}

export interface IOrderRepository {
  findAll(): Promise<Order[]>;
  findById(id: string): Promise<Order | null>;
  /** Counts orders that contain an item referencing the given material id. */
  countByMaterialId(materialId: string): Promise<number>;
  create(data: Order): Promise<Order>;
  update(id: string, data: Partial<Order>): Promise<Order | null>;
  delete(id: string): Promise<boolean>;
}

export interface ICatalogRepository {
  findAll(): Promise<CatalogEntry[]>;
  findById(id: string): Promise<CatalogEntry | null>;
  create(data: CatalogEntry): Promise<CatalogEntry>;
  /** Returns true when a document was actually removed. */
  delete(id: string): Promise<boolean>;
  exists(section: string, field: string, value: string): Promise<boolean>;
}

export interface Repos {
  materialRepo: IMaterialRepository;
  workerRepo: IWorkerRepository;
  movementRepo: IMovementRepository;
  userRepo: IUserRepository;
  orderRepo: IOrderRepository;
  catalogRepo: ICatalogRepository;
}
