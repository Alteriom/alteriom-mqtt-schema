// Re-export the generated firmware repo types by importing relative path.
// This keeps single source of truth while enabling package consumers to import from package root.
// Re-export generated types copied during prebuild from firmware docs into src/generated/types.ts
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export * from './generated/types.js';
