import * as jose from 'jose';
export type Key = jose.KeyLike | Uint8Array;
export interface KeyBuilder {
    build(): Promise<Key>;
}
export declare class SPKIBuilder implements KeyBuilder {
    protected spki: string;
    protected alg: string;
    constructor(spki: string, alg: string);
    build(): Promise<Key>;
}
export declare class X509Builder implements KeyBuilder {
    protected x509: string;
    protected alg: string;
    constructor(x509: string, alg: string);
    build(): Promise<Key>;
}
export declare class PKCS8Builder implements KeyBuilder {
    protected pkcs8: string;
    protected alg: string;
    constructor(pkcs8: string, alg: string);
    build(): Promise<Key>;
}
export declare class JWKBuilder implements KeyBuilder {
    protected jwk: jose.JWK;
    protected alg: string;
    constructor(jwk: jose.JWK, alg: string);
    build(): Promise<Key>;
}
