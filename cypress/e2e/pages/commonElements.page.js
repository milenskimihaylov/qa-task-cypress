export class CommonElements {

    pageHeading() {
        return 'h2';
    }

    getPageHeading() {
        return cy.get(this.pageHeading());
    }
}