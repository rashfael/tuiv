import{o as n,c as s,a}from"./app.383c3aaf.js";const t='{"title":"Getting Started","description":"","frontmatter":{},"headers":[{"level":2,"title":"Anatomy of a test suite","slug":"anatomy-of-a-test-suite"},{"level":3,"title":"Test Runner","slug":"test-runner"},{"level":3,"title":"Commands and Assertions","slug":"commands-and-assertions"}],"relativePath":"guide/getting-started.md","lastUpdated":1616166619665}',e={},o=a('<h1 id="getting-started"><a class="header-anchor" href="#getting-started" aria-hidden="true">#</a> Getting Started</h1><h2 id="anatomy-of-a-test-suite"><a class="header-anchor" href="#anatomy-of-a-test-suite" aria-hidden="true">#</a> Anatomy of a test suite</h2><p>This is what a test suite in <strong>tuiv</strong> usually looks like:</p><div class="language-js"><pre><code><span class="token function">describe</span><span class="token punctuation">(</span><span class="token string">&#39;checkout&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n\t<span class="token function">it</span><span class="token punctuation">(</span><span class="token string">&#39;should sucessfully checkout&#39;</span><span class="token punctuation">,</span> <span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> page <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n\t\t<span class="token keyword">await</span> page<span class="token punctuation">.</span><span class="token function">goto</span><span class="token punctuation">(</span><span class="token string">&#39;/&#39;</span><span class="token punctuation">)</span>\n\t\t<span class="token keyword">await</span> page<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">&#39;.some .selector&#39;</span><span class="token punctuation">)</span>\n\t\t\t<span class="token punctuation">.</span><span class="token function">click</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n\t\t\t<span class="token punctuation">.</span><span class="token function">type</span><span class="token punctuation">(</span><span class="token string">&#39;typing some text&#39;</span><span class="token punctuation">)</span>\n\t\t\t<span class="token punctuation">.</span>should<span class="token punctuation">.</span>not<span class="token punctuation">.</span>have<span class="token punctuation">.</span><span class="token function">class</span><span class="token punctuation">(</span><span class="token string">&#39;empty&#39;</span><span class="token punctuation">)</span>\n\t\t<span class="token keyword">await</span> page<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">&#39;.non-existing&#39;</span><span class="token punctuation">)</span><span class="token punctuation">.</span>should<span class="token punctuation">.</span>not<span class="token punctuation">.</span><span class="token function">exist</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n\t<span class="token punctuation">}</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre></div><h3 id="test-runner"><a class="header-anchor" href="#test-runner" aria-hidden="true">#</a> Test Runner</h3><p>With <code>describe</code> you can define test suites and their lifecycle. You can also nest <code>describe</code> calls.</p><p><code>it</code> defines a test with fixtures as paramaters. For more details on <code>describe</code>, <code>it</code> and other test runner features, have a look at the <a href="https://github.com/microsoft/folio" target="_blank" rel="noopener noreferrer">Folio Documentation</a>.</p><h3 id="commands-and-assertions"><a class="header-anchor" href="#commands-and-assertions" aria-hidden="true">#</a> Commands and Assertions</h3><p>The biggest parts of each of your browser tests are <strong>commands</strong>, controlling what the browser should do, and <strong>assertions</strong>, checking what the browser has done. Both <strong>commands</strong> and <strong>assertions</strong> are accessible via the promise chain and start with the <code>page</code> object.</p><div class="language-js"><pre><code><span class="token keyword">await</span> page<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">&#39;.selector&#39;</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">click</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">type</span><span class="token punctuation">(</span><span class="token string">&#39;text&#39;</span><span class="token punctuation">)</span><span class="token punctuation">.</span>should<span class="token punctuation">.</span>not<span class="token punctuation">.</span>have<span class="token punctuation">.</span><span class="token function">class</span><span class="token punctuation">(</span><span class="token string">&#39;empty&#39;</span><span class="token punctuation">)</span>\n          └──────────────────┬─────────────────┘└──────────────┬──────────────┘\n                         commands                          assertion\n</code></pre></div><p>To learn more about the promise chain, read <a href="/guide/proxied-promise-chain.html">Proxied Promise Chain</a></p>',11);e.render=function(a,t,e,p,c,i){return n(),s("div",null,[o])};export default e;export{t as __pageData};
