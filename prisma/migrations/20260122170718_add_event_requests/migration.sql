-- CreateTable
CREATE TABLE "event_requests" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "event_requests_eventId_idx" ON "event_requests"("eventId");

-- CreateIndex
CREATE INDEX "event_requests_requesterId_idx" ON "event_requests"("requesterId");

-- CreateIndex
CREATE INDEX "event_requests_status_idx" ON "event_requests"("status");

-- CreateIndex
CREATE UNIQUE INDEX "event_requests_eventId_requesterId_key" ON "event_requests"("eventId", "requesterId");

-- AddForeignKey
ALTER TABLE "event_requests" ADD CONSTRAINT "event_requests_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_requests" ADD CONSTRAINT "event_requests_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
