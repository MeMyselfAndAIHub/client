export const DAY_NUMBERS = {
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
  7: "Sun",
};

export const DAY_BACKGROUNDS = {
  1: "#BEF436",
  2: "#36B2F4",
  3: "#F4368F",
  4: "#F46936",
  5: "#1BCC21",
  6: "#FF9C9C",
  7: "#D509EB",
};

export const ALL_DAYS = [1, 2, 3, 4, 5, 6, 7];

export const ROUTINE_IMPORTANCE = {
  1: "#F44336",
  2: "#F4368F",
  3: "#36F4B8",
  4: "#F4E136 ",
  5: "#87D0FF",
};

export const IMPORTANCE_LEVELS = {
  5: "Not So Important",
  4: "Quite Important",
  3: "Important",
  2: "Very Important",
  1: "Extremely Important",
};

export const IMPORTANCE_ARRAY = [1, 2, 3, 4, 5];

export const SIGNING_KEY_FILE_TYPE = "SigningKey";

export const MEMORY_FILE_TYPE = "Memory";

export const hexStringToArrayBuffer = (hexString: string) => {
  const hexWithoutPrefix = hexString.startsWith("0x")
    ? hexString.slice(2)
    : hexString;
  const bytes = new Uint8Array(Math.ceil(hexWithoutPrefix.length / 2));

  for (let i = 0; i < bytes.length; i++) {
    const hexByte = hexWithoutPrefix.substr(i * 2, 2);
    bytes[i] = parseInt(hexByte, 16);
  }

  return bytes.buffer;
};

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

export const CAN_DECRYPT_FUNCTION_ABI = {
  inputs: [
    { name: "iris_id", type: "uint256" },
    { name: "user", type: "address" },
  ],
  name: "can_decrypt",
  outputs: [{ name: "", type: "bool" }],
  stateMutability: "view",
  type: "function",
};

type feedProcessType = {
  [key: string]: any;
};

export const FEED_IRIS_PROCESSES: feedProcessType = {
  1: "Getting Your Previous Memory...",
  2: "Combining With Your New Memory...",
  3: "Ahan...",
  4: "Your Thoughts Are Unique....",
  5: "Finalizing....",
  6: "Updated!",
};
