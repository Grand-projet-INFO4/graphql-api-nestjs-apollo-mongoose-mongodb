# Source code

This README attempts to describe everything related to the source code such as folder structure, naming convention, modularity, code design and organization, etc ...

## Table of content

In this readme, we are going to discuss the following topics:

1. Modules
2. Barrel export pattern
3. Schematics/Layers/Components
4. File naming
5. Folder structure

## Modules

Let's talk about **NestJS modules**. In a nutshell, modules in NestJS allow us to group pieces of code that we want to semantically put together in the same bucket as whole in order to enable depedency injections within a module's providers and also from other providers outside a module through its system of import/export.

In NestJS, it is considered a good practice to organize your code by module so that's why we try to gather pieces of codes together by module as much as possible in this codebase. Global modules are located at the root of the source code directory whereas API resources's modules are subfolders within the 'api' directory to keep things concise and contextualised.

## Barrel export pattern

The **barrel export pattern** is a way to export all ES modules inside a directory from within an single index.js/index.ts entry point file so that modules imports that go to the directory only refer to the directory name instead of having to having to refer to each individual file within the directory.

For example, let's say we have a directory named `myfolder` that has 2 files named `file1.ts` and `file2.ts`, and a file called `mycode.ts` that imports modules from the files within the both files inside the `myfolder` directory, then we would normally have the following code snippets:

```typescript
// myfolder/file1.ts

export function myFunction1() {
  // Code ...
}
```

```typescript
// myfolder/file2.ts

export function myFunction2() {
  // Code ...
}
```

```typescript
// mycode.ts

import { myFunction1 } from './myfolder/file1.ts';
import { myFunction2 } from './myfolder/file2.ts';

// Code ...
```

As we can see, the imports from the files within the `myfolder` diretory are spread accross multiple lines because the imports have to reference each file line by line.

However, if we applied the barrel export pattern to the `myfolder` dirtectory, then we would create another file called `index.ts` that would be the entry point for the imports from the `myfolder` directory and the code would be as follows:

```typescript
// myfolder/index.ts

export * from './file1.ts';
export * from './file2.ts';

// Code ...
```

```typescript
// mycode.ts

import { myFunction1, myFunction2 } from './myfolder';

// Code ...
```

As a result, the imports that go the `myfolder` now only reference the directory's name which elimninates the need for having to reference individually each file inside the directory. This can be very handy because we no longer have to worry about the updates made to the files' names and the exported items are now grouped as a single entity or unit.

The barrel export pattern is among the best practices in NestJS and we also use it a lot in this codebase as we will see.

**_Side note:_** The barrel export pattern could lead to issues if the exported items were exported using `export default`. Therefore, it's always recommended that exports in NestJS use the simple export `export /* item */` or `export { /* ...items */ }` syntax.

## Schematics/Layers/Components

Schematics, Layers and Components have each their own specific definitions but to make things simple, we will refer to these terms as the being same thing since they all share traits of being categories of code that have their own specific responsabilities in the codebase and the application as whole. Some examples of usually used ones are `Module`, `Controller`, `Resolver`, `Service`, `Decorator`, `DTO`, `Validator`, `Types`, `Constants`, `Helpers` and `Utils`.

### Module

What a NestJS module is has already been discussed earlier but the `Module` schematic discussed here refers to the actual typescript file that does the module definition within the module folder. Its naming convention is `<filename>.module.ts`. We do not have to necessarily manually create a module since the NestJS CLI already has a built-in command for that.

### Controller

A controller is responsible for the handling of the incoming requests and returning back the responses to the client. It is within controller that we assign the logic to run for specific HTTP methods and route segments. Its naming convention is `<filename>.controller.ts`. We do not have to necessarily manually create a controller since the NestJS CLI already has a built-in command for that.

### Resolver (only for GraphQL)

A resolver is pretty much the equivalent layer to a controller if you're using GraphQL. Resolvers are responsible of handling GraphQL queries and mutations as well as resolving how to return the field's values after these operations. Its naming convention is `<filename>.resolver.ts`. We do not have to necessarily manually create a resolver since the NestJS CLI already has a built-in command for that.

### Service

