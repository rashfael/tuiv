import{o as s,c as n,a}from"./app.76b8c738.js";const t='{"title":"Getting Started","description":"","frontmatter":{},"headers":[{"level":2,"title":"Installation","slug":"installation"},{"level":2,"title":"Create your first test","slug":"create-your-first-test"},{"level":2,"title":"Run tests","slug":"run-tests"}],"relativePath":"guide/getting-started.md","lastUpdated":1624109180601}',e={},p=a('<h1 id="getting-started"><a class="header-anchor" href="#getting-started" aria-hidden="true">#</a> Getting Started</h1><h2 id="installation"><a class="header-anchor" href="#installation" aria-hidden="true">#</a> Installation</h2><p>Install tuiv with npm or yarn. This will download and install playwright, which has some <a href="https://playwright.dev/docs/intro/#system-requirements" target="_blank" rel="noopener noreferrer">System Requirements</a>.</p><div class="language-bash"><pre><code><span class="token function">npm</span> <span class="token function">install</span> --save-dev tuiv\n</code></pre></div><h2 id="create-your-first-test"><a class="header-anchor" href="#create-your-first-test" aria-hidden="true">#</a> Create your first test</h2><p>Create a test file (usually in a separate folder for tests).</p><h4 id="tests-my-first-test-js"><a class="header-anchor" href="#tests-my-first-test-js" aria-hidden="true">#</a> tests/my-first.test.js</h4><div class="language-js"><pre><code><span class="token keyword">const</span> <span class="token punctuation">{</span> describe<span class="token punctuation">,</span> it <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;tuiv&#39;</span><span class="token punctuation">)</span>\n\n<span class="token function">describe</span><span class="token punctuation">(</span><span class="token string">&#39;a thing&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n\t<span class="token function">it</span><span class="token punctuation">(</span><span class="token string">&#39;should work&#39;</span><span class="token punctuation">,</span> <span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> page <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n\t\t<span class="token keyword">await</span> page<span class="token punctuation">.</span><span class="token function">goto</span><span class="token punctuation">(</span><span class="token string">&#39;/&#39;</span><span class="token punctuation">)</span>\n\t\t<span class="token comment">// commands and assertions go here</span>\n\t<span class="token punctuation">}</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre></div><h2 id="run-tests"><a class="header-anchor" href="#run-tests" aria-hidden="true">#</a> Run tests</h2><p>tuiv provides a cli, which you can run with <code>npx</code>.</p><div class="language-bash"><pre><code>npx tuiv run tests/*.test.js\n</code></pre></div><p>To learn more about how to test your webapp with tuiv, continue on to <a href="/guide/features.html">Feature Overview</a></p>',12);e.render=function(a,t,e,o,i,r){return s(),n("div",null,[p])};export default e;export{t as __pageData};
