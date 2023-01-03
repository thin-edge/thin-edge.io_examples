
import { AfterContentInit, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IManagedObject, IResultList } from '@c8y/client';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'item-selector',
    templateUrl: './item-selector.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ItemSelector implements AfterContentInit {
    @Input() items: IResultList<IManagedObject>;
    @Input() selected?: IManagedObject;
    @Output() valueChange = new EventEmitter();
    pattern = '';

    filterPipe;

    ngAfterContentInit(): void {
        this.setFilter('')
    }

    setFilter(filterStr: string) {
        this.pattern = filterStr;
        this.filterPipe = pipe(
            map((data: []) => {
                return data.filter(
                    (mo: any) => mo.full.label && mo.full.label.toLowerCase().indexOf(filterStr.toLowerCase()) > -1
                );
            })
        );
    }

    itemChanged(): void {
        this.valueChange.emit(this.selected);
    }

}