CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "name" TEXT,
    "passwordHash" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Report" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "User"("id"),
    "country" TEXT NOT NULL,
    "committee" TEXT NOT NULL,
    "agenda" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'generating',
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL
);

CREATE TABLE "ReportSection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reportId" TEXT NOT NULL REFERENCES "Report"("id") ON DELETE CASCADE,
    "sectionType" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL
);

CREATE TABLE "Citation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reportSectionId" TEXT NOT NULL REFERENCES "ReportSection"("id") ON DELETE CASCADE,
    "statementPreview" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "accessedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "SavedReport" (
    "userId" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("userId", "reportId")
);

CREATE TABLE "NewsCache" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceUrl" TEXT NOT NULL UNIQUE,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "fetchedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" TEXT
);
