"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_config = require("dotenv/config");
var import_core28 = require("@keystone-6/core");

// mutations/index.ts
var import_schema = require("@graphql-tools/schema");

// lib/mail.ts
var import_postmark = require("postmark");
var client = new import_postmark.ServerClient(process.env.MAIL_TOKEN);
async function sendPasswordResetEmail(resetToken, to) {
  const info = await client.sendEmailWithTemplate({
    From: "no-reply@prettyspecial.one",
    To: to,
    TemplateAlias: "password-reset",
    TemplateModel: {
      product_name: "PrettySpecial",
      subject: "Your password reset token for MindHive",
      company_name: "MindHive",
      company_address: "New York",
      support_url: `${process.env.FRONTEND_URL}/menu/docs/about`,
      action_url: `${process.env.FRONTEND_URL}/menu/reset?token=${resetToken}`
    },
    MessageStream: "ps-stream"
  });
}
async function sendNotificationEmail(to, subject, text28) {
  const info = await client.sendEmailWithTemplate({
    From: "no-reply@prettyspecial.one",
    To: to,
    TemplateAlias: "general",
    TemplateModel: {
      product_name: "MindHive",
      subject,
      company_name: "MindHive",
      company_address: "New York",
      support_url: `${process.env.FRONTEND_URL}/menu/docs/about`,
      text: text28
    },
    MessageStream: "ps-stream"
  });
}

// mutations/sendEmail.ts
async function sendEmail(root, {
  receiverId,
  header,
  body
}, context) {
  const sesh = context.session;
  if (!sesh.itemId) {
    throw new Error("You must be logged in to do this!");
  }
  const user = await context.lists.User.findOne({
    where: { id: receiverId },
    resolveFields: "email"
  });
  const email = user?.email || "produkt5@yandex.ru";
  await sendNotificationEmail(email, header, body);
  return { message: "Email was sent" };
}
var sendEmail_default = sendEmail;

// mutations/copyProposalBoard.ts
async function copyProposalBoard(root, {
  id,
  study
}, context) {
  const sesh = context.session;
  if (!sesh.itemId) {
    throw new Error("You must be logged in to do this!");
  }
  const template = await context.query.ProposalBoard.findOne({
    where: { id },
    query: "id slug title description settings sections { id title position cards { id title description position content } }"
  });
  const argumentsToCopy = {
    title: template.title,
    description: template.description,
    settings: template.settings,
    slug: template.slug
  };
  const board = await context.db.ProposalBoard.createOne(
    {
      data: {
        author: {
          connect: {
            id: sesh.itemId
          }
        },
        study: {
          connect: {
            id: study
          }
        },
        ...argumentsToCopy
      }
    },
    "id"
  );
  await Promise.all(
    template.sections.map(async (section, i) => {
      const templateSection = template.sections[i];
      const newSection = await context.db.ProposalSection.createOne(
        {
          data: {
            title: templateSection.title,
            position: templateSection.position,
            board: {
              connect: { id: board.id }
            }
          }
        },
        "id"
      );
      await Promise.all(
        templateSection.cards.map(async (card, i2) => {
          const templateCard = section.cards[i2];
          const newCard = await context.db.ProposalCard.createOne(
            {
              data: {
                section: {
                  connect: {
                    id: newSection.id
                  }
                },
                title: templateCard.title,
                description: templateCard.description,
                content: templateCard.content,
                position: templateCard.position
              }
            },
            "id"
          );
        })
      );
    })
  );
  return board;
}
var copyProposalBoard_default = copyProposalBoard;

// mutations/deleteProposal.ts
async function deleteProposal(root, {
  id
}, context) {
  const sesh = context.session;
  if (!sesh.itemId) {
    throw new Error("You must be logged in to do this!");
  }
  const proposal = await context.query.ProposalBoard.findOne({
    where: { id },
    query: "id sections { id cards { id } }"
  });
  if (proposal.sections.length) {
    const cardIds = proposal.sections.map((section) => section.cards.map((card) => ({ id: card.id }))).flat();
    if (cardIds.length) {
      await context.db.ProposalCard.deleteMany({
        where: cardIds
      });
    }
    const sectionIds = proposal.sections.map((section) => ({ id: section.id }));
    await context.db.ProposalSection.deleteMany({
      where: sectionIds
    });
  }
  return context.query.ProposalBoard.deleteOne({
    where: { id },
    query: "id"
  });
}
var deleteProposal_default = deleteProposal;

// mutations/archiveStudy.ts
async function archiveStudy(root, {
  study,
  isArchived
}, context) {
  const sesh = context.session;
  if (!sesh.itemId) {
    throw new Error("You must be logged in to do this!");
  }
  const profile = await context.query.Profile.findOne({
    where: { id: sesh.itemId },
    query: "id studiesInfo"
  });
  let studiesInfo = {};
  if (profile.studiesInfo && Object.getPrototypeOf(profile.studiesInfo) === Object.prototype && Object.keys(profile.studiesInfo).length > 0) {
    studiesInfo = profile.studiesInfo;
    studiesInfo[study] = {
      ...studiesInfo[study],
      hideInDevelop: isArchived
    };
  } else {
    studiesInfo[study] = {
      hideInDevelop: isArchived
    };
  }
  await context.db.Profile.updateOne({
    where: { id: sesh.itemId },
    data: { studiesInfo }
  });
  return profile;
}
var archiveStudy_default = archiveStudy;

// mutations/googleSignup.ts
var import_google_auth_library = require("google-auth-library");
var clientID = "1042393944588-od9nbqtdfefltmpq8kjnnhir0lbb14se.apps.googleusercontent.com";
async function googleSignup(root, {
  token,
  role,
  classCode
}, context) {
  console.log({ classCode });
  const googleClient = new import_google_auth_library.OAuth2Client(clientID);
  const ticket = await googleClient.verifyIdToken({
    idToken: token,
    audience: clientID
  });
  const payload = await ticket.getPayload();
  const { name, email } = payload;
  const profile = await context.db.Profile.createOne(
    {
      data: {
        username: name,
        email,
        password: token,
        permissions: role ? { connect: { name: role?.toUpperCase() } } : null,
        studentIn: classCode ? { connect: { code: classCode } } : null
      }
    },
    "id"
  );
  return profile;
}
var googleSignup_default = googleSignup;

// mutations/googleLogin.ts
var import_google_auth_library2 = require("google-auth-library");
var clientID2 = "1042393944588-od9nbqtdfefltmpq8kjnnhir0lbb14se.apps.googleusercontent.com";
async function googleLogin(root, {
  token
}, context) {
  const googleClient = new import_google_auth_library2.OAuth2Client(clientID2);
  const ticket = await googleClient.verifyIdToken({
    idToken: token,
    audience: clientID2
  });
  const payload = await ticket.getPayload();
  const { email } = payload;
  const profile = await context.db.Profile.updateOne({
    where: { email },
    data: { password: token }
  });
  return profile;
}
var googleLogin_default = googleLogin;

