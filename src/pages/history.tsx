import type { ExpandedAuditLog } from "@databases/types";

export default function History({ logs }: { logs: ExpandedAuditLog[] }) {
  const getLogMessage = (detailsString: string) => {
    try {
      const parsed = JSON.parse(detailsString);
      return parsed.message || "Action enregistrée";
    } catch {
      return "Détails non disponibles";
    }
  };

  return (
    <main className="page-container">
      <div className="content-card">
        <header className="page-header">
          <div className="header-titles">
            <h1>Historiques</h1>
            <p className="subtitle">Registre d'audit et activités du système</p>
          </div>
          <button className="btn-outline">Exporter (CSV)</button>
        </header>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Utilisateur</th>
                <th>Action</th>
                <th>Cible</th>
                <th>Détails</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{ textAlign: "center", padding: "2rem" }}
                  >
                    Aucun historique trouvé.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.log_id.toString()}>
                    <td
                      className="font-mono text-muted"
                      style={{ fontSize: "0.85rem" }}
                    >
                      <relative-time
                        datetime={log.created_at.replace(" ", "T") + "Z"}
                        formatStyle="short"
                      >
                        {log.created_at}
                      </relative-time>
                    </td>

                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <div className="avatar avatar-sm">
                          <span>
                            {(log.actor_first_name?.[0] || "") +
                              (log.actor_last_name?.[0] || "")}
                          </span>
                        </div>
                        <span className="font-semibold text-main">
                          {log.actor_full_name || "Système"}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`badge badge-action-${log.action.toLowerCase()}`}
                      >
                        {log.action}
                      </span>
                    </td>

                    <td
                      style={{
                        textTransform: "capitalize",
                        color: "var(--text-muted)",
                      }}
                    >
                      {log.entity_type}
                    </td>

                    <td
                      className="text-main"
                      style={{
                        maxWidth: "300px",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                    >
                      {getLogMessage(log.details)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
