import { Key, KeyBuilder } from './key-builder';
export declare class KeyProvider {
    private _key;
    private builder;
    constructor(builder: KeyBuilder);
    get key(): Key | null;
    hasKey(): boolean;
    get promise(): Promise<Key>;
}
