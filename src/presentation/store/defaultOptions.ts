/**
 * Built-in selectable option values per "section.field".
 * Admins can extend these at runtime via the catalog; `catalogOptions()` in the
 * store merges custom values on top of these defaults.
 */
export const DEFAULT_OPTIONS: Record<string, string[]> = {
  'pipe.diameter': ['1"', '2"', '3"', '4"', '6"'],
  'pipe.kind': ['Boru', 'Dirsek', 'Tee', 'Manşon'],
  'pipe.grade': ['Siyah', 'Galvaniz', 'Paslanmaz'],

  'other.category': ['Elektrod', 'Boya', 'Bağlantı', 'Sarf', 'Diğer'],
  'other.unit': ['adet', 'paket', 'litre', 'kg', 'm'],

  'ventilation.kind': ['Kanal', 'Dirsek', 'Flanş', 'Damper', 'Menfez'],
  'ventilation.grade': ['Galvaniz', 'Paslanmaz', 'Alüminyum'],
  'ventilation.diameter': ['100', '125', '160', '200', '250', '315'],

  'isolation.kind': ['Taşyünü', 'Camyünü', 'Kauçuk', 'Şilte'],
  'isolation.grade': ['Düz', 'Folyolu', 'Takviyeli'],
  'isolation.thickness': ['19', '25', '32', '50'],
  'isolation.diameter': ['22', '28', '35', '42', '54', '76'],
};
