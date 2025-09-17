# NestJS Microservices

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


## Getting Started

```
1. Install dependencies
```
npm install
```
3. Launch app
```
docker compose up --build
```


## shared folder meaning

Since our project is created, nx has already created an `API Gateway` service application for us.

Services will use the same data type and it makes sense to create a shared library in our monorepo and avoid duplicating the same code all over the place with the following command:
```sh
nx g @nx/nest:lib shared
```
It will contain domains, dtos, some utils

Also we can add a path entry in the `tsconfig.base.json` and import them with absolute paths:

```json
{
  ...
  "compilerOptions": {
    ...
    "paths": {
      "@nestjs-microservices/shared": ["shared/src/index.ts"]
    }
  },
  ...
}
```

## Creating another service

To create more services use command:

```sh
nx g @nx/nest:app auth-service
```

