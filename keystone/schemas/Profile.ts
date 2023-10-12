import { list } from "@keystone-6/core";
import {
  text,
  relationship,
  password,
  timestamp,
  select,
  integer,
  checkbox,
  json,
} from "@keystone-6/core/fields";
// import slugify from "slugify";
// import { permissions, rules } from "../access";

import uniqid from "uniqid";
import {
  uniqueNamesGenerator,
  Config,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

const customConfig: Config = {
  dictionaries: [adjectives, colors, animals],
  separator: "-",
  length: 3,
};

export const Profile = list({
  access: {
    operation: {
      query: () => true,
      create: () => true,
      update: () => true,
      delete: () => true,
    },
  },
  fields: {
    username: text({ validation: { isRequired: true } }),
    publicId: text({
      isIndexed: "unique",
      isFilterable: true,
      access: {
        read: () => true,
        create: () => true,
        update: () => true,
      },
      hooks: {
        async resolveInput({ operation }) {
          if (operation === "create") {
            return uniqid();
          }
        },
      },
    }),
    publicReadableId: text({
      isIndexed: "unique",
      isFilterable: true,
      access: {
        read: () => true,
        create: () => true,
        update: () => true,
      },
      hooks: {
        async resolveInput({ operation }) {
          if (operation === "create") {
            return uniqueNamesGenerator(customConfig);
          }
        },
      },
    }),
    email: text({
      validation: { isRequired: false },
      isIndexed: "unique",
      isFilterable: true,
      access: {
        read: () => true,
        create: () => true,
        update: () => true,
      },
    }),
    permissions: relationship({
      ref: "Permission.assignedTo",
      many: true,
    }),
    info: json(),
    isPublic: checkbox({ isFilterable: true }),
    password: password({
      validation: { isRequired: true },
      access: {
        read: () => true,
        create: () => true,
        update: () => true,
      },
    }),
    image: relationship({
      ref: "ProfileImage.profile",
      ui: {
        displayMode: "cards",
        cardFields: ["image", "altText"],
        inlineCreate: { fields: ["image", "altText"] },
        inlineEdit: { fields: ["image", "altText"] },
      },
    }),
    bio: text(),
    facebook: text(),
    twitter: text(),
    instagram: text(),
    publicMail: text(),
    website: text(),
    location: text(),
    dateCreated: timestamp({
      defaultValue: { kind: "now" },
    }),
    language: select({
      options: [
        { label: "English (American)", value: "EN-US" },
        { label: "English (British)", value: "EN-GB" },
        { label: "Bulgarian", value: "BG" },
        { label: "Chinese", value: "ZH" },
        { label: "Czech", value: "CS" },
        { label: "Danish", value: "DA" },
        { label: "Dutch", value: "NL" },
        { label: "Estonian", value: "ET" },
        { label: "Finnish", value: "FI" },
        { label: "French", value: "FR" },
        { label: "German", value: "DE" },
        { label: "Greek", value: "EL" },
        { label: "Hungarian", value: "HU" },
        { label: "Italian", value: "IT" },
        { label: "Japanese", value: "JA" },
        { label: "Latvian", value: "LV" },
        { label: "Lithuanian", value: "LT" },
        { label: "Polish", value: "PL" },
        { label: "Portuguese", value: "PT-PT" },
        { label: "Portuguese (Brazilian)", value: "PT-BR" },
        { label: "Romanian", value: "RO" },
        { label: "Russian", value: "RU" },
        { label: "Slovak", value: "SK" },
        { label: "Slovenian", value: "SL" },
        { label: "Spanish", value: "ES" },
        { label: "Swedish", value: "SV" },
      ],
      defaultValue: "EN-US",
    }),
    studiesInfo: json(),
    // not a good idea at the end
    // profileType: select({
    //   options: [
    //     { label: "Guest", value: "GUEST" },
    //     { label: "User", value: "USER" },
    //   ],
    //   defaultValue: "USER",
    // }),
    participantIn: relationship({
      ref: "Study.participants",
      many: true,
    }),
    teacherIn: relationship({ ref: "Class.creator", many: true }),
    mentorIn: relationship({ ref: "Class.mentors", many: true }),
    studentIn: relationship({ ref: "Class.students", many: true }),
    classNetworksCreated: relationship({
      ref: "ClassNetwork.creator",
      many: true,
    }),
    journals: relationship({
      ref: "Journal.creator",
      many: true,
    }),
    posts: relationship({
      ref: "Post.author",
      many: true,
    }),
    authorOfTalk: relationship({
      ref: "Talk.author",
      many: true,
    }),
    memberOfTalk: relationship({
      ref: "Talk.members",
      many: true,
    }),
    authorOfWord: relationship({
      ref: "Word.author",
      many: true,
    }),
    templates: relationship({
      ref: "Template.author",
      many: true,
    }),
    collaboratorInTemplate: relationship({
      ref: "Template.collaborators",
      many: true,
    }),
    taskCreatorIn: relationship({
      ref: "Task.author",
      many: true,
    }),
    collaboratorInTask: relationship({
      ref: "Task.collaborators",
      many: true,
    }),
    researcherIn: relationship({
      ref: "Study.author",
      many: true,
    }),
    collaboratorInStudy: relationship({
      ref: "Study.collaborators",
      many: true,
    }),
    consentCreatorIn: relationship({
      ref: "Consent.author",
      many: true,
    }),
    collaboratorInConsent: relationship({
      ref: "Consent.collaborators",
      many: true,
    }),
    creatorOfProposal: relationship({
      ref: "ProposalBoard.creator",
      many: true,
    }),
    authorOfProposal: relationship({
      ref: "ProposalBoard.author",
      many: true,
    }),
    reviews: relationship({
      ref: "Review.author",
      many: true,
    }),
    assignedToProposalCard: relationship({
      ref: "ProposalCard.assignedTo",
      many: true,
    }),
    updates: relationship({
      ref: "Update.user",
      many: true,
    }),
    authorOfLesson: relationship({
      ref: "Lesson.author",
      many: true,
    }),
    collaboratorInLesson: relationship({
      ref: "Lesson.collaborators",
      many: true,
    }),
    authorOfCurriculum: relationship({
      ref: "Curriculum.author",
      many: true,
    }),
    collaboratorInCurriculum: relationship({
      ref: "Curriculum.collaborators",
      many: true,
    }),
    authorOfAssignment: relationship({
      ref: "Assignment.author",
      many: true,
    }),
    authorOfResource: relationship({
      ref: "Resource.author",
      many: true,
    }),
    authorOfHomework: relationship({
      ref: "Homework.author",
      many: true,
    }),
    datasets: relationship({
      ref: "Dataset.profile",
      many: true,
    }),
  },
});
