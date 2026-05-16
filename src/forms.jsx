import React, { useState } from 'react';
import {
  TOKENS,
  Chip,
  Sub,
  IconArrow,
  IconCheck,
  IconSearch,
  MalzemeGlyph,
  UstaAvatar,
  btnPrimaryStyle,
} from './tokens.jsx';
import { useStore, getMalzemeAd, fmtTarih } from './store.jsx';

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function FormShell({ title, altTitle, children }) {
  return (
    <div style={{ paddingBottom: 60 }}>
      <div style={{ padding: '0 24px', paddingTop: 56 }}>
        <Sub>{altTitle}</Sub>
        <h1
          style={{
            fontFamily: TOKENS.font,
            fontWeight: 600,
            fontSize: 26,
            margin: '4px 0 18px',
            letterSpacing: -0.4,
          }}
        >
          {title}
        </h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div>
      </div>
    </div>
  );
}

export function Field({ label, optional, hint, children }) {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 6,
          gap: 8,
        }}
      >
        <label
          style={{
            fontFamily: TOKENS.font,
            fontSize: 13,
            fontWeight: 600,
            color: TOKENS.ink,
            whiteSpace: 'nowrap',
          }}
        >
          {label}{' '}
          {optional && <span style={{ color: TOKENS.inkMuted, fontWeight: 400 }}>(opsiyonel)</span>}
        </label>
        {hint && (
          <span
            style={{ fontFamily: TOKENS.mono, fontSize: 11, color: TOKENS.low, fontWeight: 600 }}
          >
            {hint}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

export function TextInput({ value, onChange, placeholder, mono }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%',
        boxSizing: 'border-box',
        padding: '12px 14px',
        border: `1px solid ${TOKENS.line}`,
        borderRadius: 10,
        background: TOKENS.paper,
        fontFamily: mono ? TOKENS.mono : TOKENS.font,
        fontSize: 15,
        color: TOKENS.ink,
        outline: 'none',
      }}
    />
  );
}

export function TextArea({ value, onChange, placeholder }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      style={{
        width: '100%',
        boxSizing: 'border-box',
        padding: '12px 14px',
        border: `1px solid ${TOKENS.line}`,
        borderRadius: 10,
        background: TOKENS.paper,
        fontFamily: TOKENS.font,
        fontSize: 15,
        color: TOKENS.ink,
        outline: 'none',
        resize: 'none',
      }}
    />
  );
}

export function NumInput({ value, onChange, suffix, warn }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        border: `1px solid ${warn ? TOKENS.low : TOKENS.line}`,
        borderRadius: 10,
        background: TOKENS.paper,
        padding: '0 14px',
      }}
    >
      <input
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, ''))}
        placeholder="0"
        inputMode="decimal"
        style={{
          flex: 1,
          padding: '12px 0',
          border: 'none',
          outline: 'none',
          background: 'transparent',
          fontFamily: TOKENS.mono,
          fontSize: 17,
          color: TOKENS.ink,
          fontWeight: 600,
        }}
      />
      {suffix && (
        <span style={{ fontFamily: TOKENS.mono, fontSize: 13, color: TOKENS.inkMuted }}>{suffix}</span>
      )}
    </div>
  );
}

export function DateInput({ value, onChange }) {
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        boxSizing: 'border-box',
        padding: '12px 14px',
        border: `1px solid ${TOKENS.line}`,
        borderRadius: 10,
        background: TOKENS.paper,
        fontFamily: TOKENS.mono,
        fontSize: 15,
        color: TOKENS.ink,
        outline: 'none',
      }}
    />
  );
}

export function MalzemeSecici({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const { getMalzeme } = useStore();
  const m = value ? getMalzeme(value) : null;
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          appearance: 'none',
          width: '100%',
          textAlign: 'left',
          border: `1px solid ${TOKENS.line}`,
          borderRadius: 10,
          background: TOKENS.paper,
          padding: '12px 14px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            fontFamily: TOKENS.font,
            fontSize: 15,
            color: m ? TOKENS.ink : TOKENS.inkMuted,
          }}
        >
          {m ? getMalzemeAd(m) : 'Malzeme seç…'}
        </span>
        <IconArrow dir="down" />
      </button>
      {open && (
        <SeciciSheet
          onClose={() => setOpen(false)}
          onPick={(id) => {
            onChange(id);
            setOpen(false);
          }}
        />
      )}
    </>
  );
}

