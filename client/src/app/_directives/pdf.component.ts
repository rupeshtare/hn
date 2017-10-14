import { Component, OnInit, Inject } from '@angular/core';
import * as jsPDF from 'jspdf';


@Component({
    moduleId: module.id,
    selector: 'hn-pdf',
    templateUrl: 'pdf.component.html',
    providers: [{ provide: 'Window', useValue: window }]
})

export class PdfComponent {
    private specialElementHandlers = {
        // element with id of 'bypass' - jQuery style selector
        '#nav': function (element, renderer) {
            // true = 'handled elsewhere, bypass text extraction'
            return true;
        },
        '#page-header': function (element, renderer) {
            return true;
        },
        '#coloumn-selector': function (element, renderer) {
            return true;
        },
        '#customer-label': function (element, renderer) {
            return true;
        },
    };

    constructor( @Inject('Window') private window: Window, ) { }

    download() {
        let doc = new jsPDF('p', 'pt', 'letter');
        const html = window.document.getElementsByTagName('html')[0];
        doc.fromHTML(html, 50, 20, { 'width': 500, 'elementHandlers': this.specialElementHandlers });

        doc = this.addWaterMark(doc);
        doc.save('hotel-nakshatra.pdf');
    }

    addWaterMark(doc) {
        const totalPages = doc.internal.getNumberOfPages();

        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(20);
            doc.setFontType('bold');
            doc.setTextColor(252, 252, 252);
            doc.text(250, 250, 'Hotel Nakshatra');
        }

        return doc;
    }
}
