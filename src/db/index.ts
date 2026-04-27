import Database from "bun:sqlite";
import type {
  CertificateID as CertID,
  Certificate,
  Earner,
  EarnerID,
  InsertCertificateDTO,
  InsertEarnerDTO,
} from "./types";
import { generateId } from "./utils";

const connection = new Database("ccert.db");
export const db = {
  earners: {
    getAll: (): Earner[] => {
      return connection
        .query("SELECT * FROM earners WHERE deleted_at IS NULL")
        .all() as Earner[];
    },
    insert: (data: InsertEarnerDTO): Earner => {
      const earnerID = generateId<EarnerID>();
      const earner: Earner = {};
      return earner;
    },
  },
  users: {},
  certificate: {
    insert: (data: InsertCertificateDTO): Certificate => {
      const certID = generateId<CertID>();
      const cert: Certificate = {};

      return cert;
    },
  },
  transaction: <T>(callback: () => T): T => {
    const tx = connection.transaction(callback);
    return tx();
  },
};
