import Database from "bun:sqlite";

const connection = new Database("ccert.db");

export default connection;
