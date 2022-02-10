import axios from "axios";

async function fetcher<T>(url: string): Promise<T> {
  const { data } = await axios.get(url);

  return data;
}

export default fetcher;
