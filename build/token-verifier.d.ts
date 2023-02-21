import * as jose from 'jose';
export declare class TokenVerifier {
    private key;
    constructor(key: jose.KeyLike);
    verify(token: string): Promise<Result>;
}
export interface Result extends jose.JWTVerifyResult {
}