function SeciciSheet({ onClose, onPick }) {
  const [q, setQ] = useState('');
  const { boruFittings, digerMalzeme } = useStore();
  const all = [...boruFittings, ...digerMalzeme];
  const filtered = q
    ? all.filter((m) => getMalzemeAd(m).toLowerCase().includes(q.toLowerCase()))
    : all;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(20,16,12,0.4)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: TOKENS.bg,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          maxHeight: '75%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ padding: '10px 0 0', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 36, height: 4, borderRadius: 99, background: TOKENS.line }} />
        </div>
        <div style={{ padding: '12px 20px 8px' }}>
          <div
            style={{
              fontFamily: TOKENS.font,
              fontWeight: 600,
              fontSize: 17,
              color: TOKENS.ink,
              marginBottom: 8,
            }}
          >
            Malzeme seç
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: TOKENS.paper,
              border: `1px solid ${TOKENS.line}`,
              borderRadius: 10,
              padding: '8px 12px',
            }}
          >
            <IconSearch />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ara…"
              autoFocus
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontFamily: TOKENS.font,
                fontSize: 15,
              }}
            />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 20px 24px' }}>
          {filtered.map((m) => (
            <button
              key={m.id}
              onClick={() => onPick(m.id)}
              style={{
                appearance: 'none',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 4px',
                borderBottom: `1px solid ${TOKENS.lineSoft}`,
                textAlign: 'left',
              }}
            >
              <MalzemeGlyph malzeme={m} size={34} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: TOKENS.font, fontSize: 14.5, color: TOKENS.ink }}>
                  {getMalzemeAd(m)}
                </div>
                <div
                  style={{ fontFamily: TOKENS.mono, fontSize: 11, color: TOKENS.inkMuted }}
                >
                  {m.stok} {m.birim} stokta
                </div>
              </div>
              <IconArrow />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function UstaSecici({ value, onChange }) {
  const { ustalar } = useStore();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {ustalar.map((u) => (
        <button
          key={u.id}
          onClick={() => onChange(u.id)}
          style={{
            appearance: 'none',
            background: value === u.id ? TOKENS.ink : TOKENS.paper,
            border: `1px solid ${value === u.id ? TOKENS.ink : TOKENS.line}`,
            borderRadius: 10,
            padding: '10px 12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            textAlign: 'left',
          }}
        >
          <UstaAvatar usta={u} size={32} />
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: TOKENS.font,
                fontWeight: 600,
                fontSize: 14,
                color: value === u.id ? '#fff' : TOKENS.ink,
              }}
            >
              {u.ad}
            </div>
            <div
              style={{
                fontFamily: TOKENS.mono,
                fontSize: 11,
                color: value === u.id ? 'rgba(255,255,255,0.7)' : TOKENS.inkMuted,
                letterSpacing: 0.5,
              }}
            >
              {u.uzmanlik}
            </div>
          </div>
          {value === u.id && <IconCheck />}
        </button>
      ))}
    </div>
  );
}