// mutations/index.ts
var graphql = String.raw;
var extendGraphqlSchema = (schema) => (0, import_schema.mergeSchemas)({
  schemas: [schema],
  typeDefs: graphql`
      type Mutation {
        sendEmail(receiverId: String, header: String, body: String): Report
        copyProposalBoard(id: ID!, study: ID): ProposalBoard
        deleteProposal(id: ID!): ProposalBoard
        archiveStudy(study: ID!, isArchived: Boolean!): Profile
        googleSignup(token: String!, role: String, classCode: String): Profile
        googleLogin(token: String!): Profile
      }
    `,
  resolvers: {
    Mutation: {
      sendEmail: sendEmail_default,
      copyProposalBoard: copyProposalBoard_default,
      deleteProposal: deleteProposal_default,
      archiveStudy: archiveStudy_default,
      googleSignup: googleSignup_default,
      googleLogin: googleLogin_default
    }
  }
});

// schemas/Profile.ts
var import_core = require("@keystone-6/core");
var import_fields = require("@keystone-6/core/fields");
var import_uniqid = __toESM(require("uniqid"));
var import_unique_names_generator = require("unique-names-generator");
var customConfig = {
  dictionaries: [import_unique_names_generator.adjectives, import_unique_names_generator.colors, import_unique_names_generator.animals],
  separator: "-",
  length: 3
};
var Profile = (0, import_core.list)({
  access: {
    operation: {
      query: () => true,
      create: () => true,
      update: () => true,
      delete: () => true
    }
  },
  fields: {
    username: (0, import_fields.text)({ validation: { isRequired: true } }),
    publicId: (0, import_fields.text)({
      isIndexed: "unique",
      isFilterable: true,
      access: {
        read: () => true,
        create: () => true,
        update: () => true
      },
      hooks: {
        async resolveInput({ operation }) {
          if (operation === "create") {
            return (0, import_uniqid.default)();
          }
        }
      }
    }),
    publicReadableId: (0, import_fields.text)({
      isIndexed: "unique",
      isFilterable: true,
      access: {
        read: () => true,
        create: () => true,
        update: () => true
      },
      hooks: {
        async resolveInput({ operation }) {
          if (operation === "create") {
            return (0, import_unique_names_generator.uniqueNamesGenerator)(customConfig);
          }
        }
      }
    }),
    email: (0, import_fields.text)({
      validation: { isRequired: false },
      isIndexed: "unique",
      isFilterable: true,
      access: {
        read: () => true,
        create: () => true,
        update: () => true
      }
    }),
    permissions: (0, import_fields.relationship)({
      ref: "Permission.assignedTo",
      many: true
    }),
    info: (0, import_fields.json)(),
    isPublic: (0, import_fields.checkbox)({ isFilterable: true }),
    password: (0, import_fields.password)({
      validation: { isRequired: true },
      access: {
        read: () => true,
        create: () => true,
        update: () => true
      }
    }),
    image: (0, import_fields.relationship)({
      ref: "ProfileImage.profile",
      ui: {
        displayMode: "cards",
        cardFields: ["image", "altText"],
        inlineCreate: { fields: ["image", "altText"] },
        inlineEdit: { fields: ["image", "altText"] }
      }
    }),
    bio: (0, import_fields.text)(),
    facebook: (0, import_fields.text)(),
    twitter: (0, import_fields.text)(),
    instagram: (0, import_fields.text)(),
    publicMail: (0, import_fields.text)(),
    website: (0, import_fields.text)(),
    location: (0, import_fields.text)(),
    dateCreated: (0, import_fields.timestamp)({
      defaultValue: { kind: "now" }
    }),
    language: (0, import_fields.select)({
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
        { label: "Swedish", value: "SV" }
      ],
      defaultValue: "EN-US"
    }),
    studiesInfo: (0, import_fields.json)(),
    participantIn: (0, import_fields.relationship)({
      ref: "Study.participants",
      many: true
    }),
    teacherIn: (0, import_fields.relationship)({ ref: "Class.creator", many: true }),
    mentorIn: (0, import_fields.relationship)({ ref: "Class.mentors", many: true }),
    studentIn: (0, import_fields.relationship)({ ref: "Class.students", many: true }),
    classNetworksCreated: (0, import_fields.relationship)({
      ref: "ClassNetwork.creator",
      many: true
    }),
    journals: (0, import_fields.relationship)({
      ref: "Journal.creator",
      many: true
    }),
    posts: (0, import_fields.relationship)({
      ref: "Post.author",
      many: true
    }),
    authorOfTalk: (0, import_fields.relationship)({
      ref: "Talk.author",
      many: true
    }),
    memberOfTalk: (0, import_fields.relationship)({
      ref: "Talk.members",
      many: true
    }),
    authorOfWord: (0, import_fields.relationship)({
      ref: "Word.author",
      many: true
    }),
    templates: (0, import_fields.relationship)({
      ref: "Template.author",
      many: true
    }),
    collaboratorInTemplate: (0, import_fields.relationship)({
      ref: "Template.collaborators",
      many: true
    }),
    taskCreatorIn: (0, import_fields.relationship)({
      ref: "Task.author",
      many: true
    }),
    collaboratorInTask: (0, import_fields.relationship)({
      ref: "Task.collaborators",
      many: true
    }),
    researcherIn: (0, import_fields.relationship)({
      ref: "Study.author",
      many: true
    }),
    collaboratorInStudy: (0, import_fields.relationship)({
      ref: "Study.collaborators",
      many: true
    }),
    consentCreatorIn: (0, import_fields.relationship)({
      ref: "Consent.author",
      many: true
    }),
    collaboratorInConsent: (0, import_fields.relationship)({
      ref: "Consent.collaborators",
      many: true
    }),
    creatorOfProposal: (0, import_fields.relationship)({
      ref: "ProposalBoard.creator",
      many: true
    }),
    authorOfProposal: (0, import_fields.relationship)({
      ref: "ProposalBoard.author",
      many: true
    }),
    reviews: (0, import_fields.relationship)({
      ref: "Review.author",
      many: true
    }),
    assignedToProposalCard: (0, import_fields.relationship)({
      ref: "ProposalCard.assignedTo",
      many: true
    }),
    updates: (0, import_fields.relationship)({
      ref: "Update.user",
      many: true
    }),
    authorOfLesson: (0, import_fields.relationship)({
      ref: "Lesson.author",
      many: true
    }),
    collaboratorInLesson: (0, import_fields.relationship)({
      ref: "Lesson.collaborators",
      many: true
    }),
    authorOfCurriculum: (0, import_fields.relationship)({
      ref: "Curriculum.author",
      many: true
    }),
    collaboratorInCurriculum: (0, import_fields.relationship)({
      ref: "Curriculum.collaborators",
      many: true
    }),
    authorOfAssignment: (0, import_fields.relationship)({
      ref: "Assignment.author",
      many: true
    }),
    authorOfResource: (0, import_fields.relationship)({
      ref: "Resource.author",
      many: true
    }),
    authorOfHomework: (0, import_fields.relationship)({
      ref: "Homework.author",
      many: true
    }),
    datasets: (0, import_fields.relationship)({
      ref: "Dataset.profile",
      many: true
    })
  }
});

