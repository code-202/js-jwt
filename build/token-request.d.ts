import { ApiRequest, Request } from '@code-202/agent';
import { TokenVerifier } from './token-verifier';
export declare class TokenRequest extends ApiRequest {
    protected _tokenVerifier: TokenVerifier;
    constructor(url: string, method: Request.Method, tokenVerifier: TokenVerifier);
    protected transformResponseData(data: any): Promise<any>;
}
