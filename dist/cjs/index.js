"use strict";
// Public export surface for @alteriom/mqtt-schema
// NOTE: This initial iteration re-exports pre-generated types produced in the firmware repo.
// In future, generation could move into this package build, but we intentionally depend on
// the firmware repo as the single source of truth to avoid divergence.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
// Use explicit .js extensions so ESM build (with dist/esm/package.json type=module) treats them as ESM.
__exportStar(require("./validators.js"), exports);
__exportStar(require("./types.js"), exports);