A service is responsible for encapsulating the actual business logic of the application inside methods especially CRUD operations to the database. Services are then invoked by controllers or resolvers if you're using GraphQL. Database interaction layers such as database drivers or ORMs are generally used within the services. A service may also import and use other services from other modules. Its naming convention is `<filename>.service.ts`. We do not have to necessarily manually create a service since the NestJS CLI already has a built-in command for that.

### Decorator

Although NestJS and its ecosystem already provides some already built-in typescript decorators, sometimes we need to create our own custom decorators that fit our need sin some specific use cases. Custom decorators can be class decorators, property decorators or compound decorators. These are generally grouped inside a `decorator`/`decorators` folder and exported using the **_barrel export pattern_**. Its naming convention is `<filename>.decorator.ts`.

### Data Transfer Object a.k.a DTO

DTOs are classes that design the shape of the payload data that mutations operations such as CREATE or UPDATE take as inputs and apply validation criterias into their properties using the `class-validator` package and NestJS's pipe system. For standard web applications like REST APIs, DTOs are extracted from the request's body whereas for GraphQL applications, DTOs are the input types defined in the graphql schemas and are extracted from the operations' arguments. Its naming convention is `<filename>.dto.ts`.

### Validator

Validators are custom validation rules that we the `class-validator`'s `Validate` decorator can take as arguments in order to provide custom validation to our DTO's fields. These are generally grouped inside a `validator`/`validators` folder and exported using the **_barrel export pattern_**. Its naming convention is `<filename>.validator.ts`.

### Types

Types refers to custom typescript type definitions files that we write manually. Its naming convention is `<filename>.d.ts`.

### Constants

Constants are files that contains values that remains constant accross the entire application. Examples of values stored inside constants are cookies' key. Its naming convention is `<filename>.constants.ts`.

### Helpers

Helpers are a set of exported helper functions that **are based on the infrastructure, the framework and the environment that the application is running on**. Helpers can be some long lines of code that we want to isolate into methods for the sake of readability or they can also be some reusable codes that are used accross different parts of the codebase. These are generally grouped inside a `helpers` folder and **are not exported using the** **_barrel export pattern_** as it is preferable to not create export conflicts by using that pattern. Its naming convention is `<filename>.helper.ts`.

### Utilities a.k.a Utils

Utilities are quite similar to helpers except they **are not based on the environment nor the framework the application is running on**. It means that no matter the framework and no matter the environment, be it on the server or on the client, utilities should be able to run. Utilities are generally those utility functions that we write to manipulate dates, arrays or strings that libraries like `lodash` or `moment` basically provide. These are generally grouped inside a `utils` folder and **are not exported using the** **_barrel export pattern_** as it is preferable to not create export conflicts by using that pattern. Its naming convention is `<filename>.utils.ts`.

## File naming

With NestJS, it is common practice to use **singular** nouns instead of plurals with modules. That's why in this codebase, file names and folder names related to modules will also use singular names.
For example, let's say we have a module dedicated for the users features for our API, then the name of the module's folder would be `user` and each filename and each schematic related folder inside that module would also adopt that singular naming. In such a case, we would have files named as `user.module.ts`, `user.controller.ts`, etc and folders named as `guard`, `decorator`, `dto`, etc for instance.
Folders within the `common` directory (that we are going to discuss in the next chapter) are **_exception to this rule_** though since their names are **pluralized** like `decorators`, `types` or `utils` for example.

File names are also very contextualised according to their schematics in NestJS using the `<filename>.<schematic>.ts` naming convetion as we have seen so far throughout in this documentation. We will use that convention for typescript files wherever we can in this codebase.

One more thing, for multi-word filenames, we will use the **kebab-case** naming convention in order to concat words together over the others such as the **_camelCase_**, **_PascalCase_** or **_snake_case_** convetions since it is widely used for file naming in codebases and we also want to avoid having to deal with case-sensitiveness related problems. For example, for a property decorator that validates a field value as unique, we could named it as `is-unique.decorator.ts`.

## Folder structure

As far as the folder structure of the source code is concerned, **global modules** or any kind of **global configurations** are located at the root of the `src` directory whereas modules exclusively dedicated to API resources are all placed within the `api` directory.

At the root of the `src` directory are also grouped together commonly used schematics inside the `common` directory.
