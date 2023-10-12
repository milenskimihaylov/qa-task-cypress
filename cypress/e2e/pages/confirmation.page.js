export class ConfirmationPage {

    successMessage() {
        return '.text-justify';
    }

    getSuccessMessage() {
        return cy.get(this.successMessage());
    }
}