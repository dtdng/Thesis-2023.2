const { BigQuery } = require("@google-cloud/bigquery");

// // Initialize the BigQuery client
// const bigquery = new BigQuery({
//   projectId: "bustling-dynamo-420507",
//   keyFilename: "D:/bustling-dynamo-420507-7ecd3e2a121a.json",
// });

// // Define the dataset and table ID
// const datasetId = "Billing_Dataset";
// const tableId = "gcp_billing_export_v1_0170AB_1A0C14_B679A1";

async function getBillingDataProjectGoogle(datasetId, tableId, projectId) {
  const bigquery = new BigQuery({
    projectId: projectId,
  });
  const query = `
    SELECT 
      service.description AS service_description, 
      SUM(cost) AS total_cost, 
      invoice.month AS month, 
      currency
    FROM \`${projectId}.${datasetId}.${tableId}\`
    WHERE DATE(_PARTITIONTIME) = "2024-05-15"
    GROUP BY service_description, month, currency
    ORDER BY total_cost DESC
    LIMIT 1000
  `;

  var result = [];

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

getBillingDataProjectGoogle(
  "Billing_Dataset",
  "gcp_billing_export_v1_0170AB_1A0C14_B679A1",
  "bustling-dynamo-420507"
);
