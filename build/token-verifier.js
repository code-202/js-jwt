import { jwtVerify } from 'jose';
export class TokenVerifier {
    provider;
    constructor(provider) {
        this.provider = provider;
    }
    verify(token) {
        return this.provider.promise.then((key) => {
            return jwtVerify(token, key);
        });
    }
}
//# sourceMappingURL=token-verifier.js.map