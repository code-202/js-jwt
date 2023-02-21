import * as jose from 'jose'

export class TokenVerifier
{
    private key: jose.KeyLike

    constructor (key: jose.KeyLike) {
        this.key = key
    }

    public verify(token: string): Promise<Result>
    {
        return jose.jwtVerify(token, this.key)
    }
}

export interface Result extends jose.JWTVerifyResult {}
