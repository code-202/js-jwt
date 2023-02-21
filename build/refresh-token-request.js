"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenRequest = void 0;
const rich_agent_1 = require("rich-agent");
class RefreshTokenRequest extends rich_agent_1.ApiRequest {
    _tokenVerifier;
    constructor(apiEndpoint, tokenVerifier) {
        super(apiEndpoint + '/security/refresh', 'POST');
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
exports.RefreshTokenRequest = RefreshTokenRequest;
