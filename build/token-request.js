import { ApiRequest } from '@code-202/agent';
export class TokenRequest extends ApiRequest {
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
//# sourceMappingURL=token-request.js.map