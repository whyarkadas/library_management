-- Drop tables if they exist (in correct order due to foreign key constraints)
DROP TABLE IF EXISTS "borrowed_book";
DROP TABLE IF EXISTS "book";
DROP TABLE IF EXISTS "user";

-- Create user table
CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR NOT NULL
);

-- Create book table
CREATE TABLE "book" (
    "id" SERIAL PRIMARY KEY,
    "title" VARCHAR NOT NULL,
    "averageRating" DECIMAL(4,2) NOT NULL DEFAULT 0,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true
);

-- Create borrowed_book table
CREATE TABLE "borrowed_book" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,
    "borrowedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returnedAt" TIMESTAMP,
    "rating" DECIMAL(3,1),
    FOREIGN KEY ("userId") REFERENCES "user"("id"),
    FOREIGN KEY ("bookId") REFERENCES "book"("id")
);

-- Create indexes for better query performance
CREATE INDEX "idx_book_title" ON "book"("title");
CREATE INDEX "idx_book_isAvailable" ON "book"("isAvailable");
CREATE INDEX "idx_borrowed_book_userId" ON "borrowed_book"("userId");
CREATE INDEX "idx_borrowed_book_bookId" ON "borrowed_book"("bookId");
CREATE INDEX "idx_borrowed_book_returnedAt" ON "borrowed_book"("returnedAt");

-- Add comments to tables and columns
COMMENT ON TABLE "user" IS 'Stores library users information';
COMMENT ON TABLE "book" IS 'Stores book information';
COMMENT ON TABLE "borrowed_book" IS 'Stores book borrowing history and status';

COMMENT ON COLUMN "book"."averageRating" IS 'Average rating of the book (0-10 scale with 2 decimal places)';
COMMENT ON COLUMN "book"."isAvailable" IS 'Indicates if the book is currently available for borrowing';
COMMENT ON COLUMN "borrowed_book"."borrowedAt" IS 'Timestamp when the book was borrowed';
COMMENT ON COLUMN "borrowed_book"."returnedAt" IS 'Timestamp when the book was returned (null if not returned)';
COMMENT ON COLUMN "borrowed_book"."rating" IS 'Rating given by the user (0-10 scale with 1 decimal place)'; 