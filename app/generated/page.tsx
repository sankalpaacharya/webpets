import { getGeneratedAnimalsWithVariants } from "@/lib/scan-generated-animals";

import GeneratedDashboardClient from "./generated-dashboard-client";

export default async function GeneratedPage() {
  const animals = await getGeneratedAnimalsWithVariants();

  return <GeneratedDashboardClient animals={animals} />;
}
