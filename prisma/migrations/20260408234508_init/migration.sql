-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "state" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "change_logs" (
    "id" SERIAL NOT NULL,
    "documentId" TEXT NOT NULL,
    "snapshot" JSONB NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "change_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "change_logs" ADD CONSTRAINT "change_logs_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
