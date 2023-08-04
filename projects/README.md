# Projects

Projects in [`/projects/`](../projects/) are independent, deployable applications. They stand completely separate from each other and must be able to be deployed independently (i.e. you can deploy _project1_ without deploying _project2_). If projects need code shared between them, that code belongs in [`/lib`](../lib/).

## Naming Conventions

The name should be all lowercase and use dashes instead of spaces. For example, a project named "My Project" would be named `my-project`, the names should reflect as simply as posisble what the project is.

If you only have one application app is acceptable but if you have more than one application you should really name them descriptively.
