import { NextRequest, NextResponse } from "next/server";
import { getAllItems, updateItemPrice } from "@/lib/db";
import { verifySessionToken } from "@/lib/auth";

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get("admin_session")?.value ?? null;
  return verifySessionToken(token);
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = getAllItems();
  return NextResponse.json({ items });
}

export async function PATCH(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, price } = await request.json();

  if (typeof id !== "number" || typeof price !== "number" || price < 0) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const success = updateItemPrice(id, price);
  if (!success) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
