/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Pipe } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
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
            options = observableOf(options);
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
export { FormlySelectOptionsPipe };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LW9wdGlvbnMucGlwZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3gtZm9ybWx5L2NvcmUvc2VsZWN0LyIsInNvdXJjZXMiOlsic2VsZWN0LW9wdGlvbnMucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLElBQUksRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFDcEQsT0FBTyxFQUFFLFVBQVUsRUFBRSxFQUFFLElBQUksWUFBWSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3RELE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUdyQztJQUFBO0lBNkZBLENBQUM7Ozs7OztJQTNGQywyQ0FBUzs7Ozs7SUFBVCxVQUFVLE9BQU8sRUFBRSxLQUF5QjtRQUE1QyxpQkFRQztRQVBDLElBQUksQ0FBQyxDQUFDLE9BQU8sWUFBWSxVQUFVLENBQUMsRUFBRTtZQUNwQyxPQUFPLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ2pDO1FBRUQsT0FBTyxDQUFDLG1CQUFBLE9BQU8sRUFBbUIsQ0FBQyxDQUFDLElBQUksQ0FDdEMsR0FBRzs7OztRQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxJQUFJLEVBQUUsQ0FBQyxFQUFsQyxDQUFrQyxFQUFDLENBQ2pELENBQUM7SUFDSixDQUFDOzs7Ozs7O0lBRU8sMkNBQVM7Ozs7OztJQUFqQixVQUFrQixPQUFPLEVBQUUsS0FBd0I7UUFBbkQsaUJBdUJDOztZQXRCTyxRQUFRLEdBQVUsRUFBRTs7WUFDeEIsTUFBTSxHQUE2QixFQUFFOztZQUNyQyxFQUFFLEdBQUcsS0FBSyxDQUFDLGVBQWUsSUFBSSxFQUFFO1FBRWxDLEVBQUUsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLE9BQU8sQ0FBQyxHQUFHOzs7O1FBQUMsVUFBQyxNQUFXO1lBQ3RCLElBQUksQ0FBQyxLQUFJLENBQUMsWUFB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Ozs7Ozs7SUFFTyw4Q0FBWTs7Ozs7O0lBQXBCLFVBQXFCLElBQUksRUFBRSxFQUFFO1FBQzNCLElBQUksT0FBTyxFQUFFLENBQUMsU0FBUyxLQUFLLFVBQVUsRUFBRTtZQUN0QyxPQUFPLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDM0I7UUFFRCxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxJQUFJLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7Ozs7Ozs7SUFFTyx1REFBcUI7Ozs7OztJQUE3QixVQUE4QixJQUFJLEVBQUUsRUFBRTtRQUNwQyxPQUFPLENBQUMsRUFBRSxDQUFDLFNBQVM7ZUFDZixDQUFDLEVBQUUsQ0FBQyxTQUFTO2VBQ2IsSUFBSSxJQUFJLElBQUk7ZUFDWixPQUFPLElBQUksS0FBSyxRQUFRO2VBQ3hCLEtBQUssSUFBSSxJQUFJO2VBQ2IsT0FBTyxJQUFJLElBQUksQ0FBQztJQUN2QixDQUFDOztnQkE1RkYsSUFBSSxTQUFDLEVBQUUsSUFBSSxFQUFFLHFCQUFxQixFQUFFOztJQTZGckMsOEJBQUM7Q0FBQSxBQTdGRCxJQTZGQztTQTVGWSx1QkFBdUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQaXBlLCBQaXBlVHJhbnNmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBvZiBhcyBvYnNlcnZhYmxlT2YgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEZvcm1seUZpZWxkQ29uZmlnIH0gZnJvbSAnQG5neC1mb3JtbHkvY29yZSc7XG5cbkBQaXBlKHsgbmFtZTogJ2Zvcm1seVNlbGVjdE9wdGlvbnMnIH0pXG5leHBvcnQgY2xhc3MgRm9ybWx5U2VsZWN0T3B0aW9uc1BpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcbiAgdHJhbnNmb3JtKG9wdGlvbnMsIGZpZWxkPzogRm9ybWx5RmllbGRDb25maWcpIHtcbiAgICBpZiAoIShvcHRpb25zIGluc3RhbmNlb2YgT2JzZXJ2YWJsZSkpIHtcbiAgICAgIG9wdGlvbnMgPSBvYnNlcnZhYmxlT2Yob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChvcHRpb25zIGFzIE9ic2VydmFibGU8YW55PikucGlwZShcbiAgICAgIG1hcCh2YWx1ZSA9PiB0aGlzLnRvT3B0aW9ucyh2YWx1ZSwgZmllbGQgfHwge30pKSxcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSB0b09wdGlvbnMob3B0aW9ucywgZmllbGQ6IEZvcm1seUZpZWxkQ29uZmlnKSB7XG4gICAgY29uc3QgZ09wdGlvbnM6IGFueVtdID0gW10sXG4gICAgICBncm91cHM6IHsgW2tleTogc3RyaW5nXTogYW55W10gfSA9IHt9LFxuICAgICAgdG8gPSBmaWVsZC50ZW1wbGF0ZU9wdGlvbnMgfHwge307XG5cbiAgICB0by5fZmxhdE9wdGlvbnMgPSB0cnVlO1xuICAgIG9wdGlvbnMubWFwKChvcHRpb246IGFueSkgPT4ge1xuICAgICAgaWYgKCF0aGlzLmdldEdyb3VwUHJvcChvcHRpb24sIHRvKSkge1xuICAgICAgICBnT3B0aW9ucy5wdXNoKHRoaXMudG9PcHRpb24ob3B0aW9uLCB0bykpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdG8uX2ZsYXRPcHRpb25zID0gZmFsc2U7XG4gICAgICAgIGlmICghZ3JvdXBzW3RoaXMuZ2V0R3JvdXBQcm9wKG9wdGlvbiwgdG8pXSkge1xuICAgICAgICAgIGdyb3Vwc1t0aGlzLmdldEdyb3VwUHJvcChvcHRpb24sIHRvKV0gPSBbXTtcbiAgICAgICAgICBnT3B0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgIGxhYmVsOiB0aGlzLmdldEdyb3VwUHJvcChvcHRpb24sIHRvKSxcbiAgICAgICAgICAgIGdyb3VwOiBncm91cHNbdGhpcy5nZXRHcm91cFByb3Aob3B0aW9uLCB0byldLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGdyb3Vwc1t0aGlzLmdldEdyb3VwUHJvcChvcHRpb24sIHRvKV0ucHVzaCh0aGlzLnRvT3B0aW9uKG9wdGlvbiwgdG8pKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBnT3B0aW9ucztcbiAgfVxuXG4gIHByaXZhdGUgdG9PcHRpb24oaXRlbSwgdG8pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGFiZWw6IHRoaXMuZ2V0TGFiZWxQcm9wKGl0ZW0sIHRvKSxcbiAgICAgIHZhbHVlOiB0aGlzLmdldFZhbHVlUHJvcChpdGVtLCB0byksXG4gICAgICBkaXNhYmxlZDogdGhpcy5nZXREaXNhYmxlZFByb3AoaXRlbSwgdG8pIHx8IGZhbHNlLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIGdldExhYmVsUHJvcChpdGVtLCB0byk6IHN0cmluZyB7XG4gICAgaWYgKHR5cGVvZiB0by5sYWJlbFByb3AgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiB0by5sYWJlbFByb3AoaXRlbSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2hvdWxkVXNlTGVnYWN5T3B0aW9uKGl0ZW0sIHRvKSkge1xuICAgICAgY29uc29sZS53YXJuKGBOZ3hGb3JtbHk6IGxlZ2FjeSBzZWxlY3Qgb3B0aW9uICd7a2V5LCB2YWx1ZX0nIGlzIGRlcHJlY2F0ZWQgc2luY2UgdjUuNSwgdXNlICd7dmFsdWUsIGxhYmVsfScgaW5zdGVhZC5gKTtcbiAgICAgIHJldHVybiBpdGVtLnZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiBpdGVtW3RvLmxhYmVsUHJvcCB8fCAnbGFiZWwnXTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0VmFsdWVQcm9wKGl0ZW0sIHRvKTogc3RyaW5nIHtcbiAgICBpZiAodHlwZW9mIHRvLnZhbHVlUHJvcCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIHRvLnZhbHVlUHJvcChpdGVtKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zaG91bGRVc2VMZWdhY3lPcHRpb24oaXRlbSwgdG8pKSB7XG4gICAgICByZXR1cm4gaXRlbS5rZXk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGl0ZW1bdG8udmFsdWVQcm9wIHx8ICd2YWx1ZSddO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXREaXNhYmxlZFByb3AoaXRlbSwgdG8pOiBzdHJpbmcge1xuICAgIGlmICh0eXBlb2YgdG8uZGlzYWJsZWRQcm9wID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gdG8uZGlzYWJsZWRQcm9wKGl0ZW0pO1xuICAgIH1cbiAgICByZXR1cm4gaXRlbVt0by5kaXNhYmxlZFByb3AgfHwgJ2Rpc2FibGVkJ107XG4gIH1cblxuICBwcml2YXRlIGdldEdyb3VwUHJvcChpdGVtLCB0byk6IHN0cmluZyB7XG4gICAgaWYgKHR5cGVvZiB0by5ncm91cFByb3AgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiB0by5ncm91cFByb3AoaXRlbSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGl0ZW1bdG8uZ3JvdXBQcm9wIHx8ICdncm91cCddO1xuICB9XG5cbiAgcHJpdmF0ZSBzaG91bGRVc2VMZWdhY3lPcHRpb24oaXRlbSwgdG8pIHtcbiAgICByZXR1cm4gIXRvLnZhbHVlUHJvcFxuICAgICAgJiYgIXRvLmxhYmVsUHJvcFxuICAgICAgJiYgaXRlbSAhPSBudWxsXG4gICAgICAmJiB0eXBlb2YgaXRlbSA9PT0gJ29iamVjdCdcbiAgICAgICYmICdrZXknIGluIGl0ZW1cbiAgICAgICYmICd2YWx1ZScgaW4gaXRlbTtcbiAgfVxufVxuIl19