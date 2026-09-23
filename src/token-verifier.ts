import { jwtVerify, JWTVerifyResult } from 'jose'
import { KeyProvider } from './key-provider'
import { Key } from './key-builder'

export class TokenVerifier {
    private provider: KeyProvider

    constructor(provider: KeyProvider) {
        this.provider = provider
    }

    public verify(token: string): Promise<Result> {
        return this.provider.promise.then((key: Key) => {
            return jwtVerify(token, key)
        })
    }
}

export interface Result extends JWTVerifyResult { }
