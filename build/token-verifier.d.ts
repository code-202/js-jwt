import * as jose from 'jose';
import { KeyProvider } from './key-provider';
export declare class TokenVerifier {
    private provider;
    constructor(provider: KeyProvider);
    verify(token: string): Promise<Result>;
}
export interface Result extends jose.JWTVerifyResult {
}
