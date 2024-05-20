const { BigQuery } = require("@google-cloud/bigquery");

// Initialize the BigQuery client
const bigquery = new BigQuery({
  projectId: "bustling-dynamo-420507",
  keyFilename: "D:/bustling-dynamo-420507-7ecd3e2a121a.json",
});

// Define the dataset and table ID
const datasetId = "Billing_Dataset";
const tableId = "gcp_billing_export_v1_0170AB_1A0C14_B679A1";

async function queryTable() {
  const query = `
    SELECT billing_account_id, service, sku, project.id, cost, currency, invoice, usage
    FROM \`${bigquery.projectId}.${datasetId}.${tableId}\`
    WHERE TIMESTAMP_TRUNC(_PARTITIONTIME, DAY) = TIMESTAMP("2024-05-18") LIMIT 1000
  `;

  try {
    // Run the query
    const [job] = await bigquery.createQueryJob({ query });
    console.log(`Job ${job.id} started.`);

    // Wait for the query to finish
    const [rows] = await job.getQueryResults();
    console.log("Query Results:", rows);

    // Process the rows as needed
    rows.forEach((row) => console.log(row));
  } catch (error) {
    console.error("ERROR:", error);
  }
}

queryTable();
