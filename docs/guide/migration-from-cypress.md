# Migration from Cypress

cy.visit => page.goto
cy.get… => await page.get…

cy.wait => page.wait (alias of waitForTimeout)
cy.log => console.log

cy\.currentRoute\(\)\.should\('equal', (.*)\) => expect(await getCurrentRoute()).toEqual($1)

visible() REMOVED

/should\('(.*?)', / => should.$1(

cy.focused => await page.get(':focus')
