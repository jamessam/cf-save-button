const contentful = require('contentful-management');

const SOURCE_SPACE_ID = process.env.SOURCE_SPACE_ID;
const SOURCE_ENV_ID = process.env.SOURCE_ENV_ID;
const DESTINATION_SPACE_ID = process.env.DESTINATION_SPACE_ID;
const DESTINATION_ENV_ID = process.env.DESTINATION_ENV_ID;
const PERSONAL_ACCESS_TOKEN = process.env.PERSONAL_ACCESS_TOKEN;

const SOURCE_CT_ID = process.argv[2];
const DESTINATION_CT_ID = process.argv[3];
const DESTINATION_CT_NAME = process.argv[4];

if (
  !SOURCE_SPACE_ID ||
  !SOURCE_ENV_ID ||
  !DESTINATION_SPACE_ID ||
  !DESTINATION_ENV_ID ||
  !PERSONAL_ACCESS_TOKEN
) {
  console.log('Please have the appropriate environment variables.');
  process.exit();
}

if (!SOURCE_CT_ID || !DESTINATION_CT_ID || !DESTINATION_CT_NAME) {
  console.log('Please pass the appropriate argument variables.');
  process.exit();
}

async function main() {
  const sourceClient = contentful.createClient({
    accessToken: process.env.PERSONAL_ACCESS_TOKEN,
  });
  const destinationClient = contentful.createClient({
    accessToken: process.env.PERSONAL_ACCESS_TOKEN,
  });

  try {
    const sourceSpace = await sourceClient.getSpace(SOURCE_SPACE_ID);
    const source = await sourceSpace.getEnvironment(SOURCE_ENV_ID);

    const destinationSpace = await destinationClient.getSpace(
      DESTINATION_SPACE_ID
    );
    const destination = await destinationSpace.getEnvironment(
      DESTINATION_ENV_ID
    );

    const ct = await source.getContentType(SOURCE_CT_ID);
    await destination.createContentTypeWithId(DESTINATION_CT_ID, {
      name: DESTINATION_CT_NAME,
      fields: ct.fields,
      displayField: ct.displayField,
      description: ct.description,
    });
  } catch (err) {
    console.error(`There was a problem with the script.`, err);
  }
}

main();
