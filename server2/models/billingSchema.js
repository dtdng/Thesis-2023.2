const billingSchema = [
  {
    name: "billing_account_id",
    type: "STRING",
    mode: "NULLABLE",
  },
  {
    name: "service",
    type: "RECORD",
    mode: "NULLABLE",
    fields: [
      {
        name: "id",
        type: "STRING",
        mode: "NULLABLE",
      },
      {
        name: "description",
        type: "STRING",
        mode: "NULLABLE",
      },
    ],
  },
  {
    name: "cost",
    type: "FLOAT",
    mode: "NULLABLE",
  },
  {
    name: "currency",
    type: "STRING",
    mode: "NULLABLE",
  },
  {
    name: "credits",
    type: "RECORD",
    mode: "REPEATED",
    fields: [
      {
        name: "name",
        type: "STRING",
        mode: "NULLABLE",
      },
      {
        name: "amount",
        type: "FLOAT",
        mode: "NULLABLE",
      },
      {
        name: "full_name",
        type: "STRING",
        mode: "NULLABLE",
      },
      {
        name: "id",
        type: "STRING",
        mode: "NULLABLE",
      },
      {
        name: "type",
        type: "STRING",
        mode: "NULLABLE",
      },
    ],
  },
  {
    name: "invoice",
    type: "RECORD",
    mode: "NULLABLE",
    fields: [
      {
        name: "month",
        type: "STRING",
        mode: "NULLABLE",
      },
    ],
  },
  {
    name: "project",
    type: "RECORD",
    mode: "NULLABLE",
    fields: [
      {
        name: "id",
        type: "STRING",
        mode: "NULLABLE",
      },
    ],
  },
];
