import{o as e,c as t,b as a,d as o}from"./app.76b8c738.js";const r='{"title":"Migration from Cypress","description":"","frontmatter":{},"relativePath":"guide/migration-from-cypress.md","lastUpdated":1616422849244}',i={},l=a("h1",{id:"migration-from-cypress"},[a("a",{class:"header-anchor",href:"#migration-from-cypress","aria-hidden":"true"},"#"),o(" Migration from Cypress")],-1),s=a("p",null,"cy.visit => page.goto cy.get… => await page.get…",-1),n=a("p",null,"cy.wait => page.wait (alias of waitForTimeout) cy.log => console.log",-1),u=a("p",null,"cy.currentRoute().should('equal', (.*)) => expect(await getCurrentRoute()).toEqual($1)",-1),p=a("p",null,"visible() REMOVED",-1),c=a("p",null,"/should('(.*?)', / => should.$1(",-1),d=a("p",null,"cy.focused => await page.get(':focus')",-1);i.render=function(a,o,r,i,g,f){return e(),t("div",null,[l,s,n,u,p,c,d])};export default i;export{r as __pageData};