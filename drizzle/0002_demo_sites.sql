CREATE TABLE "demo_sites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" integer NOT NULL,
	"build_id" integer,
	"html" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "demo_sites" ADD CONSTRAINT "demo_sites_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "demo_sites" ADD CONSTRAINT "demo_sites_build_id_site_builds_id_fk" FOREIGN KEY ("build_id") REFERENCES "public"."site_builds"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "demo_sites_business_id_idx" ON "demo_sites" USING btree ("business_id");