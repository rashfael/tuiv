import{o as s,c as e,a as n}from"./app.5358fee8.js";const t='{"title":"Comparison with other tools","description":"","frontmatter":{},"headers":[{"level":2,"title":"Playwright","slug":"playwright"},{"level":2,"title":"Playwright Test Runner / Folio","slug":"playwright-test-runner-folio"},{"level":2,"title":"Cypress","slug":"cypress"},{"level":3,"title":"Reliance on JS-injections","slug":"reliance-on-js-injections"},{"level":3,"title":"Own async-to-sync API","slug":"own-async-to-sync-api"},{"level":3,"title":"Browser Support","slug":"browser-support"},{"level":3,"title":"Assorted Nitpicks","slug":"assorted-nitpicks"}],"relativePath":"guide/comparison.md","lastUpdated":1628106690623}',a={},o=n('<h1 id="comparison-with-other-tools"><a class="header-anchor" href="#comparison-with-other-tools" aria-hidden="true">#</a> Comparison with other tools</h1><h2 id="playwright"><a class="header-anchor" href="#playwright" aria-hidden="true">#</a> Playwright</h2><p><strong>tuiv</strong> builds heavily upon playwright and extends it with a more compact syntax.<br> Instead of handling all the promises yourself in playwright like this:</p><div class="language-js"><pre><code><span class="token keyword">const</span> element <span class="token operator">=</span> <span class="token keyword">await</span> page<span class="token punctuation">.</span><span class="token function">waitForSelector</span><span class="token punctuation">(</span><span class="token string">&#39;.some-selector&#39;</span><span class="token punctuation">)</span>\n<span class="token keyword">await</span> element<span class="token punctuation">.</span><span class="token function">click</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token keyword">await</span> element<span class="token punctuation">.</span><span class="token function">type</span><span class="token punctuation">(</span><span class="token string">&#39;foo&#39;</span><span class="token punctuation">)</span>\n<span class="token function">expect</span><span class="token punctuation">(</span><span class="token keyword">await</span> element<span class="token punctuation">.</span><span class="token function">textContent</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">stringContaining</span><span class="token punctuation">(</span><span class="token string">&#39;bar&#39;</span><span class="token punctuation">)</span>\n</code></pre></div><p>tuiv allows you to write chained commands and assertions, removing the need for a lot of local variables:</p><div class="language-js"><pre><code><span class="token keyword">await</span> page<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">&#39;.some-selector&#39;</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">click</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">type</span><span class="token punctuation">(</span><span class="token string">&#39;foo&#39;</span><span class="token punctuation">)</span><span class="token punctuation">.</span>should<span class="token punctuation">.</span>contain<span class="token punctuation">.</span><span class="token function">text</span><span class="token punctuation">(</span><span class="token string">&#39;bar&#39;</span><span class="token punctuation">)</span>\n</code></pre></div><p>tuiv also auto-retries assertions and provides more assertions specifically for DOM elements.</p><h2 id="playwright-test-runner-folio"><a class="header-anchor" href="#playwright-test-runner-folio" aria-hidden="true">#</a> Playwright Test Runner / Folio</h2><p>When I first started writing tuiv I <em>only</em> wanted to create an assertion lib for playwright. I started to look at what test runners I could run those assertions on. After a bit of digging inside the usual suspects of mocha, jest, and others I discovered a <strong>very much alpha</strong> version of <a href="https://github.com/microsoft/folio" target="_blank" rel="noopener noreferrer">Folio</a> (which is the basis for the <a href="https://playwright.dev/docs/test-intro" target="_blank" rel="noopener noreferrer">Playwright Test Runner</a>). Since I am a fan of pytest fixtures I was rather excited to have found a fixture-based test runner for javascript and started using Folio to run tuiv assertions.<br> But, did I mention that Folio at that point (around March 2021) was <strong>very much alpha</strong>? Unfortunately for me, folio completely changed their api away from fixtures to something completely else, so I just… wrote my own test runner.<br> So if you are thinking <em>&quot;that API looks a lot like an early version of folio&quot;</em>, you are absolutely right, because it is. Beyond the similar API however there are a ton of features missing and the internals are (hopefully) rather different (it&#39;s in plain JS and not in TypeScript, for starters). The reporter API is also event based (similar to mocha) instead of hook-function based.</p><p>With the proper release of the Playwright Test Runner, Folio has changed its API <strong>back</strong> to (slightly different) fixtures, but by that time I already was way too deep in my own implementation.</p><h2 id="cypress"><a class="header-anchor" href="#cypress" aria-hidden="true">#</a> Cypress</h2><p>Cypress is a clear inspiration for <strong>tuiv</strong> and while Cypress remains a great and polished tool for e2e testing, it has some big caveats.</p><h3 id="reliance-on-js-injections"><a class="header-anchor" href="#reliance-on-js-injections" aria-hidden="true">#</a> Reliance on JS-injections</h3><p>Instead of controlling the browser via an automation API (like playwright does), Cypress injects javascript into the pages it tests. This has some rather big shortcomings, chief of which is that <em>all</em> events are simulated inside javascript and thus only approximate real browser behavior. One consequence of this is <a href="https://github.com/cypress-io/cypress/issues/10" target="_blank" rel="noopener noreferrer">missing hover support</a>.</p><h3 id="own-async-to-sync-api"><a class="header-anchor" href="#own-async-to-sync-api" aria-hidden="true">#</a> Own async-to-sync API</h3><p>Testing in the browser is inherently asynchronous. Waiting for pages to load, elements to exist and assertion conditions to be true need to all be handled. While playwright leaves this completely to the test author (resulting in <em>a lot</em> of <code>await</code>), Cypress completely hides this asynchronicity and presents the test author with a synchronous API, which, on first glance, is awesome. However, this forcing of asynchronous into synchronous call chains makes controlling the test flow (for <a href="https://docs.cypress.io/guides/core-concepts/conditional-testing.html" target="_blank" rel="noopener noreferrer">conditional testing</a> for example) difficult (<a href="https://docs.cypress.io/api/commands/then.html" target="_blank" rel="noopener noreferrer">fallbacks</a> exist) and some parts of Cypress&#39; API a bit <a href="https://docs.cypress.io/api/commands/its.html" target="_blank" rel="noopener noreferrer">bizarre</a>.</p><p><strong>tuiv</strong> instead relies on native Promises and Proxies, letting the test author write standard js.</p><h3 id="browser-support"><a class="header-anchor" href="#browser-support" aria-hidden="true">#</a> Browser Support</h3><p>Cypress just added Firefox support and still does not support Safari, which makes its use as a cross platform testing tool severely limited.</p><h3 id="assorted-nitpicks"><a class="header-anchor" href="#assorted-nitpicks" aria-hidden="true">#</a> Assorted Nitpicks</h3><p>From an outside perspective it looks like Cypress development is not fixing core problems but expanding into new use cases (with Cypress Studio for example).<br> Some long time problems I have while writing cypress tests are in no particular order:</p><ul><li>each test suite is a separate test run</li><li>no way to stop on error in interactive mode</li><li>iframes are complicated™</li><li>weird <code>should(&#39;have.class&#39;, &#39;myclass&#39;)</code> syntax</li><li>no window/tab support</li><li>some function names are… bad (<code>contains</code> and <code>focused</code> are queries for example, instead of checks, like the naming would suggest)</li></ul>',22);a.render=function(n,t,a,i,r,p){return s(),e("div",null,[o])};export default a;export{t as __pageData};
