import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { SEED_USTALAR, SEED_BORU_FITTINGS, SEED_DIGER_MALZEME, SEED_HAREKETLER } from './seed.js';

const STORAGE_KEY = 'atolye-envanter:v1';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error('no state');
    const parsed = JSON.parse(raw);
    if (!parsed.boruFittings || !parsed.digerMalzeme || !parsed.hareketler || !parsed.ustalar) {
      throw new Error('bad state');
    }
    return parsed;
  } catch {
    return {
      ustalar: SEED_USTALAR,
      boruFittings: SEED_BORU_FITTINGS,
      digerMalzeme: SEED_DIGER_MALZEME,
      hareketler: SEED_HAREKETLER,
    };
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // quota or disabled — ignore
  }
}

function nextId(prefix, existing) {
  let max = 0;
  for (const item of existing) {
    const m = String(item.id).match(new RegExp(`^${prefix}-?(\\d+)$`));
    if (m) max = Math.max(max, parseInt(m[1], 10));
  }
  return `${prefix}-${String(max + 1).padStart(3, '0')}`;
}

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const getMalzeme = useCallback(
    (id) =>
      state.boruFittings.find((m) => m.id === id) ||
      state.digerMalzeme.find((m) => m.id === id),
    [state]
  );

  const getUsta = useCallback((id) => state.ustalar.find((u) => u.id === id), [state]);

  const hareketlerFor = useCallback(
    (malzemeId) =>
      state.hareketler
        .filter((h) => h.malzemeId === malzemeId)
        .sort((a, b) => b.tarih.localeCompare(a.tarih)),
    [state]
  );

  const hareketlerForUsta = useCallback(
    (ustaId) =>
      state.hareketler
        .filter((h) => h.ustaId === ustaId)
        .sort((a, b) => b.tarih.localeCompare(a.tarih)),
    [state]
  );

  const addGelis = useCallback(({ malzemeId, miktar, tarih, tedarikci, fis }) => {
    setState((prev) => {
      const id = nextId('h', prev.hareketler);
      const adj = (list) =>
        list.map((m) => (m.id === malzemeId ? { ...m, stok: m.stok + Number(miktar) } : m));
      return {
        ...prev,
        boruFittings: adj(prev.boruFittings),
        digerMalzeme: adj(prev.digerMalzeme),
        hareketler: [
          ...prev.hareketler,
          {
            id,
            malzemeId,
            tip: 'gelis',
            miktar: Number(miktar),
            tarih,
            not: tedarikci ? `Tedarikçi: ${tedarikci}` : undefined,
            fis: fis || undefined,
          },
        ],
      };
    });
  }, []);

  const addKullanim = useCallback(({ malzemeId, miktar, tarih, ustaId, is }) => {
    setState((prev) => {
      const id = nextId('h', prev.hareketler);
      const adj = (list) =>
        list.map((m) => (m.id === malzemeId ? { ...m, stok: m.stok - Number(miktar) } : m));
      return {
        ...prev,
        boruFittings: adj(prev.boruFittings),
        digerMalzeme: adj(prev.digerMalzeme),
        hareketler: [
          ...prev.hareketler,
          {
            id,
            malzemeId,
            tip: 'kullanim',
            miktar: Number(miktar),
            tarih,
            ustaId,
            is,
          },
        ],
      };
    });
  }, []);

  const addMalzeme = useCallback((payload) => {
    let createdId = null;
    setState((prev) => {
      const baslangic = Number(payload.baslangic) || 0;
      const minimum = Number(payload.minimum) || 0;
      const today = new Date().toISOString().slice(0, 10);

      if (payload.grup === 'boru') {
        const birim = payload.tur === 'Boru' ? 'm' : 'adet';
        const id = nextId('bf', prev.boruFittings);
        createdId = id;
        const item = {
          id,
          tur: payload.tur,
          cap: payload.cap,
          cins: payload.cins,
          stok: baslangic,
          birim,
          minimum,
        };
        const hareketler =
          baslangic > 0
            ? [
                ...prev.hareketler,
                {
                  id: nextId('h', prev.hareketler),
                  malzemeId: id,
                  tip: 'gelis',
                  miktar: baslangic,
                  tarih: today,
                  not: 'Açılış stoku',
                },
              ]
            : prev.hareketler;
        return { ...prev, boruFittings: [...prev.boruFittings, item], hareketler };
      } else {
        const id = nextId('dm', prev.digerMalzeme);
        createdId = id;
        const item = {
          id,
          kategori: payload.kategori,
          ad: payload.ad,
          stok: baslangic,
          birim: payload.birim,
          minimum,
        };
        const hareketler =
          baslangic > 0
            ? [
                ...prev.hareketler,
                {
                  id: nextId('h', prev.hareketler),
                  malzemeId: id,
                  tip: 'gelis',
                  miktar: baslangic,
                  tarih: today,
                  not: 'Açılış stoku',
                },
              ]
            : prev.hareketler;
        return { ...prev, digerMalzeme: [...prev.digerMalzeme, item], hareketler };
      }
    });
    return createdId;
  }, []);

  const resetAll = useCallback(() => {
    if (!confirm('Tüm veriler sıfırlanacak. Emin misiniz?')) return;
    localStorage.removeItem(STORAGE_KEY);
    setState(loadState());
  }, []);

  const value = useMemo(
    () => ({
      ustalar: state.ustalar,
      boruFittings: state.boruFittings,
      digerMalzeme: state.digerMalzeme,
      hareketler: state.hareketler,
      getMalzeme,
      getUsta,
      hareketlerFor,
      hareketlerForUsta,
      addGelis,
      addKullanim,
      addMalzeme,
      resetAll,
    }),
    [state, getMalzeme, getUsta, hareketlerFor, hareketlerForUsta, addGelis, addKullanim, addMalzeme, resetAll]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}

export function getMalzemeAd(m) {
  if (!m) return '—';
  if (m.tur) return `${m.cap} ${m.cins} ${m.tur}`;
  return m.ad;
}

const TR_AYLAR = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

export function fmtTarih(iso) {
  const d = new Date(iso);
  return `${d.getDate()} ${TR_AYLAR[d.getMonth()]} ${d.getFullYear()}`;
}
