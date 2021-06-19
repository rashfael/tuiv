import{o as n,c as s,a}from"./app.76b8c738.js";const t='{"title":"Home","description":"","frontmatter":{"home":true,"heroText":"tuiv","tagline":"end-to-end browser testing based on playwright","actionText":"Get Started","actionLink":"/guide/getting-started"},"relativePath":"index.md","lastUpdated":1624110300319}',p={},e=a('<h1 id="tuiv-enables-you-to-write-tests-like-this"><a class="header-anchor" href="#tuiv-enables-you-to-write-tests-like-this" aria-hidden="true">#</a> tuiv enables you to write tests like this:</h1><div class="language-js"><pre><code><span class="token function">describe</span><span class="token punctuation">(</span><span class="token string">&#39;checkout&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n\t<span class="token function">it</span><span class="token punctuation">(</span><span class="token string">&#39;should sucessfully checkout&#39;</span><span class="token punctuation">,</span> <span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> page <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n\t\t<span class="token keyword">await</span> page<span class="token punctuation">.</span><span class="token function">goto</span><span class="token punctuation">(</span><span class="token string">&#39;/&#39;</span><span class="token punctuation">)</span>\n\t\t<span class="token keyword">await</span> page<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">&#39;.some .selector&#39;</span><span class="token punctuation">)</span>\n\t\t\t<span class="token punctuation">.</span><span class="token function">click</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n\t\t\t<span class="token punctuation">.</span><span class="token function">type</span><span class="token punctuation">(</span><span class="token string">&#39;typing some text&#39;</span><span class="token punctuation">)</span>\n\t\t\t<span class="token punctuation">.</span>should<span class="token punctuation">.</span>not<span class="token punctuation">.</span>have<span class="token punctuation">.</span><span class="token function">class</span><span class="token punctuation">(</span><span class="token string">&#39;empty&#39;</span><span class="token punctuation">)</span>\n\t\t<span class="token keyword">await</span> page<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">&#39;.non-existing&#39;</span><span class="token punctuation">)</span><span class="token punctuation">.</span>should<span class="token punctuation">.</span>not<span class="token punctuation">.</span><span class="token function">exist</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n\t<span class="token punctuation">}</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre></div><p>tuiv aims to:</p><ul><li>provide a chaining command and assertion syntax based on native async/await</li><li>use modern browser automation for all browsers via <a href="https://playwright.dev/" target="_blank" rel="noopener noreferrer">playwright</a></li><li>auto-retry everything</li><li>be a fixture based test runner</li></ul><p>tuiv achieves this with <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy" target="_blank" rel="noopener noreferrer">proxies</a>. Lots and lots of proxies.</p>',5);p.render=function(a,t,p,o,c,i){return n(),s("div",null,[e])};export default p;export{t as __pageData};
