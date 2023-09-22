"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const xml2js_1 = require("xml2js");
function parseXML(xml) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            (0, xml2js_1.parseString)(xml, (err, result) => {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                if (err) {
                    reject(err);
                }
                // Extract subdomains
                const subdomains = ((_d = (_c = (_b = (_a = result === null || result === void 0 ? void 0 : result.config) === null || _a === void 0 ? void 0 : _a.subdomains) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.subdomain) === null || _d === void 0 ? void 0 : _d.map((s) => s.toString())) || [];
                // Extract cookies
                const cookies = ((_h = (_g = (_f = (_e = result === null || result === void 0 ? void 0 : result.config) === null || _e === void 0 ? void 0 : _e.cookies) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.cookie) === null || _h === void 0 ? void 0 : _h.map((c) => {
                    return {
                        name: c.$.name,
                        host: c.$.host,
                        value: c._.toString(),
                    };
                })) || [];
                resolve({ subdomains, cookies });
            });
        });
    });
}
exports.default = parseXML;
