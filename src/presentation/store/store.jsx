import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { materialsApi } from '../../infrastructure/api/materialsApi.js';
import { workersApi } from '../../infrastructure/api/workersApi.js';
import { movementsApi } from '../../infrastructure/api/movementsApi.js';
import { getMalzemeAd } from '../../domain/entities/material.js';

const initialState = {
  boruFittings: [],
  digerMalzeme: [],
  ustalar: [],
  hareketler: [],
  loading: true,
  error: null,
};

/**
 * Updates application state. Each action touches only the relevant state slice.
 * @param {typeof initialState} state
 * @param {{ type: string, payload?: any }} action
 */
function reducer(state, action) {
  switch (action.type) {
    case 'LOADED':
      return { ...state, loading: false, error: null, ...action.payload };
    case 'MOVEMENTS_LOADED':
      return {
        ...state,
        hareketler: [...action.payload].sort((a, b) => b.tarih.localeCompare(a.tarih)),
      };
    case 'ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'MATERIAL_ADDED': {
      const m = action.payload;
      return m.grup === 'boru'
        ? { ...state, boruFittings: [...state.boruFittings, m] }
        : { ...state, digerMalzeme: [...state.digerMalzeme, m] };
    }
    case 'MATERIAL_UPDATED': {
      const m = action.payload;
      const update = (list) => list.map((x) => (x.id === m.id ? m : x));
      return m.grup === 'boru'
        ? { ...state, boruFittings: update(state.boruFittings) }
        : { ...state, digerMalzeme: update(state.digerMalzeme) };
    }
    case 'MATERIAL_DELETED': {
      const id = action.payload;
      return {
        ...state,
        boruFittings: state.boruFittings.filter((m) => m.id !== id),
        digerMalzeme: state.digerMalzeme.filter((m) => m.id !== id),
      };
    }
    case 'WORKER_ADDED':
      return { ...state, ustalar: [...state.ustalar, action.payload] };
    case 'WORKER_UPDATED':
      return {
        ...state,
        ustalar: state.ustalar.map((u) => (u.id === action.payload.id ? action.payload : u)),
      };
    case 'WORKER_DELETED':
      return { ...state, ustalar: state.ustalar.filter((u) => u.id !== action.payload) };
    case 'MOVEMENT_ADDED': {
      const { movement, updatedMaterial } = action.payload;
      const updateList = (list) => list.map((m) => (m.id === updatedMaterial.id ? updatedMaterial : m));
      return {
        ...state,
        hareketler: [movement, ...state.hareketler],
        boruFittings: updateList(state.boruFittings),
        digerMalzeme: updateList(state.digerMalzeme),
      };
    }
    default:
      return state;
  }
}

const StoreContext = createContext(null);

/**
 * Context provider that holds all application state.
 * Fetches materials, workers, and movements in parallel on initial render.
 * @param {object} props
 * @param {React.ReactNode} props.children
 */
export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    Promise.all([
      materialsApi.getAll(),
      workersApi.getAll(),
      movementsApi.getAll(),
    ])
      .then(([materials, ustalar, hareketler]) => {
        dispatch({
          type: 'LOADED',
          payload: {
            boruFittings: materials.boruFittings,
            digerMalzeme: materials.digerMalzeme,
            ustalar,
            hareketler: [...hareketler].sort((a, b) => b.tarih.localeCompare(a.tarih)),
          },
        });
      })
      .catch((err) => dispatch({ type: 'ERROR', payload: err.message }));
  }, []);

  /** @param {string} id - Material ID */
  const getMalzeme = useCallback(
    (id) =>
      state.boruFittings.find((m) => m.id === id) ||
      state.digerMalzeme.find((m) => m.id === id),
    [state.boruFittings, state.digerMalzeme]
  );

  /** @param {string} id - Worker ID */
  const getUsta = useCallback(
    (id) => state.ustalar.find((u) => u.id === id),
    [state.ustalar]
  );

  /** @param {string} malzemeId - Material ID to filter by */
  const hareketlerFor = useCallback(
    (malzemeId) => state.hareketler.filter((h) => h.malzemeId === malzemeId),
    [state.hareketler]
  );

  /** @param {string} ustaId - Worker ID to filter by */
  const hareketlerForUsta = useCallback(
    (ustaId) => state.hareketler.filter((h) => h.ustaId === ustaId),
    [state.hareketler]
  );

  const addGelis = useCallback(async (payload) => {
    const result = await movementsApi.postGelis(payload);
    dispatch({ type: 'MOVEMENT_ADDED', payload: result });
    return result;
  }, []);

  const addKullanim = useCallback(async (payload) => {
    const result = await movementsApi.postKullanim(payload);
    dispatch({ type: 'MOVEMENT_ADDED', payload: result });
    return result;
  }, []);

  const addMalzeme = useCallback(async (payload) => {
    const material = await materialsApi.create(payload);
    dispatch({ type: 'MATERIAL_ADDED', payload: material });
    // Opening stock creates a server-side movement — re-fetch to stay in sync
    if (Number(payload.baslangic) > 0) {
      const hareketler = await movementsApi.getAll();
      dispatch({ type: 'MOVEMENTS_LOADED', payload: hareketler });
    }
    return material;
  }, []);

  const editMalzeme = useCallback(async (id, payload) => {
    const material = await materialsApi.update(id, payload);
    dispatch({ type: 'MATERIAL_UPDATED', payload: material });
    return material;
  }, []);

  const removeMalzeme = useCallback(async (id) => {
    await materialsApi.remove(id);
    dispatch({ type: 'MATERIAL_DELETED', payload: id });
  }, []);

  const addUsta = useCallback(async (payload) => {
    const worker = await workersApi.create(payload);
    dispatch({ type: 'WORKER_ADDED', payload: worker });
    return worker;
  }, []);

  const editUsta = useCallback(async (id, payload) => {
    const worker = await workersApi.update(id, payload);
    dispatch({ type: 'WORKER_UPDATED', payload: worker });
    return worker;
  }, []);

  const removeUsta = useCallback(async (id) => {
    await workersApi.remove(id);
    dispatch({ type: 'WORKER_DELETED', payload: id });
  }, []);

  const value = {
    boruFittings: state.boruFittings,
    digerMalzeme: state.digerMalzeme,
    ustalar: state.ustalar,
    hareketler: state.hareketler,
    loading: state.loading,
    error: state.error,
    getMalzeme,
    getUsta,
    hareketlerFor,
    hareketlerForUsta,
    getMalzemeAd,
    addGelis,
    addKullanim,
    addMalzeme,
    editMalzeme,
    removeMalzeme,
    addUsta,
    editUsta,
    removeUsta,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

/**
 * Accesses the store context. Must be called inside StoreProvider.
 * @returns {ReturnType<typeof createContext>}
 * @throws {Error} When called outside StoreProvider
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
