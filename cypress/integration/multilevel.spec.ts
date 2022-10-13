describe('The multilevel linear view', () => {
  it('can unlink views', () => {
    cy.exec('shx cp cypress/fixtures/open_mllv_session.json .jbrowse')
    cy.visit('/?config=open_mllv_session.json')
    cy.wait(1000)
    cy.get('[data-testid=link_views]').click()
  })
  it('can align views', () => {
    cy.exec('shx cp cypress/fixtures/open_mllv_session.json .jbrowse')
    cy.visit('/?config=open_mllv_session.json')
    cy.wait(1000)
    cy.get('[data-testid=align_views]').click()
  })
  it('can reset the zoom levels', () => {
    cy.exec('shx cp cypress/fixtures/open_mllv_session.json .jbrowse')
    cy.visit('/?config=open_mllv_session.json')
    cy.wait(1000)
    cy.get('[data-testid=zoom_views]').click()
  })
  it('can reverse the cascading order', () => {
    cy.exec('shx cp cypress/fixtures/open_mllv_session.json .jbrowse')
    cy.visit('/?config=open_mllv_session.json')
    cy.wait(1000)
    cy.get('[data-testid=view_menu_icon]').click()
    cy.contains('Reverse views direction').click()
    // it is now in an order such that the second zoom in element is disabled (i.e. the overiew is at the top)
    cy.get('[data-testid=zoom_in').eq(4).should('be.disabled')
  })
  it('can add a view above a subview', () => {
    cy.exec('shx cp cypress/fixtures/open_mllv_session.json .jbrowse')
    cy.visit('/?config=open_mllv_session.json')
    cy.wait(1000)
    cy.get('[data-testid=mllv-minicontrols-menu]').eq(1).click()
    cy.contains('Add neighbouring view').click()
    cy.contains('Add view above').click()
    // there should be one fewer views available
    cy.get('[data-testid=rubberBand_controls').should('have.length', 5)
  })
  it('can add a view below a subview', () => {
    cy.exec('shx cp cypress/fixtures/open_mllv_session.json .jbrowse')
    cy.visit('/?config=open_mllv_session.json')
    cy.wait(1000)
    cy.get('[data-testid=mllv-minicontrols-menu]').eq(1).click()
    cy.contains('Add neighbouring view').click()
    cy.contains('Add view below').click()
    // there should be one fewer views available
    cy.get('[data-testid=rubberBand_controls').should('have.length', 5)
  })
  it('can add a view above the overview', () => {
    cy.exec('shx cp cypress/fixtures/open_mllv_session.json .jbrowse')
    cy.visit('/?config=open_mllv_session.json')
    cy.wait(1000)
    cy.get('[data-testid=mllv-minicontrols-menu]').eq(0).click()
    cy.contains('Add neighbouring view').click()
    cy.contains('Add view above').click()
    // there should be one fewer views available
    cy.get('[data-testid=rubberBand_controls').should('have.length', 5)
  })
  it('can add a view below the anchor', () => {
    cy.exec('shx cp cypress/fixtures/open_mllv_session.json .jbrowse')
    cy.visit('/?config=open_mllv_session.json')
    cy.wait(1000)
    cy.get('[data-testid=mllv-minicontrols-menu]').eq(3).click()
    cy.contains('Add neighbouring view').click()
    cy.contains('Add view below').click()
    // there should be one fewer views available
    cy.get('[data-testid=rubberBand_controls').should('have.length', 5)
  })
  it('can remove a view', () => {
    cy.exec('shx cp cypress/fixtures/open_mllv_session.json .jbrowse')
    cy.visit('/?config=open_mllv_session.json')
    cy.wait(1000)
    cy.get('[data-testid=mllv-minicontrols-menu]').eq(1).click()
    cy.contains('Remove view').click()
    // there should be one fewer views available
    cy.get('[data-testid=rubberBand_controls').should('have.length', 3)
  })
})
