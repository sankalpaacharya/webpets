import { getMediaAnimalsWithVariants } from "@/lib/scan-media-animals";

import DashboardClient from "./dashboard-client";

export default async function DashboardPage() {
  const animals = await getMediaAnimalsWithVariants();

  return <DashboardClient animals={animals} />;
}
