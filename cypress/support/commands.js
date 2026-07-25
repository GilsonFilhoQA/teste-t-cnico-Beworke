import { selectors } from "./selectors";

const controlSelector =
  'button, a, input[type="submit"], input[type="button"]';

Cypress.Commands.add("clickControl", (label) => {
  const labelPattern = new RegExp(`^\\s*${label}\\s*$`, "i");

  cy.get("body").then(($body) => {
    const $control = $body.find(controlSelector).filter((_, element) => {
      const text = element.innerText || element.value || "";

      return labelPattern.test(text);
    });

    expect($control.length, `controle "${label}" disponivel`).to.be.greaterThan(
      0,
    );
    cy.wrap($control.first()).click();
  });
});

Cypress.Commands.add("loginAs", (username, password = "secret_sauce") => {
  cy.visit("/", { failOnStatusCode: false });
  cy.get(selectors.username).clear().type(username);
  cy.get(selectors.password).clear().type(password, { log: false });
  cy.get(selectors.loginButton).click();
  cy.location("pathname", { timeout: 12000 }).should("include", "inventory");
});

Cypress.Commands.add("addInventoryItems", (quantity) => {
  cy.get(selectors.inventoryItem).should("have.length.at.least", quantity);

  Cypress._.times(quantity, (index) => {
    cy.get(selectors.inventoryItem)
      .eq(index)
      .contains("button", /add to cart/i)
      .click();
  });

  cy.get(selectors.cartBadge).should("have.text", String(quantity));
});

Cypress.Commands.add("openCart", () => {
  cy.get(selectors.cartLink).click();
  cy.location("pathname").should("include", "cart");
});

Cypress.Commands.add("fillCheckoutInformation", (customer) => {
  cy.get(selectors.firstName).clear().type(customer.firstName);
  cy.get(selectors.lastName).clear().type(customer.lastName);
  cy.get(selectors.postalCode).clear().type(customer.postalCode);
  cy.clickControl("Continue");
});
