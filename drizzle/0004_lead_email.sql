ALTER TABLE "leads" ADD COLUMN "contact_email" text;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "email_subject" text;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "email_body" text;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "email_language" text;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "email_sent_at" timestamp with time zone;