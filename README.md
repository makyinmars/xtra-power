## Xtra-Power App Created with [T3-Stack](https://create.t3.gg/)

### App Created for TDD Learning Purposes for `CSC 678: Software Testing`

Check `/src/test/` to learn more about TDD specifically using tRPC and Jest integration.

### Test Run

#### Run All Tests

```bash
yarn test:unit
```

#### Single Test File (ex: user.test.ts)

```bash
yarn test:unit user.test.ts
```

#### Single Test Function (ex: `Get user by email` is inside user.test.ts)

[Jest Docs --testNamePatern=<regex>](https://jestjs.io/docs/cli#--testnamepatternregex)

```bash
yarn test:unit user.test.ts -t=Get
```
