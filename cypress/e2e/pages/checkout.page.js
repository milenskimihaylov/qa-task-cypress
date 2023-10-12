export class CheckoutPage {

    tableRow() {
        return '.table-striped tbody tr';
    }

    getTableRow() {
        return cy.get(this.tableRow());
    }

    totalSum() {
        return '#total';
    }

    getTotalSum() {
        return cy.get(this.totalSum());
    }

    payButton() {
        return '.stripe-button-el';
    }

    getPayButton() {
        return cy.get(this.payButton());
    }
}