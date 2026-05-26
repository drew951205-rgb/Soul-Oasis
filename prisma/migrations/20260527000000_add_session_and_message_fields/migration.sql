ALTER TABLE "sessions"
  ADD COLUMN "title" TEXT,
  ADD COLUMN "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "emotion_score" INTEGER,
  ADD COLUMN "is_public" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "metadata" JSONB;

CREATE INDEX "sessions_user_id_is_public_created_at_idx"
  ON "sessions"("user_id", "is_public", "created_at");

ALTER TABLE "chat_messages"
  ADD COLUMN "is_edited" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "edited_at" TIMESTAMP(3),
  ADD COLUMN "ai_confidence" DOUBLE PRECISION;
