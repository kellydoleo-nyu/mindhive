-- CreateEnum
CREATE TYPE "TaskTaskTypeType" AS ENUM ('TASK', 'SURVEY', 'BLOCK');

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL DEFAULT '',
    "publicId" TEXT NOT NULL DEFAULT '',
    "publicReadableId" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "info" JSONB,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT NOT NULL,
    "image" TEXT,
    "bio" TEXT NOT NULL DEFAULT '',
    "facebook" TEXT NOT NULL DEFAULT '',
    "twitter" TEXT NOT NULL DEFAULT '',
    "instagram" TEXT NOT NULL DEFAULT '',
    "publicMail" TEXT NOT NULL DEFAULT '',
    "website" TEXT NOT NULL DEFAULT '',
    "location" TEXT NOT NULL DEFAULT '',
    "dateCreated" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "language" TEXT DEFAULT 'EN-US',
    "studiesInfo" JSONB,
    "passwordResetToken" TEXT,
    "passwordResetIssuedAt" TIMESTAMP(3),
    "passwordResetRedeemedAt" TIMESTAMP(3),

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileImage" (
    "id" TEXT NOT NULL,
    "image" JSONB,
    "altText" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "ProfileImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "canManageUsers" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Class" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL DEFAULT '',
    "title" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "settings" JSONB,
    "creator" TEXT,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassNetwork" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "settings" JSONB,
    "creator" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ClassNetwork_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL DEFAULT '',
    "dateCreated" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Journal" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL DEFAULT '',
    "title" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "creator" TEXT,
    "settings" JSONB,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Journal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "content" TEXT NOT NULL DEFAULT '',
    "author" TEXT,
    "journal" TEXT,
    "settings" JSONB,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Talk" (
    "id" TEXT NOT NULL,
    "author" TEXT,
    "settings" JSONB,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Talk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Word" (
    "id" TEXT NOT NULL,
    "author" TEXT,
    "talk" TEXT,
    "message" TEXT NOT NULL DEFAULT '',
    "new" BOOLEAN NOT NULL DEFAULT false,
    "settings" JSONB,
    "isMain" BOOLEAN NOT NULL DEFAULT false,
    "parent" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Word_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',
    "shortDescription" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "author" TEXT,
    "parameters" JSONB,
    "script" TEXT NOT NULL DEFAULT '',
    "style" TEXT NOT NULL DEFAULT '',
    "settings" JSONB,
    "file" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "taskType" "TaskTaskTypeType",
    "subtitle" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "descriptionForParticipants" TEXT NOT NULL DEFAULT '',
    "author" TEXT,
    "template" TEXT,
    "parameters" JSONB,
    "settings" JSONB,
    "link" TEXT NOT NULL DEFAULT '',
    "public" BOOLEAN NOT NULL DEFAULT false,
    "submitForPublishing" BOOLEAN NOT NULL DEFAULT false,
    "isOriginal" BOOLEAN NOT NULL DEFAULT false,
    "isExternal" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT NOT NULL DEFAULT '',
    "largeImage" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Study" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "shortDescription" TEXT NOT NULL DEFAULT '',
    "image" TEXT,
    "settings" JSONB,
    "info" JSONB,
    "public" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "submitForPublishing" BOOLEAN NOT NULL DEFAULT false,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "components" JSONB,
    "flow" JSONB,
    "diagram" TEXT NOT NULL DEFAULT '',
    "author" TEXT,
    "descriptionInProposalCard" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Study_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudyImage" (
    "id" TEXT NOT NULL,
    "image" JSONB,
    "altText" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "StudyImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consent" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL DEFAULT '',
    "title" TEXT NOT NULL DEFAULT '',
    "public" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT NOT NULL DEFAULT '',
    "organization" TEXT NOT NULL DEFAULT '',
    "info" JSONB,
    "settings" JSONB,
    "author" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Consent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Update" (
    "id" TEXT NOT NULL,
    "user" TEXT,
    "updateArea" TEXT NOT NULL DEFAULT '',
    "link" TEXT NOT NULL DEFAULT '',
    "content" JSONB,
    "hasOpen" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Update_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dataset" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL DEFAULT '',
    "profile" TEXT,
    "template" TEXT,
    "task" TEXT,
    "study" TEXT,
    "dataPolicy" TEXT NOT NULL DEFAULT '',
    "info" JSONB,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Dataset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProposalBoard" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "isTemplate" BOOLEAN NOT NULL DEFAULT false,
    "isSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "checklist" JSONB,
    "settings" JSONB,
    "creator" TEXT,
    "author" TEXT,
    "study" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ProposalBoard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProposalSection" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "position" DOUBLE PRECISION,
    "board" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ProposalSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProposalCard" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "position" DOUBLE PRECISION,
    "content" TEXT NOT NULL DEFAULT '',
    "comment" TEXT NOT NULL DEFAULT '',
    "settings" JSONB,
    "section" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ProposalCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "author" TEXT,
    "study" TEXT,
    "proposal" TEXT,
    "settings" JSONB,
    "content" JSONB,
    "stage" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Curriculum" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "diagram" TEXT NOT NULL DEFAULT '',
    "author" TEXT,
    "settings" JSONB,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Curriculum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "type" TEXT NOT NULL DEFAULT '',
    "content" TEXT NOT NULL DEFAULT '',
    "settings" JSONB,
    "author" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "parent" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "level" INTEGER,
    "parent" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assignment" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL DEFAULT '',
    "author" TEXT,
    "title" TEXT NOT NULL DEFAULT '',
    "content" TEXT NOT NULL DEFAULT '',
    "settings" JSONB,
    "public" BOOLEAN NOT NULL DEFAULT false,
    "isTemplate" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL DEFAULT '',
    "author" TEXT,
    "title" TEXT NOT NULL DEFAULT '',
    "content" TEXT NOT NULL DEFAULT '',
    "settings" JSONB,
    "public" BOOLEAN NOT NULL DEFAULT false,
    "isTemplate" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Homework" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL DEFAULT '',
    "author" TEXT,
    "assignment" TEXT,
    "resources" TEXT,
    "title" TEXT NOT NULL DEFAULT '',
    "content" TEXT NOT NULL DEFAULT '',
    "settings" JSONB,
    "public" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Homework_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Profile_participantIn" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Profile_memberOfTalk" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Profile_collaboratorInTemplate" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Profile_collaboratorInTask" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Profile_collaboratorInStudy" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Profile_assignedToProposalCard" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Permission_assignedTo" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Class_mentors" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Class_students" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Class_networks" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Class_talks" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Class_studies" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Class_resources" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Study_tags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Study_talks" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Consent_collaborators" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Consent_studies" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Consent_tasks" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Curriculum_collaborators" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Lesson_collaborators" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Lesson_tags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Assignment_classes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Assignment_tags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Resource_tags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Homework_tags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_publicId_key" ON "Profile"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_publicReadableId_key" ON "Profile"("publicReadableId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_email_key" ON "Profile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_image_key" ON "Profile"("image");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Class_code_key" ON "Class"("code");

