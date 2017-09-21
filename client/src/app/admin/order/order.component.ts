import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CustomerService, MenuService, OrderService, AlertService } from './../_services/index';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
    templateUrl: './order.component.html',
})

export class OrderComponent {
    orderForm : FormGroup;
    loading : boolean = false;
    totalBill : number = 0;
    private menus: Array<object> = [];
    private customers: Array<object> = [];

    constructor(
        private router: Router,
        private customerService: CustomerService,
        private menuService: MenuService,
        private orderService: OrderService,
        private alertService: AlertService,
        private formBuilder: FormBuilder) { }
    
    ngOnInit() : void {

        this.orderForm = this.formBuilder.group({
            customer : [null, Validators.required],
            active : true,
            orders : this.formBuilder.array([ this.initOrder() ])
        })

        this.loading = true;
        this.menuService.getAll(event).subscribe(
            resp => {
                ({data: this.menus} = resp.json());
            },
            (err: HttpErrorResponse) => {
                if (err.error instanceof Error) {
                    console.log("Client-side error occured.");
                } else {
                    console.log("Server-side error occured.");
                }
            }
        )
        this.customerService.getAll(event).subscribe(
            resp => {
                ({data: this.customers} = resp.json());
            },
            (err: HttpErrorResponse) => {
                if (err.error instanceof Error) {
                    console.log("Client-side error occured.");
                } else {
                    console.log("Server-side error occured.");
                }
            }
        )
    }

    submit(data) {
        this.loading = true;
        this.orderService.create(data)
        .subscribe(
            data => {
                this.router.navigate(['/admin/orders']);
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            }
        );
    }

    initOrder() : FormGroup {
        return this.formBuilder.group({
            menu : null,
            quantity : 1,
            amount : null,
        });
    }

    calculateTotalAmount(control: FormArray) {
        this.totalBill = control.controls.reduce((prev, curr)=>{
            if(curr.value.menu!==null)prev += (curr.value.menu.price * curr.value.quantity); return prev;
        }, 0)
    }

    calculateAmount(i: number, control: FormArray) {
        let val = control.controls[i].value;
        control.controls[i].patchValue({"amount": val.menu.price * val.quantity});
        this.calculateTotalAmount(control);
    }

    addOrder(i: number) {
        let control = <FormArray>this.orderForm.get('orders');
        this.calculateAmount(i, control);
        if(control.controls[control.length - 1].value.amount !== null)
        control.push(this.initOrder());
    }

    removeOrder(i: number) {
        let control = <FormArray>this.orderForm.get('orders');
        control.removeAt(i);
    }
}