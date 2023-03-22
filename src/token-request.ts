import { ApiRequest, Request } from '@code-202/agent'
import { TokenVerifier, Result } from './token-verifier'

export class TokenRequest extends ApiRequest {
    protected _tokenVerifier: TokenVerifier

    constructor (url: string, method: Request.Method, tokenVerifier: TokenVerifier) {
        super(url, method)

        this._tokenVerifier = tokenVerifier
    }

    protected transformResponseData (data: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this._tokenVerifier.verify(this._responseData.token).then((result: Result) => {
                resolve({
                    token: this._responseData.token,
                    decoded: result.payload
                })
            }).catch ((error) => {
                reject(error.message)
            })
        })
    }
}
