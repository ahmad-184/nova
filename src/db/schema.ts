import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  pgEnum,
  index,
  unique,
} from "drizzle-orm/pg-core";
import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from "drizzle-zod";

import { createUUID } from "@/utils/uuid";
import { fileIcon } from "@/icons/file-icon";

export const workspaceMemberRoles = pgEnum("workspace_member_role", [
  "FULL_ACCESS",
  "EDIT_ACCESS",
  "GUEST_ACCESS",
]);
export const pageCollaboratorRoles = pgEnum("page_collaborator_role", [
  "FULL_ACCESS",
  "EDIT_ACCESS",
  "VIEW_ACCESS",
]);

export const users = pgTable("nv_user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const sessions = pgTable("nv_session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const accounts = pgTable("nv_account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verifications = pgTable("nv_verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const workspaces = pgTable(
  "nv_workspace",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createUUID()),
    name: text("name").notNull(),
    ownerId: text("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    icon: text("icon"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  t => [index("idx_workspaces_owner_id").on(t.ownerId)]
);

export const workspaceMembers = pgTable(
  "nv_workspace_member",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createUUID()),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: workspaceMemberRoles("role").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  t => [
    unique("uniq_workspace_user").on(t.workspaceId, t.userId),
    index("idx_workspace_member_workspace_id").on(t.workspaceId),
    index("idx_workspace_member_user_id").on(t.userId),
    index("idx_workspace_member_workspace_id_user_id").on(
      t.workspaceId,
      t.userId
    ),
    index("idx_workspace_member_role").on(t.role),
    index("idx_workspace_member_workspace_id_user_id_role").on(
      t.workspaceId,
      t.userId,
      t.role
    ),
  ]
);

export const workspaceInvitations = pgTable(
  "nv_workspace_invitation",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createUUID()),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    email: text("email")
      .references(() => users.email, { onDelete: "cascade" })
      .notNull(),
    role: workspaceMemberRoles("role").default("EDIT_ACCESS"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  t => [index("idx_workspace_invitations_email").on(t.email)]
);

export const pages = pgTable(
  "nv_page",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createUUID()),
    name: text("name"),
    icon: text("icon").default(fileIcon),
    inTrash: boolean("in_trash").default(false),
    isShared: boolean("is_shared").default(false),
    isPublished: boolean("is_published").default(false),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    parentPageId: text("parent_page_id"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  t => [
    index("idx_pages_workspace_id").on(t.workspaceId),
    index("idx_pages_parent_page_id").on(t.parentPageId),
    index("idx_pages_in_trash").on(t.inTrash),
    index("idx_pages_is_shared").on(t.isShared),
  ]
);

export const pageCollaborators = pgTable(
  "nv_page_collaborator",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createUUID()),
    pageId: text("page_id")
      .notNull()
      .references(() => pages.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    role: pageCollaboratorRoles("role").default("VIEW_ACCESS").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  t => [
    index("page_collaborators_page_id_user_id_idx").on(t.pageId, t.userId),
    index("idx_page_collaborators_workspace_id").on(t.workspaceId),
    index("idx_page_collaborators_page_id").on(t.pageId),
    index("idx_page_collaborators_user_id").on(t.userId),
    index("idx_page_collaborators_workspace_id_user_id").on(
      t.workspaceId,
      t.userId
    ),
    unique("uniq_page_collaborator_user").on(t.pageId, t.userId),
  ]
);

export const documents = pgTable(
  "nv_document",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createUUID()),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    pageId: text("page_id")
      .notNull()
      .references(() => pages.id, { onDelete: "cascade" }),
    banner: text("banner"),
    content: text("content").default("{}"),
    isPublished: boolean("is_published").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  t => [
    index("idx_documents_workspace_id").on(t.workspaceId),
    index("idx_documents_page_id").on(t.pageId),
    index("idx_documents_is_published").on(t.isPublished),
    index("idx_documents_workspace_id_page_id").on(t.workspaceId, t.pageId),
  ]
);

// Table Relations

export const workspaceRelations = relations(workspaces, ({ many }) => ({
  members: many(workspaceMembers),
  pages: many(pages),
  pageCollaborators: many(pageCollaborators),
  documents: many(documents),
}));

