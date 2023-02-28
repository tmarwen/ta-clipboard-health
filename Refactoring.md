# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Your Explanation Here
- First I set the result `candidate` to the default result if no matching condition is met: `TRIVIAL_PARTITION_KEY`
- I then simplified the `partitionKey` presence handling by factoring up it existance validation within the same `if` statement.
- I continued with the `partitionKey` processing block to have the type validated and either serialized or not. Since within the remaining case where the `event` does not have a `partitionKey` available the result `candidate` will be hashed, I moved the result `candidate` length validation within the `partitionKey` handling block as this will be the only case where it will be executed.

Through such a process, I removed the redundant `event` check made the code more readable since the start where it reads:
- Take the default partition key as result
- If the event has a `partitionKey` then use its stringified version as result and make sure it is hashed if it exceeds the allowed key size
- If there is no `partitionKey` then the result will be a serialized and hashed form of the event
