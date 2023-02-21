import { ApiRequest } from 'rich-agent'
import { TokenVerifier, Result } from './token-verifier'

export class RefreshTokenRequest extends ApiRequest {
    protected _tokenVerifier: TokenVerifier

    constructor (apiEndpoint: string, tokenVerifier: TokenVerifier) {
        super(apiEndpoint + '/security/refresh', 'POST')

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
