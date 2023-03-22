"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenRequest = void 0;
const agent_1 = require("@code-202/agent");
class TokenRequest extends agent_1.ApiRequest {
    _tokenVerifier;
    constructor(url, method, tokenVerifier) {
        super(url, method);
        this._tokenVerifier = tokenVerifier;
    }
    transformResponseData(data) {
        return new Promise((resolve, reject) => {
            this._tokenVerifier.verify(this._responseData.token).then((result) => {
                resolve({
                    token: this._responseData.token,
                    decoded: result.payload
                });
            }).catch((error) => {
                reject(error.message);
            });
        });
    }
}
exports.TokenRequest = TokenRequest;
