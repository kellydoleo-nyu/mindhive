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
import uniqid from "uniqid";

export const Resource = list({
  access: {
    operation: {
      query: () => true,
      create: () => true,
      update: () => true,
      delete: () => true,
    },
  },
  fields: {
    code: text({
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
    author: relationship({
      ref: "Profile.authorOfResource",
      hooks: {
        async resolveInput({ context, operation, inputData }) {
          if (operation === "create") {
            return { connect: { id: context.session.itemId } };
          } else {
            return inputData.author;
          }
        },
      },
    }),
    classes: relationship({
      ref: "Class.resources",
      many: true,
    }),
    homework: relationship({
      ref: "Homework.resources",
      many: true,
    }),
    title: text({ validation: { isRequired: true } }),
    content: text(),
    settings: json(),
    public: checkbox({ isFilterable: true }),
    isTemplate: checkbox({ isFilterable: true }),
    tags: relationship({
      ref: "Tag.resources",
      many: true,
    }),
    createdAt: timestamp({
      defaultValue: { kind: "now" },
    }),
    updatedAt: timestamp(),
  },
});