"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.base64ToString = exports.stringToBase64 = void 0;
const stringToBase64 = (data) => Buffer.from(data).toString('base64');
exports.stringToBase64 = stringToBase64;
const base64ToString = (data) => Buffer.from(data, 'base64').toString('ascii');
exports.base64ToString = base64ToString;
//# sourceMappingURL=Base64.js.map