// schemas/ProfileImage.ts
var import_core2 = require("@keystone-6/core");
var import_fields2 = require("@keystone-6/core/fields");
var import_cloudinary = require("@keystone-6/cloudinary");
var cloudinary = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_KEY,
  apiSecret: process.env.CLOUDINARY_SECRET,
  folder: "mindhive-users"
};
var ProfileImage = (0, import_core2.list)({
  access: {
    operation: {
      query: () => true,
      create: () => true,
      update: () => true,
      delete: () => true
    }
  },
  fields: {
    image: (0, import_cloudinary.cloudinaryImage)({
      cloudinary,
      label: "Source"
    }),
    altText: (0, import_fields2.text)(),
    profile: (0, import_fields2.relationship)({ ref: "Profile.image" })
  }
});

// schemas/Permission.ts
var import_core3 = require("@keystone-6/core");
var import_fields4 = require("@keystone-6/core/fields");

// schemas/fields.ts
var import_fields3 = require("@keystone-6/core/fields");
var permissionFields = {
  canManageUsers: (0, import_fields3.checkbox)({
    defaultValue: false,
    label: "User can Edit other users"
  })
};
var permissionsList = Object.keys(
  permissionFields
);

// schemas/Permission.ts
var Permission = (0, import_core3.list)({
  access: {
    operation: {
      query: () => true,
      create: () => true,
      update: () => true,
      delete: () => true
    }
  },
  fields: {
    name: (0, import_fields4.text)({
      validation: { isRequired: true },
      isIndexed: "unique",
      isFilterable: true
    }),
    ...permissionFields,
    assignedTo: (0, import_fields4.relationship)({
      ref: "Profile.permissions",
      many: true,
      ui: {
        itemView: { fieldMode: "read" }
      }
    })
  }
});

// schemas/Class.ts
var import_core4 = require("@keystone-6/core");
var import_fields6 = require("@keystone-6/core/fields");
var Class = (0, import_core4.list)({
  access: {
    operation: {
      query: () => true,
      create: () => true,
      update: () => true,
      delete: () => true
    }
  },
  fields: {
    code: (0, import_fields6.text)({ isIndexed: "unique" }),
    title: (0, import_fields6.text)({ validation: { isRequired: true } }),
    description: (0, import_fields6.text)(),
    createdAt: (0, import_fields6.timestamp)({
      defaultValue: { kind: "now" }
    }),
    updatedAt: (0, import_fields6.timestamp)(),
    settings: (0, import_fields6.json)(),
    mentors: (0, import_fields6.relationship)({
      ref: "Profile.mentorIn",
      many: true
    }),
    students: (0, import_fields6.relationship)({
      ref: "Profile.studentIn",
      many: true
    }),
    networks: (0, import_fields6.relationship)({ ref: "ClassNetwork.classes", many: true }),
    creator: (0, import_fields6.relationship)({
      ref: "Profile.teacherIn",
      hooks: {
        async resolveInput({ context }) {
          return { connect: { id: context.session.itemId } };
        }
      }
    }),
    talks: (0, import_fields6.relationship)({
      ref: "Talk.classes",
      many: true
    }),
    studies: (0, import_fields6.relationship)({
      ref: "Study.classes",
      many: true
    }),
    assignments: (0, import_fields6.relationship)({
      ref: "Assignment.classes",
      many: true
    }),
    resources: (0, import_fields6.relationship)({
      ref: "Resource.classes",
      many: true
    })
  }
});

// schemas/ClassNetwork.ts
var import_core5 = require("@keystone-6/core");
var import_fields7 = require("@keystone-6/core/fields");
var ClassNetwork = (0, import_core5.list)({
  access: {
    operation: {
      query: () => true,
      create: () => true,
      update: () => true,
      delete: () => true
    }
  },
  fields: {
    title: (0, import_fields7.text)({ isIndexed: "unique", validation: { isRequired: true } }),
    description: (0, import_fields7.text)(),
    settings: (0, import_fields7.json)(),
    creator: (0, import_fields7.relationship)({
      ref: "Profile.classNetworksCreated",
      ui: {
        displayMode: "cards",
        cardFields: ["username", "email"],
        linkToItem: true
      }
    }),
    classes: (0, import_fields7.relationship)({ ref: "Class.networks", many: true }),
    createdAt: (0, import_fields7.timestamp)({
      defaultValue: { kind: "now" }
    }),
    updatedAt: (0, import_fields7.timestamp)()
  }
});

// schemas/Report.ts
var import_core6 = require("@keystone-6/core");
var import_fields8 = require("@keystone-6/core/fields");
var Report = (0, import_core6.list)({
  access: {
    operation: {
      query: () => true,
      create: () => true,
      update: () => true,
      delete: () => true
    }
  },
  fields: {
    message: (0, import_fields8.text)(),
    dateCreated: (0, import_fields8.timestamp)({
      defaultValue: { kind: "now" }
    })
  }
});

// schemas/Journal.ts
var import_core7 = require("@keystone-6/core");
var import_fields9 = require("@keystone-6/core/fields");
var Journal = (0, import_core7.list)({
  access: {
    operation: {
      query: () => true,
      create: () => true,
      update: () => true,
      delete: () => true
    }
  },
  fields: {
    code: (0, import_fields9.text)({ isIndexed: "unique" }),
    title: (0, import_fields9.text)({ validation: { isRequired: true } }),
    description: (0, import_fields9.text)(),
    creator: (0, import_fields9.relationship)({
      ref: "Profile.journals",
      hooks: {
        async resolveInput({ context }) {
          return { connect: { id: context.session.itemId } };
        }
      }
    }),
    posts: (0, import_fields9.relationship)({
      ref: "Post.journal",
      many: true
    }),
    settings: (0, import_fields9.json)(),
    createdAt: (0, import_fields9.timestamp)({
      defaultValue: { kind: "now" }
    }),
    updatedAt: (0, import_fields9.timestamp)()
  }
});

// schemas/Post.ts
var import_core8 = require("@keystone-6/core");
var import_fields10 = require("@keystone-6/core/fields");
var Post = (0, import_core8.list)({
  access: {
    operation: {
      query: () => true,
      create: () => true,
      update: () => true,
      delete: () => true
    }
  },
  fields: {
    title: (0, import_fields10.text)(),
    content: (0, import_fields10.text)(),
    author: (0, import_fields10.relationship)({
      ref: "Profile.posts",
      hooks: {
        async resolveInput({ context }) {
          return { connect: { id: context.session.itemId } };
        }
      }
    }),
    journal: (0, import_fields10.relationship)({
      ref: "Journal.posts"
    }),
    settings: (0, import_fields10.json)(),
    createdAt: (0, import_fields10.timestamp)({
      defaultValue: { kind: "now" }
    }),
    updatedAt: (0, import_fields10.timestamp)()
  }
});

