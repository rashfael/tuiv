import{o as n,c as s,a}from"./app.76b8c738.js";const t='{"title":"Feature Overview","description":"","frontmatter":{},"headers":[{"level":2,"title":"Anatomy of a test suite","slug":"anatomy-of-a-test-suite"},{"level":3,"title":"Commands and Assertions","slug":"commands-and-assertions"},{"level":3,"title":"Test Runner","slug":"test-runner"},{"level":3,"title":"Fixtures","slug":"fixtures"}],"relativePath":"guide/features.md","lastUpdated":1624111877932}',e={},o=a('<h1 id="feature-overview"><a class="header-anchor" href="#feature-overview" aria-hidden="true">#</a> Feature Overview</h1><h2 id="anatomy-of-a-test-suite"><a class="header-anchor" href="#anatomy-of-a-test-suite" aria-hidden="true">#</a> Anatomy of a test suite</h2><p>This is what a test file in <strong>tuiv</strong> usually looks like:</p><div class="language-js"><pre><code><span class="token keyword">const</span> <span class="token punctuation">{</span> context <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;tuiv&#39;</span><span class="token punctuation">)</span>\n\n<span class="token keyword">const</span> fixtures <span class="token operator">=</span> context<span class="token punctuation">.</span><span class="token function">extend</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n\nfixtures<span class="token punctuation">.</span><span class="token function">someFixture</span><span class="token punctuation">(</span><span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> run</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n\t<span class="token keyword">await</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token string">&#39;image something real here&#39;</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n<span class="token keyword">const</span> <span class="token punctuation">{</span> describe<span class="token punctuation">,</span> it<span class="token punctuation">,</span> beforeEach <span class="token punctuation">}</span> <span class="token operator">=</span> fixtures<span class="token punctuation">.</span><span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n\n<span class="token function">describe</span><span class="token punctuation">(</span><span class="token string">&#39;tuiv docs&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span> <span class="token comment">// ← a test suite</span>\n\t<span class="token function">beforeEach</span><span class="token punctuation">(</span><span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> page <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span> <span class="token comment">// ← a hook executing before each test</span>\n\t\t<span class="token keyword">await</span> page<span class="token punctuation">.</span><span class="token function">goto</span><span class="token punctuation">(</span><span class="token string">&#39;https://tuiv.rash.codes/&#39;</span><span class="token punctuation">)</span>\n\t\t<span class="token comment">// this could also be a fixture</span>\n\t<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\t<span class="token function">it</span><span class="token punctuation">(</span><span class="token string">&#39;should exist&#39;</span><span class="token punctuation">,</span> <span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> page<span class="token punctuation">,</span> someFixture <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span> <span class="token comment">// ← a test</span>\n\t\t<span class="token keyword">await</span> page<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">&#39;#main-title&#39;</span><span class="token punctuation">)</span> <span class="token comment">// ← a command</span>\n\t\t\t<span class="token punctuation">.</span>should<span class="token punctuation">.</span>have<span class="token punctuation">.</span><span class="token function">text</span><span class="token punctuation">(</span><span class="token string">&#39;tuiv&#39;</span><span class="token punctuation">)</span> <span class="token comment">// ← an assertion</span>\n\t\t<span class="token keyword">await</span> page<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">&#39;.description&#39;</span><span class="token punctuation">)</span>\n\t\t\t<span class="token punctuation">.</span>should<span class="token punctuation">.</span>contain<span class="token punctuation">.</span><span class="token function">text</span><span class="token punctuation">(</span><span class="token string">&#39;browser testing based on playwright&#39;</span><span class="token punctuation">)</span>\n\t\t<span class="token keyword">const</span> gettingStartedButton <span class="token operator">=</span> page<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">&#39;&quot;Get Started&quot;&#39;</span><span class="token punctuation">)</span>\n\t\t<span class="token keyword">await</span> gettingStartedButton\n\t\t\t<span class="token punctuation">.</span>should<span class="token punctuation">.</span>have<span class="token punctuation">.</span><span class="token function">attr</span><span class="token punctuation">(</span><span class="token string">&#39;href&#39;</span><span class="token punctuation">)</span>\n\t\t\t<span class="token punctuation">.</span><span class="token function">equaling</span><span class="token punctuation">(</span><span class="token string">&#39;/guide/getting-started.html&#39;</span><span class="token punctuation">)</span>\n\t\t<span class="token keyword">await</span> gettingStartedButton\n\t\t\t<span class="token punctuation">.</span><span class="token function">click</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n\t\t<span class="token keyword">await</span> page<span class="token punctuation">.</span><span class="token function">evaluate</span><span class="token punctuation">(</span><span class="token string">&#39;location.href&#39;</span><span class="token punctuation">)</span>\n\t\t\t<span class="token punctuation">.</span>should<span class="token punctuation">.</span><span class="token function">equal</span><span class="token punctuation">(</span><span class="token string">&#39;https://tuiv.rash.codes/guide/getting-started.html&#39;</span><span class="token punctuation">)</span>\n\t\t<span class="token keyword">await</span> page<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">&#39;.non-existing&#39;</span><span class="token punctuation">)</span>\n\t\t\t<span class="token punctuation">.</span>should<span class="token punctuation">.</span>not<span class="token punctuation">.</span><span class="token function">exist</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n\t<span class="token punctuation">}</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre></div><p>You will probably want to distribute test suites across multiple files, and perhaps extract fixture definitions into even more files. To see how a slightly larger test setup might look, have a look at THIS EXAMPLE THAT&#39;S NOT READY YET.</p><p>tuiv provides to following parts to create tests for your webapp:</p><h3 id="commands-and-assertions"><a class="header-anchor" href="#commands-and-assertions" aria-hidden="true">#</a> Commands and Assertions</h3><p>The biggest parts of each of your browser tests are <strong>commands</strong>, controlling what the browser should do, and <strong>assertions</strong>, checking what the browser has done. Both <strong>commands</strong> and <strong>assertions</strong> are accessible via the promise chain and start with the <code>page</code> object.</p><div class="language-js"><pre><code><span class="token keyword">await</span> page<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">&#39;.selector&#39;</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">click</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">type</span><span class="token punctuation">(</span><span class="token string">&#39;text&#39;</span><span class="token punctuation">)</span><span class="token punctuation">.</span>should<span class="token punctuation">.</span>not<span class="token punctuation">.</span>have<span class="token punctuation">.</span><span class="token function">class</span><span class="token punctuation">(</span><span class="token string">&#39;empty&#39;</span><span class="token punctuation">)</span>\n          └──────────────────┬─────────────────┘└──────────────┬──────────────┘\n                         commands                          assertion\n</code></pre></div><p>To learn more about commands and assertions, see the <a href="/api/commands.html">commands</a> and <a href="/api/assertions.html">assertions</a> API docs.</p><p>For a deep dive about why proxies, promises and chains instead of the API provided by playwright, read <a href="/guide/proxied-promise-chain.html">Proxied Promise Chain</a></p><h3 id="test-runner"><a class="header-anchor" href="#test-runner" aria-hidden="true">#</a> Test Runner</h3><p>You can (and should) organize your browser commands and assertions into tests and test suites, which you can do in tuiv with a BDD-style syntax very similar to what <a href="https://jasmine.github.io/index.html" target="_blank" rel="noopener noreferrer">Jasmine</a> or <a href="https://mochajs.org/" target="_blank" rel="noopener noreferrer">Mocha</a> provide.</p><p>With <code>describe</code> you can define test suites. Suites can contain other suites, also defined with a nested <code>describe</code>, tests, and hooks.</p><p><code>it</code> defines a test (or more precisely called a &quot;spec&quot;, but who&#39;s counting) with fixtures as paramaters. Each test should be able to run independently of another.</p><p>Hooks allow you to share code between tests and prepare or clean up your testing environment. These hooks are available: <code>beforeAll</code>, <code>beforeEach</code>, <code>afterEach</code>, <code>afterAll</code>.</p><p>For more details on <code>describe</code>, <code>it</code> and other test runner features, see <a href="/api/test-runner.html">Test Runner API</a></p><h3 id="fixtures"><a class="header-anchor" href="#fixtures" aria-hidden="true">#</a> Fixtures</h3><p>While it&#39;s totally possible to create test envirments with only suites and hooks, tuiv provides another API to prepare pieces of modular test pre-conditions. Fixtures, inspired by <a href="https://docs.pytest.org/en/6.2.x/fixture.html#fixture" target="_blank" rel="noopener noreferrer">pytest</a> and <a href="https://github.com/microsoft/folio" target="_blank" rel="noopener noreferrer">folio</a>, focus setup and teardown of a test enviroment on smaller, sharable, and composable test parameters.</p><p>Fixtures are created by first extending a tuiv context.</p><div class="language-js"><pre><code><span class="token keyword">const</span> fixtures <span class="token operator">=</span> context<span class="token punctuation">.</span><span class="token function">extend</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n</code></pre></div><p>To create fixtures you then declare them onto the fixture object with a function-based api.</p><div class="language-js"><pre><code>fixtures<span class="token punctuation">.</span><span class="token function">aFixture</span><span class="token punctuation">(</span><span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> run</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n\t<span class="token comment">// setup here</span>\n\t<span class="token keyword">await</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token comment">/* pass your fixture to tests here */</span><span class="token punctuation">)</span>\n\t<span class="token comment">// teardown here</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre></div><p>And finally, finish fixture declaration by building a new context, which provides you with the bdd-style test runner API. Building the fixtures also checks if you have created any circular dependencies.</p><div class="language-js"><pre><code><span class="token keyword">const</span> <span class="token punctuation">{</span> describe<span class="token punctuation">,</span> it<span class="token punctuation">,</span> beforeEach <span class="token punctuation">}</span> <span class="token operator">=</span> fixtures<span class="token punctuation">.</span><span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n</code></pre></div><p>Fixtures can then be used in tests (and other fixtures) by object-destructuring the first argument passed to the test function.</p><div class="language-js"><pre><code><span class="token function">it</span><span class="token punctuation">(</span><span class="token string">&#39;should exist&#39;</span><span class="token punctuation">,</span> <span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> aFixture <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n\taFixture<span class="token punctuation">.</span><span class="token function">explode</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre></div><p>To learn more about fixtures, see the <a href="/api/fixtures.html">fixtures API docs</a>.</p>',28);e.render=function(a,t,e,p,c,u){return n(),s("div",null,[o])};export default e;export{t as __pageData};