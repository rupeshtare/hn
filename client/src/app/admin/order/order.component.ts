import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CustomerService, MenuService, OrderService, AlertService } from './../_services/index';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
    templateUrl: './order.component.html',
})

export class OrderComponent implements OnInit {
    private loading = false;
    public totalBill = 0;
    public menus: Array<object> = [];
    public customers: Array<object> = [];
    public orderForm: FormGroup;


    constructor(
        private router: Router,
        private customerService: CustomerService,
        private menuService: MenuService,
        private orderService: OrderService,
        private alertService: AlertService,
        private formBuilder: FormBuilder) { }

    ngOnInit(): void {

        this.orderForm = this.formBuilder.group({
            customer: [null, Validators.required],
            active: true,
            orders: this.formBuilder.array([this.initOrder()])
        });

        this.loading = true;
        this.menuService.getAll({ active: true, include: ['name', 'price'] })
            .subscribe(
            resp => {
                ({ data: this.menus } = resp.json());
            },
            err => {
                this.alertService.error(err);
                this.loading = false;
            });

        this.customerService.getAll({ active: true, include: ['firstName', 'lastName', 'company.name'] })
            .subscribe(
            resp => {
                ({ data: this.customers } = resp.json());
            },
            err => {
                this.alertService.error(err);
                this.loading = false;
            });
    }

    submit(values) {
        this.loading = true;
        this.orderService.create(values)
            .subscribe(
            data => {
                this.router.navigate(['/admin/orders']);
            },
            err => {
                this.alertService.error(err);
                this.loading = false;
            });
    }

    initOrder(): FormGroup {
        return this.formBuilder.group({
            menu: null,
            quantity: 1,
            amount: null,
        });
    }

    calculateTotalAmount(control: FormArray) {
        this.totalBill = control.controls.reduce((prev, curr) => {
            if (curr.value.menu !== null) {
                prev += (curr.value.menu.price * curr.value.quantity);
                return prev;
            }
        }, 0);
    }

    calculateAmount(i: number, control: FormArray) {
        const val = control.controls[i].value;
        control.controls[i].patchValue({ 'amount': val.menu.price * val.quantity });
        this.calculateTotalAmount(control);
    }

    addOrder(i: number) {
        const control = <FormArray>this.orderForm.get('orders');
        this.calculateAmount(i, control);
        if (control.controls[control.length - 1].value.amount !== null) {
            control.push(this.initOrder());
        }
    }

    removeOrder(i: number) {
        const control = <FormArray>this.orderForm.get('orders');
        control.removeAt(i);
    }

}