// schemas/Talk.ts
var import_core9 = require("@keystone-6/core");
var import_fields11 = require("@keystone-6/core/fields");
var Talk = (0, import_core9.list)({
  access: {
    operation: {
      query: () => true,
      create: () => true,
      update: () => true,
      delete: () => true
    }
  },
  fields: {
    author: (0, import_fields11.relationship)({
      ref: "Profile.authorOfTalk",
      hooks: {
        async resolveInput({ context }) {
          return { connect: { id: context.session.itemId } };
        }
      }
    }),
    members: (0, import_fields11.relationship)({
      ref: "Profile.memberOfTalk",
      many: true
    }),
    words: (0, import_fields11.relationship)({
      ref: "Word.talk",
      many: true
    }),
    settings: (0, import_fields11.json)(),
    studies: (0, import_fields11.relationship)({
      ref: "Study.talks",
      many: true
    }),
    classes: (0, import_fields11.relationship)({
      ref: "Class.talks",
      many: true
    }),
    createdAt: (0, import_fields11.timestamp)({
      defaultValue: { kind: "now" }
    }),
    updatedAt: (0, import_fields11.timestamp)()
  }
});

// schemas/Word.ts
var import_core10 = require("@keystone-6/core");
var import_fields12 = require("@keystone-6/core/fields");
var Word = (0, import_core10.list)({
  access: {
    operation: {
      query: () => true,
      create: () => true,
      update: () => true,
      delete: () => true
    }
  },
  fields: {
    author: (0, import_fields12.relationship)({
      ref: "Profile.authorOfWord",
      hooks: {
        async resolveInput({ context }) {
          return { connect: { id: context.session.itemId } };
        }
      }
    }),
    talk: (0, import_fields12.relationship)({
      ref: "Talk.words"
    }),
    message: (0, import_fields12.text)(),
    new: (0, import_fields12.checkbox)(),
    settings: (0, import_fields12.json)(),
    isMain: (0, import_fields12.checkbox)(),
    parent: (0, import_fields12.relationship)({
      ref: "Word.children"
    }),
    children: (0, import_fields12.relationship)({
      ref: "Word.parent",
      many: true
    }),
    createdAt: (0, import_fields12.timestamp)({
      defaultValue: { kind: "now" }
    }),
    updatedAt: (0, import_fields12.timestamp)()
  }
});

