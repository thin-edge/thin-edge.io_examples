import { Component, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { C8yJSONSchema, C8yStepper } from '@c8y/ngx-components';
import { EdgeService } from '../edge.service';
import { CustomCertificate } from '../property.model';
import { CdkStep } from '@angular/cdk/stepper';


@Component({
  selector: 'c8y-manage-certificate',
  templateUrl: './manage-certificate.component.html',
  styleUrls: ['./manage-certificate.component.css']
})
export class ManageCertificateComponent implements OnInit {
  @Input() property: CustomCertificate;
  @Input() refresh: EventEmitter<any> = new EventEmitter();

  @ViewChild(C8yStepper, { static: false })
  stepper: C8yStepper;

  @Output() onClose = new EventEmitter<any>();

  pendingStatus: boolean = false;
  showAlert: boolean = false;
  formGroupStepOne: FormGroup;
  errorMsg: string = '';

  formGroupStepTwo: FormGroup;


  constructor(
    private formBuilder: FormBuilder,
    public jsonschema: C8yJSONSchema,
    private edgeService: EdgeService
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.initFormStepOne();
    this.initFormStepTwo();
  }

  initFormStepOne(): void {
    this.formGroupStepOne = this.formBuilder.group({
      name: [this.isUpdateExistingCertificate() ? this.property.name : ''],
      description: [this.isUpdateExistingCertificate() ? this.property.description : ''],
      isComplex: [this.isUpdateExistingCertificate() ? this.property.isComplex : false]
    });
  }

  initFormStepTwo(): void {
    this.formGroupStepTwo = this.formBuilder.group({
      path: [this.isUpdateExistingCertificate() ? this.property.path : '']
    });
  }

  public onNextSelected(event: { stepper: C8yStepper; step: CdkStep }): void {
    event.stepper.next();
  }

  public onBackSelected(event: { stepper: C8yStepper; step: CdkStep }): void {
    this.resetForm();
    event.stepper.previous();
  }

  public onCancelClicked(): void {
    this.resetForm();
    this.resetStepper();
    this.onClose.emit();
  }

  public isUpdateExistingCertificate(): boolean {
    return !!this.property;
  }

  private resetStepper(): void {
    this.stepper.reset();
    this.stepper.selectedIndex = 0;
    this.pendingStatus = false;
  }

  private resetForm(): void {
    this.property = null;
    this.initFormStepTwo();
  }

  private closeStepper(): void {
    this.resetForm();
    this.resetStepper();
    this.onClose.emit();
    this.refresh.emit();
  }


  async onSaveClicked(): Promise<void> {
    await this.updateCertificate();
  }

  async updateCertificate(): Promise<void> {
    try {
      // const res = await this.edgeService.updateCertificate(
      //   this.formGroupStepOne.value.name,
      //   this.formGroupStepOne.value.description,
      //   this.formGroupStepOne.value.isComplex
      // );
      this.closeStepper();
    } catch (error) {
      console.log(error);
      this.errorMsg = error.message;
      this.showAlert = true;
    }
  }

  onCloseAlert = () => {
    console.log('on close alert');
    this.showAlert=false
    this.closeStepper();
  };

}
