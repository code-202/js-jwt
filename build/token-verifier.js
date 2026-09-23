"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenVerifier = void 0;
const jose_1 = require("jose");
class TokenVerifier {
    constructor(provider) {
        this.provider = provider;
    }
    verify(token) {
        return this.provider.promise.then((key) => {
            return (0, jose_1.jwtVerify)(token, key);
        });
    }
}
exports.TokenVerifier = TokenVerifier;
//# sourceMappingURL=token-verifier.js.map