import React, { useEffect, useMemo, useState } from 'react';
import {
  TOKENS,
  stokDurum,
  Chip,
  Pill,
  Sub,
  IconSearch,
  MalzemeGlyph,
  UstaAvatar,
  btnPrimaryStyle,
  btnGhostStyle,
} from './tokens.jsx';
import { useStore, getMalzemeAd, fmtTarih } from './store.jsx';

const iconBtnStyle = {
  appearance: 'none',
  border: `1px solid ${TOKENS.line}`,
  background: TOKENS.paper,
  width: 28,
  height: 28,
  borderRadius: 7,
  cursor: 'pointer',
  fontFamily: TOKENS.font,
  fontSize: 14,
  color: TOKENS.inkSoft,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

function Th({ children, sortKey, dir, k, onClick, w, align = 'left' }) {
  const sorted = sortKey === k;
  return (
    <th
      onClick={onClick}
      style={{
        padding: '10px 14px',
        textAlign: align,
        width: w,
        fontFamily: TOKENS.mono,
        fontSize: 10.5,
        color: TOKENS.inkMuted,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        fontWeight: 600,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {children}
      {sorted && <span style={{ marginLeft: 4, color: TOKENS.ink }}>{dir === 'asc' ? '↑' : '↓'}</span>}
    </th>
  );
}

function Td({ children, align = 'left' }) {
  return (
    <td
      style={{
        padding: '10px 14px',
        textAlign: align,
        fontFamily: TOKENS.font,
        fontSize: 13.5,
        color: TOKENS.ink,
        verticalAlign: 'middle',
      }}
    >
      {children}
    </td>
  );
}

function MonoText({ children }) {
  return (
    <span style={{ fontFamily: TOKENS.mono, fontSize: 13, color: TOKENS.ink }}>{children}</span>
  );
}

function FilterGroup({ label, value, onChange, options }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <Sub style={{ marginRight: 2 }}>{label}</Sub>
      {options.map((o) => (
        <Chip key={o} active={value === o} onClick={() => onChange(o)}>
          {o === 'hepsi' ? 'Hepsi' : o}
        </Chip>
      ))}
    </div>
  );
}

function StatTile({ k, v, sub, warn }) {
  return (
    <div
      style={{
        background: TOKENS.paper,
        border: `1px solid ${TOKENS.line}`,
        borderRadius: 12,
        padding: 14,
      }}
    >
      <Sub style={{ marginBottom: 2 }}>{k}</Sub>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span
          style={{
            fontFamily: TOKENS.mono,
            fontSize: 28,
            fontWeight: 600,
            color: warn ? TOKENS.low : TOKENS.ink,
            letterSpacing: -0.5,
          }}
        >
          {v}
        </span>
      </div>
      <div
        style={{
          fontFamily: TOKENS.font,
          fontSize: 12,
          color: TOKENS.inkMuted,
          marginTop: 2,
        }}
      >
        {sub}
      </div>
    </div>
  );
}

function StokBar({ item }) {
  const ratio = Math.min(item.stok / (item.minimum * 2 || 1), 1);
  const d = stokDurum(item);
  return (
    <div
      style={{
        width: 90,
        height: 4,
        background: TOKENS.lineSoft,
        borderRadius: 2,
        marginTop: 4,
        marginLeft: 'auto',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: `${ratio * 100}%`,
          background: d.renk,
          borderRadius: 2,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: -1,
          bottom: -1,
          width: 1,
          background: TOKENS.inkMuted,
          opacity: 0.4,
        }}
      />
    </div>
  );
}

function RowActions({ onGelis, onKullanim }) {
  return (
    <div style={{ display: 'inline-flex', gap: 4 }}>
      <button onClick={onGelis} title="Geliş kaydet" style={iconBtnStyle}>
        ↓
      </button>
      <button onClick={onKullanim} title="Kullanım kaydet" style={iconBtnStyle}>
        ↑
      </button>
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        gap: 16,
        paddingBottom: 4,
      }}
    >
      <div>
        <h1
          style={{
            fontFamily: TOKENS.font,
            fontWeight: 600,
            fontSize: 30,
            margin: 0,
            letterSpacing: -0.6,
            color: TOKENS.ink,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <div
            style={{
              fontFamily: TOKENS.font,
              fontSize: 14,
              color: TOKENS.inkSoft,
              marginTop: 4,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
      {actions && <div style={{ display: 'flex', gap: 8 }}>{actions}</div>}
    </div>
  );
}

function Breadcrumb({ items }) {
  return (
    <div
      style={{
        fontFamily: TOKENS.mono,
        fontSize: 11.5,
        color: TOKENS.inkMuted,
        marginBottom: 14,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        letterSpacing: 0.4,
      }}
    >
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {it.onClick ? (
            <button
              onClick={it.onClick}
              style={{
                appearance: 'none',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 'inherit',
                color: TOKENS.inkSoft,
                padding: 0,
                textTransform: 'uppercase',
                letterSpacing: 'inherit',
              }}
            >
              {it.label}
            </button>
          ) : (
            <span style={{ color: TOKENS.ink, textTransform: 'uppercase' }}>{it.label}</span>
          )}
          {i < items.length - 1 && <span>/</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

function Row({ k, v, last }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '11px 14px',
        borderBottom: last ? 'none' : `1px solid ${TOKENS.lineSoft}`,
        fontFamily: TOKENS.font,
        fontSize: 14,
      }}
    >
      <span style={{ color: TOKENS.inkSoft }}>{k}</span>
      <span style={{ color: TOKENS.ink, fontWeight: 500 }}>{v}</span>
    </div>
  );
}

function SubHeader({ children }) {
  return (
    <div
      style={{
        padding: '12px 14px',
        borderBottom: `1px solid ${TOKENS.lineSoft}`,
        fontFamily: TOKENS.mono,
        fontSize: 10.5,
        color: TOKENS.inkMuted,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        fontWeight: 600,
        background: TOKENS.bg,
      }}
    >
      {children}
    </div>
  );
}

function BigBar({ stok, min, renk }) {
  const max = min * 2 || 1;
  const ratio = Math.min(stok / max, 1);
  return (
    <div
      style={{
        width: '100%',
        height: 8,
        background: TOKENS.lineSoft,
        borderRadius: 4,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: `${ratio * 100}%`,
          background: renk,
          borderRadius: 4,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: -3,
          bottom: -3,
          width: 1.5,
          background: TOKENS.ink,
          opacity: 0.5,
        }}
      />
    </div>
  );
}

function Timeline({ hareketler, m }) {
  const { getUsta } = useStore();
  return (
    <div style={{ position: 'relative', paddingLeft: 24 }}>
      <div
        style={{
          position: 'absolute',
          left: 7,
          top: 12,
          bottom: 12,
          width: 1,
          background: TOKENS.line,
        }}
      />
      {hareketler.map((h) => {
        const isGelis = h.tip === 'gelis';
        const renk = isGelis ? TOKENS.ok : TOKENS.accent;
        const soft = isGelis ? TOKENS.okSoft : TOKENS.accentSoft;
        const usta = h.ustaId ? getUsta(h.ustaId) : null;
        return (
          <div key={h.id} style={{ position: 'relative', padding: '12px 0' }}>
            <div
              style={{
                position: 'absolute',
                left: -23,
                top: 16,
                width: 15,
                height: 15,
                borderRadius: 99,
                background: soft,
                border: `2px solid ${renk}`,
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: renk,
                fontWeight: 700,
                fontSize: 9,
              }}
            >
              {isGelis ? '↓' : '↑'}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 10,
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  fontFamily: TOKENS.mono,
                  fontSize: 11,
                  color: TOKENS.inkMuted,
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                }}
              >
                {fmtTarih(h.tarih)}
              </span>
              <Pill color={renk} soft={soft}>
                {isGelis ? 'GELİŞ' : 'KULLANIM'}
              </Pill>
              <span
                style={{
                  fontFamily: TOKENS.mono,
                  fontSize: 13,
                  fontWeight: 600,
                  color: renk,
                }}
              >
                {isGelis ? '+' : '−'}
                {h.miktar} {m.birim}
              </span>
              {h.fis && (
                <span
                  style={{
                    fontFamily: TOKENS.mono,
                    fontSize: 11,
                    color: TOKENS.inkMuted,
                  }}
                >
                  · {h.fis}
                </span>
              )}
            </div>
            <div
              style={{
                marginTop: 6,
                fontFamily: TOKENS.font,
                fontSize: 14,
                color: TOKENS.ink,
                lineHeight: 1.45,
              }}
            >
              {h.is || h.not}
            </div>
            {usta && (
              <div
                style={{
                  marginTop: 6,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <UstaAvatar usta={usta} size={22} />
                <span
                  style={{
                    fontFamily: TOKENS.font,
                    fontSize: 12.5,
                    color: TOKENS.inkSoft,
                  }}
                >
                  <span style={{ color: TOKENS.ink, fontWeight: 600 }}>{usta.ad}</span> ·{' '}
                  {usta.uzmanlik}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function StokPage({ open }) {
  const { boruFittings, digerMalzeme, hareketler, ustalar } = useStore();
  const [grup, setGrup] = useState('boru');
  const [cap, setCap] = useState('hepsi');
  const [cins, setCins] = useState('hepsi');
  const [tur, setTur] = useState('hepsi');
  const [kat, setKat] = useState('hepsi');
  const [q, setQ] = useState('');
  const [durum, setDurum] = useState('hepsi');
  const [sortKey, setSortKey] = useState('id');
  const [sortDir, setSortDir] = useState('asc');

  const items = useMemo(() => {
    let list = grup === 'boru' ? boruFittings : digerMalzeme;
    list = list.filter((m) => {
      if (grup === 'boru') {
        if (cap !== 'hepsi' && m.cap !== cap) return false;
        if (cins !== 'hepsi' && m.cins !== cins) return false;
        if (tur !== 'hepsi' && m.tur !== tur) return false;
      } else {
        if (kat !== 'hepsi' && m.kategori !== kat) return false;
      }
      if (durum !== 'hepsi') {
        const d = stokDurum(m).etiket;
        if (durum === 'azaldi' && d !== 'AZALDI') return false;
        if (durum === 'takip' && d !== 'TAKİP') return false;
        if (durum === 'stokta' && d !== 'STOKTA') return false;
      }
      if (q && !getMalzemeAd(m).toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av === bv) return 0;
      const c = av < bv ? -1 : 1;
      return sortDir === 'asc' ? c : -c;
    });
    return list;
  }, [boruFittings, digerMalzeme, grup, cap, cins, tur, kat, q, durum, sortKey, sortDir]);

  const counts = useMemo(
    () => ({
      total: boruFittings.length + digerMalzeme.length,
      azaldi: [...boruFittings, ...digerMalzeme].filter((m) => m.stok < m.minimum).length,
      boru: boruFittings.length,
      diger: digerMalzeme.length,
    }),
    [boruFittings, digerMalzeme]
  );

  const ayStats = useMemo(() => {
    const ay = new Date().toISOString().slice(0, 7);
    const buAy = hareketler.filter((h) => h.tarih.startsWith(ay));
    const gelisler = buAy.filter((h) => h.tip === 'gelis');
    const kullanimlar = buAy.filter((h) => h.tip === 'kullanim');
    return {
      gelisKayit: gelisler.length,
      gelisAdet: gelisler.reduce((s, h) => s + h.miktar, 0),
      kullanimKayit: kullanimlar.length,
      kullanimUsta: new Set(kullanimlar.map((h) => h.ustaId)).size,
    };
  }, [hareketler]);

  const toggleSort = (k) => {
    if (sortKey === k) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else {
      setSortKey(k);
      setSortDir('asc');
    }
  };

  return (
    <div>
      <PageHeader
        title="Stok"
        subtitle="Malzeme envanteri ve gerçek zamanlı durum"
        actions={
          <>
            <button onClick={() => open('yeni-malzeme', { grup })} style={btnGhostStyle}>
              <span style={{ fontSize: 16 }}>+</span> Yeni malzeme
            </button>
            <button onClick={() => open('gelis')} style={btnGhostStyle}>
              <span style={{ fontSize: 16 }}>↓</span> Geliş kaydet
            </button>
            <button onClick={() => open('kullanim')} style={btnPrimaryStyle}>
              <span style={{ fontSize: 16 }}>↑</span> Kullanım kaydet
            </button>
          </>
        }
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12,
          marginTop: 16,
        }}
      >
        <StatTile
          k="Toplam kalem"
          v={counts.total}
          sub={`${counts.boru} boru/fittings · ${counts.diger} diğer`}
        />
        <StatTile k="Azalan" v={counts.azaldi} sub="minimumun altında" warn />
        <StatTile
          k="Bu ay geliş"
          v={ayStats.gelisKayit}
          sub={`kayıt · ${ayStats.gelisAdet} kalem`}
        />
        <StatTile
          k="Bu ay kullanım"
          v={ayStats.kullanimKayit}
          sub={`kayıt · ${ayStats.kullanimUsta} usta`}
        />
      </div>

      <div
        style={{
          marginTop: 20,
          background: TOKENS.paper,
          border: `1px solid ${TOKENS.line}`,
          borderRadius: 12,
          padding: 14,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              background: TOKENS.lineSoft,
              padding: 3,
              borderRadius: 9,
            }}
          >
            {[
              { id: 'boru', label: 'Boru & Fittings', n: counts.boru },
              { id: 'diger', label: 'Diğer Malzeme', n: counts.diger },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setGrup(t.id)}
                style={{
                  appearance: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px 12px',
                  borderRadius: 7,
                  background: grup === t.id ? TOKENS.paper : 'transparent',
                  color: grup === t.id ? TOKENS.ink : TOKENS.inkSoft,
                  fontFamily: TOKENS.font,
                  fontWeight: 600,
                  fontSize: 13,
                  boxShadow: grup === t.id ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {t.label}
                <span
                  style={{
                    fontFamily: TOKENS.mono,
                    fontSize: 10.5,
                    color: TOKENS.inkMuted,
                    background: grup === t.id ? TOKENS.lineSoft : 'transparent',
                    padding: '1px 6px',
                    borderRadius: 4,
                  }}
                >
                  {t.n}
                </span>
              </button>
            ))}
          </div>

          <div style={{ flex: 1, minWidth: 240 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: TOKENS.bg,
                border: `1px solid ${TOKENS.line}`,
                borderRadius: 8,
                padding: '7px 10px',
              }}
            >
              <IconSearch />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Malzeme ara…"
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontFamily: TOKENS.font,
                  fontSize: 14,
                }}
              />
              {q && (
                <button
                  onClick={() => setQ('')}
                  style={{
                    appearance: 'none',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: TOKENS.inkMuted,
                    fontSize: 14,
                  }}
                >
                  ×
                </button>
              )}
            </div>
          </div>

          <div style={{ display: 'inline-flex', gap: 4 }}>
            {[
              { id: 'hepsi', label: 'Hepsi' },
              { id: 'azaldi', label: 'Azalan', c: TOKENS.low },
              { id: 'takip', label: 'Takip', c: TOKENS.accent },
              { id: 'stokta', label: 'Stokta', c: TOKENS.ok },
            ].map((d) => (
              <Chip key={d.id} active={durum === d.id} onClick={() => setDurum(d.id)}>
                {d.c && (
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: 99,
                      background: d.c,
                      display: 'inline-block',
                      marginRight: 6,
                      verticalAlign: 'middle',
                    }}
                  />
                )}
                {d.label}
              </Chip>
            ))}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 14,
            marginTop: 12,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {grup === 'boru' ? (
            <>
              <FilterGroup
                label="Çap"
                value={cap}
                onChange={setCap}
                options={['hepsi', '1"', '2"', '3"']}
              />
              <FilterGroup
                label="Tür"
                value={tur}
                onChange={setTur}
                options={['hepsi', 'Boru', 'Dirsek', 'Tee', 'Manşon']}
              />
              <FilterGroup
                label="Cins"
                value={cins}
                onChange={setCins}
                options={['hepsi', 'Siyah', 'Galvaniz', 'Paslanmaz']}
              />
            </>
          ) : (
            <FilterGroup
              label="Kategori"
              value={kat}
              onChange={setKat}
              options={['hepsi', 'Elektrod', 'Boya', 'Bağlantı']}
            />
          )}
        </div>
      </div>

      <div
        style={{
          marginTop: 16,
          background: TOKENS.paper,
          border: `1px solid ${TOKENS.line}`,
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: TOKENS.font,
          }}
        >
          <thead>
            <tr style={{ background: TOKENS.bg, borderBottom: `1px solid ${TOKENS.line}` }}>
              <Th onClick={() => toggleSort('id')} sortKey={sortKey} dir={sortDir} k="id" w={120}>
                Kod
              </Th>
              <Th>Malzeme</Th>
              {grup === 'boru' && (
                <>
                  <Th w={70}>Çap</Th>
                  <Th w={100}>Tür</Th>
                  <Th w={110}>Cins</Th>
                </>
              )}
              {grup === 'diger' && <Th w={130}>Kategori</Th>}
              <Th
                onClick={() => toggleSort('stok')}
                sortKey={sortKey}
                dir={sortDir}
                k="stok"
                w={120}
                align="right"
              >
                Stok
              </Th>
              <Th
                onClick={() => toggleSort('minimum')}
                sortKey={sortKey}
                dir={sortDir}
                k="minimum"
                w={90}
                align="right"
              >
                Min
              </Th>
              <Th w={110}>Durum</Th>
              <Th w={120} align="right" />
            </tr>
          </thead>
          <tbody>
            {items.map((m) => {
              const d = stokDurum(m);
              return (
                <tr
                  key={m.id}
                  onClick={() => open('detay', m.id)}
                  style={{
                    borderBottom: `1px solid ${TOKENS.lineSoft}`,
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = TOKENS.bg)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <Td>
                    <span
                      style={{
                        fontFamily: TOKENS.mono,
                        fontSize: 11.5,
                        color: TOKENS.inkMuted,
                        letterSpacing: 0.5,
                      }}
                    >
                      {m.id.toUpperCase()}
                    </span>
                  </Td>
                  <Td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <MalzemeGlyph malzeme={m} size={32} />
                      <span
                        style={{
                          fontWeight: 500,
                          fontSize: 14,
                          color: TOKENS.ink,
                        }}
                      >
                        {getMalzemeAd(m)}
                      </span>
                    </div>
                  </Td>
                  {grup === 'boru' && (
                    <>
                      <Td>
                        <MonoText>{m.cap}</MonoText>
                      </Td>
                      <Td>{m.tur}</Td>
                      <Td>{m.cins}</Td>
                    </>
                  )}
                  {grup === 'diger' && <Td>{m.kategori}</Td>}
                  <Td align="right">
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: 4,
                        justifyContent: 'flex-end',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: TOKENS.mono,
                          fontSize: 17,
                          fontWeight: 600,
                          color: TOKENS.ink,
                          letterSpacing: -0.3,
                        }}
                      >
                        {m.stok}
                      </span>
                      <span
                        style={{
                          fontFamily: TOKENS.mono,
                          fontSize: 10.5,
                          color: TOKENS.inkMuted,
                          textTransform: 'uppercase',
                          letterSpacing: 0.4,
                        }}
                      >
                        {m.birim}
                      </span>
                    </div>
                    <StokBar item={m} />
                  </Td>
                  <Td align="right">
                    <span
                      style={{
                        fontFamily: TOKENS.mono,
                        fontSize: 12,
                        color: TOKENS.inkSoft,
                      }}
                    >
                      {m.minimum}
                    </span>
                  </Td>
                  <Td>
                    <Pill color={d.renk} soft={d.soft}>
                      {d.etiket}
                    </Pill>
                  </Td>
                  <Td align="right">
                    <RowActions
                      onGelis={(e) => {
                        e.stopPropagation();
                        open('gelis', m.id);
                      }}
                      onKullanim={(e) => {
                        e.stopPropagation();
                        open('kullanim', m.id);
                      }}
                    />
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {items.length === 0 && (
          <div
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: TOKENS.inkMuted,
              fontFamily: TOKENS.font,
              fontSize: 14,
            }}
          >
            Sonuç yok.
          </div>
        )}
      </div>
      <div
        style={{
          marginTop: 10,
          fontFamily: TOKENS.mono,
          fontSize: 11,
          color: TOKENS.inkMuted,
          textAlign: 'right',
        }}
      >
        {items.length} kalem gösteriliyor
      </div>
    </div>
  );
}

export function DetayPage({ id, open, goBack }) {
  const { getMalzeme, hareketlerFor, getUsta } = useStore();
  const m = getMalzeme(id);
  if (!m) {
    return (
      <div style={{ padding: 24 }}>
        <Breadcrumb items={[{ label: 'Stok', onClick: goBack }, { label: 'Bulunamadı' }]} />
        <div style={{ fontFamily: TOKENS.font, color: TOKENS.inkSoft }}>
          Bu malzeme silinmiş ya da bulunamıyor.
        </div>
      </div>
    );
  }
  const d = stokDurum(m);
  const hareketler = hareketlerFor(id);
  const toplamGelis = hareketler.filter((h) => h.tip === 'gelis').reduce((s, h) => s + h.miktar, 0);
  const toplamKullanim = hareketler
    .filter((h) => h.tip === 'kullanim')
    .reduce((s, h) => s + h.miktar, 0);
  const kullanan = [...new Set(hareketler.filter((h) => h.ustaId).map((h) => h.ustaId))].map((uid) =>
    getUsta(uid)
  );

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Stok', onClick: goBack },
          { label: getMalzemeAd(m) },
        ]}
      />
      <PageHeader
        title={getMalzemeAd(m)}
        subtitle={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                fontFamily: TOKENS.mono,
                color: TOKENS.inkMuted,
                fontSize: 12,
                letterSpacing: 0.5,
              }}
            >
              {m.id.toUpperCase()}
            </span>
            <Pill color={d.renk} soft={d.soft} size="md">
              {d.etiket}
            </Pill>
          </span>
        }
        actions={
          <>
            <button onClick={() => open('gelis', m.id)} style={btnGhostStyle}>
              ↓ Geliş kaydet
            </button>
            <button onClick={() => open('kullanim', m.id)} style={btnPrimaryStyle}>
              ↑ Kullanım kaydet
            </button>
          </>
        }
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          gap: 20,
          marginTop: 16,
          alignItems: 'start',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              background: TOKENS.paper,
              border: `1px solid ${TOKENS.line}`,
              borderRadius: 12,
              padding: 20,
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <MalzemeGlyph malzeme={m} size={80} />
            </div>
            <div
              style={{
                marginTop: 14,
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <span
                style={{
                  fontFamily: TOKENS.mono,
                  fontSize: 44,
                  fontWeight: 600,
                  color: TOKENS.ink,
                  letterSpacing: -1,
                }}
              >
                {m.stok}
              </span>
              <span
                style={{
                  fontFamily: TOKENS.mono,
                  fontSize: 14,
                  color: TOKENS.inkMuted,
                  textTransform: 'uppercase',
                }}
              >
                {m.birim}
              </span>
            </div>
            <Sub style={{ marginTop: 4 }}>mevcut stok</Sub>
            <div
              style={{
                marginTop: 16,
                paddingTop: 14,
                borderTop: `1px solid ${TOKENS.lineSoft}`,
              }}
            >
              <BigBar stok={m.stok} min={m.minimum} renk={d.renk} />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 6,
                  fontFamily: TOKENS.mono,
                  fontSize: 11,
                  color: TOKENS.inkMuted,
                }}
              >
                <span>0</span>
                <span>min {m.minimum}</span>
                <span>{m.minimum * 2}</span>
              </div>
            </div>
          </div>

          <div
            style={{
              background: TOKENS.paper,
              border: `1px solid ${TOKENS.line}`,
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            <SubHeader>Özellikler</SubHeader>
            {m.tur ? (
              <>
                <Row k="Çap" v={m.cap} />
                <Row k="Tür" v={m.tur} />
                <Row k="Cins" v={m.cins} />
                <Row k="Birim" v={m.birim} />
                <Row k="Minimum stok" v={`${m.minimum} ${m.birim}`} last />
              </>
            ) : (
              <>
                <Row k="Kategori" v={m.kategori} />
                <Row k="Birim" v={m.birim} />
                <Row k="Minimum stok" v={`${m.minimum} ${m.birim}`} last />
              </>
            )}
          </div>

          <div
            style={{
              background: TOKENS.paper,
              border: `1px solid ${TOKENS.line}`,
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            <SubHeader>İstatistik</SubHeader>
            <Row k="Toplam geliş" v={`${toplamGelis} ${m.birim}`} />
            <Row k="Toplam kullanım" v={`${toplamKullanim} ${m.birim}`} />
            <Row k="Kullanan usta sayısı" v={kullanan.length} />
            <Row k="Hareket sayısı" v={hareketler.length} last />
          </div>
        </div>

        <div
          style={{
            background: TOKENS.paper,
            border: `1px solid ${TOKENS.line}`,
            borderRadius: 12,
          }}
        >
          <div
            style={{
              padding: '14px 20px',
              borderBottom: `1px solid ${TOKENS.line}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: TOKENS.font,
                  fontWeight: 600,
                  fontSize: 15,
                  color: TOKENS.ink,
                }}
              >
                Hareket Geçmişi
              </div>
              <Sub style={{ marginTop: 2 }}>kim, ne zaman, hangi iş için</Sub>
            </div>
            <span
              style={{
                fontFamily: TOKENS.mono,
                fontSize: 11,
                color: TOKENS.inkMuted,
              }}
            >
              {hareketler.length} kayıt
            </span>
          </div>
          <div style={{ padding: '8px 20px 20px' }}>
            {hareketler.length === 0 ? (
              <div
                style={{
                  padding: 30,
                  textAlign: 'center',
                  color: TOKENS.inkMuted,
                  fontFamily: TOKENS.font,
                  fontSize: 14,
                }}
              >
                Henüz hareket yok.
              </div>
            ) : (
              <Timeline hareketler={hareketler} m={m} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function UstalarPage() {
  const { ustalar, hareketlerForUsta, getMalzeme } = useStore();
  const [selected, setSelected] = useState(ustalar[0]?.id);

  useEffect(() => {
    if (!selected || !ustalar.find((u) => u.id === selected)) {
      setSelected(ustalar[0]?.id);
    }
  }, [ustalar, selected]);

  if (!ustalar.length) return null;
  const u = ustalar.find((x) => x.id === selected) || ustalar[0];
  const hareketler = hareketlerForUsta(u.id);
  const malzemeIst = {};
  hareketler.forEach((h) => {
    const m = getMalzeme(h.malzemeId);
    if (!m) return;
    const key = getMalzemeAd(m);
    malzemeIst[key] = malzemeIst[key] || { miktar: 0, birim: m.birim, m };
    malzemeIst[key].miktar += h.miktar;
  });
  const enCok = Object.entries(malzemeIst).sort((a, b) => b[1].miktar - a[1].miktar);

  return (
    <div>
      <PageHeader title="Ustalar" subtitle="Ekip listesi ve yapılan işlerin tam izlenebilirliği" />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '280px 1fr',
          gap: 20,
          marginTop: 16,
          alignItems: 'start',
        }}
      >
        <div
          style={{
            background: TOKENS.paper,
            border: `1px solid ${TOKENS.line}`,
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          {ustalar.map((usta, i) => {
            const n = hareketlerForUsta(usta.id).length;
            return (
              <button
                key={usta.id}
                onClick={() => setSelected(usta.id)}
                style={{
                  appearance: 'none',
                  width: '100%',
                  textAlign: 'left',
                  border: 'none',
                  borderBottom:
                    i === ustalar.length - 1 ? 'none' : `1px solid ${TOKENS.lineSoft}`,
                  background: selected === usta.id ? TOKENS.bg : 'transparent',
                  padding: '12px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  borderLeft:
                    selected === usta.id
                      ? `3px solid ${TOKENS.ink}`
                      : '3px solid transparent',
                }}
              >
                <UstaAvatar usta={usta} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: TOKENS.font,
                      fontWeight: 600,
                      fontSize: 14,
                      color: TOKENS.ink,
                    }}
                  >
                    {usta.ad}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      marginTop: 3,
                    }}
                  >
                    <Pill>{usta.uzmanlik.toUpperCase()}</Pill>
                    <span
                      style={{
                        fontFamily: TOKENS.mono,
                        fontSize: 10.5,
                        color: TOKENS.inkMuted,
                      }}
                    >
                      {n} işlem
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              background: TOKENS.paper,
              border: `1px solid ${TOKENS.line}`,
              borderRadius: 12,
              padding: 18,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <UstaAvatar usta={u} size={64} />
            <div style={{ flex: 1 }}>
              <h3
                style={{
                  fontFamily: TOKENS.font,
                  fontSize: 22,
                  fontWeight: 600,
                  margin: 0,
                  letterSpacing: -0.3,
                }}
              >
                {u.ad}
              </h3>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginTop: 6,
                }}
              >
                <Pill>{u.uzmanlik.toUpperCase()}</Pill>
                <span
                  style={{
                    fontFamily: TOKENS.mono,
                    fontSize: 11,
                    color: TOKENS.inkMuted,
                  }}
                >
                  Başlangıç: {fmtTarih(u.baslangic)}
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  fontFamily: TOKENS.mono,
                  fontSize: 28,
                  fontWeight: 600,
                  color: TOKENS.ink,
                  letterSpacing: -0.5,
                }}
              >
                {hareketler.length}
              </div>
              <Sub>kayıtlı işlem</Sub>
            </div>
          </div>

          {enCok.length > 0 && (
            <div
              style={{
                background: TOKENS.paper,
                border: `1px solid ${TOKENS.line}`,
                borderRadius: 12,
                overflow: 'hidden',
              }}
            >
              <SubHeader>En Çok Kullandığı Malzemeler</SubHeader>
              <div>
                {enCok.slice(0, 5).map(([ad, info], i, arr) => (
                  <div
                    key={ad}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 14px',
                      borderBottom:
                        i === arr.length - 1 ? 'none' : `1px solid ${TOKENS.lineSoft}`,
                    }}
                  >
                    <MalzemeGlyph malzeme={info.m} size={30} />
                    <div
                      style={{
                        flex: 1,
                        fontFamily: TOKENS.font,
                        fontSize: 13.5,
                        color: TOKENS.ink,
                      }}
                    >
                      {ad}
                    </div>
                    <div
                      style={{
                        fontFamily: TOKENS.mono,
                        fontSize: 14,
                        fontWeight: 600,
                        color: TOKENS.ink,
                      }}
                    >
                      {info.miktar}{' '}
                      <span
                        style={{
                          color: TOKENS.inkMuted,
                          fontSize: 10.5,
                          fontWeight: 500,
                        }}
                      >
                        {info.birim}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div
            style={{
              background: TOKENS.paper,
              border: `1px solid ${TOKENS.line}`,
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            <SubHeader>Yaptığı İşler ({hareketler.length})</SubHeader>
            {hareketler.length === 0 ? (
              <div
                style={{
                  padding: 30,
                  textAlign: 'center',
                  color: TOKENS.inkMuted,
                  fontFamily: TOKENS.font,
                  fontSize: 14,
                }}
              >
                Henüz iş kaydı yok.
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr
                    style={{
                      background: TOKENS.bg,
                      borderBottom: `1px solid ${TOKENS.lineSoft}`,
                    }}
                  >
                    <Th w={110}>Tarih</Th>
                    <Th>İş</Th>
                    <Th w={200}>Malzeme</Th>
                    <Th w={100} align="right">
                      Miktar
                    </Th>
                  </tr>
                </thead>
                <tbody>
                  {hareketler.map((h) => {
                    const m = getMalzeme(h.malzemeId);
                    if (!m) return null;
                    return (
                      <tr
                        key={h.id}
                        style={{ borderBottom: `1px solid ${TOKENS.lineSoft}` }}
                      >
                        <Td>
                          <MonoText>{fmtTarih(h.tarih)}</MonoText>
                        </Td>
                        <Td>{h.is}</Td>
                        <Td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <MalzemeGlyph malzeme={m} size={24} />
                            <span style={{ fontSize: 13 }}>{getMalzemeAd(m)}</span>
                          </div>
                        </Td>
                        <Td align="right">
                          <span
                            style={{
                              fontFamily: TOKENS.mono,
                              fontSize: 13,
                              fontWeight: 600,
                              color: TOKENS.accent,
                            }}
                          >
                            −{h.miktar}
                          </span>
                          <span
                            style={{
                              fontFamily: TOKENS.mono,
                              fontSize: 10.5,
                              color: TOKENS.inkMuted,
                              marginLeft: 3,
                            }}
                          >
                            {m.birim}
                          </span>
                        </Td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FormModal({ children, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(20,16,12,0.45)',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 460,
          maxWidth: '100%',
          height: '100%',
          background: TOKENS.bg,
          boxShadow: '-20px 0 40px rgba(0,0,0,0.1)',
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 10,
            appearance: 'none',
            border: `1px solid ${TOKENS.line}`,
            background: TOKENS.paper,
            width: 32,
            height: 32,
            borderRadius: 8,
            cursor: 'pointer',
            fontFamily: TOKENS.font,
            fontSize: 18,
            color: TOKENS.inkSoft,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
