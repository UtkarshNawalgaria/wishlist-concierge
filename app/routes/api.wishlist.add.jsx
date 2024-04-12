import { json } from "@remix-run/node";
import prisma from "../db.server";

function generateSessionId(length = 10) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let sessionId = "";

  for (let i = 0; i < length; i++) {
    sessionId += characters.charAt(
      Math.floor(Math.random() * characters.length),
    );
  }

  return sessionId;
}

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

export async function action({ request }) {
  if (request.method === "POST") {
    const body = await request.json();

    // Check if shop has the app installed or not
    if (!body.productId || !body.shop) {
      return json({ error: true }, 400);
    }

    const isShopInstalled = await prisma.session.findFirst({
      where: {
        shop: body.shop,
      },
    });

    if (!isShopInstalled) {
      return json({ error: true }, 400);
    }

    // check if sessionId/customerId is returned in the body, if not, create a new one
    let sessionId = body.sessionId ?? generateSessionId();

    // check if wishlist with sessionId exists
    let wishlist = await prisma.wishlist.findFirst({
      where: {
        sessionId: sessionId,
      },
      select: WISHLIST_SELECT_FIELDS,
    });

    // If not, then create new Wishlist Item in the database for the customer
    if (!wishlist) {
      // Create wishlist
      wishlist = await prisma.wishlist.create({
        data: {
          sessionId,
          store: body.shop,
          customerId: body.customerId,
          publicId: generateSessionId(24),
          items: {
            create: [{ productId: body.productId }],
          },
        },
        select: WISHLIST_SELECT_FIELDS,
      });
    }

    return json({ success: true, data: wishlist }, 200);
  }
}
