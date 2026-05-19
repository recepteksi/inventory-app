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

export type ModalKind =
  | 'delivery'
  | 'usage'
  | 'new-material'
  | 'edit-material'
  | 'new-worker'
  | 'edit-worker';

export interface ModalState {
  kind: ModalKind;
  id?: string;
}

export interface RouteState {
  kind: 'detail';
  id: string;
}
