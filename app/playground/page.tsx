import { getMediaAnimalsWithVariants } from "@/lib/scan-media-animals";

import DashboardClient from "../dashboard/dashboard-client";

export default async function PlaygroundPage() {
  const animals = await getMediaAnimalsWithVariants();

  return <DashboardClient animals={animals} />;
}
