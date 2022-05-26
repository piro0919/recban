import { ContentfulClientApi, createClient } from "contentful";

function getClient(): ContentfulClientApi | undefined {
  if (
    !process.env.CONTENTFUL_DELIVERY_API_ACCESS_TOKEN ||
    !process.env.CONTENTFUL_SPACE_ID
  ) {
    return undefined;
  }

  const client = createClient({
    accessToken: process.env.CONTENTFUL_DELIVERY_API_ACCESS_TOKEN,
    environment: process.env.CONTENTFUL_ENVIRONMENT,
    space: process.env.CONTENTFUL_SPACE_ID,
  });

  return client;
}

export default getClient;
