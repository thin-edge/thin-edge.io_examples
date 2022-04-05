import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActionControl, AlertService, Column, ColumnDataType, DisplayOptions, Pagination } from '@c8y/ngx-components';
import { Observable } from 'rxjs';
import { EdgeService } from '../edge.service';
import { RowStructure } from '../property.model';
import { properCase, unCamelCase } from './cloud-helper';

@Component({
  selector: 'app-cloud',
  templateUrl: './cloud.component.html',
  styleUrls: ['./cloud.component.css']
})
export class CloudComponent implements OnInit {
  columns: Column[];

  constructor(private formBuilder: FormBuilder, private edgeService: EdgeService, private alertService: AlertService) {
    this.columns = this.getDefaultColumns();
  }

  loginForm: FormGroup;
  edgeConfiguration: any = {}
  rows$: Observable<RowStructure[]>;
  pagination: Pagination = {
    pageSize: 30,
    currentPage: 1,
  };

  displayOptions: DisplayOptions = {
    bordered: true,
    striped: true,
    filter: false,
    gridHeader: true
  };

  actionControls: ActionControl[] = [];

  ngOnInit() {
    this.edgeService.getEdgeConfiguration().then(config => {
      this.edgeConfiguration = config
      this.loginForm.setValue({
        username: this.edgeConfiguration.username ? this.edgeConfiguration.username : '',
        tenantUrl: this.edgeConfiguration['c8y.url'] ? this.edgeConfiguration['c8y.url'] : '',
        password: this.edgeConfiguration.password ? this.edgeConfiguration.password : '',
      })
      console.log("Intialized configuration:", config)
    })
    this.initForm();
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      tenantUrl: this.edgeConfiguration['c8y.url'] ? this.edgeConfiguration['c8y.url'] : '',
      username: this.edgeConfiguration.username ? this.edgeConfiguration.username : '',
      password: this.edgeConfiguration.password ? this.edgeConfiguration.password : '',
    });
  }

  async updateCloudConfiguration() {
    const up = {
      'c8y.url': this.loginForm.value.tenantUrl,
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
    }
    this.edgeService.updateEdgeConfiguration(up);
    this.edgeService.initFetchClient();
  }

  async login() {
    this.updateCloudConfiguration();

    try {
      const res = await this.edgeService.login()
      console.log("Login response:", res)
      if (res.status < 300) {
        this.alertService.success("Could log in to cloud tenant")

      } else {
        this.alertService.danger("Failed to login!")
      }
    } catch (err) {
      this.alertService.danger("Failed to login: " + err.message)
    }

    try {
      const data = await this.edgeService.getDetailsCloudDevice(this.edgeConfiguration['device.id'])
      let rows: RowStructure[] = [];
      // ignore those values that are object,because they look ugly when printed    
      Object.keys(data)
        .filter(key => typeof data[key] != 'object')
        .forEach(key => {
          rows.push(
            {
              name: properCase(unCamelCase(key)),
              value: data[key]
            })
        });
      this.rows$ = new Observable<RowStructure[]>(observer => {
        observer.next(rows);
        observer.complete();
      })
      //console.log("Retrieved cloud data:", data)
    } catch (err) {
      this.alertService.danger("Failed to retrieve details, device not yet registered!")
    }
  }

  getDefaultColumns(): Column[] {
    return [
      {
        name: 'name',
        header: 'Name',
        path: 'name',
        filterable: true,
      },
      {
        header: 'Value',
        name: 'value',
        sortable: true,
        filterable: true,
        path: 'value',
        dataType: ColumnDataType.TextShort,
      },
    ];
  }
}
