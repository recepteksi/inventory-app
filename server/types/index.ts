export interface Material {
  id: string;
  group: 'pipe' | 'other';
  diameter?: string;
  kind?: string;
  grade?: string;
  name?: string;
  category?: string;
  stock: number;
  minimum: number;
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
}

export interface MaterialsResponse {
  pipeFittings: Material[];
  otherMaterials: Material[];
}

export interface MovementResult {
  movement: Movement;
  updatedMaterial: Material;
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

export interface Repos {
  materialRepo: IMaterialRepository;
  workerRepo: IWorkerRepository;
  movementRepo: IMovementRepository;
}