-- CreateIndex
CREATE INDEX "Class_creator_idx" ON "Class"("creator");

-- CreateIndex
CREATE UNIQUE INDEX "ClassNetwork_title_key" ON "ClassNetwork"("title");

-- CreateIndex
CREATE INDEX "ClassNetwork_creator_idx" ON "ClassNetwork"("creator");

-- CreateIndex
CREATE UNIQUE INDEX "Journal_code_key" ON "Journal"("code");

-- CreateIndex
CREATE INDEX "Journal_creator_idx" ON "Journal"("creator");

-- CreateIndex
CREATE INDEX "Post_author_idx" ON "Post"("author");

-- CreateIndex
CREATE INDEX "Post_journal_idx" ON "Post"("journal");

-- CreateIndex
CREATE INDEX "Talk_author_idx" ON "Talk"("author");

-- CreateIndex
CREATE INDEX "Word_author_idx" ON "Word"("author");

-- CreateIndex
CREATE INDEX "Word_talk_idx" ON "Word"("talk");

-- CreateIndex
CREATE INDEX "Word_parent_idx" ON "Word"("parent");

-- CreateIndex
CREATE INDEX "Template_author_idx" ON "Template"("author");

-- CreateIndex
CREATE UNIQUE INDEX "Task_slug_key" ON "Task"("slug");

