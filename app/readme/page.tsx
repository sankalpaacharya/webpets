import { getGeneratedAnimalsWithVariants } from "@/lib/scan-generated-animals";

import ReadmeDashboardClient from "./readme-dashboard-client";

export default async function ReadmePage() {
  const animals = await getGeneratedAnimalsWithVariants();

  return <ReadmeDashboardClient animals={animals} />;
}
