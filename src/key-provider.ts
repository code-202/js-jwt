import { Key, KeyBuilder } from './key-builder'

export class KeyProvider
{
    private _key: Key | null = null

    private builder: KeyBuilder

    constructor (builder: KeyBuilder)
    {
        this.builder = builder
    }

    get key (): Key | null
    {
        return this._key
    }

    hasKey (): boolean
    {
        return this._key !== null
    }

    get promise (): Promise<Key>
    {
        return new Promise<Key>((resolve) => {
            if (this._key) {
                resolve(this._key)
            }

            this.builder.build().then((key: Key) => {
                this._key = key
                resolve(key)
            })
        })
    }
}
