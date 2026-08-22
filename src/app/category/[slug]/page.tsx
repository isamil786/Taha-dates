import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getItemsByCategory,
  getCategories,
  getCategoryLabel,
  getCategoryIcon,
} from "@/lib/db";
import { CategoryPageClient } from "@/components/CategoryPageClient";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const items = getItemsByCategory(slug);
  const categories = getCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category || items.length === 0) {
    notFound();
  }

  const rawCategory = items[0]?.category ?? "";
  const label = getCategoryLabel(rawCategory);
  const icon = getCategoryIcon(rawCategory);

  return (
    <CategoryPageClient
      categoryName={label}
      categoryIcon={icon}
      initialItems={items}
    />
  );
}

export async function generateStaticParams() {
  return [];
}
