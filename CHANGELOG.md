# Changelog

## 1.1.0 (unreleased)

### Added

- `preserveHalfSpace` and `preserveDiacritics` options for `toPersian`.
- Optional Arabic digit conversion in `toEnglish` with `{ arabic: true }`.
- `formatNumber` for grouping numeric strings without losing precision or digit style.
- `numberToWords` for Persian integer and decimal words.
- `switchKeyboard` for Persian Standard and English QWERTY letter positions.
- TypeScript definitions for all exports and options.
- Conversion benchmarks for short and long inputs.
- CI coverage for packaged installation, CommonJS, native ESM, TypeScript and Vite browser consumers.

### Changed

- Remove U+064B–U+065F diacritics in one replacement pass in `toPersian`.
- Update Babel and ESLint development tools while retaining ES5 CommonJS output.

Existing conversion defaults are unchanged. The package has no runtime dependencies
and retains compatibility with Node.js 0.10 and later. Building from source requires
Node.js 22.18 or later in the 22.x line, or Node.js 24.11 or later.