-- CreateIndex
CREATE INDEX "Task_author_idx" ON "Task"("author");

-- CreateIndex
CREATE INDEX "Task_template_idx" ON "Task"("template");

-- CreateIndex
CREATE UNIQUE INDEX "Study_slug_key" ON "Study"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Study_image_key" ON "Study"("image");

-- CreateIndex
CREATE INDEX "Study_author_idx" ON "Study"("author");

-- CreateIndex
CREATE INDEX "Study_descriptionInProposalCard_idx" ON "Study"("descriptionInProposalCard");

-- CreateIndex
CREATE UNIQUE INDEX "Consent_code_key" ON "Consent"("code");

-- CreateIndex
CREATE INDEX "Consent_author_idx" ON "Consent"("author");

-- CreateIndex
CREATE INDEX "Update_user_idx" ON "Update"("user");

-- CreateIndex
CREATE UNIQUE INDEX "Dataset_token_key" ON "Dataset"("token");

-- CreateIndex
CREATE INDEX "Dataset_profile_idx" ON "Dataset"("profile");

-- CreateIndex
CREATE INDEX "Dataset_template_idx" ON "Dataset"("template");

-- CreateIndex
CREATE INDEX "Dataset_task_idx" ON "Dataset"("task");

-- CreateIndex
CREATE INDEX "Dataset_study_idx" ON "Dataset"("study");

-- CreateIndex
CREATE UNIQUE INDEX "ProposalBoard_slug_key" ON "ProposalBoard"("slug");

-- CreateIndex
CREATE INDEX "ProposalBoard_creator_idx" ON "ProposalBoard"("creator");

-- CreateIndex
CREATE INDEX "ProposalBoard_author_idx" ON "ProposalBoard"("author");

-- CreateIndex
CREATE INDEX "ProposalBoard_study_idx" ON "ProposalBoard"("study");

-- CreateIndex
CREATE INDEX "ProposalSection_board_idx" ON "ProposalSection"("board");

-- CreateIndex
CREATE INDEX "ProposalCard_section_idx" ON "ProposalCard"("section");

-- CreateIndex
CREATE INDEX "Review_author_idx" ON "Review"("author");

-- CreateIndex
CREATE INDEX "Review_study_idx" ON "Review"("study");

-- CreateIndex
CREATE INDEX "Review_proposal_idx" ON "Review"("proposal");

-- CreateIndex
CREATE UNIQUE INDEX "Curriculum_slug_key" ON "Curriculum"("slug");

-- CreateIndex
CREATE INDEX "Curriculum_author_idx" ON "Curriculum"("author");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_slug_key" ON "Lesson"("slug");

-- CreateIndex
CREATE INDEX "Lesson_author_idx" ON "Lesson"("author");

-- CreateIndex
CREATE INDEX "Lesson_parent_idx" ON "Lesson"("parent");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");

-- CreateIndex
CREATE INDEX "Tag_parent_idx" ON "Tag"("parent");

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_code_key" ON "Assignment"("code");

-- CreateIndex
CREATE INDEX "Assignment_author_idx" ON "Assignment"("author");

-- CreateIndex
CREATE UNIQUE INDEX "Resource_code_key" ON "Resource"("code");

-- CreateIndex
CREATE INDEX "Resource_author_idx" ON "Resource"("author");

-- CreateIndex
CREATE UNIQUE INDEX "Homework_code_key" ON "Homework"("code");

