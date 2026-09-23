import { CryptoKey, importJWK, importPKCS8, importSPKI, importX509, JWK } from 'jose'

export type Key = CryptoKey | Uint8Array

export interface KeyBuilder {
    build(): Promise<Key>
}

export class SPKIBuilder implements KeyBuilder {
    protected spki: string
    protected alg: string

    constructor(spki: string, alg: string) {
        this.spki = spki
        this.alg = alg
    }

    build(): Promise<Key> {
        return importSPKI(this.spki, this.alg)
    }
}

export class X509Builder implements KeyBuilder {
    protected x509: string
    protected alg: string

    constructor(x509: string, alg: string) {
        this.x509 = x509
        this.alg = alg
    }

    build(): Promise<Key> {
        return importX509(this.x509, this.alg)
    }
}

export class PKCS8Builder implements KeyBuilder {
    protected pkcs8: string
    protected alg: string

    constructor(pkcs8: string, alg: string) {
        this.pkcs8 = pkcs8
        this.alg = alg
    }

    build(): Promise<Key> {
        return importPKCS8(this.pkcs8, this.alg)
    }
}

export class JWKBuilder implements KeyBuilder {
    protected jwk: JWK
    protected alg: string

    constructor(jwk: JWK, alg: string) {
        this.jwk = jwk
        this.alg = alg
    }

    build(): Promise<Key> {
        return importJWK(this.jwk, this.alg)
    }
}
