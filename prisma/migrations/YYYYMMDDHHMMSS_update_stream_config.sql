-- AlterTable
ALTER TABLE "Event" DROP COLUMN IF EXISTS "iframeUrl";

-- AlterTable
ALTER TABLE "StreamConfig" DROP COLUMN IF EXISTS "streamUrl",
ADD COLUMN "provider" "StreamProvider" NOT NULL DEFAULT 'CLOUDFLARE',
ADD COLUMN "videoId" TEXT NOT NULL DEFAULT '';

-- CreateEnum
CREATE TYPE "StreamProvider" AS ENUM ('CLOUDFLARE', 'YOUTUBE'); 