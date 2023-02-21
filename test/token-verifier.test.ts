import { test, expect, afterAll, beforeAll } from '@jest/globals'
import { TokenVerifier } from '../src/token-verifier'
import { KeyProvider } from '../src/key-provider'
import { SPKIBuilder } from '../src/key-builder'
import * as jose from 'jose'

const spki = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2RbCZIlcKwCOS4dnvt2i
Jb8pElee4wpFqD0dydmQfnQwf1igD1iquEvlZXEtCrjhDUfK6amiyMaBu7xI3RGf
Nu/NUngiQx1bsyV3EOSU4cB4EuhOa4hAyy98raj6I8Pvay+Q5V3627gz9DnAD9r7
HnWbFzgFnG1SYYcQo684yyMtk/juLfOLKuIkT08nipERd4kAbEs+nQjwUCKDwWhC
arpNR73e1Ic8UL2hrk4qgIj5SoTxnY9PNymjP+p6WVT3MhCPXpbVVhcUabVmR7xz
8f2uRz77M9iP2k6lOySuAiguOwfL1c4PNBHlWxCfgZp3pJhTOb4w/fjzZVxSWNdJ
XQIDAQAB
-----END PUBLIC KEY-----`

const provider = new KeyProvider(new SPKIBuilder(spki, 'RS256'))

test('good', async () => {
    expect.assertions(3);

    const tv = new TokenVerifier(provider)

    return tv.verify('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2NzY5ODkxNDgsInJvbGVzIjpbIlJPTEVfVEVTVCJdLCJ1c2VybmFtZSI6InRlc3QifQ.exrjEyjctwMshSG47O0T4_sGXG6DEhgMRwF-eIWu-sy0GdtV4h63X8bbqB6gfXGhjc9vprKW074EPkR4wSW3cvVENdXvFoNKs9f7-wSuEuSzcCV_RoAYwGmf-OeF95vNDfPEwvNAoJMtW5cXCFUKimKHqhIsM-G3u8ymT1nArbRbX0prklVOPuRd4K3SHW_L1oI8SY-Q8d9_BcEHRrNV8_XDyzg9GY4Uh8DFNonkTpJbVJjEvXXtpcE-HqdPw_9fz0rurR8tHDho38Nx-o-_IeO58lLgOANBIG5T_XeVMqsx0j_Cna21CmoCpqoqgL3iUrmXAtxd1_OtxKt7Zkel6Q').then((result) => {
        console.log(result)

        expect(result.payload.username).toBe('test')
        expect(result.payload.iat).toBe(1676989148)
        expect(result.payload.exp).not.toBeDefined()
    })
})

test('exp', async () => {
    expect.assertions(1);

    const tv = new TokenVerifier(provider)

    await expect(tv.verify('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2NzY5OTA3MzQsImV4cCI6MTY3Njk5MDczNSwicm9sZXMiOlsiUk9MRV9URVNUIl0sInVzZXJuYW1lIjoidGVzdCJ9.ErxnYerXxIQYgAYMqRT6X1O2Xu5rYk9LD2omwgr0cw_bWdvAzR7KFfeLC13rNiHc1k46aq0M_xtL6ugAqyHl2XH7XDDywPogmjdZ2AEEKM_CZuEh9NdzKtzm2Li6XJ2xVEfqAplFevEF9UbntwpOQCXz0CxtQ56PP725upj_eSeBcMhhMqq4fdzpMkOrkT94szwGoN49igkNzTYb0k5raZ1jm4y6fXD0Gh2hnjDjOFJjKaGUR3BfCHDJkfyk9APDC3KbMSPPKWyHO4K74XIJbVoyjzmqgS6CNYgheBMlpraw7ivQjlri2Rkf9-Bcex3Jwe2I725Qt91-g17E83fQAg')).rejects.toThrow(jose.errors.JWTExpired)
})

