import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from '../core/core.service';
import { EmployeeService } from '../services/employee.service';
import { Observable } from 'rxjs/internal/Observable';
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';

import { Validators } from '@angular/forms';

@Component({
  selector: 'app-emp-add-edit',
  templateUrl: './emp-add-edit.component.html',
  styleUrls: ['./emp-add-edit.component.scss'],
})
export class EmpAddEditComponent implements OnInit {

  empForm: FormGroup;

  service = new FormControl('');
  ser: string[] = [
    'Hair Cut',
    'Facial',
    'Menicure',
    'Pedicure',
    'Hair Color',
  ];
  filteredOptions!: Observable<string[]>;


  numbers: string[] = [
    "one",
    "two",
    "three"
  ];
  price = new FormGroup('');


  constructor(
    private _fb: FormBuilder,
    private _empService: EmployeeService,
    private _dialogRef: MatDialogRef<EmpAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _coreService: CoreService
  ) {
    this.empForm = this._fb.group({
      title: ['', Validators.required],
      name: ['', Validators.required],
      des: ['', Validators.required],
      date: ['', Validators.compose([Validators.required, this.validateDate])],
      gender: ['', Validators.required],
      service:['', Validators.required], 
      price: ['', Validators.compose ([Validators.required,this.validateCurrency]),],
      number:['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.empForm.patchValue(this.data);
    this.filteredOptions = this.service.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }



  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.ser.filter(option => option.toLowerCase().includes(filterValue));
  }


  onFormSubmit() {
    if (this.empForm.valid) {
      if (this.data) {
        this._empService
          .updateuserFn(this.data.id, this.empForm.value)
          .subscribe({
            next: (val: any) => {
              this._coreService.openSnackBar('Employee detail updated!');
              this._dialogRef.close(true);
            },
            error: (err: any) => {
              console.error(err);
            },
          });
      } else {
        this._empService.adduserFn(this.empForm.value).subscribe({
          next: (val: any) => {
            this._coreService.openSnackBar('Employee added successfully');
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          },
        });
      }
    }
  }

  // validateDate(control: FormControl) {
  //   const inputDate = new Date(control.value);
  //   const today = new Date();

  //   if (inputDate > today) {
  //     return {
  //       invalidDate: true
  //     };
  //   }

  //   return null;
  // }

  validateDate(control: FormControl){
    const selectedDate =control.value;
    const today =new Date();
    const selectedDateTime = new Date(selectedDate).getTime();
    const todayTime = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const difference = selectedDateTime - todayTime;
    if (difference < 0) {
      return { validateDate: true };
    }
    return null;
  }
  validateCurrency(control: FormControl) {
    const value = control.value;
  
    if (value === null || value === undefined || value === '') {
      return null; // Allow empty values
    }
  
    if (isNaN(value) || value <= 0) {
      return { validateCurrency: true, message: 'Please enter a valid positive number' };
    }
  
    return null;
  }

}
