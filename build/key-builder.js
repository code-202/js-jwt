import { importJWK, importPKCS8, importSPKI, importX509 } from 'jose';
export class SPKIBuilder {
    spki;
    alg;
    constructor(spki, alg) {
        this.spki = spki;
        this.alg = alg;
    }
    build() {
        return importSPKI(this.spki, this.alg);
    }
}
export class X509Builder {
    x509;
    alg;
    constructor(x509, alg) {
        this.x509 = x509;
        this.alg = alg;
    }
    build() {
        return importX509(this.x509, this.alg);
    }
}
export class PKCS8Builder {
    pkcs8;
    alg;
    constructor(pkcs8, alg) {
        this.pkcs8 = pkcs8;
        this.alg = alg;
    }
    build() {
        return importPKCS8(this.pkcs8, this.alg);
    }
}
export class JWKBuilder {
    jwk;
    alg;
    constructor(jwk, alg) {
        this.jwk = jwk;
        this.alg = alg;
    }
    build() {
        return importJWK(this.jwk, this.alg);
    }
}
//# sourceMappingURL=key-builder.js.map