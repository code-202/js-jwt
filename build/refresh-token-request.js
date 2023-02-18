"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenRequest = void 0;
const rich_agent_1 = require("rich-agent");
const jwt = __importStar(require("jsonwebtoken"));
class RefreshTokenRequest extends rich_agent_1.ApiRequest {
    _apiPublicKey;
    constructor(apiEndpoint, apiPublicKey) {
        super(apiEndpoint + '/security/refresh', 'POST');
        this._apiPublicKey = apiPublicKey;
    }
    transformResponseData(data) {
        if (!super.transformResponseData(data)) {
            return false;
        }
        try {
            const decoded = jwt.verify(this._responseData.token, this._apiPublicKey);
            if (decoded) {
                this._responseData = {
                    token: this._responseData.token,
                    decoded: decoded
                };
            }
        }
        catch (error) {
            this._responseTextStatus = error.message;
            return false;
        }
        return true;
    }
    transformErrorResponseData(data) {
        return super.transformResponseData(data);
    }
}
exports.RefreshTokenRequest = RefreshTokenRequest;
