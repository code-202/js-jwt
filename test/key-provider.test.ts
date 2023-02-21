import { test, expect, afterAll, beforeAll } from '@jest/globals'
import { KeyProvider } from '../src/key-provider'
import { SPKIBuilder, Key } from '../src/key-builder'

const spki = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2RbCZIlcKwCOS4dnvt2i
Jb8pElee4wpFqD0dydmQfnQwf1igD1iquEvlZXEtCrjhDUfK6amiyMaBu7xI3RGf
Nu/NUngiQx1bsyV3EOSU4cB4EuhOa4hAyy98raj6I8Pvay+Q5V3627gz9DnAD9r7
HnWbFzgFnG1SYYcQo684yyMtk/juLfOLKuIkT08nipERd4kAbEs+nQjwUCKDwWhC
arpNR73e1Ic8UL2hrk4qgIj5SoTxnY9PNymjP+p6WVT3MhCPXpbVVhcUabVmR7xz
8f2uRz77M9iP2k6lOySuAiguOwfL1c4PNBHlWxCfgZp3pJhTOb4w/fjzZVxSWNdJ
XQIDAQAB
-----END PUBLIC KEY-----`

test('good', async () => {
    expect.assertions(4);

    const provider = new KeyProvider(new SPKIBuilder(spki, 'RS256'))

    expect(provider.hasKey()).toBe(false)
    expect(provider.key).toBe(null)

    const key = await provider.promise
    expect(provider.hasKey()).toBe(true)
    expect(provider.key).toBe(key)
})