-- CreateIndex
CREATE INDEX "Homework_author_idx" ON "Homework"("author");

-- CreateIndex
CREATE INDEX "Homework_assignment_idx" ON "Homework"("assignment");

-- CreateIndex
CREATE INDEX "Homework_resources_idx" ON "Homework"("resources");

-- CreateIndex
CREATE UNIQUE INDEX "_Profile_participantIn_AB_unique" ON "_Profile_participantIn"("A", "B");

-- CreateIndex
CREATE INDEX "_Profile_participantIn_B_index" ON "_Profile_participantIn"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Profile_memberOfTalk_AB_unique" ON "_Profile_memberOfTalk"("A", "B");

-- CreateIndex
CREATE INDEX "_Profile_memberOfTalk_B_index" ON "_Profile_memberOfTalk"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Profile_collaboratorInTemplate_AB_unique" ON "_Profile_collaboratorInTemplate"("A", "B");

-- CreateIndex
CREATE INDEX "_Profile_collaboratorInTemplate_B_index" ON "_Profile_collaboratorInTemplate"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Profile_collaboratorInTask_AB_unique" ON "_Profile_collaboratorInTask"("A", "B");

-- CreateIndex
CREATE INDEX "_Profile_collaboratorInTask_B_index" ON "_Profile_collaboratorInTask"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Profile_collaboratorInStudy_AB_unique" ON "_Profile_collaboratorInStudy"("A", "B");

-- CreateIndex
CREATE INDEX "_Profile_collaboratorInStudy_B_index" ON "_Profile_collaboratorInStudy"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Profile_assignedToProposalCard_AB_unique" ON "_Profile_assignedToProposalCard"("A", "B");

-- CreateIndex
CREATE INDEX "_Profile_assignedToProposalCard_B_index" ON "_Profile_assignedToProposalCard"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Permission_assignedTo_AB_unique" ON "_Permission_assignedTo"("A", "B");

-- CreateIndex
CREATE INDEX "_Permission_assignedTo_B_index" ON "_Permission_assignedTo"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Class_mentors_AB_unique" ON "_Class_mentors"("A", "B");

-- CreateIndex
CREATE INDEX "_Class_mentors_B_index" ON "_Class_mentors"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Class_students_AB_unique" ON "_Class_students"("A", "B");

-- CreateIndex
CREATE INDEX "_Class_students_B_index" ON "_Class_students"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Class_networks_AB_unique" ON "_Class_networks"("A", "B");

-- CreateIndex
CREATE INDEX "_Class_networks_B_index" ON "_Class_networks"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Class_talks_AB_unique" ON "_Class_talks"("A", "B");

-- CreateIndex
CREATE INDEX "_Class_talks_B_index" ON "_Class_talks"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Class_studies_AB_unique" ON "_Class_studies"("A", "B");

-- CreateIndex
CREATE INDEX "_Class_studies_B_index" ON "_Class_studies"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Class_resources_AB_unique" ON "_Class_resources"("A", "B");

-- CreateIndex
CREATE INDEX "_Class_resources_B_index" ON "_Class_resources"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Study_tags_AB_unique" ON "_Study_tags"("A", "B");

-- CreateIndex
CREATE INDEX "_Study_tags_B_index" ON "_Study_tags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Study_talks_AB_unique" ON "_Study_talks"("A", "B");

-- CreateIndex
CREATE INDEX "_Study_talks_B_index" ON "_Study_talks"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Consent_collaborators_AB_unique" ON "_Consent_collaborators"("A", "B");

-- CreateIndex
CREATE INDEX "_Consent_collaborators_B_index" ON "_Consent_collaborators"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Consent_studies_AB_unique" ON "_Consent_studies"("A", "B");

-- CreateIndex
CREATE INDEX "_Consent_studies_B_index" ON "_Consent_studies"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Consent_tasks_AB_unique" ON "_Consent_tasks"("A", "B");

