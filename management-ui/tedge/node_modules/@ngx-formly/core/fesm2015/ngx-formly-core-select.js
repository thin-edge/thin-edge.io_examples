import { Pipe, NgModule } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class FormlySelectOptionsPipe {
    /**
     * @param {?} options
     * @param {?=} field
     * @return {?}
     */
    transform(options, field) {
        if (!(options instanceof Observable)) {
            options = of(options);
        }
        return ((/** @type {?} */ (options))).pipe(map((/**
         * @param {?} value
         * @return {?}
         */
        value => this.toOptions(value, field || {}))));
    }
    /**
     * @private
     * @param {?} options
     * @param {?} field
     * @return {?}
     */
    toOptions(options, field) {
        /** @type {?} */
        const gOptions = [];
        /** @type {?} */
        const groups = {};
        /** @type {?} */
        const to = field.templateOptions || {};
        to._flatOptions = true;
        options.map((/**
         * @param {?} option
         * @return {?}
         */
        (option) => {
            if (!this.getGroupProp(option, to)) {
                gOptions.push(this.toOption(option, to));
            }
            else {
                to._flatOptions = false;
                if (!groups[this.getGroupProp(option, to)]) {
                    groups[this.getGroupProp(option, to)] = [];
                    gOptions.push({
                        label: this.getGroupProp(option, to),
                        group: groups[this.getGroupProp(option, to)],
                    });
                }
                groups[this.getGroupProp(option, to)].push(this.toOption(option, to));
            }
        }));
        return gOptions;
    }
    /**
     * @private
     * @param {?} item
     * @param {?} to
     * @return {?}
     */
    toOption(item, to) {
        return {
            label: this.getLabelProp(item, to),
            value: this.getValueProp(item, to),
            disabled: this.getDisabledProp(item, to) || false,
        };
    }
    /**
     * @private
     * @param {?} item
     * @param {?} to
     * @return {?}
     */
    getLabelProp(item, to) {
        if (typeof to.labelProp === 'function') {
            return to.labelProp(item);
        }
        if (this.shouldUseLegacyOption(item, to)) {
            console.warn(`NgxFormly: legacy select option '{key, value}' is deprecated since v5.5, use '{value, label}' instead.`);
            return item.value;
        }
        return item[to.labelProp || 'label'];
    }
    /**
     * @private
     * @param {?} item
     * @param {?} to
     * @return {?}
     */
    getValueProp(item, to) {
        if (typeof to.valueProp === 'function') {
            return to.valueProp(item);
        }
        if (this.shouldUseLegacyOption(item, to)) {
            return item.key;
        }
        return item[to.valueProp || 'value'];
    }
    /**
     * @private
     * @param {?} item
     * @param {?} to
     * @return {?}
     */
    getDisabledProp(item, to) {
        if (typeof to.disabledProp === 'function') {
            return to.disabledProp(item);
        }
        return item[to.disabledProp || 'disabled'];
    }
    /**
     * @private
     * @param {?} item
     * @param {?} to
     * @return {?}
     */
    getGroupProp(item, to) {
        if (typeof to.groupProp === 'function') {
            return to.groupProp(item);
        }
        return item[to.groupProp || 'group'];
    }
    /**
     * @private
     * @param {?} item
     * @param {?} to
     * @return {?}
     */
    shouldUseLegacyOption(item, to) {
        return !to.valueProp
            && !to.labelProp
            && item != null
            && typeof item === 'object'
            && 'key' in item
            && 'value' in item;
    }
}
FormlySelectOptionsPipe.decorators = [
    { type: Pipe, args: [{ name: 'formlySelectOptions' },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class FormlySelectModule {
}
FormlySelectModule.decorators = [
    { type: NgModule, args: [{
                declarations: [FormlySelectOptionsPipe],
                exports: [FormlySelectOptionsPipe],
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { FormlySelectModule, FormlySelectOptionsPipe as ɵa };

//# sourceMappingURL=ngx-formly-core-select.js.map