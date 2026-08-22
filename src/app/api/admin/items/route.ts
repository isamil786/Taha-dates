import { NextRequest, NextResponse } from "next/server";

// Use the Node.js runtime for this API so we can use Buffer and fs safely
export const runtime = "nodejs";
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

  // If a GitHub token is available in the environment, also commit the updated
  // data file back to the repository so the change persists across Vercel
  // deployments (Vercel filesystem is ephemeral). Collect debug messages
  // to return to the admin client when requested (header `x-debug: 1`).
  const debugMsgs: string[] = [];
  try {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const owner = process.env.GITHUB_OWNER ?? "isamil786";
    const repo = process.env.GITHUB_REPO ?? "Taha-dates";
    const branch = process.env.GITHUB_BRANCH ?? "main";
    const filePath = "data/items.json";

    if (!GITHUB_TOKEN) {
      debugMsgs.push("no GITHUB_TOKEN in env");
    }

    if (GITHUB_TOKEN) {
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;
      const getRes = await fetch(apiUrl, {
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: `Bearer ${GITHUB_TOKEN}`,
        },
      });

      if (getRes.ok) {
        const payload = await getRes.json();
        const sha = payload.sha;
        const remoteContent = JSON.parse(Buffer.from(payload.content, "base64").toString("utf8"));

        // Update the item in the remote copy as well to produce a new file
        const idx = remoteContent.findIndex((it: any) => it.id === id);
        if (idx !== -1) {
          remoteContent[idx].price = price;
        }

        const newContent = Buffer.from(JSON.stringify(remoteContent, null, 2)).toString("base64");

        const putRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
          method: "PUT",
          headers: {
            Accept: "application/vnd.github.v3+json",
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `Update price for item ${id}`,
            content: newContent,
            sha,
            branch,
          }),
        });

        if (!putRes.ok) {
          const txt = await putRes.text();
          debugMsgs.push("put_failed: " + txt.substring(0, 1000));
          console.error("GitHub commit failed", txt);
        } else {
          debugMsgs.push("put_ok");
        }
      } else {
        const txt = await getRes.text();
        debugMsgs.push("get_failed: " + txt.substring(0, 1000));
        console.error("Failed to read file from GitHub", txt);
      }
    }
  } catch (err) {
    // If any unexpected error occurs, return a JSON error and include debug info when requested
    console.error("Unhandled error in PATCH /api/admin/items:", err);
    const wantsDebug = request.headers.get("x-debug") === "1";
    if (wantsDebug) {
      return NextResponse.json({ error: "internal", _debug: String(err) }, { status: 500 });
    }
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }

  // If client requested debug, include debug messages
  const wantsDebug = request.headers.get("x-debug") === "1";
  if (wantsDebug) {
    return NextResponse.json({ success: true, _debug: debugMsgs.join(" | ") });
  }
  return NextResponse.json({ success: true });
}
