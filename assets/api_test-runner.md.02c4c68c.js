import{o as n,c as t,a as e}from"./app.5358fee8.js";const a='{"title":"Test Runner API","description":"","frontmatter":{},"headers":[{"level":2,"title":"tuiv","slug":"tuiv"},{"level":3,"title":"tuiv.context","slug":"tuiv-context"},{"level":3,"title":"tuiv.wrap","slug":"tuiv-wrap"},{"level":2,"title":"Context","slug":"context"},{"level":3,"title":"context.extend()","slug":"context-extend"},{"level":3,"title":"context.describe\\\\[.only]\\\\.skip","slug":"context-describe-only-skip-title-suitefunction"},{"level":3,"title":"context\\\\.it\\\\[.only]\\\\.skip","slug":"context-it-only-skip-title-testfunction"},{"level":3,"title":"context.beforeEach(hookFunction)","slug":"context-beforeeach-hookfunction"},{"level":3,"title":"context.afterEach(hookFunction)","slug":"context-aftereach-hookfunction"},{"level":3,"title":"context.beforeAll(hookFunction)","slug":"context-beforeall-hookfunction"},{"level":3,"title":"context.afterAll(hookFunction)","slug":"context-afterall-hookfunction"},{"level":2,"title":"FixtureBuilder","slug":"fixturebuilder"},{"level":3,"title":"Adding fixtures","slug":"adding-fixtures"},{"level":3,"title":"fixtures.FIXTURE_NAME(fixtureSetupFunction[, options])","slug":"fixtures-fixture-name-fixturesetupfunction-options"},{"level":3,"title":"fixtures.build()","slug":"fixtures-build"}],"relativePath":"api/test-runner.md","lastUpdated":1628106605252}',s={},o=e('<h1 id="test-runner-api"><a class="header-anchor" href="#test-runner-api" aria-hidden="true">#</a> Test Runner API</h1><h2 id="tuiv"><a class="header-anchor" href="#tuiv" aria-hidden="true">#</a> tuiv</h2><p>If you don&#39;t need to add your own fixtures, tuiv lets you import the BDD setup functions with the default fixtures loaded directly from the module.</p><div class="language-js"><pre><code><span class="token keyword">const</span> <span class="token punctuation">{</span>\n\tdescribe<span class="token punctuation">,</span>\n\tit<span class="token punctuation">,</span>\n\tbeforeEach<span class="token punctuation">,</span>\n\tbeforeAll<span class="token punctuation">,</span>\n\tafterEach<span class="token punctuation">,</span>\n\tafterAll\n<span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;tuiv&#39;</span><span class="token punctuation">)</span>\n\n<span class="token function">describe</span><span class="token punctuation">(</span><span class="token string">&#39;A test suite&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n\t<span class="token function">it</span><span class="token punctuation">(</span><span class="token string">&#39;should run a test&#39;</span><span class="token punctuation">,</span> <span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span>page<span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n\t\t<span class="token comment">// test here</span>\n\t<span class="token punctuation">}</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre></div><p>If you want own fixtures, you need to extend the default context and build your own.</p><div class="language-js"><pre><code><span class="token keyword">const</span> <span class="token punctuation">{</span> context <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;tuiv&#39;</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> fixtures <span class="token operator">=</span> context<span class="token punctuation">.</span><span class="token function">extend</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n\nfixtures<span class="token punctuation">.</span><span class="token function">myFixture</span><span class="token punctuation">(</span><span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> run</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n\t<span class="token keyword">await</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token comment">/* your fixture here*/</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n<span class="token keyword">const</span> <span class="token punctuation">{</span>\n\tdescribe<span class="token punctuation">,</span>\n\tit<span class="token punctuation">,</span>\n\tbeforeEach<span class="token punctuation">,</span>\n\tbeforeAll<span class="token punctuation">,</span>\n\tafterEach<span class="token punctuation">,</span>\n\tafterAll\n<span class="token punctuation">}</span> <span class="token operator">=</span> fixtures<span class="token punctuation">.</span><span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n</code></pre></div><h3 id="tuiv-context"><a class="header-anchor" href="#tuiv-context" aria-hidden="true">#</a> tuiv.context</h3><p>The default <a href="#Context">Context</a> with <a href="/api/fixtures.html">built-in fixtures included</a>.</p><h3 id="tuiv-wrap"><a class="header-anchor" href="#tuiv-wrap" aria-hidden="true">#</a> tuiv.wrap</h3><div class="language-js"><pre><code><span class="token keyword">const</span> <span class="token punctuation">{</span> wrap <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;tuiv&#39;</span><span class="token punctuation">)</span>\n<span class="token keyword">await</span> <span class="token function">wrap</span><span class="token punctuation">(</span><span class="token punctuation">{</span>anything<span class="token operator">:</span> <span class="token number">3</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span>anything<span class="token punctuation">.</span>should<span class="token punctuation">.</span><span class="token function">equal</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">)</span>\n</code></pre></div><p><code>wrap</code> takes any value or object and lets you run <a href="/api/commands.html">commands</a> and <a href="/api/assertions.html">assertions</a> off of it.</p><h2 id="context"><a class="header-anchor" href="#context" aria-hidden="true">#</a> Context</h2><p>Tuiv contexts provide access to BDD setup functions.<br> New contexts can be created from any context by expanding it with additional fixtures.</p><h3 id="context-extend"><a class="header-anchor" href="#context-extend" aria-hidden="true">#</a> context.extend()</h3><p>returns a new <a href="#FixtureBuilder">FixtureBuilder</a> based on the current context. Inherits all fixtures of the current context.</p><h3 id="context-describe-only-skip-title-suitefunction"><a class="header-anchor" href="#context-describe-only-skip-title-suitefunction" aria-hidden="true">#</a> context.describe[.only][.skip](title, suiteFunction)</h3><ul><li><code>title</code> <em>&lt;string&gt;</em> suite title</li><li><code>suiteFunction</code> <em>&lt;function&gt;</em> immediately called function. All other BDD setup functions called inside this function are added to the described suite.</li></ul><p>Defines a test suite which can hold tests, hooks and other suites.<br> Can be modified with the modifiers <code>only</code> and <code>skip</code>.</p><h3 id="context-it-only-skip-title-testfunction"><a class="header-anchor" href="#context-it-only-skip-title-testfunction" aria-hidden="true">#</a> context.it[.only][.skip](title, testFunction)</h3><ul><li><code>testFunction</code> <em>&lt;async function(Fixtures)&gt;</em><ul><li><code>Fixtures</code> <em>&lt;destructured object&gt;</em> fixtures used by this test. Must be a <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment" target="_blank" rel="noopener noreferrer">destructured</a> object.</li></ul></li></ul><h3 id="context-beforeeach-hookfunction"><a class="header-anchor" href="#context-beforeeach-hookfunction" aria-hidden="true">#</a> context.beforeEach(hookFunction)</h3><h3 id="context-aftereach-hookfunction"><a class="header-anchor" href="#context-aftereach-hookfunction" aria-hidden="true">#</a> context.afterEach(hookFunction)</h3><h3 id="context-beforeall-hookfunction"><a class="header-anchor" href="#context-beforeall-hookfunction" aria-hidden="true">#</a> context.beforeAll(hookFunction)</h3><h3 id="context-afterall-hookfunction"><a class="header-anchor" href="#context-afterall-hookfunction" aria-hidden="true">#</a> context.afterAll(hookFunction)</h3><ul><li><code>hookFunction</code> <em>&lt;async function(Fixtures)&gt;</em><ul><li><code>Fixtures</code> <em>&lt;destructured object&gt;</em> fixtures used by this hook. Must be a <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment" target="_blank" rel="noopener noreferrer">destructured</a> object.</li></ul></li></ul><h2 id="fixturebuilder"><a class="header-anchor" href="#fixturebuilder" aria-hidden="true">#</a> FixtureBuilder</h2><h3 id="adding-fixtures"><a class="header-anchor" href="#adding-fixtures" aria-hidden="true">#</a> Adding fixtures</h3><div class="language-js"><pre><code><span class="token keyword">const</span> fixtures <span class="token operator">=</span> context<span class="token punctuation">.</span><span class="token function">extend</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n\nfixtures<span class="token punctuation">.</span><span class="token function">myFixture</span><span class="token punctuation">(</span><span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> otherFixture <span class="token punctuation">}</span><span class="token punctuation">,</span> run</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n\t<span class="token comment">// fixture setup</span>\n\t<span class="token keyword">const</span> myFixture <span class="token operator">=</span> <span class="token keyword">await</span> otherFixture<span class="token punctuation">.</span><span class="token function">something</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n\t<span class="token comment">// hand over fixture to test and run</span>\n\t<span class="token keyword">await</span> <span class="token function">run</span><span class="token punctuation">(</span>myFixture<span class="token punctuation">)</span>\n\t<span class="token comment">// fixture teardown</span>\n\tmyFixture<span class="token punctuation">.</span><span class="token function">teardown</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n<span class="token keyword">const</span> newContext <span class="token operator">=</span> fixtures<span class="token punctuation">.</span><span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n</code></pre></div><h3 id="fixtures-fixture-name-fixturesetupfunction-options"><a class="header-anchor" href="#fixtures-fixture-name-fixturesetupfunction-options" aria-hidden="true">#</a> fixtures.<em>FIXTURE_NAME</em>(fixtureSetupFunction[, options])</h3><ul><li><code>fixtureSetupFunction</code> <em>&lt;async function(Fixtures, runCallback)&gt;</em><ul><li><code>Fixtures</code> <em>&lt;destructured object&gt;</em> other fixtures used by this fixture. Must be a <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment" target="_blank" rel="noopener noreferrer">destructured</a> object, just like fixture loading in test definitions.</li><li><code>runCallback</code> <em>&lt;async function(any)&gt;</em> await this callback with your fixture as the parameter after you have finished setting up your fixture. After this callback has returned, teardown your fixture if needed.</li></ul></li><li><code>options</code> <em>&lt;object&gt;</em><ul><li><code>scope</code> <em>&lt;&quot;test&quot;|&quot;worker&quot;&gt;</em> Specifies the scope of the fixture. <code>test</code>-scoped fixtures are setup and torn down before and after each test. <code>worker</code>-scoped fixtures are setup on first use and torn down when a worker has finished all tests. Defaults to <code>test</code>.</li></ul></li></ul><p>Adds a fixture with <em>FIXTURE_NAME</em> as name to the builder.<br> You can override fixtures by re-declaring the same <em>FIXTURE_NAME</em> and access the previous fixture by loading it as a dependent fixture.</p><h3 id="fixtures-build"><a class="header-anchor" href="#fixtures-build" aria-hidden="true">#</a> fixtures.build()</h3><p>Resolves all added fixtures. Throws an error if any cyclical dependencies are found or returns a new <a href="#Context">Context</a>.</p>',33);s.render=function(e,a,s,c,i,u){return n(),t("div",null,[o])};export default s;export{a as __pageData};
