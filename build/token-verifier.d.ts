import { JWTVerifyResult } from 'jose';
import { KeyProvider } from './key-provider.js';
export declare class TokenVerifier {
    private provider;
    constructor(provider: KeyProvider);
    verify(token: string): Promise<Result>;
}
export interface Result extends JWTVerifyResult {
}
//# sourceMappingURL=token-verifier.d.ts.map