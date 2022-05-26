import { createClient, Environment } from "contentful-management";

async function getEnvironment(): Promise<Environment | undefined> {
  if (
    !process.env.CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN ||
    !process.env.CONTENTFUL_SPACE_ID ||
    !process.env.CONTENTFUL_ENVIRONMENT
  ) {
    return undefined;
  }

  const client = createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN,
  });
  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
  const environment = await space.getEnvironment(
    process.env.CONTENTFUL_ENVIRONMENT
  );

  return environment;
}

export default getEnvironment;
