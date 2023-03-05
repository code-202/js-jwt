import { ApiRequest } from '@code-202/agent'
import { TokenVerifier, Result } from './token-verifier'

export class TokenRequest extends ApiRequest {
    protected _tokenVerifier: TokenVerifier

    constructor (apiEndpoint: string, tokenVerifier: TokenVerifier) {
        super(apiEndpoint + '/login_check', 'POST')

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
