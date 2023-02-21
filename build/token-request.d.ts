import { ApiRequest } from 'rich-agent';
import { TokenVerifier } from './token-verifier';
export declare class TokenRequest extends ApiRequest {
    protected _tokenVerifier: TokenVerifier;
    constructor(apiEndpoint: string, tokenVerifier: TokenVerifier);
    protected transformResponseData(data: any): Promise<any>;
}
