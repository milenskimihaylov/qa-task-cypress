export class LandingPage {

    temperature() {
        return '#temperature';
    }

    getTemperature() {
        return cy.get(this.temperature());
    }

    moisturizersButton() {
        return "a[href = '/moisturizer'] button";
    }

    getMoisturizersButton() {
        return cy.get(this.moisturizersButton());
    }

    sunscreensButton() {
        return "a[href = '/sunscreen'] button";
    }

    getSunscreensButton() {
        return cy.get(this.sunscreensButton());
    }
}