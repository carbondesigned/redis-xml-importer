"use strict";
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = __importDefault(require("./parser"));
const redisOps_1 = require("./redisOps");
const fs = __importStar(require("fs"));
// Parse command line arguments
const args = process.argv.slice(2);
const verbose = args.includes('-v');
const filePathIndex = args.indexOf('-v') === 0 ? 1 : 0;
const filePath = args[filePathIndex];
// Check if file exists
if (!fs.existsSync(filePath)) {
    console.error('XML file not found at provided path.');
    process.exit(1);
}
// Read the XML
const xmlData = fs.readFileSync(filePath, 'utf-8');
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Parse the XML
        const { subdomains, cookies } = yield (0, parser_1.default)(xmlData);
        console.log('Parsed subdomains:', subdomains);
        console.log('Parsed cookies:', cookies);
        // Initialize Redis operations instance
        const redisOps = new redisOps_1.RedisOps();
        yield redisOps.connect();
        // Save subdomains to Redis
        yield redisOps.setSubdomains(subdomains);
        // Save cookies to Redis
        for (const cookie of cookies) {
            yield redisOps.setCookie(cookie.name, cookie.host, cookie.value);
        }
        if (verbose) {
            // Print keys
            const keys = yield redisOps.getAllKeys();
            console.log('Keys saved to Redis:', keys);
        }
        // Close Redis connection
        redisOps.close();
    }
    catch (error) {
        console.error('Error encountered:');
        console.error(error); // Print the raw error object.
    }
}))();