// schemas/Template.ts
var import_core11 = require("@keystone-6/core");
var import_fields13 = require("@keystone-6/core/fields");
var import_slugify = __toESM(require("slugify"));
var Template = (0, import_core11.list)({
  access: {
    operation: {
      query: () => true,
      create: () => true,
      update: () => true,
      delete: () => true
    }
  },
  fields: {
    title: (0, import_fields13.text)({ validation: { isRequired: true } }),
    slug: (0, import_fields13.text)({
      hooks: {
        async resolveInput({ context, operation, inputData }) {
          if (operation === "create") {
            const { title } = inputData;
            if (title) {
              let slug = (0, import_slugify.default)(title, {
                remove: /[*+~.()'"!:@]/g,
                lower: true,
                strict: true
              });
              const items = await context.query.Template.findMany({
                where: { slug: { startsWith: slug } },
                query: "id slug"
              });
              if (items.length) {
                const re = new RegExp(`${slug}-*\\d*$`);
                const slugs = items.filter((item) => item.slug.match(re));
                if (slugs.length) {
                  slug = `${slug}-${slugs.length}`;
                }
              }
              return slug;
            }
          } else {
            return inputData.slug;
          }
        }
      }
    }),
    shortDescription: (0, import_fields13.text)(),
    description: (0, import_fields13.text)(),
    author: (0, import_fields13.relationship)({
      ref: "Profile.templates",
      hooks: {
        async resolveInput({ context }) {
          return { connect: { id: context.session.itemId } };
        }
      }
    }),
    collaborators: (0, import_fields13.relationship)({
      ref: "Profile.collaboratorInTemplate",
      many: true
    }),
    parameters: (0, import_fields13.json)(),
    script: (0, import_fields13.text)(),
    style: (0, import_fields13.text)(),
    tasks: (0, import_fields13.relationship)({
      ref: "Task.template",
      many: true
    }),
    datasets: (0, import_fields13.relationship)({
      ref: "Dataset.template",
      many: true
    }),
    settings: (0, import_fields13.json)(),
    file: (0, import_fields13.text)(),
    createdAt: (0, import_fields13.timestamp)({
      defaultValue: { kind: "now" }
    }),
    updatedAt: (0, import_fields13.timestamp)()
  }
});

// schemas/Task.ts
var import_core12 = require("@keystone-6/core");
var import_fields14 = require("@keystone-6/core/fields");
var import_slugify2 = __toESM(require("slugify"));
var Task = (0, import_core12.list)({
  access: {
    operation: {
      query: () => true,
      create: () => true,
      update: () => true,
      delete: () => true
    }
  },
  fields: {
    title: (0, import_fields14.text)({ validation: { isRequired: true } }),
    taskType: (0, import_fields14.select)({
      type: "enum",
      options: [
        { label: "Task", value: "TASK" },
        { label: "Survey", value: "SURVEY" },
        { label: "Block", value: "BLOCK" }
      ]
    }),
    subtitle: (0, import_fields14.text)(),
    slug: (0, import_fields14.text)({
      validation: { isRequired: true },
      isIndexed: "unique",
      isFilterable: true,
      hooks: {
        async resolveInput({ context, operation, inputData }) {
          if (operation === "create") {
            const { title } = inputData;
            if (title) {
              let slug = (0, import_slugify2.default)(title, {
                remove: /[*+~.()'"!:@]/g,
                lower: true,
                strict: true
              });
              const items = await context.query.Task.findMany({
                where: { slug: { startsWith: slug } },
                query: "id slug"
              });
              if (items.length) {
                const re = new RegExp(`${slug}-*\\d*$`);
                const slugs = items.filter((item) => item.slug.match(re));
                if (slugs.length) {
                  slug = `${slug}-${slugs.length}`;
                }
              }
              return slug;
            }
          } else {
            return inputData.slug;
          }
        }
      }
    }),
    description: (0, import_fields14.text)(),
    descriptionForParticipants: (0, import_fields14.text)(),
    author: (0, import_fields14.relationship)({
      ref: "Profile.taskCreatorIn",
      hooks: {
        async resolveInput({ context }) {
          return { connect: { id: context.session.itemId } };
        }
      }
    }),
    collaborators: (0, import_fields14.relationship)({
      ref: "Profile.collaboratorInTask",
      many: true
    }),
    template: (0, import_fields14.relationship)({
      ref: "Template.tasks"
    }),
    parameters: (0, import_fields14.json)(),
    settings: (0, import_fields14.json)(),
    link: (0, import_fields14.text)(),
    public: (0, import_fields14.checkbox)(),
    submitForPublishing: (0, import_fields14.checkbox)(),
    isOriginal: (0, import_fields14.checkbox)(),
    isExternal: (0, import_fields14.checkbox)(),
    image: (0, import_fields14.text)(),
    largeImage: (0, import_fields14.text)(),
    consent: (0, import_fields14.relationship)({
      ref: "Consent.tasks",
      many: true
    }),
    datasets: (0, import_fields14.relationship)({
      ref: "Dataset.task",
      many: true
    }),
    createdAt: (0, import_fields14.timestamp)({
      defaultValue: { kind: "now" }
    }),
    updatedAt: (0, import_fields14.timestamp)()
  }
});

// schemas/Study.ts
var import_core13 = require("@keystone-6/core");
var import_fields15 = require("@keystone-6/core/fields");
var import_slugify3 = __toESM(require("slugify"));
var Study = (0, import_core13.list)({
  access: {
    operation: {
      query: () => true,
      create: () => true,
      update: () => true,
      delete: () => true
    }
  },
  fields: {
    title: (0, import_fields15.text)({ validation: { isRequired: true } }),
    slug: (0, import_fields15.text)({
      validation: { isRequired: true },
      isIndexed: "unique",
      isFilterable: true,
      hooks: {
        async resolveInput({ context, operation, inputData }) {
          if (operation === "create") {
            const { title } = inputData;
            if (title) {
              let slug = (0, import_slugify3.default)(title, {
                remove: /[*+~.()'"!:@]/g,
                lower: true,
                strict: true
              });
              const items = await context.query.Study.findMany({
                where: { slug: { startsWith: slug } },
                query: "id slug"
              });
              if (items.length) {
                const re = new RegExp(`${slug}-*\\d*$`);
                const slugs = items.filter((item) => item.slug.match(re));
                if (slugs.length) {
                  slug = `${slug}-${slugs.length}`;
                }
              }
              return slug;
            }
          } else {
            return inputData.slug;
          }
        }
      }
    }),
    description: (0, import_fields15.text)(),
    shortDescription: (0, import_fields15.text)(),
    image: (0, import_fields15.relationship)({
      ref: "StudyImage.study",
      ui: {
        displayMode: "cards",
        cardFields: ["image", "altText"],
        inlineCreate: { fields: ["image", "altText"] },
        inlineEdit: { fields: ["image", "altText"] }
      }
    }),
    settings: (0, import_fields15.json)(),
    info: (0, import_fields15.json)(),
    public: (0, import_fields15.checkbox)({ isFilterable: true }),
    featured: (0, import_fields15.checkbox)({ isFilterable: true }),
    submitForPublishing: (0, import_fields15.checkbox)({ isFilterable: true }),
    isHidden: (0, import_fields15.checkbox)({ isFilterable: true }),
    components: (0, import_fields15.json)(),
    flow: (0, import_fields15.json)(),
    diagram: (0, import_fields15.text)(),
    author: (0, import_fields15.relationship)({
      ref: "Profile.researcherIn",
      hooks: {
        async resolveInput({ context, operation, inputData }) {
          if (operation === "create") {
            return { connect: { id: context.session.itemId } };
          } else {
            return inputData.author;
          }
        }
      }
    }),
    collaborators: (0, import_fields15.relationship)({
      ref: "Profile.collaboratorInStudy",
      many: true,
      hooks: {
        async resolveInput({ context, operation, inputData }) {
          if (operation === "create") {
            return { connect: { id: context.session.itemId } };
          } else {
            return inputData.collaborators;
          }
        }
      }
    }),
    participants: (0, import_fields15.relationship)({
      ref: "Profile.participantIn",
      many: true
    }),
    consent: (0, import_fields15.relationship)({
      ref: "Consent.studies",
      many: true
    }),
    proposal: (0, import_fields15.relationship)({
      ref: "ProposalBoard.study",
      many: true
    }),
    descriptionInProposalCard: (0, import_fields15.relationship)({
      ref: "ProposalCard.studyDescription"
    }),
    classes: (0, import_fields15.relationship)({
      ref: "Class.studies",
      many: true
    }),
    reviews: (0, import_fields15.relationship)({
      ref: "Review.study",
      many: true
    }),
    tags: (0, import_fields15.relationship)({
      ref: "Tag.studies",
      many: true
    }),
    talks: (0, import_fields15.relationship)({
      ref: "Talk.studies",
      many: true
    }),
    datasets: (0, import_fields15.relationship)({
      ref: "Dataset.study",
      many: true
    }),
    createdAt: (0, import_fields15.timestamp)({
      defaultValue: { kind: "now" }
    }),
    updatedAt: (0, import_fields15.timestamp)()
  }
});

// schemas/StudyImage.ts
var import_core14 = require("@keystone-6/core");
var import_fields16 = require("@keystone-6/core/fields");
var import_cloudinary2 = require("@keystone-6/cloudinary");
var cloudinary2 = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_KEY,
  apiSecret: process.env.CLOUDINARY_SECRET,
  folder: "mindhive-studies"
};
var StudyImage = (0, import_core14.list)({
  access: {
    operation: {
      query: () => true,
      create: () => true,
      update: () => true,
      delete: () => true
    }
  },
  fields: {
    image: (0, import_cloudinary2.cloudinaryImage)({
      cloudinary: cloudinary2,
      label: "Source"
    }),
    altText: (0, import_fields16.text)(),
    study: (0, import_fields16.relationship)({ ref: "Study.image" })
  }
});

// schemas/Consent.ts
var import_core15 = require("@keystone-6/core");
var import_fields17 = require("@keystone-6/core/fields");
var import_uniqid2 = __toESM(require("uniqid"));
var Consent = (0, import_core15.list)({
  access: {
    operation: {
      query: () => true,
      create: () => true,
      update: () => true,
      delete: () => true
    }
  },
  fields: {
    code: (0, import_fields17.text)({
      isIndexed: "unique",
      isFilterable: true,
      access: {
        read: () => true,
        create: () => true,
        update: () => true
      },
      hooks: {
        async resolveInput({ operation }) {
          if (operation === "create") {
            return (0, import_uniqid2.default)();
          }
        }
      }
    }),
    title: (0, import_fields17.text)({ validation: { isRequired: true } }),
    public: (0, import_fields17.checkbox)(),
    description: (0, import_fields17.text)(),
    organization: (0, import_fields17.text)(),
    info: (0, import_fields17.json)(),
    settings: (0, import_fields17.json)(),
    author: (0, import_fields17.relationship)({
      ref: "Profile.consentCreatorIn",
      hooks: {
        async resolveInput({ context, operation, inputData }) {
          if (operation === "create") {
            return { connect: { id: context.session.itemId } };
          } else {
            return inputData.author;
          }
        }
      }
    }),
    collaborators: (0, import_fields17.relationship)({
      ref: "Profile.collaboratorInConsent",
      many: true,
      hooks: {
        async resolveInput({ context, operation, inputData }) {
          if (operation === "create") {
            return { connect: { id: context.session.itemId } };
          } else {
            return inputData.collaborators;
          }
        }
      }
    }),
    studies: (0, import_fields17.relationship)({
      ref: "Study.consent",
      many: true
    }),
    tasks: (0, import_fields17.relationship)({
      ref: "Task.consent",
      many: true
    }),
    createdAt: (0, import_fields17.timestamp)({
      defaultValue: { kind: "now" }
    }),
    updatedAt: (0, import_fields17.timestamp)()
  }
});

// schemas/Update.ts
var import_core16 = require("@keystone-6/core");
var import_fields18 = require("@keystone-6/core/fields");
var Update = (0, import_core16.list)({
  access: {
    operation: {
      query: () => true,
      create: () => true,
      update: () => true,
      delete: () => true
    }
  },
  fields: {
    user: (0, import_fields18.relationship)({
      ref: "Profile.updates"
    }),
    updateArea: (0, import_fields18.text)(),
    link: (0, import_fields18.text)(),
    content: (0, import_fields18.json)(),
    hasOpen: (0, import_fields18.checkbox)({ isFilterable: true }),
    createdAt: (0, import_fields18.timestamp)({
      defaultValue: { kind: "now" }
    }),
    updatedAt: (0, import_fields18.timestamp)()
  }
});

// schemas/Dataset.ts
var import_core17 = require("@keystone-6/core");
var import_fields19 = require("@keystone-6/core/fields");
var Dataset = (0, import_core17.list)({
  access: {
    operation: {
      query: () => true,
      create: () => true,
      update: () => true,
      delete: () => true
    }
  },
  fields: {
    token: (0, import_fields19.text)({
      isIndexed: "unique",
      isFilterable: true
    }),
    profile: (0, import_fields19.relationship)({
      ref: "Profile.datasets"
    }),
    template: (0, import_fields19.relationship)({
      ref: "Template.datasets"
    }),
    task: (0, import_fields19.relationship)({
      ref: "Task.datasets"
    }),
    study: (0, import_fields19.relationship)({
      ref: "Study.datasets"
    }),
    dataPolicy: (0, import_fields19.text)(),
    info: (0, import_fields19.json)(),
    isCompleted: (0, import_fields19.checkbox)({ isFilterable: true }),
    createdAt: (0, import_fields19.timestamp)({
      defaultValue: { kind: "now" }
    }),
    updatedAt: (0, import_fields19.timestamp)()
  }
});

// schemas/ProposalBoard.ts
var import_core18 = require("@keystone-6/core");
var import_fields20 = require("@keystone-6/core/fields");
var import_slugify4 = __toESM(require("slugify"));
var ProposalBoard = (0, import_core18.list)({
  access: {
    operation: {
      query: () => true,
      create: () => true,
      update: () => true,
      delete: () => true
    }
  },
  fields: {
    title: (0, import_fields20.text)({ validation: { isRequired: true } }),
    slug: (0, import_fields20.text)({
      validation: { isRequired: true },
      isIndexed: "unique",
      isFilterable: true,
      hooks: {
        async resolveInput({ context, inputData }) {
          const { title } = inputData;
          if (title) {
            let slug = (0, import_slugify4.default)(title, {
              remove: /[*+~.()'"!:@]/g,
              lower: true,
              strict: true
            });
            const items = await context.query.ProposalBoard.findMany({
              where: { slug: { startsWith: slug } },
              query: "id slug"
            });
            if (items.length) {
              const re = new RegExp(`${slug}-*\\d*$`);
              const slugs = items.filter((item) => item.slug.match(re));
              if (slugs.length) {
                slug = `${slug}-${slugs.length}`;
              }
            }
            return slug;
          }
        }
      }
    }),
    description: (0, import_fields20.text)(),
    isTemplate: (0, import_fields20.checkbox)({ isFilterable: true }),
    isSubmitted: (0, import_fields20.checkbox)({ isFilterable: true }),
    checklist: (0, import_fields20.json)(),
    settings: (0, import_fields20.json)(),
    creator: (0, import_fields20.relationship)({
      ref: "Profile.creatorOfProposal"
    }),
    author: (0, import_fields20.relationship)({
      ref: "Profile.authorOfProposal"
    }),
    study: (0, import_fields20.relationship)({
      ref: "Study.proposal"
    }),
    sections: (0, import_fields20.relationship)({
      ref: "ProposalSection.board",
      many: true
    }),
    reviews: (0, import_fields20.relationship)({
      ref: "Review.proposal",
      many: true
    }),
    createdAt: (0, import_fields20.timestamp)({
      defaultValue: { kind: "now" }
    }),
    updatedAt: (0, import_fields20.timestamp)()
  }
});

// schemas/ProposalSection.ts
var import_core19 = require("@keystone-6/core");
var import_fields21 = require("@keystone-6/core/fields");
var ProposalSection = (0, import_core19.list)({
  access: {
    operation: {
      query: () => true,
      create: () => true,
      update: () => true,
      delete: () => true
    }
  },
  fields: {
    title: (0, import_fields21.text)({ validation: { isRequired: true } }),
    description: (0, import_fields21.text)(),
    position: (0, import_fields21.float)(),
    board: (0, import_fields21.relationship)({
      ref: "ProposalBoard.sections"
    }),
    cards: (0, import_fields21.relationship)({
      ref: "ProposalCard.section",
      many: true
    }),
    createdAt: (0, import_fields21.timestamp)({
      defaultValue: { kind: "now" }
    }),
    updatedAt: (0, import_fields21.timestamp)()
  }
});

// schemas/ProposalCard.ts
var import_core20 = require("@keystone-6/core");
var import_fields22 = require("@keystone-6/core/fields");
var ProposalCard = (0, import_core20.list)({
  access: {
    operation: {
      query: () => true,
      create: () => true,
      update: () => true,
      delete: () => true
    }
  },
  fields: {
    title: (0, import_fields22.text)({ validation: { isRequired: true } }),
    description: (0, import_fields22.text)(),
    position: (0, import_fields22.float)(),
    content: (0, import_fields22.text)(),
    comment: (0, import_fields22.text)(),
    settings: (0, import_fields22.json)(),
    section: (0, import_fields22.relationship)({
      ref: "ProposalSection.cards"
    }),
    assignedTo: (0, import_fields22.relationship)({
      ref: "Profile.assignedToProposalCard",
      many: true
    }),
    studyDescription: (0, import_fields22.relationship)({
      ref: "Study.descriptionInProposalCard",
      many: true
    }),
    createdAt: (0, import_fields22.timestamp)({
      defaultValue: { kind: "now" }
    }),
    updatedAt: (0, import_fields22.timestamp)()
  }
});

// schemas/Review.ts
var import_core21 = require("@keystone-6/core");
var import_fields23 = require("@keystone-6/core/fields");
var Review = (0, import_core21.list)({
  access: {
    operation: {
      query: () => true,
      create: () => true,
      update: () => true,
      delete: () => true
    }
  },
  fields: {
    author: (0, import_fields23.relationship)({
      ref: "Profile.reviews"
    }),
    study: (0, import_fields23.relationship)({
      ref: "Study.reviews"
    }),
    proposal: (0, import_fields23.relationship)({
      ref: "ProposalBoard.reviews"
    }),
    settings: (0, import_fields23.json)(),
    content: (0, import_fields23.json)(),
    stage: (0, import_fields23.select)({
      options: [
        { label: "Individual", value: "INDIVIDUAL" },
        { label: "Synthesis", value: "SYNTHESIS" }
      ]
    }),
    createdAt: (0, import_fields23.timestamp)({
      defaultValue: { kind: "now" }
    }),
    updatedAt: (0, import_fields23.timestamp)()
  }
});

// schemas/Curriculum.ts
var import_core22 = require("@keystone-6/core");
var import_fields24 = require("@keystone-6/core/fields");
var import_slugify5 = __toESM(require("slugify"));
var Curriculum = (0, import_core22.list)({
  access: {
    operation: {
      query: () => true,
      create: () => true,
      update: () => true,
      delete: () => true
    }
  },
  fields: {
    title: (0, import_fields24.text)({ validation: { isRequired: true } }),
    slug: (0, import_fields24.text)({
      validation: { isRequired: true },
      isIndexed: "unique",
      isFilterable: true,
      hooks: {
        async resolveInput({ context, inputData }) {
          const { title } = inputData;
          if (title) {
            let slug = (0, import_slugify5.default)(title, {
              remove: /[*+~.()'"!:@]/g,
              lower: true,
              strict: true
            });
            const items = await context.query.Curriculum.findMany({
              where: { slug: { startsWith: slug } },
              query: "id slug"
            });
            if (items.length) {
              const re = new RegExp(`${slug}-*\\d*$`);
              const slugs = items.filter((item) => item.slug.match(re));
              if (slugs.length) {
                slug = `${slug}-${slugs.length}`;
              }
            }
            return slug;
          }
        }
      }
    }),
    description: (0, import_fields24.text)(),
    diagram: (0, import_fields24.text)(),
    author: (0, import_fields24.relationship)({
      ref: "Profile.authorOfCurriculum",
      hooks: {
        async resolveInput({ context, operation, inputData }) {
          if (operation === "create") {
            return { connect: { id: context.session.itemId } };
          } else {
            return inputData.author;
          }
        }
      }
    }),
    collaborators: (0, import_fields24.relationship)({
      ref: "Profile.collaboratorInCurriculum",
      many: true,
      hooks: {
        async resolveInput({ context, operation, inputData }) {
          if (operation === "create") {
            return { connect: { id: context.session.itemId } };
          } else {
            return inputData.collaborators;
          }
        }
      }
    }),
    settings: (0, import_fields24.json)(),
    createdAt: (0, import_fields24.timestamp)({
      defaultValue: { kind: "now" }
    }),
    updatedAt: (0, import_fields24.timestamp)()
  }
});

// schemas/Lesson.ts
var import_core23 = require("@keystone-6/core");
var import_fields25 = require("@keystone-6/core/fields");
var import_slugify6 = __toESM(require("slugify"));
var Lesson = (0, import_core23.list)({
  access: {
    operation: {
      query: () => true,
      create: () => true,
      update: () => true,
      delete: () => true
    }
  },
  fields: {
    title: (0, import_fields25.text)({ validation: { isRequired: true } }),
    slug: (0, import_fields25.text)({
      validation: { isRequired: true },
      isIndexed: "unique",
      isFilterable: true,
      hooks: {
        async resolveInput({ context, inputData }) {
          const { title } = inputData;
          if (title) {
            let slug = (0, import_slugify6.default)(title, {
              remove: /[*+~.()'"!:@]/g,
              lower: true,
              strict: true
            });
            const items = await context.query.Lesson.findMany({
              where: { slug: { startsWith: slug } },
              query: "id slug"
            });
            if (items.length) {
              const re = new RegExp(`${slug}-*\\d*$`);
              const slugs = items.filter((item) => item.slug.match(re));
              if (slugs.length) {
                slug = `${slug}-${slugs.length}`;
              }
            }
            return slug;
          }
        }
      }
    }),
    description: (0, import_fields25.text)(),
    type: (0, import_fields25.text)(),
    content: (0, import_fields25.text)(),
    settings: (0, import_fields25.json)(),
    author: (0, import_fields25.relationship)({
      ref: "Profile.authorOfLesson",
      hooks: {
        async resolveInput({ context, operation, inputData }) {
          if (operation === "create") {
            return { connect: { id: context.session.itemId } };
          } else {
            return inputData.author;
          }
        }
      }
    }),
    collaborators: (0, import_fields25.relationship)({
      ref: "Profile.collaboratorInLesson",
      many: true,
      hooks: {
        async resolveInput({ context, operation, inputData }) {
          if (operation === "create") {
            return { connect: { id: context.session.itemId } };
          } else {
            return inputData.collaborators;
          }
        }
      }
    }),
    isPublic: (0, import_fields25.checkbox)({ isFilterable: true }),
    isFeatured: (0, import_fields25.checkbox)({ isFilterable: true }),
    parent: (0, import_fields25.relationship)({
      ref: "Lesson.children"
    }),
    children: (0, import_fields25.relationship)({
      ref: "Lesson.parent",
      many: true
    }),
    tags: (0, import_fields25.relationship)({
      ref: "Tag.lessons",
      many: true
    }),
    createdAt: (0, import_fields25.timestamp)({
      defaultValue: { kind: "now" }
    }),
    updatedAt: (0, import_fields25.timestamp)()
  }
});

// schemas/Tag.ts
var import_core24 = require("@keystone-6/core");
var import_fields26 = require("@keystone-6/core/fields");
var import_slugify7 = __toESM(require("slugify"));
var Tag = (0, import_core24.list)({
  access: {
    operation: {
      query: () => true,
      create: () => true,
      update: () => true,
      delete: () => true
    }
  },
  fields: {
    title: (0, import_fields26.text)({ validation: { isRequired: true } }),
    slug: (0, import_fields26.text)({
      validation: { isRequired: true },
      isIndexed: "unique",
      isFilterable: true,
      hooks: {
        async resolveInput({ context, inputData }) {
          const { title } = inputData;
          if (title) {
            let slug = (0, import_slugify7.default)(title, {
              remove: /[*+~.()'"!:@]/g,
              lower: true,
              strict: true
            });
            const items = await context.query.Study.findMany({
              where: { slug: { startsWith: slug } },
              query: "id slug"
            });
            if (items.length) {
              const re = new RegExp(`${slug}-*\\d*$`);
              const slugs = items.filter((item) => item.slug.match(re));
              if (slugs.length) {
                slug = `${slug}-${slugs.length}`;
              }
            }
            return slug;
          }
        }
      }
    }),
    description: (0, import_fields26.text)(),
    lessons: (0, import_fields26.relationship)({
      ref: "Lesson.tags",
      many: true
    }),
    assignments: (0, import_fields26.relationship)({
      ref: "Assignment.tags",
      many: true
    }),
    resources: (0, import_fields26.relationship)({
      ref: "Resource.tags",
      many: true
    }),
    homeworks: (0, import_fields26.relationship)({
      ref: "Homework.tags",
      many: true
    }),
    studies: (0, import_fields26.relationship)({
      ref: "Study.tags",
      many: true
    }),
    level: (0, import_fields26.integer)(),
    parent: (0, import_fields26.relationship)({
      ref: "Tag.children"
    }),
    children: (0, import_fields26.relationship)({
      ref: "Tag.parent",
      many: true
    }),
    createdAt: (0, import_fields26.timestamp)({
      defaultValue: { kind: "now" }
    }),
    updatedAt: (0, import_fields26.timestamp)()
  }
});

// schemas/Assignment.ts
var import_core25 = require("@keystone-6/core");
var import_fields27 = require("@keystone-6/core/fields");
var import_uniqid3 = __toESM(require("uniqid"));
var Assignment = (0, import_core25.list)({
  access: {
    operation: {
      query: () => true,
      create: () => true,
      update: () => true,
      delete: () => true
    }
  },
  fields: {
    code: (0, import_fields27.text)({
      isIndexed: "unique",
      isFilterable: true,
      access: {
        read: () => true,
        create: () => true,
        update: () => true
      },
      hooks: {
        async resolveInput({ operation }) {
          if (operation === "create") {
            return (0, import_uniqid3.default)();
          }
        }
      }
    }),
    author: (0, import_fields27.relationship)({
      ref: "Profile.authorOfAssignment",
      hooks: {
        async resolveInput({ context, operation, inputData }) {
          if (operation === "create") {
            return { connect: { id: context.session.itemId } };
          } else {
            return inputData.author;
          }
        }
      }
    }),
    classes: (0, import_fields27.relationship)({
      ref: "Class.assignments",
      many: true
    }),
    homework: (0, import_fields27.relationship)({
      ref: "Homework.assignment",
      many: true
    }),
    title: (0, import_fields27.text)({ validation: { isRequired: true } }),
    content: (0, import_fields27.text)(),
    settings: (0, import_fields27.json)(),
    public: (0, import_fields27.checkbox)({ isFilterable: true }),
    isTemplate: (0, import_fields27.checkbox)({ isFilterable: true }),
    tags: (0, import_fields27.relationship)({
      ref: "Tag.assignments",
      many: true
    }),
    createdAt: (0, import_fields27.timestamp)({
      defaultValue: { kind: "now" }
    }),
    updatedAt: (0, import_fields27.timestamp)()
  }
});

// schemas/Resource.ts
var import_core26 = require("@keystone-6/core");
var import_fields28 = require("@keystone-6/core/fields");
var import_uniqid4 = __toESM(require("uniqid"));
var Resource = (0, import_core26.list)({
  access: {
    operation: {
      query: () => true,
      create: () => true,
      update: () => true,
      delete: () => true
    }
  },
  fields: {
    code: (0, import_fields28.text)({
      isIndexed: "unique",
      isFilterable: true,
      access: {
        read: () => true,
        create: () => true,
        update: () => true
      },
      hooks: {
        async resolveInput({ operation }) {
          if (operation === "create") {
            return (0, import_uniqid4.default)();
          }
        }
      }
    }),
    author: (0, import_fields28.relationship)({
      ref: "Profile.authorOfResource",
      hooks: {
        async resolveInput({ context, operation, inputData }) {
          if (operation === "create") {
            return { connect: { id: context.session.itemId } };
          } else {
            return inputData.author;
          }
        }
      }
    }),
    classes: (0, import_fields28.relationship)({
      ref: "Class.resources",
      many: true
    }),
    homework: (0, import_fields28.relationship)({
      ref: "Homework.resources",
      many: true
    }),
    title: (0, import_fields28.text)({ validation: { isRequired: true } }),
    content: (0, import_fields28.text)(),
    settings: (0, import_fields28.json)(),
    public: (0, import_fields28.checkbox)({ isFilterable: true }),
    isTemplate: (0, import_fields28.checkbox)({ isFilterable: true }),
    tags: (0, import_fields28.relationship)({
      ref: "Tag.resources",
      many: true
    }),
    createdAt: (0, import_fields28.timestamp)({
      defaultValue: { kind: "now" }
    }),
    updatedAt: (0, import_fields28.timestamp)()
  }
});

// schemas/Homework.ts
var import_core27 = require("@keystone-6/core");
var import_fields29 = require("@keystone-6/core/fields");
var import_uniqid5 = __toESM(require("uniqid"));
var Homework = (0, import_core27.list)({
  access: {
    operation: {
      query: () => true,
      create: () => true,
      update: () => true,
      delete: () => true
    }
  },
  fields: {
    code: (0, import_fields29.text)({
      isIndexed: "unique",
      isFilterable: true,
      access: {
        read: () => true,
        create: () => true,
        update: () => true
      },
      hooks: {
        async resolveInput({ operation }) {
          if (operation === "create") {
            return (0, import_uniqid5.default)();
          }
        }
      }
    }),
    author: (0, import_fields29.relationship)({
      ref: "Profile.authorOfHomework",
      hooks: {
        async resolveInput({ context, operation, inputData }) {
          if (operation === "create") {
            return { connect: { id: context.session.itemId } };
          } else {
            return inputData.author;
          }
        }
      }
    }),
    assignment: (0, import_fields29.relationship)({
      ref: "Assignment.homework"
    }),
    resources: (0, import_fields29.relationship)({
      ref: "Resource.homework"
    }),
    title: (0, import_fields29.text)({ validation: { isRequired: true } }),
    content: (0, import_fields29.text)(),
    settings: (0, import_fields29.json)(),
    public: (0, import_fields29.checkbox)({ isFilterable: true }),
    tags: (0, import_fields29.relationship)({
      ref: "Tag.homeworks",
      many: true
    }),
    createdAt: (0, import_fields29.timestamp)({
      defaultValue: { kind: "now" }
    }),
    updatedAt: (0, import_fields29.timestamp)()
  },
  graphql: {
    plural: "homeworks"
  }
});

// schema.ts
var lists = {
  Profile,
  ProfileImage,
  Permission,
  Class,
  ClassNetwork,
  Report,
  Journal,
  Post,
  Talk,
  Word,
  Template,
  Task,
  Study,
  StudyImage,
  Consent,
  Update,
  Dataset,
  ProposalBoard,
  ProposalSection,
  ProposalCard,
  Review,
  Curriculum,
  Lesson,
  Tag,
  Assignment,
  Resource,
  Homework
};

// auth.ts
var import_crypto = require("crypto");
var import_auth = require("@keystone-6/auth");
var import_session = require("@keystone-6/core/session");
var sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && process.env.NODE_ENV !== "production") {
  sessionSecret = (0, import_crypto.randomBytes)(32).toString("hex");
}
var { withAuth } = (0, import_auth.createAuth)({
  listKey: "Profile",
  identityField: "email",
  sessionData: "username",
  secretField: "password",
  initFirstItem: {
    fields: ["username", "email", "password"]
  },
  passwordResetLink: {
    async sendToken(args) {
      await sendPasswordResetEmail(args.token, args.identity);
    }
  }
});
var sessionMaxAge = 60 * 60 * 24 * 30;
var session = (0, import_session.statelessSessions)({
  maxAge: sessionMaxAge,
  secret: sessionSecret
});

// keystone.ts
var keystone_default = withAuth(
  (0, import_core28.config)({
    server: {
      cors: {
        origin: [
          process.env.NODE_ENV === "development" ? process.env.FRONTEND_URL_DEV : process.env.FRONTEND_URL
        ],
        credentials: true
      }
    },
    db: {
      provider: "postgresql",
      url: process.env.NODE_ENV === "development" ? process.env.DATABASE_DEV : process.env.DATABASE_URL
    },
    lists,
    extendGraphqlSchema,
    session
  })
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
