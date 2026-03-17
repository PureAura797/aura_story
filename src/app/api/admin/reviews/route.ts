import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticatedFromRequest } from "@/lib/admin-auth";
import { getReviews, saveReviews } from "@/lib/data";
import type { Review } from "@/lib/data";

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticatedFromRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reviews = getReviews();
  return NextResponse.json(reviews);
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticatedFromRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, review, reviews: allReviews } = body as {
      action: "save_all" | "add" | "delete";
      review?: Review;
      reviews?: Review[];
    };

    if (action === "save_all" && allReviews) {
      saveReviews(allReviews);
      return NextResponse.json({ success: true });
    }

    const current = getReviews();

    if (action === "add" && review) {
      review.id = review.id || Date.now().toString();
      current.push(review);
      saveReviews(current);
      return NextResponse.json({ success: true, id: review.id });
    }

    if (action === "delete" && review?.id) {
      const filtered = current.filter((r) => r.id !== review.id);
      saveReviews(filtered);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
