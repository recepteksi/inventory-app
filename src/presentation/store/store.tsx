import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { materialsApi } from '../../infrastructure/api/materialsApi.ts';
import { workersApi } from '../../infrastructure/api/workersApi.ts';
import { movementsApi } from '../../infrastructure/api/movementsApi.ts';
import { getMaterialName } from '../../domain/entities/material.ts';
import type { Material, Worker, Movement, MaterialsResponse, MovementResult } from '../../types/index.ts';

interface StoreState {
  pipeFittings: Material[];
  otherMaterials: Material[];
  workers: Worker[];
  movements: Movement[];
  loading: boolean;
  error: string | null;
}

type StoreAction =
  | { type: 'LOADED'; payload: { pipeFittings: Material[]; otherMaterials: Material[]; workers: Worker[]; movements: Movement[] } }
  | { type: 'MOVEMENTS_LOADED'; payload: Movement[] }
  | { type: 'ERROR'; payload: string }
  | { type: 'MATERIAL_ADDED'; payload: Material }
  | { type: 'MATERIAL_UPDATED'; payload: Material }
  | { type: 'MATERIAL_DELETED'; payload: string }
  | { type: 'WORKER_ADDED'; payload: Worker }
  | { type: 'WORKER_UPDATED'; payload: Worker }
  | { type: 'WORKER_DELETED'; payload: string }
  | { type: 'MOVEMENT_ADDED'; payload: MovementResult };

interface StoreValue extends StoreState {
  getMaterial: (id: string) => Material | undefined;
  getWorker: (id: string) => Worker | undefined;
  movementsFor: (materialId: string) => Movement[];
  movementsForWorker: (workerId: string) => Movement[];
  getMaterialName: (m: Material | null | undefined) => string;
  addDelivery: (payload: Record<string, unknown>) => Promise<MovementResult>;
  addUsage: (payload: Record<string, unknown>) => Promise<MovementResult>;
  addMaterial: (payload: Record<string, unknown>) => Promise<Material>;
  editMaterial: (id: string, payload: Record<string, unknown>) => Promise<Material>;
  removeMaterial: (id: string) => Promise<void>;
  addWorker: (payload: Record<string, unknown>) => Promise<Worker>;
  editWorker: (id: string, payload: Record<string, unknown>) => Promise<Worker>;
  removeWorker: (id: string) => Promise<void>;
}

const initialState: StoreState = {
  pipeFittings: [],
  otherMaterials: [],
  workers: [],
  movements: [],
  loading: true,
  error: null,
};

/**
 * Updates application state. Each action touches only the relevant state slice.
 */
function reducer(state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case 'LOADED':
      return { ...state, loading: false, error: null, ...action.payload };
    case 'MOVEMENTS_LOADED':
      return {
        ...state,
        movements: [...action.payload].sort((a, b) => b.date.localeCompare(a.date)),
      };
    case 'ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'MATERIAL_ADDED': {
      const m = action.payload;
      return m.group === 'pipe'
        ? { ...state, pipeFittings: [...state.pipeFittings, m] }
        : { ...state, otherMaterials: [...state.otherMaterials, m] };
    }
    case 'MATERIAL_UPDATED': {
      const m = action.payload;
      const update = (list: Material[]) => list.map((x) => (x.id === m.id ? m : x));
      return m.group === 'pipe'
        ? { ...state, pipeFittings: update(state.pipeFittings) }
        : { ...state, otherMaterials: update(state.otherMaterials) };
    }
    case 'MATERIAL_DELETED': {
      const id = action.payload;
      return {
        ...state,
        pipeFittings: state.pipeFittings.filter((m) => m.id !== id),
        otherMaterials: state.otherMaterials.filter((m) => m.id !== id),
      };
    }
    case 'WORKER_ADDED':
      return { ...state, workers: [...state.workers, action.payload] };
    case 'WORKER_UPDATED':
      return {
        ...state,
        workers: state.workers.map((u) => (u.id === action.payload.id ? action.payload : u)),
      };
    case 'WORKER_DELETED':
      return { ...state, workers: state.workers.filter((u) => u.id !== action.payload) };
    case 'MOVEMENT_ADDED': {
      const { movement, updatedMaterial } = action.payload;
      const updateList = (list: Material[]) =>
        list.map((m) => (m.id === updatedMaterial.id ? updatedMaterial : m));
      return {
        ...state,
        movements: [movement, ...state.movements],
        pipeFittings: updateList(state.pipeFittings),
        otherMaterials: updateList(state.otherMaterials),
      };
    }
    default:
      return state;
  }
}

const StoreContext = createContext<StoreValue | null>(null);

/**
 * Context provider that holds all application state.
 * Fetches materials, workers, and movements in parallel on initial render.
 */
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    Promise.all([
      materialsApi.getAll(),
      workersApi.getAll(),
      movementsApi.getAll(),
    ] as [Promise<MaterialsResponse>, Promise<Worker[]>, Promise<Movement[]>])
      .then(([materials, workers, movements]) => {
        dispatch({
          type: 'LOADED',
          payload: {
            pipeFittings: materials.pipeFittings,
            otherMaterials: materials.otherMaterials,
            workers,
            movements: [...movements].sort((a, b) => b.date.localeCompare(a.date)),
          },
        });
      })
      .catch((err: Error) => dispatch({ type: 'ERROR', payload: err.message }));
  }, []);

  const getMaterial = useCallback(
    (id: string): Material | undefined =>
      state.pipeFittings.find((m) => m.id === id) ||
      state.otherMaterials.find((m) => m.id === id),
    [state.pipeFittings, state.otherMaterials]
  );

  const getWorker = useCallback(
    (id: string): Worker | undefined => state.workers.find((u) => u.id === id),
    [state.workers]
  );

  const movementsFor = useCallback(
    (materialId: string): Movement[] =>
      state.movements.filter((h) => h.materialId === materialId),
    [state.movements]
  );

  const movementsForWorker = useCallback(
    (workerId: string): Movement[] =>
      state.movements.filter((h) => h.workerId === workerId),
    [state.movements]
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

  const addMaterial = useCallback(async (payload: Record<string, unknown>): Promise<Material> => {
    const material = await materialsApi.create(payload);
    dispatch({ type: 'MATERIAL_ADDED', payload: material });
    // Opening stock creates a server-side movement — re-fetch to stay in sync
    if (Number(payload.openingStock) > 0) {
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

  const value: StoreValue = {
    pipeFittings: state.pipeFittings,
    otherMaterials: state.otherMaterials,
    workers: state.workers,
    movements: state.movements,
    loading: state.loading,
    error: state.error,
    getMaterial,
    getWorker,
    movementsFor,
    movementsForWorker,
    getMaterialName,
    addDelivery,
    addUsage,
    addMaterial,
    editMaterial,
    removeMaterial,
    addWorker,
    editWorker,
    removeWorker,
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
