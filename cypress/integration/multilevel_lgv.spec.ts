describe('The multilevel linear genome view', () => {
  it('can hide the header', () => {
    cy.exec('shx cp cypress/fixtures/open_mllv_session.json .jbrowse')
    cy.visit('/?config=open_mllv_session.json')
    cy.wait(1000)
    // before hiding the header there should be 3
    cy.get('[data-testid=subheader]').should('have.length', 3)
    cy.get('[data-testid=mllv-minicontrols-menu]').eq(1).click()
    cy.contains('Show header').click()
    // after hiding the header there should only be 2
    cy.get('[data-testid=subheader]').should('have.length', 2)
  })
  it('can show the controls', () => {
    cy.exec('shx cp cypress/fixtures/open_mllv_session.json .jbrowse')
    cy.visit('/?config=open_mllv_session.json')
    cy.wait(1000)
    cy.get('[data-testid=mllv-minicontrols-menu]').eq(1).click()
    cy.contains('Show controls').click()
    // after hiding the header there should only be 2
    cy.get('[data-testid=panright]').should('have.length', 2)
  })
  it('can hide the view', () => {
    cy.exec('shx cp cypress/fixtures/open_mllv_session.json .jbrowse')
    cy.visit('/?config=open_mllv_session.json')
    cy.wait(1000)
    cy.get('[data-testid=mllv-minicontrols-menu]').eq(1).click()
    cy.contains('Hide view').click()
    // after hiding the header there should only be 2
    cy.get('[data-testid=rubberBand_controls').should('have.length', 3)
  })
})
