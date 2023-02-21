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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWKBuilder = exports.PKCS8Builder = exports.X509Builder = exports.SPKIBuilder = void 0;
const jose = __importStar(require("jose"));
class SPKIBuilder {
    spki;
    alg;
    constructor(spki, alg) {
        this.spki = spki;
        this.alg = alg;
    }
    build() {
        return jose.importSPKI(this.spki, this.alg);
    }
}
exports.SPKIBuilder = SPKIBuilder;
class X509Builder {
    x509;
    alg;
    constructor(x509, alg) {
        this.x509 = x509;
        this.alg = alg;
    }
    build() {
        return jose.importX509(this.x509, this.alg);
    }
}
exports.X509Builder = X509Builder;
class PKCS8Builder {
    pkcs8;
    alg;
    constructor(pkcs8, alg) {
        this.pkcs8 = pkcs8;
        this.alg = alg;
    }
    build() {
        return jose.importPKCS8(this.pkcs8, this.alg);
    }
}
exports.PKCS8Builder = PKCS8Builder;
class JWKBuilder {
    jwk;
    alg;
    constructor(jwk, alg) {
        this.jwk = jwk;
        this.alg = alg;
    }
    build() {
        return jose.importJWK(this.jwk, this.alg);
    }
}
exports.JWKBuilder = JWKBuilder;
