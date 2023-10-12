export class PaymentModal {

    iframe() {
        return 'iframe.stripe_checkout_app';
    }

    body() {
        return '.bodyView';
    }

    emailInput() {
        return '#email';
    }

    cardNumberInput() {
        return '#card_number';
    }

    cardExpirationInput() {
        return '#cc-exp';
    }

    cvcInput() {
        return '#cc-csc';
    }

    zipCodeInput() {
        return '#billing-zip';
    }

    submitButton() {
        return '#submitButton';
    }
}