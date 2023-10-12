export class ProductsPage {

    item() {
        return 'div.col-4';
    }

    getItem() {
        return cy.get(this.item());
    }

    itemName() {
        return 'p.font-weight-bold';
    }

    getItemName() {
        return cy.get(this.itemName());
    }

    itemPrice() {
        return this.itemName() + 'p';
    }

    getItemPrice() {
        return cy.get(this.itemPrice());
    }

    itemAddButton() {
        return '.btn-primary';
    }

    getItemAddButton() {
        return cy.get(this.itemAddButton());
    }

    cartButton() {
        return 'button.nav-link';
    }

    getCartButton() {
        return cy.get(this.cartButton());
    }
}