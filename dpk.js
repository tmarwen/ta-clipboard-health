const crypto = require("crypto");

exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;
  
  // Set to trivial key first
  let candidate = TRIVIAL_PARTITION_KEY;

  if (event && event.partitionKey) { // If the event has already a partition key, use its stringified form
    if (typeof event.partitionKey === "string") {
      candidate = event.partitionKey;
    } else {
      candidate = JSON.stringify(event.partitionKey);
    }
    if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
      candidate = crypto.createHash("sha3-512").update(candidate).digest("hex");
    }
  } else if (event) { // Otherwise use the serialized event as data
    const data = JSON.stringify(event);
    candidate = crypto.createHash("sha3-512").update(data).digest("hex");
  }

  return candidate;
};