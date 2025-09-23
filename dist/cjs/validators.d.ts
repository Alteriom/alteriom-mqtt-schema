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
    gatewayInfo: (d: unknown) => ValidationResult;
    gatewayMetrics: (d: unknown) => ValidationResult;
    firmwareStatus: (d: unknown) => ValidationResult;
    controlResponse: (d: unknown) => ValidationResult;
};
export type ValidatorName = keyof typeof validators;
export declare function validateMessage(kind: ValidatorName, data: unknown): ValidationResult;
export declare function classifyAndValidate(data: any): {
    kind?: ValidatorName;
    result: ValidationResult;
};
