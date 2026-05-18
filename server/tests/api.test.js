/**
 * End-to-end API tests — runs against the live Express server.
 * Usage: node server/tests/api.test.js
 */

const BASE = 'http://localhost:3001/api';

let passed = 0;
let failed = 0;

async function req(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body != null ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  return { status: res.status, data };
}

function assert(label, condition, detail = '') {
  if (condition) {
    console.log(`  ✅ ${label}`);
    passed++;
  } else {
    console.error(`  ❌ ${label}${detail ? ` — ${detail}` : ''}`);
    failed++;
  }
}

async function run() {
  console.log('\n═══════════════════════════════════════');
  console.log('  Atolye Envanter — API Test Suite');
  console.log('═══════════════════════════════════════\n');

  // ── Materials ────────────────────────────────────────────
  console.log('📦 Materials');

  let r = await req('GET', '/materials');
  assert('GET /materials returns 200', r.status === 200);
  assert('Response has boruFittings array', Array.isArray(r.data.boruFittings));
  assert('Response has digerMalzeme array', Array.isArray(r.data.digerMalzeme));

  // Create boru fitting
  r = await req('POST', '/materials', {
    grup: 'boru', cap: '2"', tur: 'Boru', cins: 'Siyah', minimum: 10, baslangic: 50,
  });
  assert('POST boru malzeme → 201', r.status === 201, JSON.stringify(r.data));
  assert('Boru malzeme has correct stok (50)', r.data?.stok === 50);
  assert('Boru birim is m', r.data?.birim === 'm');
  const boruId = r.data?.id;

  // Create diger malzeme
  r = await req('POST', '/materials', {
    grup: 'diger', kategori: 'Boya', ad: 'Test Boya', birim: 'litre', minimum: 5, baslangic: 20,
  });
  assert('POST diger malzeme → 201', r.status === 201, JSON.stringify(r.data));
  assert('Diger malzeme has correct stok (20)', r.data?.stok === 20);
  const digerId = r.data?.id;

  // Duplicate check
  r = await req('POST', '/materials', {
    grup: 'boru', cap: '2"', tur: 'Boru', cins: 'Siyah', minimum: 10,
  });
  assert('Duplicate boru malzeme → 409', r.status === 409);

  // Update
  r = await req('PUT', `/materials/${digerId}`, { minimum: 8 });
  assert('PUT malzeme minimum → 200', r.status === 200);
  assert('Minimum updated to 8', r.data?.minimum === 8);

  // Delete with movements — should fail
  r = await req('DELETE', `/materials/${boruId}`);
  assert('DELETE malzeme with movements → 409', r.status === 409, JSON.stringify(r.data));

  // ── Workers ──────────────────────────────────────────────
  console.log('\n👷 Workers');

  r = await req('GET', '/workers');
  assert('GET /workers returns 200', r.status === 200);
  assert('Response is array', Array.isArray(r.data));

  r = await req('POST', '/workers', { ad: 'Test Usta', uzmanlik: 'Kaynak', baslangic: '2020-01-01' });
  assert('POST worker → 201', r.status === 201, JSON.stringify(r.data));
  assert('Worker has id', !!r.data?.id);
  const ustaId = r.data?.id;

  r = await req('PUT', `/workers/${ustaId}`, { ad: 'Test Usta Güncellendi', uzmanlik: 'Kaynak', baslangic: '2020-01-01' });
  assert('PUT worker → 200', r.status === 200);
  assert('Name updated', r.data?.ad === 'Test Usta Güncellendi');

  // Missing required field
  r = await req('POST', '/workers', { ad: 'Eksik', baslangic: '2020-01-01' });
  assert('POST worker missing uzmanlik → 400', r.status === 400);

  // ── Movements ────────────────────────────────────────────
  console.log('\n📋 Movements');

  r = await req('GET', '/movements');
  assert('GET /movements returns 200', r.status === 200);
  assert('Movements is array', Array.isArray(r.data));

  // Gelis
  r = await req('POST', '/movements/gelis', {
    malzemeId: boruId, miktar: 30, tarih: '2026-05-18', tedarikci: 'Test Tedarikci', fis: 'T-001',
  });
  assert('POST gelis → 201', r.status === 201, JSON.stringify(r.data));
  assert('Gelis returns updatedMaterial', !!r.data?.updatedMaterial);
  assert('Stock increased by 30 (50+30=80)', r.data?.updatedMaterial?.stok === 80);

  // Kullanim
  r = await req('POST', '/movements/kullanim', {
    malzemeId: boruId, miktar: 10, tarih: '2026-05-18', ustaId: ustaId, is: 'Test iş açıklaması',
  });
  assert('POST kullanim → 201', r.status === 201, JSON.stringify(r.data));
  assert('Stock decreased by 10 (80-10=70)', r.data?.updatedMaterial?.stok === 70);

  // Insufficient stock
  r = await req('POST', '/movements/kullanim', {
    malzemeId: boruId, miktar: 9999, tarih: '2026-05-18', ustaId: ustaId, is: 'Yetersiz stok testi',
  });
  assert('Insufficient stock → 400', r.status === 400);

  // Filter movements by malzeme
  r = await req('GET', `/movements?malzemeId=${boruId}`);
  assert('GET movements by malzemeId returns array', Array.isArray(r.data));
  assert('All movements belong to boruId', r.data.every((h) => h.malzemeId === boruId));

  // Filter movements by usta
  r = await req('GET', `/movements?ustaId=${ustaId}`);
  assert('GET movements by ustaId returns array', Array.isArray(r.data));

  // Delete worker with movements — should fail
  r = await req('DELETE', `/workers/${ustaId}`);
  assert('DELETE worker with movements → 409', r.status === 409, JSON.stringify(r.data));

  // ── Summary ──────────────────────────────────────────────
  console.log('\n═══════════════════════════════════════');
  const total = passed + failed;
  const status = failed === 0 ? '✅ TÜM TESTLER GEÇTİ' : `❌ ${failed} TEST BAŞARISIZ`;
  console.log(`  ${status}  (${passed}/${total})`);
  console.log('═══════════════════════════════════════\n');

  process.exit(failed > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error('\n💥 Test runner hatası:', err.message);
  console.error('Sunucu çalışıyor mu? node server/index.js');
  process.exit(1);
});
