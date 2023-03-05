import { ApiRequest } from '@code-202/agent';
import { TokenVerifier } from './token-verifier';
export declare class RefreshTokenRequest extends ApiRequest {
    protected _tokenVerifier: TokenVerifier;
    constructor(apiEndpoint: string, tokenVerifier: TokenVerifier);
    protected transformResponseData(data: any): Promise<any>;
}
