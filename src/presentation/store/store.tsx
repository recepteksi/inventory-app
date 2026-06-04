import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { materialsApi } from '../../infrastructure/api/materialsApi.ts';
import { workersApi } from '../../infrastructure/api/workersApi.ts';
import { movementsApi } from '../../infrastructure/api/movementsApi.ts';
import { catalogApi } from '../../infrastructure/api/catalogApi.ts';
import { ordersApi } from '../../infrastructure/api/ordersApi.ts';
import { getMaterialName } from '../../domain/entities/material.ts';
import type {
  Material, Worker, Movement, Order, CatalogEntry, CatalogField, MaterialGroup,
  MaterialsResponse, MovementResult, BatchUsageResult,
} from '../../types/index.ts';

type GroupKey = 'pipeFittings' | 'otherMaterials' | 'ventilation' | 'isolation';

const GROUP_KEY: Record<MaterialGroup, GroupKey> = {
  pipe: 'pipeFittings',
  other: 'otherMaterials',
  ventilation: 'ventilation',
  isolation: 'isolation',
};

interface StoreState {
  pipeFittings: Material[];
  otherMaterials: Material[];
  ventilation: Material[];
  isolation: Material[];
  workers: Worker[];
  movements: Movement[];
  orders: Order[];
  catalog: CatalogEntry[];
  loading: boolean;
  error: string | null;
}

type StoreAction =
  | { type: 'LOADED'; payload: Partial<StoreState> }
  | { type: 'MOVEMENTS_LOADED'; payload: Movement[] }
  | { type: 'ERROR'; payload: string }
  | { type: 'MATERIAL_ADDED'; payload: Material }
  | { type: 'MATERIAL_UPDATED'; payload: Material }
  | { type: 'MATERIAL_DELETED'; payload: string }
  | { type: 'WORKER_ADDED'; payload: Worker }
  | { type: 'WORKER_UPDATED'; payload: Worker }
  | { type: 'WORKER_DELETED'; payload: string }
  | { type: 'MOVEMENT_ADDED'; payload: MovementResult }
  | { type: 'MOVEMENTS_BATCH_ADDED'; payload: BatchUsageResult }
  | { type: 'CATALOG_ADDED'; payload: CatalogEntry }
  | { type: 'CATALOG_DELETED'; payload: string }
  | { type: 'ORDER_ADDED'; payload: Order }
  | { type: 'ORDER_UPDATED'; payload: Order }
  | { type: 'ORDER_DELETED'; payload: string };

interface StoreValue extends StoreState {
  getMaterial: (id: string) => Material | undefined;
  getWorker: (id: string) => Worker | undefined;
  materialsByGroup: (group: MaterialGroup) => Material[];
  allMaterials: () => Material[];
  movementsFor: (materialId: string) => Movement[];
  movementsForWorker: (workerId: string) => Movement[];
  getMaterialName: (m: Material | null | undefined) => string;
  catalogOptions: (section: MaterialGroup, field: CatalogField) => string[];
  addDelivery: (payload: Record<string, unknown>) => Promise<MovementResult>;
  addUsage: (payload: Record<string, unknown>) => Promise<MovementResult>;
  addUsageBatch: (payload: Record<string, unknown>) => Promise<BatchUsageResult>;
  addMaterial: (payload: Record<string, unknown>) => Promise<Material>;
  editMaterial: (id: string, payload: Record<string, unknown>) => Promise<Material>;
  removeMaterial: (id: string) => Promise<void>;
  addWorker: (payload: Record<string, unknown>) => Promise<Worker>;
  editWorker: (id: string, payload: Record<string, unknown>) => Promise<Worker>;
  removeWorker: (id: string) => Promise<void>;
  addCatalog: (payload: Record<string, unknown>) => Promise<CatalogEntry>;
  removeCatalog: (id: string) => Promise<void>;
  addOrder: (payload: Record<string, unknown>) => Promise<Order>;
  approveOrder: (id: string) => Promise<Order>;
  removeOrder: (id: string) => Promise<void>;
}

const initialState: StoreState = {
  pipeFittings: [], otherMaterials: [], ventilation: [], isolation: [],
  workers: [], movements: [], orders: [], catalog: [],
  loading: true, error: null,
};

const MATERIAL_KEYS: GroupKey[] = ['pipeFittings', 'otherMaterials', 'ventilation', 'isolation'];

/** Applies a per-material update across all four material lists. */
function mapMaterials(state: StoreState, fn: (list: Material[]) => Material[]): Pick<StoreState, GroupKey> {
  return {
    pipeFittings: fn(state.pipeFittings),
    otherMaterials: fn(state.otherMaterials),
    ventilation: fn(state.ventilation),
    isolation: fn(state.isolation),
  };
}

