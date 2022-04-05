import { FormlyFieldConfig } from '@ngx-formly/core';
import { JSONSchema7 } from 'json-schema';
export interface FormlyJsonschemaOptions {
    /**
     * allows to intercept the mapping, taking the already mapped
     * formly field and the original JSONSchema source from which it
     * was mapped.
     */
    map?: (mappedField: FormlyFieldConfig, mapSource: JSONSchema7) => FormlyFieldConfig;
}
export declare class FormlyJsonschema {
    toFieldConfig(schema: JSONSchema7, options?: FormlyJsonschemaOptions): FormlyFieldConfig;
    private _toFieldConfig;
    private resolveSchema;
    private resolveAllOf;
    private resolveMultiSchema;
    private resolveDefinition;
    private resolveDependencies;
    private guessType;
    private addValidator;
    private isEnum;
    private toEnumOptions;
    private isFieldValid;
}
