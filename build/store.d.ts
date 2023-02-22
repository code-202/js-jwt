import { TokenVerifier } from './token-verifier';
import { TokenRequest } from './token-request';
import { RefreshTokenRequest } from './refresh-token-request';
import { LogoutRequest } from './logout-request';
import { Request } from 'rich-agent';
import Cookies from 'universal-cookie';
export interface Options {
    endpoint: string;
    notifyLogout?: boolean;
    cookieOptions?: {
        domain?: string;
    };
}
export interface Informations {
    iat: number;
    exp: number;
    username: string;
}
export declare abstract class Store<T extends Informations> implements Request.AuthorizationService {
    status: Request.Status;
    token: string;
    informations: T;
    protected _apiEndpoint: string;
    protected _tokenVerifier: TokenVerifier;
    protected _request: TokenRequest;
    protected _cookies: Cookies;
    protected _refreshToken: RefreshTokenRequest;
    protected _requestLogout: LogoutRequest;
    protected _notifyLogout: boolean;
    protected _cookieOptionsDomain: string;
    constructor(tokenVerifier: TokenVerifier, options: Options);
    protected abstract createInformations(): T;
    get endpoint(): string;
    get authorizationToken(): string;
    get authorizationPrefix(): string;
    onAuthorizationError(responseStatus: any | null, responseTextStatus: any | null): void;
    get connected(): boolean;
    login(username: string, password: string, rememberMe?: boolean): Promise<any>;
    logout(): Promise<void>;
    forceLogout(): void;
    protected eraseCredentials(): void;
    protected buildLoginData(username: string, password: string, rememberMe?: boolean): object;
    loadTokenFromString(token: string): Promise<void>;
    protected loadTokenFromCookie(): void;
    protected saveTokenInCookie(): void;
    protected deleteTokenCookie(): void;
    protected refreshTokenIfItNeed(): void;
    protected updateToken(token: string, decoded: Informations, andSave?: boolean, rememberMe?: boolean): void;
    protected tokenHasToBeRefreshed(): boolean;
    protected loadTokenFromUrl(): Promise<void>;
    serialize(): Record<string, any>;
    deserialize(data: Record<string, any>): void;
}
