import { NextRequest, NextResponse } from "next/server";
import { getCategories, getItemsByCategory, getAllItems } from "@/lib/db";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");

  if (slug) {
    const items = getItemsByCategory(slug);
    return NextResponse.json({ items });
  }

  const categories = getCategories();
  const items = getAllItems();
  return NextResponse.json({ categories, items });
}
