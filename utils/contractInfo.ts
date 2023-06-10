export const CONTRACT_ADDRESS = "0xc4787aA24E51a22f92910F97320aA98e167c7695";

export const CONTRACT_ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "user", type: "address" },
      {
        components: [
          { name: "total_tabs_amount", type: "uint256" },
          { name: "days", type: "uint256[]" },
          { name: "name", type: "string" },
          { name: "dosage", type: "uint256[]" },
          { name: "desc", type: "string" },
        ],
        indexed: false,
        name: "med",
        type: "tuple",
      },
      { indexed: false, name: "reminder_id", type: "uint256" },
    ],
    name: "Medication_Created",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "user", type: "address" },
      {
        components: [
          { name: "days", type: "uint256[]" },
          { name: "importance", type: "uint256" },
          { name: "routine_description", type: "string" },
        ],
        indexed: false,
        name: "daily_routine",
        type: "tuple",
      },
      { indexed: false, name: "reminder_id", type: "uint256" },
    ],
    name: "Daily_Routine_Created",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "user", type: "address" },
      {
        components: [
          { name: "days", type: "uint256[]" },
          { name: "importance", type: "uint256" },
          { name: "location", type: "string" },
          { name: "appointment_desc", type: "string" },
        ],
        indexed: false,
        name: "appoitment",
        type: "tuple",
      },
      { indexed: false, name: "reminder_id", type: "uint256" },
    ],
    name: "Appointment_Created",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "user", type: "address" },
      { indexed: false, name: "user_tag_id", type: "uint256" },
      {
        components: [
          { name: "name", type: "string" },
          { name: "summary", type: "string" },
          { name: "importance", type: "uint256" },
        ],
        indexed: false,
        name: "tag",
        type: "tuple",
      },
    ],
    name: "Tag_Created",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "user", type: "address" },
      { indexed: false, name: "reminder_id", type: "uint256" },
    ],
    name: "Medication_Deleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "user", type: "address" },
      { indexed: false, name: "reminder_id", type: "uint256" },
    ],
    name: "Daily_Routine_Deleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "user", type: "address" },
      { indexed: false, name: "reminder_id", type: "uint256" },
    ],
    name: "Appointment_Deleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "user", type: "address" },
      { indexed: false, name: "time", type: "uint256" },
      { indexed: false, name: "username", type: "string" },
    ],
    name: "Daily_Reminder_Pushed",
    type: "event",
  },
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    inputs: [
      { name: "username", type: "string" },
      { name: "aid", type: "address" },
      { name: "w3MemoryName", type: "string" },
      { name: "signing_key_cid", type: "string" },
    ],
    name: "create_account",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "user", type: "address" },
      {
        components: [
          { name: "total_tabs_amount", type: "uint256" },
          { name: "days", type: "uint256[]" },
          { name: "name", type: "string" },
          { name: "dosage", type: "uint256[]" },
          { name: "desc", type: "string" },
        ],
        name: "med",
        type: "tuple",
      },
    ],
    name: "create_medication",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "user", type: "address" },
      { name: "reminder_id", type: "uint256" },
    ],
    name: "delete_medication",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "user", type: "address" },
      {
        components: [
          { name: "days", type: "uint256[]" },
          { name: "importance", type: "uint256" },
          { name: "routine_description", type: "string" },
        ],
        name: "daily_routine",
        type: "tuple",
      },
    ],
    name: "create_daily_routine",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "user", type: "address" },
      { name: "reminder_id", type: "uint256" },
    ],
    name: "delete_daily_routine",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "user", type: "address" },
      {
        components: [
          { name: "days", type: "uint256[]" },
          { name: "importance", type: "uint256" },
          { name: "location", type: "string" },
          { name: "appointment_desc", type: "string" },
        ],
        name: "appointment",
        type: "tuple",
      },
    ],
    name: "create_appointment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "user", type: "address" },
      { name: "reminder_id", type: "uint256" },
    ],
    name: "delete_appointment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "user", type: "address" },
      {
        components: [
          { name: "name", type: "string" },
          { name: "summary", type: "string" },
          { name: "importance", type: "uint256" },
        ],
        name: "tag",
        type: "tuple",
      },
    ],
    name: "create_tag",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "push_daily_application_reminder",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "iris_id", type: "uint256" },
      { name: "user", type: "address" },
    ],
    name: "can_decrypt",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "user", type: "address" }],
    name: "get_account_details",
    outputs: [
      {
        components: [
          { name: "user", type: "address" },
          { name: "username", type: "string" },
          { name: "aid", type: "address" },
          { name: "iris_id", type: "uint256" },
        ],
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "get_next_iris_id",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "user", type: "address" }],
    name: "get_user_w3memoryname_and_signing_key",
    outputs: [
      { name: "", type: "string" },
      { name: "", type: "string" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "deployer",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "iris_identifier_count",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "arg0", type: "address" }],
    name: "accounts",
    outputs: [
      {
        components: [
          { name: "user", type: "address" },
          { name: "username", type: "string" },
          { name: "aid", type: "address" },
          { name: "iris_id", type: "uint256" },
        ],
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "arg0", type: "address" }],
    name: "has_account",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "arg0", type: "string" }],
    name: "taken_username",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "arg0", type: "address" }],
    name: "reminder_id",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "arg0", type: "address" },
      { name: "arg1", type: "uint256" },
    ],
    name: "users_meds",
    outputs: [
      {
        components: [
          { name: "total_tabs_amount", type: "uint256" },
          { name: "days", type: "uint256[]" },
          { name: "name", type: "string" },
          { name: "dosage", type: "uint256[]" },
          { name: "desc", type: "string" },
        ],
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "arg0", type: "address" },
      { name: "arg1", type: "uint256" },
    ],
    name: "users_daily_routine",
    outputs: [
      {
        components: [
          { name: "days", type: "uint256[]" },
          { name: "importance", type: "uint256" },
          { name: "routine_description", type: "string" },
        ],
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "arg0", type: "address" },
      { name: "arg1", type: "uint256" },
    ],
    name: "users_appointments",
    outputs: [
      {
        components: [
          { name: "days", type: "uint256[]" },
          { name: "importance", type: "uint256" },
          { name: "location", type: "string" },
          { name: "appointment_desc", type: "string" },
        ],
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "arg0", type: "uint256" }],
    name: "tags",
    outputs: [
      {
        components: [
          { name: "name", type: "string" },
          { name: "summary", type: "string" },
          { name: "importance", type: "uint256" },
        ],
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "arg0", type: "address" }],
    name: "tag_id",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "arg0", type: "uint256" }],
    name: "iris_id_to_memory",
    outputs: [
      {
        components: [
          { name: "w3MemoryName", type: "string" },
          { name: "owner", type: "address" },
          { name: "identifier", type: "uint256" },
          { name: "signing_key_cid", type: "string" },
        ],
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "arg0", type: "uint256" }],
    name: "all_users",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "arg0", type: "address" },
      { name: "arg1", type: "uint256" },
    ],
    name: "validity",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
];
