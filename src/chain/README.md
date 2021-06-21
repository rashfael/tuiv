# Design

A chain records operations of proxy `get`s and `apply`s.
A chain has two phases:

- collecting and validating: record the op when the proxy gets called and call the correct handler to validate the input. We need to validate input at this point to emit errors at the right place.
- executing: execute ops with the corresponding handlers and all collected information.

Previously, validation and execution was done in a single phase, but we have certain commands and assertions that influence earlier commands.
