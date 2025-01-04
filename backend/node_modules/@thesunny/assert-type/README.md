# AssertType

## Getting Started

```sh
yarn add @thesunny/assert-type
```

## Writing AssertType asserts

```ts
import { AssertType } from ".."

describe("AssertType", () => {
  describe("AssertType.Equal", () => {
    it("should check if two types are not equal", async () => {
      AssertType.NotEqual<0, 1>(true)
    })

    it("should check if two types are exactly equal", async () => {
      AssertType.Equal<88, 88>(true)
    })
  })

  describe("AssertType.Extends", () => {
    it("should check if a type cannot extend another", async () => {
      AssertType.NotExtends<number, 0>(true)
    })

    it("should check if a type can extend another", async () => {
      AssertType.Extends<0, number>(true)
    })
  })
})
```
