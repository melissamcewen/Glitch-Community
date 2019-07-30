# CI Configuration

~community is using CircleCI to run our tests now that we've added tools like Cypress and Percy in addition to our lint checking.

Our workflow is set up in multiple steps to allow tests to run in parallel when possible, and to fail early when things like linting errors are detected.

1. `lint` - This will lint the server, shared, and client files and if it fails, no other steps will run.
1. `cypress/install` - This installs cypress in a way that lets other steps share it. See (a reference) for more information.
1. `cypress/run` - If linting and cypress/install succeed, we will run `integration`, `accessibility`, and `visual` tests in parallel. These all use cypress, but are separated by context.