export const workspaceMembersRelations = relations(
  workspaceMembers,
  ({ one }) => ({
    workspace: one(workspaces, {
      fields: [workspaceMembers.workspaceId],
      references: [workspaces.id],
    }),
    user: one(users, {
      fields: [workspaceMembers.userId],
      references: [users.id],
    }),
  })
);

export const workspaceInvitationsRelations = relations(
  workspaceInvitations,
  ({ one }) => ({
    workspace: one(workspaces, {
      fields: [workspaceInvitations.workspaceId],
      references: [workspaces.id],
    }),
    user: one(users, {
      fields: [workspaceInvitations.email],
      references: [users.email],
    }),
  })
);

export const pagesRelations = relations(pages, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [pages.workspaceId],
    references: [workspaces.id],
  }),
  parentPage: one(pages, {
    fields: [pages.parentPageId],
    references: [pages.id],
    relationName: "page_parent",
  }),
}));

export const pageCollaboratorsRelations = relations(
  pageCollaborators,
  ({ one }) => ({
    page: one(pages, {
      fields: [pageCollaborators.pageId],
      references: [pages.id],
    }),
    user: one(users, {
      fields: [pageCollaborators.userId],
      references: [users.id],
    }),
    workspace: one(workspaces, {
      fields: [pageCollaborators.workspaceId],
      references: [workspaces.id],
    }),
  })
);

export const documentsRelations = relations(documents, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [documents.workspaceId],
    references: [workspaces.id],
  }),
  page: one(pages, {
    fields: [documents.pageId],
    references: [pages.id],
  }),
}));

/////////////////////////////////////////////////////////////////////////////////
// Schema Types
export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Account = typeof accounts.$inferSelect;
export type Verification = typeof verifications.$inferSelect;
export type Workspace = typeof workspaces.$inferSelect;
export type WorkspaceMember = typeof workspaceMembers.$inferSelect;
export type WorkspaceInvitation = typeof workspaceInvitations.$inferSelect;
export type Page = typeof pages.$inferSelect;
export type PageCollaborator = typeof pageCollaborators.$inferSelect;
export type Document = typeof documents.$inferSelect;

export type UserInsert = typeof users.$inferInsert;
export type SessionInsert = typeof sessions.$inferInsert;
export type AccountInsert = typeof accounts.$inferInsert;
export type VerificationInsert = typeof verifications.$inferInsert;
export type WorkspaceInsert = typeof workspaces.$inferInsert;
export type WorkspaceMemberInsert = typeof workspaceMembers.$inferInsert;
export type WorkspaceInvitationInsert =
  typeof workspaceInvitations.$inferInsert;
export type PageInsert = typeof pages.$inferInsert;
export type PageCollaboratorInsert = typeof pageCollaborators.$inferInsert;
export type DocumentInsert = typeof documents.$inferInsert;

/////////////////////////////////////////////////////////////////////////////////
// Schema Zod Schemas
export const workspaceSelectSchema = createSelectSchema(workspaces);
export const workspaceInsertSchema = createInsertSchema(workspaces);
export const workspaceUpdateSchema = createUpdateSchema(workspaces);

export const workspaceMemberSelectSchema = createSelectSchema(workspaceMembers);
export const workspaceMemberInsertSchema = createInsertSchema(workspaceMembers);
export const workspaceMemberUpdateSchema = createUpdateSchema(workspaceMembers);

export const workspaceInvitationSelectSchema =
  createSelectSchema(workspaceInvitations);
export const workspaceInvitationInsertSchema =
  createInsertSchema(workspaceInvitations);
export const workspaceInvitationUpdateSchema =
  createUpdateSchema(workspaceInvitations);

export const pageSelectSchema = createSelectSchema(pages);
export const pageInsertSchema = createInsertSchema(pages);
export const pageUpdateSchema = createUpdateSchema(pages);

export const pageCollaboratorSelectSchema =
  createSelectSchema(pageCollaborators);
export const pageCollaboratorInsertSchema =
  createInsertSchema(pageCollaborators);
export const pageCollaboratorUpdateSchema =
  createUpdateSchema(pageCollaborators);

export const documentSelectSchema = createSelectSchema(documents);
export const documentInsertSchema = createInsertSchema(documents);
export const documentUpdateSchema = createUpdateSchema(documents);

export const workspaceMemberRoleSchema = workspaceMemberSelectSchema.shape.role;
export const pageCollaboratorRoleSchema =
  pageCollaboratorSelectSchema.shape.role;