function BasariliEkran({ tip, miktar, m, usta, is, tarih, goBack }) {
  return (
    <div
      style={{
        padding: '60px 24px 100px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 999,
          background: TOKENS.okSoft,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <IconCheck size={36} color={TOKENS.ok} />
      </div>
      <h2
        style={{
          fontFamily: TOKENS.font,
          fontWeight: 600,
          fontSize: 22,
          margin: 0,
          color: TOKENS.ink,
        }}
      >
        {tip === 'gelis' ? 'Geliş kaydedildi' : 'Kullanım kaydedildi'}
      </h2>
      <div
        style={{
          background: TOKENS.paper,
          border: `1px solid ${TOKENS.line}`,
          borderRadius: 14,
          padding: 16,
          width: '100%',
          textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <MalzemeGlyph malzeme={m} size={40} />
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: TOKENS.font,
                fontWeight: 600,
                fontSize: 15,
                color: TOKENS.ink,
              }}
            >
              {getMalzemeAd(m)}
            </div>
            <div
              style={{
                fontFamily: TOKENS.mono,
                fontSize: 14,
                fontWeight: 600,
                color: tip === 'gelis' ? TOKENS.ok : TOKENS.accent,
              }}
            >
              {tip === 'gelis' ? '+' : '−'}
              {miktar} {m.birim}
            </div>
          </div>
        </div>
        {usta && (
          <div
            style={{
              marginTop: 10,
              padding: '10px 0 0',
              borderTop: `1px solid ${TOKENS.lineSoft}`,
            }}
          >
            <div style={{ fontFamily: TOKENS.font, fontSize: 13, color: TOKENS.inkSoft }}>
              <span style={{ color: TOKENS.ink, fontWeight: 600 }}>{usta.ad}</span> · {usta.uzmanlik}
            </div>
            <div
              style={{
                fontFamily: TOKENS.font,
                fontSize: 13,
                color: TOKENS.ink,
                marginTop: 4,
                lineHeight: 1.4,
              }}
            >
              {is}
            </div>
          </div>
        )}
        <div
          style={{
            marginTop: 10,
            fontFamily: TOKENS.mono,
            fontSize: 11,
            color: TOKENS.inkMuted,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
          }}
        >
          {fmtTarih(tarih)}
        </div>
      </div>
      <button
        onClick={goBack}
        style={{ ...btnPrimaryStyle, padding: '12px 30px' }}
      >
        Tamam
      </button>
    </div>
  );
}

export function GelisScreen({ presetId, goBack }) {
  const { getMalzeme, addGelis } = useStore();
  const [malzemeId, setMalzemeId] = useState(presetId || '');
  const [miktar, setMiktar] = useState('');
  const [tarih, setTarih] = useState(todayIso());
  const [fis, setFis] = useState('');
  const [tedarikci, setTedarikci] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [snapshot, setSnapshot] = useState(null);

  const m = malzemeId ? getMalzeme(malzemeId) : null;
  const valid = malzemeId && miktar && Number(miktar) > 0;

  const submit = () => {
    if (!valid) return;
    setSnapshot({ m, miktar, tarih });
    addGelis({ malzemeId, miktar, tarih, tedarikci, fis });
    setSubmitted(true);
  };

  if (submitted && snapshot) {
    return (
      <BasariliEkran
        tip="gelis"
        miktar={snapshot.miktar}
        m={snapshot.m}
        tarih={snapshot.tarih}
        goBack={goBack}
      />
    );
  }

  return (
    <FormShell title="Yeni Geliş" altTitle="Tedarikten malzeme girişi">
      <Field label="Malzeme">
        <MalzemeSecici value={malzemeId} onChange={setMalzemeId} />
      </Field>

      {m && (
        <div
          style={{
            background: TOKENS.steelSoft,
            borderRadius: 10,
            padding: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <MalzemeGlyph malzeme={m} size={36} />
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: TOKENS.font,
                fontWeight: 600,
                fontSize: 14,
                color: TOKENS.ink,
              }}
            >
              {getMalzemeAd(m)}
            </div>
            <div style={{ fontFamily: TOKENS.mono, fontSize: 11, color: TOKENS.inkSoft }}>
              Mevcut: {m.stok} {m.birim}
              {miktar && Number(miktar) > 0 && (
                <>
                  {' '}→{' '}
                  <span style={{ color: TOKENS.ok, fontWeight: 600 }}>
                    {m.stok + Number(miktar)} {m.birim}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <Field label={`Miktar${m ? ` (${m.birim})` : ''}`}>
        <NumInput value={miktar} onChange={setMiktar} suffix={m?.birim} />
      </Field>

      <Field label="Geliş Tarihi">
        <DateInput value={tarih} onChange={setTarih} />
      </Field>

      <Field label="Tedarikçi" optional>
        <TextInput value={tedarikci} onChange={setTedarikci} placeholder="ör. Borsan Çelik" />
      </Field>

      <Field label="Fiş No" optional>
        <TextInput value={fis} onChange={setFis} placeholder="F-2026-…" mono />
      </Field>

      <div
        style={{
          position: 'sticky',
          bottom: 0,
          padding: '12px 0 0',
          background: `linear-gradient(transparent, ${TOKENS.bg} 30%)`,
        }}
      >
        <button
          onClick={submit}
          disabled={!valid}
          style={{
            ...btnPrimaryStyle,
            width: '100%',
            padding: '14px',
            opacity: valid ? 1 : 0.4,
            background: TOKENS.ok,
          }}
        >
          Geliş kaydet
        </button>
      </div>
    </FormShell>
  );
}

export function KullanimScreen({ presetId, goBack }) {
  const { getMalzeme, getUsta, addKullanim } = useStore();
  const [malzemeId, setMalzemeId] = useState(presetId || '');
  const [miktar, setMiktar] = useState('');
  const [ustaId, setUstaId] = useState('');
  const [is, setIs] = useState('');
  const [tarih, setTarih] = useState(todayIso());
  const [submitted, setSubmitted] = useState(false);
  const [snapshot, setSnapshot] = useState(null);

  const m = malzemeId ? getMalzeme(malzemeId) : null;
  const usta = ustaId ? getUsta(ustaId) : null;
  const valid =
    malzemeId && miktar && Number(miktar) > 0 && ustaId && is.trim().length > 2;
  const yetersiz = m && miktar && Number(miktar) > m.stok;

  const submit = () => {
    if (!valid || yetersiz) return;
    setSnapshot({ m, miktar, usta, is, tarih });
    addKullanim({ malzemeId, miktar, tarih, ustaId, is });
    setSubmitted(true);
  };

  if (submitted && snapshot) {
    return (
      <BasariliEkran
        tip="kullanim"
        miktar={snapshot.miktar}
        m={snapshot.m}
        usta={snapshot.usta}
        is={snapshot.is}
        tarih={snapshot.tarih}
        goBack={goBack}
      />
    );
  }

  return (
    <FormShell title="Kullanım Kaydet" altTitle="Üretimde kullanılan malzeme">
      <Field label="Malzeme">
        <MalzemeSecici value={malzemeId} onChange={setMalzemeId} />
      </Field>

      {m && (
        <div
          style={{
            background: TOKENS.steelSoft,
            borderRadius: 10,
            padding: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <MalzemeGlyph malzeme={m} size={36} />
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: TOKENS.font,
                fontWeight: 600,
                fontSize: 14,
                color: TOKENS.ink,
              }}
            >
              {getMalzemeAd(m)}
            </div>
            <div style={{ fontFamily: TOKENS.mono, fontSize: 11, color: TOKENS.inkSoft }}>
              Mevcut: {m.stok} {m.birim}
              {miktar && Number(miktar) > 0 && (
                <>
                  {' '}→{' '}
                  <span
                    style={{
                      color: yetersiz ? TOKENS.low : TOKENS.accent,
                      fontWeight: 600,
                    }}
                  >
                    {m.stok - Number(miktar)} {m.birim}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <Field
        label={`Miktar${m ? ` (${m.birim})` : ''}`}
        hint={yetersiz ? 'Stok yetersiz!' : null}
      >
        <NumInput value={miktar} onChange={setMiktar} suffix={m?.birim} warn={yetersiz} />
      </Field>

      <Field label="Kullanan Usta">
        <UstaSecici value={ustaId} onChange={setUstaId} />
      </Field>

      <Field label="Yapılan İş">
        <TextArea
          value={is}
          onChange={setIs}
          placeholder="ör. 4. kat radyatör hattı dönüş kolları"
        />
      </Field>

      <Field label="Tarih">
        <DateInput value={tarih} onChange={setTarih} />
      </Field>

      <div
        style={{
          position: 'sticky',
          bottom: 0,
          padding: '12px 0 0',
          background: `linear-gradient(transparent, ${TOKENS.bg} 30%)`,
        }}
      >
        <button
          onClick={submit}
          disabled={!valid || yetersiz}
          style={{
            ...btnPrimaryStyle,
            width: '100%',
            padding: '14px',
            opacity: valid && !yetersiz ? 1 : 0.4,
          }}
        >
          Kullanım kaydet
        </button>
      </div>
    </FormShell>
  );
}

function SegmentControl({ value, onChange, options }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${options.length}, 1fr)`,
        background: TOKENS.lineSoft,
        padding: 3,
        borderRadius: 10,
      }}
    >
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          style={{
            appearance: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '9px 12px',
            borderRadius: 8,
            background: value === o.value ? TOKENS.paper : 'transparent',
            color: value === o.value ? TOKENS.ink : TOKENS.inkSoft,
            fontFamily: TOKENS.font,
            fontWeight: 600,
            fontSize: 14,
            boxShadow: value === o.value ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function ChipPicker({ value, onChange, options }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {options.map((o) => (
        <Chip key={o} active={value === o} onClick={() => onChange(o)}>
          {o}
        </Chip>
      ))}
    </div>
  );
}

function PreviewCard({ ad, birim, cakisma, malzemePreview }) {
  return (
    <div
      style={{
        background: cakisma ? TOKENS.lowSoft : TOKENS.steelSoft,
        border: `1px solid ${cakisma ? TOKENS.low : 'transparent'}`,
        borderRadius: 10,
        padding: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <MalzemeGlyph malzeme={malzemePreview} size={40} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: TOKENS.mono,
            fontSize: 10,
            color: TOKENS.inkMuted,
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}
        >
          {cakisma ? 'Zaten var' : 'Önizleme'}
        </div>
        <div
          style={{
            fontFamily: TOKENS.font,
            fontWeight: 600,
            fontSize: 15,
            color: TOKENS.ink,
            marginTop: 2,
          }}
        >
          {ad}
        </div>
        <div
          style={{
            fontFamily: TOKENS.mono,
            fontSize: 11,
            color: TOKENS.inkSoft,
            marginTop: 2,
          }}
        >
          {cakisma
            ? `Mevcut stok: ${cakisma.stok} ${cakisma.birim} (${cakisma.id.toUpperCase()})`
            : `Birim: ${birim}`}
        </div>
      </div>
    </div>
  );
}

function BasariliMalzemeEkran({ yeniAd, grup, birim, baslangic, minimum, goBack }) {
  return (
    <div
      style={{
        padding: '60px 24px 100px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 999,
          background: TOKENS.okSoft,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <IconCheck size={36} color={TOKENS.ok} />
      </div>
      <h2
        style={{
          fontFamily: TOKENS.font,
          fontWeight: 600,
          fontSize: 22,
          margin: 0,
          color: TOKENS.ink,
        }}
      >
        Malzeme kataloga eklendi
      </h2>
      <div
        style={{
          background: TOKENS.paper,
          border: `1px solid ${TOKENS.line}`,
          borderRadius: 14,
          padding: 16,
          width: '100%',
          textAlign: 'left',
        }}
      >
        <div
          style={{
            fontFamily: TOKENS.mono,
            fontSize: 10,
            color: TOKENS.inkMuted,
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}
        >
          {grup === 'boru' ? 'Boru & Fittings' : 'Diğer Malzeme'}
        </div>
        <div
          style={{
            fontFamily: TOKENS.font,
            fontWeight: 600,
            fontSize: 17,
            color: TOKENS.ink,
            marginTop: 2,
          }}
        >
          {yeniAd}
        </div>
        <div
          style={{
            marginTop: 12,
            paddingTop: 10,
            borderTop: `1px solid ${TOKENS.lineSoft}`,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 8,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: TOKENS.mono,
                fontSize: 10,
                color: TOKENS.inkMuted,
                letterSpacing: 0.6,
              }}
            >
              AÇILIŞ
            </div>
            <div
              style={{
                fontFamily: TOKENS.mono,
                fontSize: 17,
                fontWeight: 600,
                color: TOKENS.ink,
              }}
            >
              {baslangic || 0}{' '}
              <span style={{ fontSize: 11, color: TOKENS.inkMuted }}>{birim}</span>
            </div>
          </div>
          <div>
            <div
              style={{
                fontFamily: TOKENS.mono,
                fontSize: 10,
                color: TOKENS.inkMuted,
                letterSpacing: 0.6,
              }}
            >
              MİNİMUM
            </div>
            <div
              style={{
                fontFamily: TOKENS.mono,
                fontSize: 17,
                fontWeight: 600,
                color: TOKENS.ink,
              }}
            >
              {minimum}{' '}
              <span style={{ fontSize: 11, color: TOKENS.inkMuted }}>{birim}</span>
            </div>
          </div>
        </div>
      </div>
      <button onClick={goBack} style={{ ...btnPrimaryStyle, padding: '12px 30px' }}>
        Tamam
      </button>
    </div>
  );
}

export function YeniMalzemeScreen({ preset, goBack }) {
  const { boruFittings, digerMalzeme, addMalzeme } = useStore();
  const [grup, setGrup] = useState(preset?.grup || 'boru');
  const [cap, setCap] = useState('');
  const [tur, setTur] = useState('');
  const [cins, setCins] = useState('');
  const [kategori, setKategori] = useState('');
  const [ad, setAd] = useState('');
  const [birim, setBirim] = useState('');
  const [baslangic, setBaslangic] = useState('');
  const [minimum, setMinimum] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const isBoru = grup === 'boru';
  const otoBirim = isBoru ? (tur === 'Boru' ? 'm' : 'adet') : birim;

  const valid = isBoru
    ? cap && tur && cins && minimum
    : kategori && ad.trim().length > 1 && birim && minimum;

  const cakisma =
    isBoru && cap && tur && cins
      ? boruFittings.find((m) => m.cap === cap && m.tur === tur && m.cins === cins)
      : !isBoru && ad
      ? digerMalzeme.find((m) => m.ad.toLowerCase() === ad.toLowerCase())
      : null;

  const submit = () => {
    if (!valid || cakisma) return;
    addMalzeme({ grup, cap, tur, cins, kategori, ad, birim, baslangic, minimum });
    setSubmitted(true);
  };

  if (submitted) {
    const yeniAd = isBoru ? `${cap} ${cins} ${tur}` : ad;
    return (
      <BasariliMalzemeEkran
        yeniAd={yeniAd}
        grup={grup}
        birim={otoBirim}
        baslangic={baslangic}
        minimum={minimum}
        goBack={goBack}
      />
    );
  }

  return (
    <FormShell title="Yeni Malzeme" altTitle="Katalog tanımı">
      <Field label="Malzeme Grubu">
        <SegmentControl
          value={grup}
          onChange={setGrup}
          options={[
            { value: 'boru', label: 'Boru & Fittings' },
            { value: 'diger', label: 'Diğer Malzeme' },
          ]}
        />
      </Field>

      {isBoru ? (
        <>
          <Field label="Çap">
            <ChipPicker value={cap} onChange={setCap} options={['1"', '2"', '3"', '4"', '6"']} />
          </Field>
          <Field label="Tür">
            <ChipPicker
              value={tur}
              onChange={setTur}
              options={['Boru', 'Dirsek', 'Tee', 'Manşon']}
            />
          </Field>
          <Field label="Cins">
            <ChipPicker
              value={cins}
              onChange={setCins}
              options={['Siyah', 'Galvaniz', 'Paslanmaz']}
            />
          </Field>
          {cap && tur && cins && (
            <PreviewCard
              ad={`${cap} ${cins} ${tur}`}
              birim={otoBirim}
              cakisma={cakisma}
              malzemePreview={{ tur, cap, cins }}
            />
          )}
        </>
      ) : (
        <>
          <Field label="Kategori">
            <ChipPicker
              value={kategori}
              onChange={setKategori}
              options={['Elektrod', 'Boya', 'Bağlantı', 'Sarf', 'Diğer']}
            />
          </Field>
          <Field label="Malzeme Adı">
            <TextInput
              value={ad}
              onChange={setAd}
              placeholder="ör. Rutil Elektrod Ø4.0"
            />
          </Field>
          <Field label="Birim">
            <ChipPicker
              value={birim}
              onChange={setBirim}
              options={['adet', 'paket', 'litre', 'kg', 'm']}
            />
          </Field>
          {ad && kategori && birim && (
            <PreviewCard
              ad={ad}
              birim={birim}
              cakisma={cakisma}
              malzemePreview={{ kategori, ad }}
            />
          )}
        </>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          paddingTop: 4,
          borderTop: `1px solid ${TOKENS.lineSoft}`,
          marginTop: 4,
        }}
      >
        <Field label="Açılış stoku" optional>
          <NumInput value={baslangic} onChange={setBaslangic} suffix={otoBirim} />
        </Field>
        <Field label="Minimum stok">
          <NumInput value={minimum} onChange={setMinimum} suffix={otoBirim} />
        </Field>
      </div>

      <div
        style={{
          fontFamily: TOKENS.font,
          fontSize: 12,
          color: TOKENS.inkMuted,
          lineHeight: 1.5,
        }}
      >
        Minimum stok altına düşen kalemler{' '}
        <span style={{ color: TOKENS.low, fontWeight: 600 }}>AZALDI</span> olarak işaretlenir.
        Açılış stoku, ilk geliş kaydı olarak loglanır.
      </div>

      <div
        style={{
          position: 'sticky',
          bottom: 0,
          padding: '12px 0 0',
          background: `linear-gradient(transparent, ${TOKENS.bg} 30%)`,
        }}
      >
        <button
          onClick={submit}
          disabled={!valid || !!cakisma}
          style={{
            ...btnPrimaryStyle,
            width: '100%',
            padding: '14px',
            opacity: valid && !cakisma ? 1 : 0.4,
          }}
        >
          {cakisma ? 'Bu malzeme zaten kayıtlı' : 'Kataloga ekle'}
        </button>
      </div>
    </FormShell>
  );
}
