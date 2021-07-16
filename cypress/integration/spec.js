/// <reference types="cypress" />

describe('Flagsmith Cypress example', () => {
  it('shows the loading message', () => {
    // slow down the network call by 1 second
    cy.intercept('/api/v1/flags/', (req) =>
      Cypress.Promise.delay(1000).then(req.continue),
    ).as('flags')
    cy.visit('/')
    cy.contains('#feature-area', 'Initializing...').should('be.visible')
    // wait for the feature flags Ajax call
    cy.wait('@flags')
    cy.contains('Initializing...').should('not.exist')
  })
})
