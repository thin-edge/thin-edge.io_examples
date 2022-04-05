import { PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { FormlyFieldConfig } from '@ngx-formly/core';
export declare class FormlySelectOptionsPipe implements PipeTransform {
    transform(options: any, field?: FormlyFieldConfig): Observable<any[]>;
    private toOptions;
    private toOption;
    private getLabelProp;
    private getValueProp;
    private getDisabledProp;
    private getGroupProp;
    private shouldUseLegacyOption;
}
