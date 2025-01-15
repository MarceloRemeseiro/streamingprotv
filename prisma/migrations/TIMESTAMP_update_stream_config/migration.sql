-- AlterTable
ALTER TABLE "Event" DROP COLUMN "iframeUrl";

-- AlterTable
ALTER TABLE "StreamConfig" 
ALTER COLUMN "streamUrl" SET COMMENT 'iframe completo del streaming'; 