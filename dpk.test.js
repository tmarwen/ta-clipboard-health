const crypto = require('crypto');
const { deterministicPartitionKey } = require("./dpk");

describe("deterministicPartitionKey", () => {

  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it("It returns the provided partition key if it exists and is a string", () => {
    const partitionKey = 'some-key';
    const trivialKey = deterministicPartitionKey({ partitionKey });
    expect(trivialKey).toBe(partitionKey);
  });

  it("It strigifies and returns the provided partition key if it exists and is not a string", () => {
    const partitionKey = { data: 'some-data' };
    const trivialKey = deterministicPartitionKey({ partitionKey });
    expect(trivialKey).toBe(JSON.stringify({ data: 'some-data' }));
  });

  it("It hashes and returns the event data if no partition key is defined", () => {
    const data = 'some-data';
    const trivialKey = deterministicPartitionKey({ data });
    expect(trivialKey).toBe(crypto.createHash("sha3-512").update(JSON.stringify({data})).digest("hex"));
  });

  it("It hashes and returns the partition key if it is longer than allowed length", () => {
    const partitionKey = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;
    const trivialKey = deterministicPartitionKey({ partitionKey });
    expect(trivialKey).toBe('c990d245d6c2485b4e7a8b86094cdc266e790a560e7ed3aa1ad8897f986b52b0e14c60d2da8bb103731c72d21b5b874864fca1afd451f9c752f52bdc7b905fc6');
  });
});
