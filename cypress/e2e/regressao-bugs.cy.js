import { selectors } from "../support/selectors";

const sortedAscending = (values) => [...values].sort((a, b) => a - b);
const sortedDescending = (values) => [...values].sort((a, b) => b - a);

const productPrices = () =>
  cy.get(".inventory_item_price").then(($prices) =>
    [...$prices].map((price) =>
      Number(price.textContent.replace("$", "").trim()),
    ),
  );

describe("Swag Labs - regressao dos bugs reportados", () => {
  it("BUG01 - reproduz imagens iguais/incorretas para problem_user", () => {
    cy.loginAs("problem_user");

    cy.get(`${selectors.inventoryItem} img`).then(($images) => {
      const imageSources = [...$images].map((image) =>
        image.getAttribute("src"),
      );
      const uniqueImages = new Set(imageSources);

      expect(
        uniqueImages.size,
        "todos os produtos aparecem com a mesma imagem",
      ).to.equal(1);
      expect(
        imageSources.some((source) => /404|dog/i.test(source)),
        "as imagens apontam para placeholder incorreto",
      ).to.equal(true);
    });
  });

  it("BUG02 - reproduz botao Remove sem remover produto na listagem", () => {
    cy.loginAs("problem_user");

    cy.get(selectors.inventoryItem)
      .first()
      .within(() => {
        cy.get(".inventory_item_name").invoke("text").as("productName");
        cy.contains("button", /add to cart/i).click();
        cy.contains("button", /^remove$/i).click();
        cy.contains("button", /^remove$/i).should("be.visible");
      });

    cy.get(selectors.cartBadge).should("have.text", "1");
  });

  it("CT09 - reproduz compra concluida com carrinho vazio", () => {
    cy.loginAs("standard_user");
    cy.openCart();
    cy.get(selectors.cartItem).should("not.exist");

    cy.clickControl("Checkout");
    cy.location("pathname").should("include", "checkout-step-one");
    cy.fillCheckoutInformation({
      firstName: "Ana",
      lastName: "Silva",
      postalCode: "01310-000",
    });
    cy.location("pathname").should("include", "checkout-step-two");
    cy.get(selectors.cartItem).should("not.exist");
    cy.clickControl("Finish");

    cy.location("pathname").should("include", "checkout-complete");
    cy.contains(
      ".complete-header, [data-test='complete-header']",
      /thank you for your order/i,
    ).should("be.visible");
  });

  it("CT17 - reproduz ordenacao incorreta por preco para visual_user", () => {
    cy.loginAs("visual_user");

    cy.get(selectors.productSort).select("lohi");
    productPrices().then((lowToHighPrices) => {
      const lowToHighIsWrong =
        JSON.stringify(lowToHighPrices) !==
        JSON.stringify(sortedAscending(lowToHighPrices));

      cy.get(selectors.productSort).select("hilo");
      productPrices().should((highToLowPrices) => {
        const highToLowIsWrong =
          JSON.stringify(highToLowPrices) !==
          JSON.stringify(sortedDescending(highToLowPrices));

        expect(
          lowToHighIsWrong || highToLowIsWrong,
          "ao menos uma ordenacao por preco fica incorreta",
        ).to.equal(true);
      });
    });
  });

  it("CT12 - reproduz desalinhamento visual no carrinho para visual_user", () => {
    cy.loginAs("visual_user");
    cy.openCart();

    cy.get(".app_logo").then(($logo) => {
      const logoRect = $logo[0].getBoundingClientRect();
      const logoCenterY = logoRect.top + logoRect.height / 2;

      cy.get(selectors.cartLink).then(($cartLink) => {
        const cartRect = $cartLink[0].getBoundingClientRect();
        const cartCenterY = cartRect.top + cartRect.height / 2;

        expect(
          Math.abs(cartCenterY - logoCenterY),
          "icone do carrinho desalinhado ao topo",
        ).to.be.gte(16);
      });
    });
  });

  it("BUG06 - reproduz demora no login do performance_glitch_user", () => {
    cy.visit("/");
    cy.get(selectors.username).clear().type("performance_glitch_user");
    cy.get(selectors.password).clear().type("secret_sauce", { log: false });

    cy.then(() => {
      cy.wrap(Date.now()).as("loginStartedAt");
    });

    cy.get(selectors.loginButton).click();
    cy.location("pathname", { timeout: 12000 }).should("include", "inventory");

    cy.get("@loginStartedAt").then((startedAt) => {
      expect(Date.now() - startedAt, "tempo de login em ms").to.be.gte(3000);
    });
  });
});
