/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Pipe } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
export class FormlySelectOptionsPipe {
    /**
     * @param {?} options
     * @param {?=} field
     * @return {?}
     */
    transform(options, field) {
        if (!(options instanceof Observable)) {
            options = observableOf(options);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LW9wdGlvbnMucGlwZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3gtZm9ybWx5L2NvcmUvc2VsZWN0LyIsInNvdXJjZXMiOlsic2VsZWN0LW9wdGlvbnMucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLElBQUksRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFDcEQsT0FBTyxFQUFFLFVBQVUsRUFBRSxFQUFFLElBQUksWUFBWSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3RELE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUlyQyxNQUFNLE9BQU8sdUJBQXVCOzs7Ozs7SUFDbEMsU0FBUyxDQUFDLE9BQU8sRUFBRSxLQUF5QjtRQUMxQyxJQUFJLENBQUMsQ0FBQyxPQUFPLFlBQVksVUFBVSxDQUFDLEVBQUU7WUFDcEMsT0FBTyxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNqQztRQUVELE9BQU8sQ0FBQyxtQkFBQSxPQUFPLEVBQW1CLENBQUMsQ0FBQyxJQUFJLENBQ3RDLEdBQUc7Ozs7UUFBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLEtBQUssSUFBSSxFQUFFLENBQUMsRUFBQyxDQUNqRCxDQUFDO0lBQ0osQ0FBQzs7Ozs7OztJQUVPLFNBQVMsQ0FBQyxPQUFPLEVBQUUsS0FBd0I7O2NBQzNDLFFBQVEsR0FBVSxFQUFFOztjQUN4QixNQUFNLEdBQTZCLEVBQUU7O2NBQ3JDLEVBQUUsR0FBRyxLQUFLLENBQUMsZUFBZSxJQUFJLEVBQUU7UUFFbEMsRUFBRSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7UUFDdkIsT0FBTyxDQUFDLEdBQUc7Ozs7UUFBQyxDQUFDLE1BQVcsRUFBRSxFQUFFO1lBQzFCLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtnQkFDbEMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQzFDO2lCQUFNO2dCQUNMLEVBQUUsQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO2dCQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUU7b0JBQzFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztvQkFDM0MsUUFBUSxDQUFDLElBQUksQ0FBQzt3QkFDWixLQUFLLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDO3dCQUNwQyxLQUFLLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO3FCQUM3QyxDQUFDLENBQUM7aUJBQ0o7Z0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDdkU7UUFDSCxDQUFDLEVBQUMsQ0FBQztRQUVILE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUM7Ozs7Ozs7SUFFTyxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUU7UUFDdkIsT0FBTztZQUNMLEtBQUssRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUM7WUFDbEMsS0FBSyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQztZQUNsQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksS0FBSztTQUNsRCxDQUFDO0lBQ0osQ0FBQzs7Ozs7OztJQUVPLFlBQVksQ0FBQyxJQUFJLEVBQUUsRUFBRTtRQUMzQixJQUFJLE9BQU8sRUFBRSxDQUFDLFNBQVMsS0FBSyxVQUFVLEVBQUU7WUFDdEMsT0FBTyxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzNCO1FBRUQsSUFBSSxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1lBQ3hDLE9BQU8sQ0FBQyxJQUFJLENBQUMsd0dBQXdHLENBQUMsQ0FBQztZQUN2SCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7U0FDbkI7UUFFRCxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxJQUFJLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7Ozs7Ozs7SUFFTyxZQUFZLENBQUMsSUFBSSxFQUFFLEVBQUU7UUFDM0IsSUFBSSxPQUFPLEVBQUUsQ0FBQyxTQUFTLEtBQUssVUFBVSxFQUFFO1lBQ3RDLE9BQU8sRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUMzQjtRQUVELElBQUksSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRTtZQUN4QyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7U0FDakI7UUFFRCxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxJQUFJLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7Ozs7Ozs7SUFFTyxlQUFlLENBQUMsSUFBSSxFQUFFLEVBQUU7UUFDOUIsSUFBSSxPQUFPLEVBQUUsQ0FBQyxZQUFZLEtBQUssVUFBVSxFQUFFO1lBQ3pDLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM5QjtRQUNELE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLElBQUksVUFBVSxDQUFDLENBQUM7SUFDN0MsQ0FBQzs7Ozs7OztJQUVPLFlBQVksQ0FBQyxJQUFJLEVBQUUsRUFBRTtRQUMzQixJQUFJLE9BQU8sRUFBRSxDQUFDLFNBQVMsS0FBSyxVQUFVLEVBQUU7WUFDdEMsT0FBTyxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzNCO1FBRUQsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsSUFBSSxPQUFPLENBQUMsQ0FBQztJQUN2QyxDQUFDOzs7Ozs7O0lBRU8scUJBQXFCLENBQUMsSUFBSSxFQUFFLEVBQUU7UUFDcEMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxTQUFTO2VBQ2YsQ0FBQyxFQUFFLENBQUMsU0FBUztlQUNiLElBQUksSUFBSSxJQUFJO2VBQ1osT0FBTyxJQUFJLEtBQUssUUFBUTtlQUN4QixLQUFLLElBQUksSUFBSTtlQUNiLE9BQU8sSUFBSSxJQUFJLENBQUM7SUFDdkIsQ0FBQzs7O1lBNUZGLElBQUksU0FBQyxFQUFFLElBQUksRUFBRSxxQkFBcUIsRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIG9mIGFzIG9ic2VydmFibGVPZiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgRm9ybWx5RmllbGRDb25maWcgfSBmcm9tICdAbmd4LWZvcm1seS9jb3JlJztcblxuQFBpcGUoeyBuYW1lOiAnZm9ybWx5U2VsZWN0T3B0aW9ucycgfSlcbmV4cG9ydCBjbGFzcyBGb3JtbHlTZWxlY3RPcHRpb25zUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuICB0cmFuc2Zvcm0ob3B0aW9ucywgZmllbGQ/OiBGb3JtbHlGaWVsZENvbmZpZykge1xuICAgIGlmICghKG9wdGlvbnMgaW5zdGFuY2VvZiBPYnNlcnZhYmxlKSkge1xuICAgICAgb3B0aW9ucyA9IG9ic2VydmFibGVPZihvcHRpb25zKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKG9wdGlvbnMgYXMgT2JzZXJ2YWJsZTxhbnk+KS5waXBlKFxuICAgICAgbWFwKHZhbHVlID0+IHRoaXMudG9PcHRpb25zKHZhbHVlLCBmaWVsZCB8fCB7fSkpLFxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIHRvT3B0aW9ucyhvcHRpb25zLCBmaWVsZDogRm9ybWx5RmllbGRDb25maWcpIHtcbiAgICBjb25zdCBnT3B0aW9uczogYW55W10gPSBbXSxcbiAgICAgIGdyb3VwczogeyBba2V5OiBzdHJpbmddOiBhbnlbXSB9ID0ge30sXG4gICAgICB0byA9IGZpZWxkLnRlbXBsYXRlT3B0aW9ucyB8fCB7fTtcblxuICAgIHRvLl9mbGF0T3B0aW9ucyA9IHRydWU7XG4gICAgb3B0aW9ucy5tYXAoKG9wdGlvbjogYW55KSA9PiB7XG4gICAgICBpZiAoIXRoaXMuZ2V0R3JvdXBQcm9wKG9wdGlvbiwgdG8pKSB7XG4gICAgICAgIGdPcHRpb25zLnB1c2godGhpcy50b09wdGlvbihvcHRpb24sIHRvKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0by5fZmxhdE9wdGlvbnMgPSBmYWxzZTtcbiAgICAgICAgaWYgKCFncm91cHNbdGhpcy5nZXRHcm91cFByb3Aob3B0aW9uLCB0byldKSB7XG4gICAgICAgICAgZ3JvdXBzW3RoaXMuZ2V0R3JvdXBQcm9wKG9wdGlvbiwgdG8pXSA9IFtdO1xuICAgICAgICAgIGdPcHRpb25zLnB1c2goe1xuICAgICAgICAgICAgbGFiZWw6IHRoaXMuZ2V0R3JvdXBQcm9wKG9wdGlvbiwgdG8pLFxuICAgICAgICAgICAgZ3JvdXA6IGdyb3Vwc1t0aGlzLmdldEdyb3VwUHJvcChvcHRpb24sIHRvKV0sXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZ3JvdXBzW3RoaXMuZ2V0R3JvdXBQcm9wKG9wdGlvbiwgdG8pXS5wdXNoKHRoaXMudG9PcHRpb24ob3B0aW9uLCB0bykpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGdPcHRpb25zO1xuICB9XG5cbiAgcHJpdmF0ZSB0b09wdGlvbihpdGVtLCB0bykge1xuICAgIHJldHVybiB7XG4gICAgICBsYWJlbDogdGhpcy5nZXRMYWJlbFByb3AoaXRlbSwgdG8pLFxuICAgICAgdmFsdWU6IHRoaXMuZ2V0VmFsdWVQcm9wKGl0ZW0sIHRvKSxcbiAgICAgIGRpc2FibGVkOiB0aGlzLmdldERpc2FibGVkUHJvcChpdGVtLCB0bykgfHwgZmFsc2UsXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0TGFiZWxQcm9wKGl0ZW0sIHRvKTogc3RyaW5nIHtcbiAgICBpZiAodHlwZW9mIHRvLmxhYmVsUHJvcCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIHRvLmxhYmVsUHJvcChpdGVtKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zaG91bGRVc2VMZWdhY3lPcHRpb24oaXRlbSwgdG8pKSB7XG4gICAgICBjb25zb2xlLndhcm4oYE5neEZvcm1seTogbGVnYWN5IHNlbGVjdCBvcHRpb24gJ3trZXksIHZhbHVlfScgaXMgZGVwcmVjYXRlZCBzaW5jZSB2NS41LCB1c2UgJ3t2YWx1ZSwgbGFiZWx9JyBpbnN0ZWFkLmApO1xuICAgICAgcmV0dXJuIGl0ZW0udmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGl0ZW1bdG8ubGFiZWxQcm9wIHx8ICdsYWJlbCddO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRWYWx1ZVByb3AoaXRlbSwgdG8pOiBzdHJpbmcge1xuICAgIGlmICh0eXBlb2YgdG8udmFsdWVQcm9wID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gdG8udmFsdWVQcm9wKGl0ZW0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNob3VsZFVzZUxlZ2FjeU9wdGlvbihpdGVtLCB0bykpIHtcbiAgICAgIHJldHVybiBpdGVtLmtleTtcbiAgICB9XG5cbiAgICByZXR1cm4gaXRlbVt0by52YWx1ZVByb3AgfHwgJ3ZhbHVlJ107XG4gIH1cblxuICBwcml2YXRlIGdldERpc2FibGVkUHJvcChpdGVtLCB0byk6IHN0cmluZyB7XG4gICAgaWYgKHR5cGVvZiB0by5kaXNhYmxlZFByb3AgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiB0by5kaXNhYmxlZFByb3AoaXRlbSk7XG4gICAgfVxuICAgIHJldHVybiBpdGVtW3RvLmRpc2FibGVkUHJvcCB8fCAnZGlzYWJsZWQnXTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0R3JvdXBQcm9wKGl0ZW0sIHRvKTogc3RyaW5nIHtcbiAgICBpZiAodHlwZW9mIHRvLmdyb3VwUHJvcCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIHRvLmdyb3VwUHJvcChpdGVtKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaXRlbVt0by5ncm91cFByb3AgfHwgJ2dyb3VwJ107XG4gIH1cblxuICBwcml2YXRlIHNob3VsZFVzZUxlZ2FjeU9wdGlvbihpdGVtLCB0bykge1xuICAgIHJldHVybiAhdG8udmFsdWVQcm9wXG4gICAgICAmJiAhdG8ubGFiZWxQcm9wXG4gICAgICAmJiBpdGVtICE9IG51bGxcbiAgICAgICYmIHR5cGVvZiBpdGVtID09PSAnb2JqZWN0J1xuICAgICAgJiYgJ2tleScgaW4gaXRlbVxuICAgICAgJiYgJ3ZhbHVlJyBpbiBpdGVtO1xuICB9XG59XG4iXX0=