-- CreateIndex
CREATE INDEX "_Consent_tasks_B_index" ON "_Consent_tasks"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Curriculum_collaborators_AB_unique" ON "_Curriculum_collaborators"("A", "B");

-- CreateIndex
CREATE INDEX "_Curriculum_collaborators_B_index" ON "_Curriculum_collaborators"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Lesson_collaborators_AB_unique" ON "_Lesson_collaborators"("A", "B");

-- CreateIndex
CREATE INDEX "_Lesson_collaborators_B_index" ON "_Lesson_collaborators"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Lesson_tags_AB_unique" ON "_Lesson_tags"("A", "B");

-- CreateIndex
CREATE INDEX "_Lesson_tags_B_index" ON "_Lesson_tags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Assignment_classes_AB_unique" ON "_Assignment_classes"("A", "B");

-- CreateIndex
CREATE INDEX "_Assignment_classes_B_index" ON "_Assignment_classes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Assignment_tags_AB_unique" ON "_Assignment_tags"("A", "B");

-- CreateIndex
CREATE INDEX "_Assignment_tags_B_index" ON "_Assignment_tags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Resource_tags_AB_unique" ON "_Resource_tags"("A", "B");

-- CreateIndex
CREATE INDEX "_Resource_tags_B_index" ON "_Resource_tags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Homework_tags_AB_unique" ON "_Homework_tags"("A", "B");

