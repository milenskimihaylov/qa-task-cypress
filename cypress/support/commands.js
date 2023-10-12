// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import { ProductsPage } from "../e2e/pages/products.page";
import { CommonElements } from "../e2e/pages/commonElements.page";
import { faker } from '@faker-js/faker';

const productsPage = new ProductsPage();
const commonElements = new CommonElements();

//Asserting current page url and heading
Cypress.Commands.add('assertOpenPage', (pageUrl, headingText) => {

    cy.step("Assert that page URL is correct");
    cy.url().should('equal', pageUrl);

    cy.step("Assert that correct page heading is displayed");
    commonElements.getPageHeading().should('be.visible').and('have.text', headingText);
});

//Finds the cheapest product which contains certain text
Cypress.Commands.add('findCheapestProductWithText', (productText) => {

    cy.step(`Finding the cheapest product which contains '${productText}'`);
    let searchedProducts = [];

    //going through every product/item on the page
    productsPage.getItem().should('be.visible').each(($product, index) => {
        //scoping to work inside the current product/item
        productsPage.getItem().eq(index).within(($item) => {
          //getting current product/item name and check if it includes the searched text
          productsPage.getItemName().then(($el) => {
            if ($el.text().includes(productText)) {
              //pushing an object with item's name, price and index of the dom element into an array
              cy.contains('p', 'Price:').then(($price) => {
                let price = $price.text().replace(/[^0-9]/g, '');
                searchedProducts.push({"name": $el.text(), "price": price, "index": index});
              });
            }
          })
        })
    }).then(() => {
        //sorting the array with found products in ascending order
        searchedProducts.sort((item1, item2) => item1.price - item2.price);
    });

    return cy.wrap(searchedProducts);
});

//Add item to cart
Cypress.Commands.add('addItemToCart', (itemObject) => {

    cy.step(`Add item '${itemObject.name}' to the cart`);
    productsPage.getItemAddButton().eq(itemObject.index).click();
});

//Generates payment details
Cypress.Commands.add('generatePaymentDetails', () => {

    let testEmail = "Test_" + faker.internet.email();
    let testExpiryDate = faker.number.int({ min: 1, max: 12 }).toString() + faker.number.int({ min: 24, max: 34 }).toString();
    let testCvc = faker.finance.creditCardCVV();
    let testZipCode = faker.location.zipCode('#####');

    const paymentDetails = {
        email: testEmail,
        cardNumber: '4242424242424242',
        expiryDate: testExpiryDate.length === 3 ? "0" + testExpiryDate : testExpiryDate,
        cvc: testCvc,
        zipCode: testZipCode,
    }

    return paymentDetails;
});

//Gets iframe body to further query elements inside the iframe
Cypress.Commands.add('getIframeBody', (selector) => {
    cy.get(selector).then(($iframe) => {
        return new Cypress.Promise((resolve) => {
            $iframe.ready(function () {
              resolve($iframe.contents().find('body'));
            })
        });
    }).then(($body) => {
        cy.wrap($body);
    });    
});