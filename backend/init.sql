-- Enums
DO $$ BEGIN
  CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "ConsultantRequestStatus" AS ENUM ('PENDING', 'REVIEWED', 'FULFILLED', 'REJECTED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Admins
CREATE TABLE IF NOT EXISTS "admins" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  "isMainAdmin" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "permissions" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Team Members
CREATE TABLE IF NOT EXISTS "team_members" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "isFounder" BOOLEAN NOT NULL DEFAULT false,
  "initials" TEXT NOT NULL,
  "bio" TEXT,
  "education" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "keyAreas" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Services
CREATE TABLE IF NOT EXISTS "services" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "serviceId" TEXT NOT NULL UNIQUE,
  "icon" TEXT NOT NULL,
  "tabLabel" TEXT NOT NULL,
  "headline" TEXT NOT NULL,
  "shortSummary" TEXT NOT NULL,
  "deliverables" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "subAreas" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "cta" TEXT NOT NULL,
  "ctaLink" TEXT NOT NULL,
  "color" TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Training Courses
CREATE TABLE IF NOT EXISTS "training_courses" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "courseId" TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "subtitle" TEXT NOT NULL,
  "badge" TEXT NOT NULL,
  "overview" TEXT NOT NULL,
  "modules" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- FAQs
CREATE TABLE IF NOT EXISTS "faqs" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "question" TEXT NOT NULL,
  "answer" TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Stats
CREATE TABLE IF NOT EXISTS "stats" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "statId" TEXT NOT NULL UNIQUE,
  "label" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "unit" TEXT NOT NULL,
  "tag" TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Contact Info
CREATE TABLE IF NOT EXISTS "contact_info" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
  "phone" TEXT NOT NULL,
  "phoneClean" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "physicalAddress" TEXT NOT NULL,
  "xHandle" TEXT NOT NULL,
  "xUrl" TEXT NOT NULL,
  "linkedinHandle" TEXT NOT NULL,
  "linkedinUrl" TEXT NOT NULL,
  "igHandle" TEXT NOT NULL,
  "igUrl" TEXT NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Legal Content
CREATE TABLE IF NOT EXISTS "legal_content" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "type" TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Library Categories
CREATE TABLE IF NOT EXISTS "library_categories" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "catId" TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "tagline" TEXT NOT NULL,
  "icon" TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Library Items
CREATE TABLE IF NOT EXISTS "library_items" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "categoryId" TEXT NOT NULL REFERENCES "library_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "date" TEXT,
  "link" TEXT,
  "tag" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Applications
CREATE TABLE IF NOT EXISTS "applications" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "course" TEXT NOT NULL,
  "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Consultant Requests
CREATE TABLE IF NOT EXISTS "consultant_requests" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "clientName" TEXT NOT NULL,
  "clientEmail" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "country" TEXT NOT NULL,
  "position" TEXT NOT NULL,
  "education" TEXT NOT NULL,
  "experience" TEXT NOT NULL,
  "startMonth" TEXT NOT NULL,
  "endMonth" TEXT NOT NULL,
  "personDays" TEXT NOT NULL,
  "paymentMode" TEXT NOT NULL,
  "momoPhone" TEXT,
  "torFilePath" TEXT,
  "torFileName" TEXT,
  "status" "ConsultantRequestStatus" NOT NULL DEFAULT 'PENDING',
  "adminNotes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
