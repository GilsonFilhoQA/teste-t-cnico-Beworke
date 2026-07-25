import { selectors } from "../support/selectors";

const customer = {
  firstName: "Ana",
  lastName: "Silva",
  postalCode: "01310-000",
};

describe("Swag Labs - compra bem-sucedida com standard_user", () => {
  it("CT01 - adiciona 3 produtos, finaliza a compra e valida sucesso", () => {
    cy.loginAs("standard_user");
    cy.addInventoryItems(3);
    cy.openCart();

    cy.get(selectors.cartItem).should("have.length", 3);
    cy.clickControl("Checkout");
    cy.fillCheckoutInformation(customer);

    cy.location("pathname").should("include", "checkout-step-two");
    cy.get(selectors.cartItem).should("have.length", 3);
    cy.contains(".summary_total_label", /total:/i).should("be.visible");
    cy.clickControl("Finish");

    cy.location("pathname").should("include", "checkout-complete");
    cy.contains(".complete-header, [data-test='complete-header']", /thank you for your order/i).should(
      "be.visible",
    );
  });
});
