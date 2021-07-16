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

  it('does not show feature A', () => {
    cy.intercept('/api/v1/flags/', { fixture: 'no-feature-a.json' }).as('flags')
    cy.visit('/')
    cy.wait('@flags')
    cy.contains('#feature-area', 'Not showing feature A')
  })

  it('does not show feature A (modify response)', () => {
    cy.intercept('/api/v1/flags/', (req) => {
      req.continue((res) => {
        expect(res.body, 'response is a list of features').to.be.an('array')
        const featureA = Cypress._.find(
          res.body,
          (f) => f.feature.name === 'feature_a',
        )
        // make sure the feature is present
        expect(featureA, 'feature_a is present').to.be.an('object')
        expect(featureA).to.have.property('enabled')
        // make sure the feature is always disabled
        console.log(
          'changing %s from %s to %s',
          featureA.feature.name,
          featureA.enabled,
          false,
        )
        featureA.enabled = false
      })
    }).as('flags')
    cy.visit('/')
    cy.wait('@flags')
    cy.contains('#feature-area', 'Not showing feature A')
  })

  it('shows the feature A', () => {
    cy.intercept('/api/v1/flags/', (req) => {
      req.continue((res) => {
        expect(res.body, 'response is a list of features').to.be.an('array')
        const featureA = Cypress._.find(
          res.body,
          (f) => f.feature.name === 'feature_a',
        )
        // make sure the feature is present
        expect(featureA, 'feature_a is present').to.be.an('object')
        expect(featureA).to.have.property('enabled')
        console.log(
          'changing %s from %s to %s',
          featureA.feature.name,
          featureA.enabled,
          true,
        )
        featureA.enabled = true
      })
    }).as('flags')
    cy.visit('/')
    cy.wait('@flags')
    cy.contains('#feature-area', 'Showing feature A').should('be.visible')
  })

  const setFeatureFlags = (flags = {}) => {
    expect(flags).to.be.an('object').and.not.to.be.empty

    cy.intercept('/api/v1/flags/', (req) => {
      req.continue((res) => {
        expect(res.body, 'response is a list of features').to.be.an('array')
        Cypress._.forEach(flags, (value, flagName) => {
          const feature = Cypress._.find(
            res.body,
            (f) => f.feature.name === flagName,
          )
          // make sure the feature is present
          expect(feature, 'feature_a is present').to.be.an('object')
          expect(feature).to.have.property('enabled')

          console.log(
            'changing %s from %s to %s',
            feature.feature.name,
            feature.enabled,
            value,
          )
          feature.enabled = value
        })
      })
    }).as('flags')
  }

  it('controls the flags', () => {
    setFeatureFlags({ feature_a: true })

    cy.visit('/')
    cy.wait('@flags')
    cy.contains('#feature-area', 'Showing feature A').should('be.visible')
  })
})
