import { Key, KeyBuilder } from './key-builder.js';
export declare class KeyProvider {
    private _key;
    private builder;
    constructor(builder: KeyBuilder);
    get key(): Key | null;
    hasKey(): boolean;
    get promise(): Promise<Key>;
}
//# sourceMappingURL=key-provider.d.ts.map