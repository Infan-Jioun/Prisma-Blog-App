-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_parentId_fkey";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "phone" TEXT,
ADD COLUMN     "role" TEXT DEFAULT 'USER',
ADD COLUMN     "status" TEXT DEFAULT 'Active';

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
