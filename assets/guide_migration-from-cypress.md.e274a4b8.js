import{o as t,c as e,a}from"./app.5358fee8.js";const r='{"title":"Migration from Cypress","description":"","frontmatter":{},"relativePath":"guide/migration-from-cypress.md","lastUpdated":1616422849244}',o={},i=a('<h1 id="migration-from-cypress"><a class="header-anchor" href="#migration-from-cypress" aria-hidden="true">#</a> Migration from Cypress</h1><p>cy.visit =&gt; page.goto<br> cy.get… =&gt; await page.get…</p><p>cy.wait =&gt; page.wait (alias of waitForTimeout)<br> cy.log =&gt; console.log</p><p>cy.currentRoute().should(&#39;equal&#39;, (.*)) =&gt; expect(await getCurrentRoute()).toEqual($1)</p><p>visible() REMOVED</p><p>/should(&#39;(.*?)&#39;, / =&gt; should.$1(</p><p>cy.focused =&gt; await page.get(&#39;:focus&#39;)</p>',7);o.render=function(a,r,o,p,s,g){return t(),e("div",null,[i])};export default o;export{r as __pageData};
