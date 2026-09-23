"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWKBuilder = exports.PKCS8Builder = exports.X509Builder = exports.SPKIBuilder = void 0;
const jose_1 = require("jose");
class SPKIBuilder {
    constructor(spki, alg) {
        this.spki = spki;
        this.alg = alg;
    }
    build() {
        return (0, jose_1.importSPKI)(this.spki, this.alg);
    }
}
exports.SPKIBuilder = SPKIBuilder;
class X509Builder {
    constructor(x509, alg) {
        this.x509 = x509;
        this.alg = alg;
    }
    build() {
        return (0, jose_1.importX509)(this.x509, this.alg);
    }
}
exports.X509Builder = X509Builder;
class PKCS8Builder {
    constructor(pkcs8, alg) {
        this.pkcs8 = pkcs8;
        this.alg = alg;
    }
    build() {
        return (0, jose_1.importPKCS8)(this.pkcs8, this.alg);
    }
}
exports.PKCS8Builder = PKCS8Builder;
class JWKBuilder {
    constructor(jwk, alg) {
        this.jwk = jwk;
        this.alg = alg;
    }
    build() {
        return (0, jose_1.importJWK)(this.jwk, this.alg);
    }
}
exports.JWKBuilder = JWKBuilder;
//# sourceMappingURL=key-builder.js.map