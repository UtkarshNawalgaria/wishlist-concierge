-- CreateTable
CREATE TABLE "Wishlist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "publicId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "customerId" TEXT,
    "title" TEXT NOT NULL DEFAULT 'My Wishlist',
    "store" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "WishlistItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "wishlistId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    CONSTRAINT "WishlistItem_wishlistId_fkey" FOREIGN KEY ("wishlistId") REFERENCES "Wishlist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_publicId_key" ON "Wishlist"("publicId");
