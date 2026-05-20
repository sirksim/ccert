import type {
  AuditAction,
  EntityType,
  ExpandedAuditLog,
} from "@databases/types";

type ParsedDetails = {
  message: string;
  entries: Array<[string, string]>;
};

const actionMeta: Record<
  AuditAction,
  { label: string; icon: string; tone: string }
> = {
  CREATE: { label: "Création", icon: "fa-plus", tone: "success" },
  UPDATE: { label: "Modification", icon: "fa-pen", tone: "warning" },
  DELETE: { label: "Suppression", icon: "fa-trash", tone: "danger" },
  LOGIN: { label: "Connexion", icon: "fa-right-to-bracket", tone: "info" },
  LOGOUT: { label: "Déconnexion", icon: "fa-right-from-bracket", tone: "info" },
};

const entityLabels: Record<EntityType, string> = {
  certificate: "Certificat",
  earner: "Certifié",
  user: "Utilisateur",
};

const parseDetails = (detailsString: string | null): ParsedDetails => {
  if (!detailsString) {
    return { message: "Action enregistrée", entries: [] };
  }

  try {
    const parsed = JSON.parse(detailsString) as Record<string, unknown>;
    const message =
      typeof parsed.message === "string" && parsed.message.trim().length > 0
        ? parsed.message
        : "Action enregistrée";

    const entries = Object.entries(parsed)
      .filter(([key]) => key !== "message")
      .map(
        ([key, value]) =>
          [
            key
              .replaceAll("_", " ")
              .replace(/^./, (letter) => letter.toUpperCase()),
            typeof value === "object" && value !== null
              ? JSON.stringify(value)
              : String(value ?? "—"),
          ] as [string, string],
      );

    return { message, entries };
  } catch {
    return { message: detailsString, entries: [] };
  }
};

const formatDateHeading = (dateTime: string) => {
  const date = new Date(`${dateTime.replace(" ", "T")}Z`);

  if (Number.isNaN(date.getTime())) {
    return "Date inconnue";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "full",
  }).format(date);
};

const countByAction = (logs: ExpandedAuditLog[], action: AuditAction) =>
  logs.filter((log) => log.action === action).length;

export default function History({ logs }: { logs: ExpandedAuditLog[] }) {
  const groupedLogs = logs.reduce<Record<string, ExpandedAuditLog[]>>(
    (groups, log) => {
      const date = log.created_at.split(" ")[0] || "unknown";
      groups[date] = groups[date] ?? [];
      groups[date].push(log);
      return groups;
    },
    {},
  );

  return (
    <main>
      <div className="container history-page">
        <header className="history-header">
          <div>
            <p className="eyebrow">Registre d'audit</p>
            <h1>Historiques</h1>
            <p>
              Suivez les actions importantes effectuées sur les certifiés, les
              certificats et les utilisateurs.
            </p>
          </div>
          <div className="history-total">
            <strong>{logs.length}</strong>
            <span>évènement{logs.length > 1 ? "s" : ""}</span>
          </div>
        </header>

        <section className="history-stats" aria-label="Résumé des activités">
          <article className="stat-card">
            <span className="stat-icon stat-icon-success">
              <i className="fa-solid fa-plus"></i>
            </span>
            <div>
              <strong>{countByAction(logs, "CREATE")}</strong>
              <span>Créations</span>
            </div>
          </article>
          <article className="stat-card">
            <span className="stat-icon stat-icon-warning">
              <i className="fa-solid fa-pen"></i>
            </span>
            <div>
              <strong>{countByAction(logs, "UPDATE")}</strong>
              <span>Modifications</span>
            </div>
          </article>
          <article className="stat-card">
            <span className="stat-icon stat-icon-danger">
              <i className="fa-solid fa-trash"></i>
            </span>
            <div>
              <strong>{countByAction(logs, "DELETE")}</strong>
              <span>Suppressions</span>
            </div>
          </article>
          <article className="stat-card">
            <span className="stat-icon stat-icon-info">
              <i className="fa-solid fa-right-to-bracket"></i>
            </span>
            <div>
              <strong>{countByAction(logs, "LOGIN")}</strong>
              <span>Connexions</span>
            </div>
          </article>
        </section>

        {logs.length === 0 ? (
          <section className="empty-history">
            <span>
              <i className="fa-solid fa-clock-rotate-left"></i>
            </span>
            <h2>Aucune activité enregistrée</h2>
            <p>Les futures actions apparaîtront ici automatiquement.</p>
          </section>
        ) : (
          <section
            className="history-timeline"
            aria-label="Liste des activités"
          >
            {Object.entries(groupedLogs).map(([date, dayLogs]) => (
              <article className="timeline-day" key={date}>
                <h2>{formatDateHeading(`${date} 00:00:00`)}</h2>
                <ol>
                  {dayLogs.map((log) => {
                    const action = actionMeta[log.action];
                    const details = parseDetails(log.details);
                    const initials =
                      (log.actor_first_name?.[0] || "") +
                        (log.actor_last_name?.[0] || "") || "SY";

                    return (
                      <li className="timeline-item" key={log.log_id.toString()}>
                        <div
                          className={`timeline-marker marker-${action.tone}`}
                        >
                          <i className={`fa-solid ${action.icon}`}></i>
                        </div>

                        <div className="history-entry">
                          <div className="entry-main">
                            <div className="entry-title-row">
                              <span
                                className={`action-pill action-${action.tone}`}
                              >
                                {action.label}
                              </span>
                              <span className="entity-pill">
                                {entityLabels[log.entity_type]}
                              </span>
                            </div>

                            <h3>{details.message}</h3>

                            <div className="entry-meta">
                              <span className="actor-chip">
                                <span className="avatar avatar-sm">
                                  {initials}
                                </span>
                                <span>
                                  <strong>
                                    {log.actor_full_name || "Système"}
                                  </strong>
                                  {log.actor_email && (
                                    <small>{log.actor_email}</small>
                                  )}
                                </span>
                              </span>
                              <span className="entry-time">
                                <i className="fa-regular fa-clock"></i>
                                <relative-time
                                  datetime={`${log.created_at.replace(" ", "T")}Z`}
                                >
                                  {log.created_at}
                                </relative-time>
                              </span>
                            </div>
                          </div>

                          {details.entries.length > 0 && (
                            <details className="entry-details">
                              <summary>Voir les détails</summary>
                              <dl>
                                {details.entries.map(([key, value]) => (
                                  <div key={key}>
                                    <dt>{key}</dt>
                                    <dd>{value}</dd>
                                  </div>
                                ))}
                              </dl>
                            </details>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
