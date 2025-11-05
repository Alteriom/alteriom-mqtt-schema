export interface CompileOptions {
    allErrors?: boolean;
    strict?: boolean;
}
export interface ValidationResult {
    valid: boolean;
    errors?: string[];
}
export declare const validators: {
    sensorData: (d: unknown) => ValidationResult;
    sensorHeartbeat: (d: unknown) => ValidationResult;
    sensorStatus: (d: unknown) => ValidationResult;
    sensorInfo: (d: unknown) => ValidationResult;
    sensorMetrics: (d: unknown) => ValidationResult;
    gatewayInfo: (d: unknown) => ValidationResult;
    gatewayMetrics: (d: unknown) => ValidationResult;
    gatewayData: (d: unknown) => ValidationResult;
    gatewayHeartbeat: (d: unknown) => ValidationResult;
    gatewayStatus: (d: unknown) => ValidationResult;
    firmwareStatus: (d: unknown) => ValidationResult;
    controlResponse: (d: unknown) => ValidationResult;
    command: (d: unknown) => ValidationResult;
    commandResponse: (d: unknown) => ValidationResult;
    meshNodeList: (d: unknown) => ValidationResult;
    meshTopology: (d: unknown) => ValidationResult;
    meshAlert: (d: unknown) => ValidationResult;
    meshBridge: (d: unknown) => ValidationResult;
    meshStatus: (d: unknown) => ValidationResult;
    meshMetrics: (d: unknown) => ValidationResult;
    deviceConfig: (d: unknown) => ValidationResult;
    batchEnvelope: (d: unknown) => ValidationResult;
    compressedEnvelope: (d: unknown) => ValidationResult;
};
export type ValidatorName = keyof typeof validators;
export declare function validateMessage(kind: ValidatorName, data: unknown): ValidationResult;
export declare function classifyAndValidate(data: any): {
    kind?: ValidatorName;
    result: ValidationResult;
};
