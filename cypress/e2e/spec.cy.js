import { getUrls } from "../../src/apiCalls";

describe("Home page on load", () => {
	beforeEach(() => {
		cy.intercept("GET", "http://localhost:3001/api/v1/urls", {
			fixture: "urls.json",
		}).as("getUrls");
	});

	it("should display the heading", () => {
		cy.visit("http://localhost:3000/");
		cy.wait("@getUrls");
		cy.get("header").should("contain", "URL Shortener");
	});

	it("should display the form", () => {
		cy.get("form").within(() => {
			cy.get("input[name=title]")
				.should("exist")
				.and("be.visible")
				.and("have.attr", "Placeholder", "Title...");
			cy.get("input[name=urlToShorten]")
				.should("exist")
				.and("be.visible")
				.and("have.attr", "Placeholder", "URL to Shorten...");
			cy.get("button").should("exist").and("be.visible");
		});
	});

	it("should update form when user fills in input", () => {
		cy.get("form").within(() => {
			cy.get("input[name=title]").type("New Title");
			cy.get("input[name=title]").should("have.value", "New Title");
			cy.get("input[name=urlToShorten]").type("New long URL");
			cy.get("input[name=urlToShorten]").should("have.value", "New long URL");
		});
	});

	it("should display the existing cards with urls", () => {
		cy.get(".url").should("have.length", 2);
		cy.get(".url")
			.first()
			.within(() => {
				cy.get("h3").contains("Awesome photo");
				cy.get("a").contains("http://localhost:3001/useshorturl/1");
				cy.get("p").contains(
					"https://images.unsplash.com/photo-1531898418865-480b7090470f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80"
				);
			});
		cy.get(".url")
			.last()
			.within(() => {
				cy.get("h3").contains("MLK Jr.");
				cy.get("a").contains("http://localhost:3001/useshorturl/2");
				cy.get("p").contains(
					"https://verrrrrrrrrrrryyyyyyyyylonnnnnnnnnngwebsite.jpg"
				);
			});
	});

describe("Posting a new URL", () => {
		beforeEach(() => {
			cy.visit("http://localhost:3000");
			cy.wait("@getUrls");
			cy.intercept("POST", "http://localhost:3001/api/v1/urls", {
				statusCode: 201,
				body: {
					id: 3,
					long_url:
						"https://verrrrrryyyyyyyllloooooonggggVery_sleepy_cat.jpg",
					short_url: "http://localhost:3001/useshorturl/3",
					title: "Sleepy Cat",
				},
			}).as("postUrl");
		});

		it("should have a form that takes input values", () => {
			cy.get("input[name=title]").type("Sleepy Cat");
			cy.get("input[name=urlToShorten]").type(
				"https://verrrrrryyyyyyyllloooooonggggVery_sleepy_cat.jpg"
			);
			cy.get("input[name=title]").should("have.value", "Sleepy Cat");
			cy.get("input[name=urlToShorten]").should(
				"have.value",
				"https://verrrrrryyyyyyyllloooooonggggVery_sleepy_cat.jpg"
			);
		});

		it("should successfully POST new URL to API", () => {
			cy.get("form").within(() => {
				cy.get("input[name=title]").type("Sleepy Cat");
				cy.get("input[name=urlToShorten]").type(
					"https://verrrrrryyyyyyyllloooooonggggVery_sleepy_cat.jpg"
				);
				cy.get("button").click();
			});
        cy.wait("@postUrl");
    })

    it("should display a new shortened URL when the form is submitted", () => {
      cy.get("input[name=title]").type("Sleepy Cat");
      cy.get("input[name=urlToShorten]").type(
        "https://verrrrrryyyyyyyllloooooonggggVery_sleepy_cat.jpg"
      );
      cy.get("button").click()
      cy.wait("@postUrl");
      cy.get(".url").should("have.length", 3);
    
      cy.fixture("urls.json").then((fixtureUrls) => {
        cy.get(".url")
        .first()
        .within(() => {
            cy.get("h3").contains("Awesome photo");
            cy.get("a").should('have.attr', 'href', 'http://localhost:3001/useshorturl/1');
            cy.get("p").contains("https://images.unsplash.com/photo-1531898418865-480b7090470f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80");
        });
        })    
        cy.get(".url")
          .last()
          .within(() => {
            cy.get("h3").contains("Sleepy Cat");
            cy.get("a").contains(
              'http://localhost:3001/useshorturl/3'
            );
            cy.get("p").contains("https://verrrrrryyyyyyyllloooooonggggVery_sleepy_cat.jpg");
          });
    });
	});
});