-- CreateIndex
CREATE INDEX "_Homework_tags_B_index" ON "_Homework_tags"("B");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_image_fkey" FOREIGN KEY ("image") REFERENCES "ProfileImage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_creator_fkey" FOREIGN KEY ("creator") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassNetwork" ADD CONSTRAINT "ClassNetwork_creator_fkey" FOREIGN KEY ("creator") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Journal" ADD CONSTRAINT "Journal_creator_fkey" FOREIGN KEY ("creator") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_author_fkey" FOREIGN KEY ("author") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_journal_fkey" FOREIGN KEY ("journal") REFERENCES "Journal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Talk" ADD CONSTRAINT "Talk_author_fkey" FOREIGN KEY ("author") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Word" ADD CONSTRAINT "Word_author_fkey" FOREIGN KEY ("author") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Word" ADD CONSTRAINT "Word_talk_fkey" FOREIGN KEY ("talk") REFERENCES "Talk"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Word" ADD CONSTRAINT "Word_parent_fkey" FOREIGN KEY ("parent") REFERENCES "Word"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_author_fkey" FOREIGN KEY ("author") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_author_fkey" FOREIGN KEY ("author") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_template_fkey" FOREIGN KEY ("template") REFERENCES "Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Study" ADD CONSTRAINT "Study_image_fkey" FOREIGN KEY ("image") REFERENCES "StudyImage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Study" ADD CONSTRAINT "Study_author_fkey" FOREIGN KEY ("author") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Study" ADD CONSTRAINT "Study_descriptionInProposalCard_fkey" FOREIGN KEY ("descriptionInProposalCard") REFERENCES "ProposalCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consent" ADD CONSTRAINT "Consent_author_fkey" FOREIGN KEY ("author") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Update" ADD CONSTRAINT "Update_user_fkey" FOREIGN KEY ("user") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dataset" ADD CONSTRAINT "Dataset_profile_fkey" FOREIGN KEY ("profile") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dataset" ADD CONSTRAINT "Dataset_template_fkey" FOREIGN KEY ("template") REFERENCES "Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dataset" ADD CONSTRAINT "Dataset_task_fkey" FOREIGN KEY ("task") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dataset" ADD CONSTRAINT "Dataset_study_fkey" FOREIGN KEY ("study") REFERENCES "Study"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalBoard" ADD CONSTRAINT "ProposalBoard_creator_fkey" FOREIGN KEY ("creator") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalBoard" ADD CONSTRAINT "ProposalBoard_author_fkey" FOREIGN KEY ("author") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalBoard" ADD CONSTRAINT "ProposalBoard_study_fkey" FOREIGN KEY ("study") REFERENCES "Study"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalSection" ADD CONSTRAINT "ProposalSection_board_fkey" FOREIGN KEY ("board") REFERENCES "ProposalBoard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalCard" ADD CONSTRAINT "ProposalCard_section_fkey" FOREIGN KEY ("section") REFERENCES "ProposalSection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_author_fkey" FOREIGN KEY ("author") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_study_fkey" FOREIGN KEY ("study") REFERENCES "Study"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_proposal_fkey" FOREIGN KEY ("proposal") REFERENCES "ProposalBoard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curriculum" ADD CONSTRAINT "Curriculum_author_fkey" FOREIGN KEY ("author") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_author_fkey" FOREIGN KEY ("author") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_parent_fkey" FOREIGN KEY ("parent") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_parent_fkey" FOREIGN KEY ("parent") REFERENCES "Tag"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_author_fkey" FOREIGN KEY ("author") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_author_fkey" FOREIGN KEY ("author") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Homework" ADD CONSTRAINT "Homework_author_fkey" FOREIGN KEY ("author") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Homework" ADD CONSTRAINT "Homework_assignment_fkey" FOREIGN KEY ("assignment") REFERENCES "Assignment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Homework" ADD CONSTRAINT "Homework_resources_fkey" FOREIGN KEY ("resources") REFERENCES "Resource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Profile_participantIn" ADD CONSTRAINT "_Profile_participantIn_A_fkey" FOREIGN KEY ("A") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Profile_participantIn" ADD CONSTRAINT "_Profile_participantIn_B_fkey" FOREIGN KEY ("B") REFERENCES "Study"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Profile_memberOfTalk" ADD CONSTRAINT "_Profile_memberOfTalk_A_fkey" FOREIGN KEY ("A") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Profile_memberOfTalk" ADD CONSTRAINT "_Profile_memberOfTalk_B_fkey" FOREIGN KEY ("B") REFERENCES "Talk"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Profile_collaboratorInTemplate" ADD CONSTRAINT "_Profile_collaboratorInTemplate_A_fkey" FOREIGN KEY ("A") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Profile_collaboratorInTemplate" ADD CONSTRAINT "_Profile_collaboratorInTemplate_B_fkey" FOREIGN KEY ("B") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Profile_collaboratorInTask" ADD CONSTRAINT "_Profile_collaboratorInTask_A_fkey" FOREIGN KEY ("A") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Profile_collaboratorInTask" ADD CONSTRAINT "_Profile_collaboratorInTask_B_fkey" FOREIGN KEY ("B") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Profile_collaboratorInStudy" ADD CONSTRAINT "_Profile_collaboratorInStudy_A_fkey" FOREIGN KEY ("A") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Profile_collaboratorInStudy" ADD CONSTRAINT "_Profile_collaboratorInStudy_B_fkey" FOREIGN KEY ("B") REFERENCES "Study"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Profile_assignedToProposalCard" ADD CONSTRAINT "_Profile_assignedToProposalCard_A_fkey" FOREIGN KEY ("A") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Profile_assignedToProposalCard" ADD CONSTRAINT "_Profile_assignedToProposalCard_B_fkey" FOREIGN KEY ("B") REFERENCES "ProposalCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Permission_assignedTo" ADD CONSTRAINT "_Permission_assignedTo_A_fkey" FOREIGN KEY ("A") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Permission_assignedTo" ADD CONSTRAINT "_Permission_assignedTo_B_fkey" FOREIGN KEY ("B") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Class_mentors" ADD CONSTRAINT "_Class_mentors_A_fkey" FOREIGN KEY ("A") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Class_mentors" ADD CONSTRAINT "_Class_mentors_B_fkey" FOREIGN KEY ("B") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Class_students" ADD CONSTRAINT "_Class_students_A_fkey" FOREIGN KEY ("A") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Class_students" ADD CONSTRAINT "_Class_students_B_fkey" FOREIGN KEY ("B") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Class_networks" ADD CONSTRAINT "_Class_networks_A_fkey" FOREIGN KEY ("A") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Class_networks" ADD CONSTRAINT "_Class_networks_B_fkey" FOREIGN KEY ("B") REFERENCES "ClassNetwork"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Class_talks" ADD CONSTRAINT "_Class_talks_A_fkey" FOREIGN KEY ("A") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Class_talks" ADD CONSTRAINT "_Class_talks_B_fkey" FOREIGN KEY ("B") REFERENCES "Talk"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Class_studies" ADD CONSTRAINT "_Class_studies_A_fkey" FOREIGN KEY ("A") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Class_studies" ADD CONSTRAINT "_Class_studies_B_fkey" FOREIGN KEY ("B") REFERENCES "Study"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Class_resources" ADD CONSTRAINT "_Class_resources_A_fkey" FOREIGN KEY ("A") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Class_resources" ADD CONSTRAINT "_Class_resources_B_fkey" FOREIGN KEY ("B") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Study_tags" ADD CONSTRAINT "_Study_tags_A_fkey" FOREIGN KEY ("A") REFERENCES "Study"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Study_tags" ADD CONSTRAINT "_Study_tags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Study_talks" ADD CONSTRAINT "_Study_talks_A_fkey" FOREIGN KEY ("A") REFERENCES "Study"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Study_talks" ADD CONSTRAINT "_Study_talks_B_fkey" FOREIGN KEY ("B") REFERENCES "Talk"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Consent_collaborators" ADD CONSTRAINT "_Consent_collaborators_A_fkey" FOREIGN KEY ("A") REFERENCES "Consent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Consent_collaborators" ADD CONSTRAINT "_Consent_collaborators_B_fkey" FOREIGN KEY ("B") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Consent_studies" ADD CONSTRAINT "_Consent_studies_A_fkey" FOREIGN KEY ("A") REFERENCES "Consent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Consent_studies" ADD CONSTRAINT "_Consent_studies_B_fkey" FOREIGN KEY ("B") REFERENCES "Study"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Consent_tasks" ADD CONSTRAINT "_Consent_tasks_A_fkey" FOREIGN KEY ("A") REFERENCES "Consent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Consent_tasks" ADD CONSTRAINT "_Consent_tasks_B_fkey" FOREIGN KEY ("B") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Curriculum_collaborators" ADD CONSTRAINT "_Curriculum_collaborators_A_fkey" FOREIGN KEY ("A") REFERENCES "Curriculum"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Curriculum_collaborators" ADD CONSTRAINT "_Curriculum_collaborators_B_fkey" FOREIGN KEY ("B") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Lesson_collaborators" ADD CONSTRAINT "_Lesson_collaborators_A_fkey" FOREIGN KEY ("A") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Lesson_collaborators" ADD CONSTRAINT "_Lesson_collaborators_B_fkey" FOREIGN KEY ("B") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Lesson_tags" ADD CONSTRAINT "_Lesson_tags_A_fkey" FOREIGN KEY ("A") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Lesson_tags" ADD CONSTRAINT "_Lesson_tags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Assignment_classes" ADD CONSTRAINT "_Assignment_classes_A_fkey" FOREIGN KEY ("A") REFERENCES "Assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Assignment_classes" ADD CONSTRAINT "_Assignment_classes_B_fkey" FOREIGN KEY ("B") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Assignment_tags" ADD CONSTRAINT "_Assignment_tags_A_fkey" FOREIGN KEY ("A") REFERENCES "Assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Assignment_tags" ADD CONSTRAINT "_Assignment_tags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Resource_tags" ADD CONSTRAINT "_Resource_tags_A_fkey" FOREIGN KEY ("A") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Resource_tags" ADD CONSTRAINT "_Resource_tags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Homework_tags" ADD CONSTRAINT "_Homework_tags_A_fkey" FOREIGN KEY ("A") REFERENCES "Homework"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Homework_tags" ADD CONSTRAINT "_Homework_tags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
