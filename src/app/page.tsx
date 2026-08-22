import { getCategories, getAllItems } from "@/lib/db";
import { HomePageClient } from "@/components/HomePageClient";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const categories = getCategories();
  const allItems = getAllItems();

  return (
    <HomePageClient
      initialCategories={categories}
      initialItems={allItems}
    />
  );
}
