-- CreateTable
CREATE TABLE "public"."Style" (
    "id" SERIAL NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "curationCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Style_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Image" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "styleId" INTEGER NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Category" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "styleId" INTEGER NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StyleTag" (
    "styleId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "StyleTag_pkey" PRIMARY KEY ("styleId","tagId")
);

-- CreateTable
CREATE TABLE "public"."Curation" (
    "id" SERIAL NOT NULL,
    "nickname" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "trendy" INTEGER NOT NULL,
    "personality" INTEGER NOT NULL,
    "practicality" INTEGER NOT NULL,
    "costEffectiveness" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "styleId" INTEGER NOT NULL,

    CONSTRAINT "Curation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Comment" (
    "id" SERIAL NOT NULL,
    "nickname" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "curationId" INTEGER NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "public"."Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Comment_curationId_key" ON "public"."Comment"("curationId");

-- AddForeignKey
ALTER TABLE "public"."Image" ADD CONSTRAINT "Image_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "public"."Style"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Category" ADD CONSTRAINT "Category_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "public"."Style"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StyleTag" ADD CONSTRAINT "StyleTag_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "public"."Style"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StyleTag" ADD CONSTRAINT "StyleTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Curation" ADD CONSTRAINT "Curation_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "public"."Style"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_curationId_fkey" FOREIGN KEY ("curationId") REFERENCES "public"."Curation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
