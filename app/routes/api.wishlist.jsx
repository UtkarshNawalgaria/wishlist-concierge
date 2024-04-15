import { json } from "@remix-run/node";
import prisma from "../db.server";

const WISHLIST_SELECT_FIELDS = {
  publicId: true,
  sessionId: true,
  customerId: true,
  title: true,
  items: {
    select: {
      productId: true,
    },
  },
};

export async function loader({ request }) {
  const headers = request.headers;
  const sessionId = headers.get("x-wishlist-cg-sid");

  if (sessionId === "null") {
    return json({ wishlist: null }, 200);
  }

  const wishlist = await prisma.wishlist.findFirst({
    where: {
      sessionId,
    },
    select: WISHLIST_SELECT_FIELDS,
  });

  return json(wishlist, 200);
}
