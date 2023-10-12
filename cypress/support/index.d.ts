/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable {
      
      /**
       * Custom command to assert current page url and heading.
       * @example cy.assertOpenPage('https://weathershopper.pythonanywhere.com/sunscreen', 'h2', 'Sunscreens')
       */
      assertOpenPage(pageUrl: string, headingSelector: string, headingText: string): Chainable<Element>;

      /**
       * Custom command to find the cheapest product which contains certain text.
       * @example cy.findCheapestProductWithText('Aloe')
       */
      findCheapestProductWithText(productText: string): Chainable<Element>;

      /**
       * Custom command to add an item to the cart.
       * @example cy.addItemToCart({"name": "Aloe top product", "price": "155", "index": "3"})
       */
      addItemToCart(itemObject: object): Chainable<Element>;

      /**
       * Custom command to generate payment details.
       * @example cy.generatePaymentDetails()
       */
      generatePaymentDetails(): Chainable<Element>;

      /**
       * Custom command to get iframe body to further query elements inside the iframe.
       * @example cy.getIframeBody('iframe').find('#email')
       */
      getIframeBody(selector: string): Chainable<Element>;
    }
  }