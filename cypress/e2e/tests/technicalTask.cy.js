import { LandingPage } from "../pages/landing.page";
import { ProductsPage } from "../pages/products.page";
import { CheckoutPage } from "../pages/checkout.page";
import { PaymentModal } from "../modals/payment.modal";
import { ConfirmationPage } from "../pages/confirmation.page";
import { TEMPERATURE } from "../constants/temperatureLimits.constants";
import { APP_URLS } from "../constants/urls.constants";
import { ENDPOINTS_URLS } from "../constants/urls.constants";
import { HEADINGS } from "../constants/labels.constants";
import { SUCCESS_MESSAGE } from "../constants/labels.constants";

const landingPage = new LandingPage();
const productsPage = new ProductsPage();
const checkoutPage = new CheckoutPage();
const paymentModal = new PaymentModal();
const confirmationPage = new ConfirmationPage();

describe('QA Technical Task', () => {

  beforeEach(() => {
    cy.step("Navigate to Weathershopper landing page");
    cy.visit('/');
  });

  it('User is able to buy products', () => {

    let itemsInCart = 0;
    let firstCriterionProducts = [];
    let secondCriterionProducts = [];
    let finalProductsArray = [];
    let totalSum = 0;

    cy.intercept('POST', ENDPOINTS_URLS.stripeTokens).as('stripeTokensCall');
    cy.intercept('GET', ENDPOINTS_URLS.marketplaceImage).as('marketplaceImageCall');

    landingPage.getTemperature().then(($temperature) => {
      //removing redundant symbols from the temperature
      let currentTemperature = $temperature.text().replace(/[^0-9]/g, '');
      
      if (currentTemperature < TEMPERATURE.coldLimit) {
        cy.step(`Current temperature is: ${currentTemperature} degrees. Click on 'Buy moisturizers' button`);
        landingPage.getMoisturizersButton().click();

        cy.assertOpenPage(Cypress.config('baseUrl') + APP_URLS.moisturizers, HEADINGS.moisturizers);

        cy.findCheapestProductWithText('Aloe').then((aloeProducts) => {
          //here only 'almond' (case sensitive) is accepted according to the requirements
          //sometimes there are no products including 'almond' in their name 
          cy.findCheapestProductWithText('almond').then((almondProducts) => {
            firstCriterionProducts = aloeProducts;
            secondCriterionProducts = almondProducts;
          });
        });
      }
      else if (currentTemperature > TEMPERATURE.hotLimit) {
        cy.step(`Current temperature is: ${currentTemperature} degrees. Click on 'Buy sunscreens' button`);
        landingPage.getSunscreensButton().click();

        cy.assertOpenPage(Cypress.config('baseUrl') + APP_URLS.sunscreens, HEADINGS.sunscreens);

        cy.findCheapestProductWithText('SPF-50').then((spf50Products) => {
          cy.findCheapestProductWithText('SPF-30').then((spf30Products) => {
            firstCriterionProducts = spf50Products;
            secondCriterionProducts = spf30Products;
          });
        });
      }
      else {
        throw new Error(`Current temperature is: ${currentTemperature}. It is neither cold or too hot so no shopping today!`);
      }
    }).then(() => {

      if (firstCriterionProducts.length > 0) {
        cy.addItemToCart(firstCriterionProducts[0]);
        itemsInCart++;
        //adding the product in the cart to the array
        //in order to be able to work with it later
        finalProductsArray.push(firstCriterionProducts[0]);
      }
      if (secondCriterionProducts.length > 0) {
        cy.addItemToCart(secondCriterionProducts[0]);
        itemsInCart++;
        //adding the product in the cart to the array
        //in order to be able to work with it later
        finalProductsArray.push(secondCriterionProducts[0]);
      }

      cy.step("Click on 'Cart' button");
      productsPage.getCartButton().should('have.text', `Cart - ${itemsInCart} item(s)`).click();

      cy.assertOpenPage(Cypress.config('baseUrl') + APP_URLS.cart, HEADINGS.cart);

      cy.step("Assert that correct number of items is displayed in the table with items");
      checkoutPage.getTableRow().its('length').should('equal', itemsInCart);

      cy.step("Assert that correct product details are displayed in the table with items");
      finalProductsArray.forEach((product, index) => {
        totalSum = totalSum + parseInt(product.price);
        checkoutPage.getTableRow().eq(index).within(($tableRow) => {
          cy.get('td').eq(0).should('have.text', product.name);
          cy.get('td').eq(1).should('have.text', product.price);
        });
      });

      cy.step("Assert that correct total sum is displayed on the page");
      checkoutPage.getTotalSum().should('have.text', `Total: Rupees ${totalSum}`);

      cy.step("Click on 'Pay with Card' button");
      checkoutPage.getPayButton().click();

      cy.wait('@marketplaceImageCall');

      cy.generatePaymentDetails().then((paymentDetails) => {
        
        cy.step(`Enter email address '${paymentDetails.email}' in the payment modal`);
        cy.getIframeBody(paymentModal.iframe()).find(paymentModal.emailInput()).type(paymentDetails.email);

        cy.step(`Enter card number '${paymentDetails.cardNumber}' in the payment modal`);
        cy.getIframeBody(paymentModal.iframe()).find(paymentModal.cardNumberInput()).type(paymentDetails.cardNumber);

        cy.step(`Enter card expiration date '${paymentDetails.expiryDate}' in the payment modal`);
        cy.getIframeBody(paymentModal.iframe()).find(paymentModal.cardExpirationInput()).type(paymentDetails.expiryDate);

        cy.step(`Enter card cvc '${paymentDetails.cvc}' in the payment modal`);
        cy.getIframeBody(paymentModal.iframe()).find(paymentModal.cvcInput()).type(paymentDetails.cvc);

        cy.step(`Enter zip code '${paymentDetails.zipCode}' in the payment modal`);
        cy.getIframeBody(paymentModal.iframe()).find(paymentModal.zipCodeInput()).type(paymentDetails.zipCode);

        cy.step("Click on 'Submit' button");
        cy.getIframeBody(paymentModal.iframe())
        .find(paymentModal.submitButton())
        .should('have.text', `Pay INR ₹${totalSum}.00`).click();
      });

      cy.step("Assert that stripe tokens post endpoint call is successfull");
      cy.wait('@stripeTokensCall').its('response').then((response) => {
        expect(response.statusCode, "Stripe tokens endpoint call should be successfull").to.equal(200);
      });

      cy.assertOpenPage(Cypress.config('baseUrl') + APP_URLS.confirmation, HEADINGS.confirmation);

      cy.step("Assert that correct success message is displayed on the confirmation page");
      confirmationPage.getSuccessMessage()
      .should('be.visible')
      .and('have.text', SUCCESS_MESSAGE);
    });
  });
})