function reducer(state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case 'LOADED':
      return { ...state, loading: false, error: null, ...action.payload };
    case 'MOVEMENTS_LOADED':
      return { ...state, movements: [...action.payload].sort((a, b) => b.date.localeCompare(a.date)) };
    case 'ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'MATERIAL_ADDED': {
      const m = action.payload;
      const key = GROUP_KEY[m.group];
      return { ...state, [key]: [...state[key], m] };
    }
    case 'MATERIAL_UPDATED': {
      const m = action.payload;
      return { ...state, ...mapMaterials(state, (list) => list.map((x) => (x.id === m.id ? m : x))) };
    }
    case 'MATERIAL_DELETED': {
      const id = action.payload;
      return { ...state, ...mapMaterials(state, (list) => list.filter((m) => m.id !== id)) };
    }
    case 'WORKER_ADDED':
      return { ...state, workers: [...state.workers, action.payload] };
    case 'WORKER_UPDATED':
      return { ...state, workers: state.workers.map((u) => (u.id === action.payload.id ? action.payload : u)) };
    case 'WORKER_DELETED':
      return { ...state, workers: state.workers.filter((u) => u.id !== action.payload) };
    case 'MOVEMENT_ADDED': {
      const { movement, updatedMaterial } = action.payload;
      return {
        ...state,
        movements: [movement, ...state.movements],
        ...mapMaterials(state, (list) => list.map((m) => (m.id === updatedMaterial.id ? updatedMaterial : m))),
      };
    }
    case 'MOVEMENTS_BATCH_ADDED': {
      const { movements, updatedMaterials } = action.payload;
      const byId = new Map(updatedMaterials.map((m) => [m.id, m]));
      return {
        ...state,
        movements: [...movements, ...state.movements],
        ...mapMaterials(state, (list) => list.map((m) => byId.get(m.id) ?? m)),
      };
    }
    case 'CATALOG_ADDED':
      return { ...state, catalog: [...state.catalog, action.payload] };
    case 'CATALOG_DELETED':
      return { ...state, catalog: state.catalog.filter((c) => c.id !== action.payload) };
    case 'ORDER_ADDED':
      return { ...state, orders: [action.payload, ...state.orders] };
    case 'ORDER_UPDATED':
      return { ...state, orders: state.orders.map((o) => (o.id === action.payload.id ? action.payload : o)) };
    case 'ORDER_DELETED':
      return { ...state, orders: state.orders.filter((o) => o.id !== action.payload) };
    default:
      return state;
  }
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    Promise.all([
      materialsApi.getAll(),
      workersApi.getAll(),
      movementsApi.getAll(),
      catalogApi.getAll(),
      ordersApi.getAll(),
    ] as [Promise<MaterialsResponse>, Promise<Worker[]>, Promise<Movement[]>, Promise<CatalogEntry[]>, Promise<Order[]>])
      .then(([materials, workers, movements, catalog, orders]) => {
        dispatch({
          type: 'LOADED',
          payload: {
            pipeFittings: materials.pipeFittings,
            otherMaterials: materials.otherMaterials,
            ventilation: materials.ventilation,
            isolation: materials.isolation,
            workers,
            movements: [...movements].sort((a, b) => b.date.localeCompare(a.date)),
            catalog,
            orders: [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
          },
        });
      })
      .catch((err: Error) => dispatch({ type: 'ERROR', payload: err.message }));
  }, []);

  const allMaterials = useCallback(
    (): Material[] => MATERIAL_KEYS.flatMap((k) => state[k]),
    [state]
  );

  const getMaterial = useCallback(
    (id: string): Material | undefined =>
      state.pipeFittings.find((m) => m.id === id) ||
      state.otherMaterials.find((m) => m.id === id) ||
      state.ventilation.find((m) => m.id === id) ||
      state.isolation.find((m) => m.id === id),
    [state.pipeFittings, state.otherMaterials, state.ventilation, state.isolation]
  );

  const materialsByGroup = useCallback(
    (group: MaterialGroup): Material[] => state[GROUP_KEY[group]],
    [state]
  );

  const getWorker = useCallback(
    (id: string): Worker | undefined => state.workers.find((u) => u.id === id),
    [state.workers]
  );

  const movementsFor = useCallback(
    (materialId: string): Movement[] => state.movements.filter((h) => h.materialId === materialId),
    [state.movements]
  );

  const movementsForWorker = useCallback(
    (workerId: string): Movement[] => state.movements.filter((h) => h.workerId === workerId),
    [state.movements]
  );

  const catalogOptions = useCallback(
    (section: MaterialGroup, field: CatalogField): string[] => {
      const seen = new Set<string>();
      const out: string[] = [];
      for (const c of state.catalog) {
        if (c.section !== section || c.field !== field) continue;
        const key = c.value.toLowerCase();
        if (!seen.has(key)) { seen.add(key); out.push(c.value); }
      }
      return out;
    },
    [state.catalog]
  );

  const addDelivery = useCallback(async (payload: Record<string, unknown>): Promise<MovementResult> => {
    const result = await movementsApi.postDelivery(payload);
    dispatch({ type: 'MOVEMENT_ADDED', payload: result });
    return result;
  }, []);

  const addUsage = useCallback(async (payload: Record<string, unknown>): Promise<MovementResult> => {
    const result = await movementsApi.postUsage(payload);
    dispatch({ type: 'MOVEMENT_ADDED', payload: result });
    return result;
  }, []);

  const addUsageBatch = useCallback(async (payload: Record<string, unknown>): Promise<BatchUsageResult> => {
    const result = await movementsApi.postUsageBatch(payload);
    dispatch({ type: 'MOVEMENTS_BATCH_ADDED', payload: result });
    return result;
  }, []);

  const addMaterial = useCallback(async (payload: Record<string, unknown>): Promise<Material> => {
    const material = await materialsApi.create(payload);
    dispatch({ type: 'MATERIAL_ADDED', payload: material });
    if (Number(payload['openingStock']) > 0) {
      const movements = await movementsApi.getAll();
      dispatch({ type: 'MOVEMENTS_LOADED', payload: movements });
    }
    return material;
  }, []);

  const editMaterial = useCallback(async (id: string, payload: Record<string, unknown>): Promise<Material> => {
    const material = await materialsApi.update(id, payload);
    dispatch({ type: 'MATERIAL_UPDATED', payload: material });
    return material;
  }, []);

  const removeMaterial = useCallback(async (id: string): Promise<void> => {
    await materialsApi.remove(id);
    dispatch({ type: 'MATERIAL_DELETED', payload: id });
  }, []);

  const addWorker = useCallback(async (payload: Record<string, unknown>): Promise<Worker> => {
    const worker = await workersApi.create(payload);
    dispatch({ type: 'WORKER_ADDED', payload: worker });
    return worker;
  }, []);

  const editWorker = useCallback(async (id: string, payload: Record<string, unknown>): Promise<Worker> => {
    const worker = await workersApi.update(id, payload);
    dispatch({ type: 'WORKER_UPDATED', payload: worker });
    return worker;
  }, []);

  const removeWorker = useCallback(async (id: string): Promise<void> => {
    await workersApi.remove(id);
    dispatch({ type: 'WORKER_DELETED', payload: id });
  }, []);

  const addCatalog = useCallback(async (payload: Record<string, unknown>): Promise<CatalogEntry> => {
    const entry = await catalogApi.create(payload);
    dispatch({ type: 'CATALOG_ADDED', payload: entry });
    return entry;
  }, []);

  const removeCatalog = useCallback(async (id: string): Promise<void> => {
    await catalogApi.remove(id);
    dispatch({ type: 'CATALOG_DELETED', payload: id });
  }, []);

  const addOrder = useCallback(async (payload: Record<string, unknown>): Promise<Order> => {
    const order = await ordersApi.create(payload);
    dispatch({ type: 'ORDER_ADDED', payload: order });
    return order;
  }, []);

  const approveOrder = useCallback(async (id: string): Promise<Order> => {
    const order = await ordersApi.approve(id);
    dispatch({ type: 'ORDER_UPDATED', payload: order });
    // Approval records deliveries on the server — refresh stock + movements.
    const [materials, movements] = await Promise.all([materialsApi.getAll(), movementsApi.getAll()]);
    dispatch({
      type: 'LOADED',
      payload: {
        pipeFittings: materials.pipeFittings,
        otherMaterials: materials.otherMaterials,
        ventilation: materials.ventilation,
        isolation: materials.isolation,
      },
    });
    dispatch({ type: 'MOVEMENTS_LOADED', payload: movements });
    return order;
  }, []);

  const removeOrder = useCallback(async (id: string): Promise<void> => {
    await ordersApi.remove(id);
    dispatch({ type: 'ORDER_DELETED', payload: id });
  }, []);

  const value: StoreValue = {
    ...state,
    getMaterial, getWorker, materialsByGroup, allMaterials,
    movementsFor, movementsForWorker, getMaterialName, catalogOptions,
    addDelivery, addUsage, addUsageBatch,
    addMaterial, editMaterial, removeMaterial,
    addWorker, editWorker, removeWorker,
    addCatalog, removeCatalog,
    addOrder, approveOrder, removeOrder,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

/**
 * Accesses the store context. Must be called inside StoreProvider.
 * @throws {Error} When called outside StoreProvider
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
