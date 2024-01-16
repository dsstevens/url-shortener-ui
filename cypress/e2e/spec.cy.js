import { getUrls } from "../../src/apiCalls";

describe('Home page on load', () => {
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:3001/api/v1/urls', {
      fixture: 'urls.json',
    }).as('getUrls');
  });

  it('should display the heading', () => {
    cy.visit('http://localhost:3000/');
    cy.wait('@getUrls');
    cy.get('header').should('contain', 'URL Shortener');
    })

  it('should display the form', () => {
     cy.get('form').within(() => {
      cy.get('input[name=title]').should('exist').and('be.visible')
        .and('have.attr', 'Placeholder', 'Title...')
      cy.get('input[name=urlToShorten]').should('exist').and('be.visible')
        .and('have.attr', 'Placeholder', 'URL to Shorten...')
      cy.get('button').should('exist').and('be.visible')
      })
    })

  it('should update form when user fills in input', () => {
    cy.get('form').within(() => {
      cy.get('input[name=title]').type('New Title')
      cy.get('input[name=title]').should('have.value', 'New Title')
      cy.get('input[name=urlToShorten]').type('New long URL')
      cy.get('input[name=urlToShorten]').should('have.value','New long URL')
      })
});

describe('Posting a new URL', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
    cy.wait('@getUrls')
    cy.intercept('POST', 'http://localhost:3001/api/v1/urls', {
      statusCode: 201,
      body: {
        id: 2,
        long_url:
          'https://commons.wikimedia.org/wiki/File:Very_sleepy_cat.jpg',
        short_url: 'http://localhost:3001/useshorturl/3',
        title: 'Sleepy Cat'
      }
    }).as('postRequest')
  })

  it('should have a form that takes input values', () => {
    cy.get('input[name=title]').type('Sleepy Cat');
    cy.get('input[name=urlToShorten]').type('https://commons.wikimedia.org/wiki/File:Very_sleepy_cat.jpg');
    cy.get('input[name=title]').should('have.value', 'Sleepy Cat');
    cy.get('input[name=urlToShorten]').should('have.value', 'https://commons.wikimedia.org/wiki/File:Very_sleepy_cat.jpg');
  })

  it('should successfully POST new URL to API', () => {
    cy.get('form').within(() => {
      cy.get('input[name=title]').type('Sleepy Cat')
      cy.get('input[name=urlToShorten]').type(
        'https://commons.wikimedia.org/wiki/File:Very_sleepy_cat.jpg'
      )
      cy.get('button').click()
    })

    it("should display a new shortened URL when the form is submitted", () => {
      cy.get("input[name=title]").type("Sleepy Cat")
      cy.get("input[name=urlToShorten]").type(
        "https://commons.wikimedia.org/wiki/File:Very_sleepy_cat.jpg"
      );
      cy.get("form").submit()
      cy.wait("@postUrl")
      cy.get(".url").should("have.length", 3)
    });
  
    it("should display the first and last contents of the URL submissions", () => {
      cy.visit("http://localhost:3000/")
      cy.wait("@getUrls")
  
      cy.fixture("urls.json").then((fixtureUrls) => {
        cy.get(".url").should("have.length", fixtureUrls.urls.length)
  
        cy.get(".url").first().within(() => {
          cy.get("h3").contains("Awesome Photo")
          cy.get("a").contains("https://images.unsplash.com/photo-1531898418865-480b7090470f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80")
          cy.get("p").contains("http://localhost:3001/useshorturl/1")
        });
  
        cy.get(".url").last().within(() => {
          cy.get("h3").contains("Sleepy Cat")
          cy.get("a").contains("https://commons.wikimedia.org/wiki/File:Very_sleepy_cat.jpg")
          cy.get("p").contains("http://localhost:3001/useshorturl/3"); 
        });
      });
    });
  })
})
})