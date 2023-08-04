# Monorepo

A practical monorepo (with a React app using Vite, Yarn, TS, and Storybook) template

- [`/lib`](./lib/) - Libraries that are shared by projects
- [`/projects`](./projects/) - Deployable projects (APIs, UIs, apps)
- [`/tools`](./tools/) - Internal tools

## Getting Started

Clone this repo

```sh
git clone ${URL} ${REPO_NAME}
cd ${REPO_NAME}
```

Install the dependencies

```sh
cd projects/${PROJECT_NAME}
yarn
```

Start the project

```sh
yarn dev
```
