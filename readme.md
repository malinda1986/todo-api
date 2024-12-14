<div id="top"></div>

<!--
** Inspired by the Best-README-Template.
** Let's create something AMAZING! :D

** GitLab Flavored Markdown - https://gitlab.com/gitlab-org/gitlab/-/blob/master/doc/user/markdown.md

PROJECT SHIELDS
** https://shields.io/
-->

<div align="center">
  <h1>TODO API</h1>
</div>

[[_TOC_]]

## 📍 About The Project

`todo-api` sample rest full api written with nodejs (using ExpressJs).

```
/todo-api
|-- src
|   |-- config
|   |-- adapters
|   |   |-- inbound
|   |   `-- outbound
|   |-- infrastructure
|   |   |-- database
|   |   |-- file-storage
|   |-- application
|   |   |-- use-cases
|   |   |-- validators
|   |-- di
|   |-- domains
|   |   |-- models
|   `-- index.js
|-- tests
|   |-- integration
|   `-- unit
|-- .env
|-- .gitignore
|-- package.json
|-- README.md

```

### 🧑‍💻 Ownership

> Email: [malindar11@gmail.com](mailto:malindar11@gmail.com) <br/>

### Tags

`rest-full` `todo` `hexagonal architecture` `SOLID principal` `clean code` `IOC` `DynamoDB` `Inversify`

<!-- DEPENDENCIES
** Include dependencies on other services (internal or external)
-->

### Dependencies

- Node 22.10.0
- ExpressJs
- Inversify
- zod
- vitest
- swagger
- winston

<div align="right">
  <p>(<a href="#top">back to top</a>)</p>
</div>

<!-- GETTING STARTED
** Include any instructions that would be useful
    to get this project up and running
    as well as info about troubleshooting known issues
-->

## 🚀 Getting Started

### Installation

1. Clone the repo
2. Install NPM packages
   ```sh
   npm install and npm run dev
   ```
3. Set environment variables by adding your own .env file to the root of this repository:

   ```
   # .env
    copy sample.env -> .env
   ```

4. Provision resources
   ```
   //create tables and s3
   node scripts/setup-aws.js
   ```
   ```
   set ttl
   node scripts/ttl.js
   ```
5. Testing

   ```
    Unit testing
    npm run test:unit
   ```

   ```
    Integration testing
    npm run test:integration
   ```

6. API doc - api doc is available under (http://localhost:3008/api-docs/#/)

### Additional Information

- InversifyJS - InversifyJS is a lightweight and flexible Inversion of Control (IoC) container. It allows for efficient dependency injection, making it easier to manage complex dependencies and improve code testability
- Zod - Zod is a TypeScript-first schema declaration and validation library. It is designed to be a minimalistic and highly composable tool that can be used for validating and parsing data within JavaScript/TypeScript applications. Zod's API allows defining schemas to ensure that incoming data matches expected types, providing a clear structure for data validation and parsing.
- Hexagonal Architecture - software architecture pattern that emphasizes separation of concerns by decoupling the core logic from external components like databases, APIs, and user interfaces.

### Notes

- Deployment is not completed, facing some issues with resource provisioning
- Not all routes added to the api doc
- Error message can be improve further with proper details, currently it sends as zod error

   <div align="right">
     <p>(<a href="#top">back to top</a>)</p>
   </div>

### Questions

- Discuss options for deploying the application in a serverless architecture (e.g., AWS Lambda with API Gateway) in the README.
  > How to deploy with Lambda:
- Write Lambda function: Create the function that processes incoming requests. For example, if you have a RESTful API for a todo application, each endpoint (GET, POST, etc.) can be its own Lambda function.
- Package function: The Lambda function can be packaged as a zip file, or can use frameworks like the Serverless Framework or AWS SAM to deploy the function.
- Deploy to Lambda: Once packaged, deploy the function using AWS CLI, Serverless Framework, or AWS SAM.
  > API Gateway:
- API Gateway acts as a front-end to Lambda function, routing HTTP requests to the appropriate Lambda function. It acts as a fully managed API Gateway that enables to expose RESTful APIs to the outside.
  > Considerations for Serverless Applications:
- Cold Starts: When a Lambda function is invoked after a period of inactivity, there may be a delay known as a "cold start." This can be mitigated with strategies like keeping Lambda warm or using provisioned concurrency (for critical applications).
- Logging and Monitoring: AWS CloudWatch can be used for logging Lambda function executions and API Gateway logs.
- Security: Use AWS IAM roles and policies to control access to Lambda functions, API Gateway, and other resources.

   <div align="right">
     <p>(<a href="#top">back to top</a>)</p>
   </div>
