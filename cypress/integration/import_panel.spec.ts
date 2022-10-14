describe('The multilevel linear view import panel', () => {
  it('is opened in JBrowse', () => {
    cy.exec('shx cp cypress/fixtures/clear_session.json .jbrowse')
    cy.visit('/?config=clear_session.json')
    cy.wait(1000)
    cy.contains('Empty', { timeout: 10000 }).click()
    cy.contains('Add').click()
    cy.contains('Linear multilevel view').click()
    // it opens
    cy.contains('Open').should('be.visible')
  })
  it('can change the assembly', () => {
    cy.get('[data-testid=assembly-selector]').parent().click()
    cy.contains('hg19').click()
    // it opens with the correct assembly
    cy.contains('hg19').should('be.visible')
  })
  it('can change the region', () => {
    cy.exec('shx cp cypress/fixtures/import_panel_session.json .jbrowse')
    cy.visit('/?config=import_panel_session.json')
    cy.wait(1000)
    cy.get('[data-testid=autocomplete]')
      .parent()
      .click()
      .type('{downArrow}')
      .type('{downArrow}')
      .type('{enter}')
    cy.contains('Open').click()
    cy.wait(1000)
    // it opens with the correct region
    cy.get('[data-testid=autocomplete]')
      .find('input')
      .should('have.value', '2:121,096,272..121,097,259')
  })
  /** NUM VIEW TESTS CURRENTLY DON'T WORK FOR SOME REASON WITH CYPRESS, HAVE BEEN MANUALLY TESTED */
  // it('can change the number of views', () => {
  //   cy.exec('shx cp cypress/fixtures/import_panel_session.json .jbrowse')
  //   cy.visit('/?config=import_panel_session.json')
  //   cy.wait(2000)
  //   cy.get('[data-testid=num_views]').parent().type('{upArrow}').type('{enter}')
  //   cy.wait(2000)
  //   cy.get('[data-testid=num_views]').find('input').should('have.value', 3)
  //   cy.wait(2000)
  //   cy.contains('Open').click()
  //   cy.wait(2000)
  // })
  // it('cannot open more than 10 views', () => {
  //   cy.get('[data-testid=num_views]').parent().type('11')
  //   cy.contains('10')
  //   // and then opens 10 views
  // })
  // it('cannot open less than 2 views', () => {
  //   cy.get('[data-testid=num_views]').parent().type('1')
  //   cy.contains('2')
  //   // and then opens 2 views
  // })
  it('can change the view cascade order to ascending', () => {
    cy.exec('shx cp cypress/fixtures/import_panel_session.json .jbrowse')
    cy.visit('/?config=import_panel_session.json')
    cy.wait(1000)
    cy.get('[data-testid=cascade_order]')
      .parent()
      .type('{upArrow}{upArrow}{enter}')
    cy.get('[data-testid=cascade_order]')
      .find('input')
      .should('have.value', 'Ascending')
    cy.wait(1000)
    cy.contains('Open').click()
    cy.wait(2000)
    // it opens in an order such that the second zoom in element is enabled (i.e. the anchor is at the top)
    cy.get('[data-testid=zoom_in').eq(1).should('be.enabled')
  })
  it('can change the view cascade order to descending', () => {
    cy.exec('shx cp cypress/fixtures/import_panel_session.json .jbrowse')
    cy.visit('/?config=import_panel_session.json')
    cy.wait(1000)

    cy.get('[data-testid=cascade_order]')
      .find('input')
      .should('have.value', 'Descending')
    cy.wait(1000)
    cy.contains('Open').click()
    cy.wait(2000)
    // it opens in an order such that the second zoom in element is disabled (i.e. the overiew is at the top)
    cy.get('[data-testid=zoom_in').eq(1).should('be.disabled')
  })
})
