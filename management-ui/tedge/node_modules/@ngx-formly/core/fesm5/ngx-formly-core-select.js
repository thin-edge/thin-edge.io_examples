import { Pipe, NgModule } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var FormlySelectOptionsPipe = /** @class */ (function () {
    function FormlySelectOptionsPipe() {
    }
    /**
     * @param {?} options
     * @param {?=} field
     * @return {?}
     */
    FormlySelectOptionsPipe.prototype.transform = /**
     * @param {?} options
     * @param {?=} field
     * @return {?}
     */
    function (options, field) {
        var _this = this;
        if (!(options instanceof Observable)) {
            options = of(options);
        }
        return ((/** @type {?} */ (options))).pipe(map((/**
         * @param {?} value
         * @return {?}
         */
        function (value) { return _this.toOptions(value, field || {}); })));
    };
    /**
     * @private
     * @param {?} options
     * @param {?} field
     * @return {?}
     */
    FormlySelectOptionsPipe.prototype.toOptions = /**
     * @private
     * @param {?} options
     * @param {?} field
     * @return {?}
     */
    function (options, field) {
        var _this = this;
        /** @type {?} */
        var gOptions = [];
        /** @type {?} */
        var groups = {};
        /** @type {?} */
        var to = field.templateOptions || {};
        to._flatOptions = true;
        options.map((/**
         * @param {?} option
         * @return {?}
         */
        function (option) {
            if (!_this.getGroupProp(option, to)) {
                gOptions.push(_this.toOption(option, to));
            }
            else {
                to._flatOptions = false;
                if (!groups[_this.getGroupProp(option, to)]) {
                    groups[_this.getGroupProp(option, to)] = [];
                    gOptions.push({
                        label: _this.getGroupProp(option, to),
                        group: groups[_this.getGroupProp(option, to)],
                    });
                }
                groups[_this.getGroupProp(option, to)].push(_this.toOption(option, to));
            }
        }));
        return gOptions;
    };
    /**
     * @private
     * @param {?} item
     * @param {?} to
     * @return {?}
     */
    FormlySelectOptionsPipe.prototype.toOption = /**
     * @private
     * @param {?} item
     * @param {?} to
     * @return {?}
     */
    function (item, to) {
        return {
            label: this.getLabelProp(item, to),
            value: this.getValueProp(item, to),
            disabled: this.getDisabledProp(item, to) || false,
        };
    };
    /**
     * @private
     * @param {?} item
     * @param {?} to
     * @return {?}
     */
    FormlySelectOptionsPipe.prototype.getLabelProp = /**
     * @private
     * @param {?} item
     * @param {?} to
     * @return {?}
     */
    function (item, to) {
        if (typeof to.labelProp === 'function') {
            return to.labelProp(item);
        }
        if (this.shouldUseLegacyOption(item, to)) {
            console.warn("NgxFormly: legacy select option '{key, value}' is deprecated since v5.5, use '{value, label}' instead.");
            return item.value;
        }
        return item[to.labelProp || 'label'];
    };
    /**
     * @private
     * @param {?} item
     * @param {?} to
     * @return {?}
     */
    FormlySelectOptionsPipe.prototype.getValueProp = /**
     * @private
     * @param {?} item
     * @param {?} to
     * @return {?}
     */
    function (item, to) {
        if (typeof to.valueProp === 'function') {
            return to.valueProp(item);
        }
        if (this.shouldUseLegacyOption(item, to)) {
            return item.key;
        }
        return item[to.valueProp || 'value'];
    };
    /**
     * @private
     * @param {?} item
     * @param {?} to
     * @return {?}
     */
    FormlySelectOptionsPipe.prototype.getDisabledProp = /**
     * @private
     * @param {?} item
     * @param {?} to
     * @return {?}
     */
    function (item, to) {
        if (typeof to.disabledProp === 'function') {
            return to.disabledProp(item);
        }
        return item[to.disabledProp || 'disabled'];
    };
    /**
     * @private
     * @param {?} item
     * @param {?} to
     * @return {?}
     */
    FormlySelectOptionsPipe.prototype.getGroupProp = /**
     * @private
     * @param {?} item
     * @param {?} to
     * @return {?}
     */
    function (item, to) {
        if (typeof to.groupProp === 'function') {
            return to.groupProp(item);
        }
        return item[to.groupProp || 'group'];
    };
    /**
     * @private
     * @param {?} item
     * @param {?} to
     * @return {?}
     */
    FormlySelectOptionsPipe.prototype.shouldUseLegacyOption = /**
     * @private
     * @param {?} item
     * @param {?} to
     * @return {?}
     */
    function (item, to) {
        return !to.valueProp
            && !to.labelProp
            && item != null
            && typeof item === 'object'
            && 'key' in item
            && 'value' in item;
    };
    FormlySelectOptionsPipe.decorators = [
        { type: Pipe, args: [{ name: 'formlySelectOptions' },] }
    ];
    return FormlySelectOptionsPipe;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var FormlySelectModule = /** @class */ (function () {
    function FormlySelectModule() {
    }
    FormlySelectModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [FormlySelectOptionsPipe],
                    exports: [FormlySelectOptionsPipe],
                },] }
    ];
    return FormlySelectModule;
}());

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