import { database } from "@/db";
import type { ExtractTablesWithRelations } from "drizzle-orm";
import type { PgTransaction } from "drizzle-orm/pg-core";
import type { PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js";

export type GetWorkspacePropsType = Parameters<
  typeof database.query.workspaces.findFirst
>[0];

export type GetWorkspacesPropsType = Parameters<
  typeof database.query.workspaces.findMany
>[0];

export type GetPagePropsType = Parameters<
  typeof database.query.pages.findFirst
>[0];

export type GetPagesPropsType = Parameters<
  typeof database.query.pages.findMany
>[0];

export type GetWorkspaceMemberPropsType = Parameters<
  typeof database.query.workspaceMembers.findFirst
>[0];

export type TX = PgTransaction<
  PostgresJsQueryResultHKT,
  typeof import("@/db/schema"),
  ExtractTablesWithRelations<typeof import("@/db/schema")>
>;
