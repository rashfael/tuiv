# Configuration

tuiv can be configured with a `tuiv.config.js` file in your project folder and supports the following settings.

## baseUrl

Used by `page.goto` to resolve urls without an origin/host.

## blocklist
An array of globby urls or regexes supported by [playwright's page.route](https://playwright.dev/docs/api/class-page#page-route).
To block a whole domain or more, use something like `'**/*googletagmanager.com/**'`.
