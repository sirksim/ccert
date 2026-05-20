import type { EarnerWithCertificate } from "@databases/types";

type DashboardStats = {
  totalCertificates: number;
  validCertificates: number;
  expiredCertificates: number;
  expiringSoon: number;
  totalEarners: number;
  totalUsers: number;
};

type DashboardProps = {
  stats: DashboardStats;
  expiringSoon: EarnerWithCertificate[];
  recentAdditions: EarnerWithCertificate[];
};

const getPercent = (value: number, total: number) => {
  if (total === 0) {
    return 0;
  }

  return Math.round((value / total) * 100);
};

const getInitials = (firstName: string, lastName: string) =>
  `${lastName[0] ?? ""}${firstName[0] ?? ""}`.toUpperCase();

function CertificateList({
  items,
  emptyMessage,
}: {
  items: EarnerWithCertificate[];
  emptyMessage: string;
}) {
  return items.length === 0 ? (
    <p className="dashboard-empty">{emptyMessage}</p>
  ) : (
    <ul className="dashboard-list">
      {items.map((item) => (
        <li key={(item.certificate_id ?? item.earner_id).toBase64()}>
          <div className="avatar avatar-sm">
            <span>{getInitials(item.first_name, item.last_name)}</span>
          </div>
          <div>
            <strong>{item.full_name}</strong>
            <span>
              {item.certificate_code ?? "Sans certificat"} · {item.company_name}
            </span>
          </div>
          <div className="dashboard-list-date">
            {item.expiry_date ? (
              <relative-time datetime={item.expiry_date}>
                {item.expiry_date}
              </relative-time>
            ) : (
              "—"
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function Dashboard({
  stats,
  expiringSoon,
  recentAdditions,
}: DashboardProps) {
  const validPercent = getPercent(
    stats.validCertificates,
    stats.totalCertificates,
  );
  const expiredPercent = getPercent(
    stats.expiredCertificates,
    stats.totalCertificates,
  );

  return (
    <main>
      <div className="container dashboard-page">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">Vue d'ensemble</p>
            <h1>Dashboard</h1>
            <p>
              Suivi global des certificats, des certifiés et des utilisateurs.
            </p>
          </div>
          <a href="/earners" className="dashboard-action">
            <i className="fa-solid fa-plus" aria-hidden="true"></i>
            Ajouter un certifié
          </a>
        </header>

        <section className="dashboard-stats" aria-label="Résumé">
          <article className="dashboard-card primary-card">
            <span className="card-icon">
              <i className="fa-solid fa-certificate"></i>
            </span>
            <div>
              <p>Total certificats</p>
              <strong>{stats.totalCertificates}</strong>
            </div>
          </article>

          <article className="dashboard-card">
            <span className="card-icon">
              <i className="fa-solid fa-user-graduate"></i>
            </span>
            <div>
              <p>Certifiés</p>
              <strong>{stats.totalEarners}</strong>
            </div>
          </article>

          <article className="dashboard-card warning-card">
            <span className="card-icon">
              <i className="fa-solid fa-hourglass-half"></i>
            </span>
            <div>
              <p>Expirent bientôt</p>
              <strong>{stats.expiringSoon}</strong>
            </div>
          </article>

          <article className="dashboard-card danger-card">
            <span className="card-icon">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </span>
            <div>
              <p>Expirés</p>
              <strong>{stats.expiredCertificates}</strong>
            </div>
          </article>
        </section>

        <section className="dashboard-grid">
          <article className="dashboard-panel status-panel">
            <div className="panel-header">
              <div>
                <h2>Certificats par statut</h2>
                <p>Répartition des certificats actifs et expirés.</p>
              </div>
            </div>

            <div
              className="status-chart"
              aria-label={`${validPercent}% valides`}
            >
              <div
                className="status-ring"
                style={`--valid-percent: ${validPercent}; --expired-percent: ${expiredPercent};`}
              >
                <strong>{validPercent}%</strong>
                <span>valides</span>
              </div>
              <div className="status-legend">
                <span>
                  <i className="legend-dot valid-dot"></i>
                  Valides <strong>{stats.validCertificates}</strong>
                </span>
                <span>
                  <i className="legend-dot expired-dot"></i>
                  Expirés <strong>{stats.expiredCertificates}</strong>
                </span>
              </div>
            </div>
          </article>

          <article className="dashboard-panel users-panel">
            <div className="panel-header">
              <div>
                <h2>Utilisateurs</h2>
                <p>Comptes actifs sur la plateforme.</p>
              </div>
            </div>
            <div className="big-number">
              <strong>{stats.totalUsers}</strong>
              <span>utilisateur{stats.totalUsers > 1 ? "s" : ""}</span>
            </div>
          </article>
        </section>

        <section className="dashboard-grid dashboard-grid-lists">
          <article className="dashboard-panel">
            <div className="panel-header">
              <div>
                <h2>Certificats bientôt expirés</h2>
                <p>Échéances dans les 30 prochains jours.</p>
              </div>
              <a href="/earners">Voir tout</a>
            </div>
            <CertificateList
              items={expiringSoon}
              emptyMessage="Aucun certificat n'expire dans les 30 prochains jours."
            />
          </article>

          <article className="dashboard-panel">
            <div className="panel-header">
              <div>
                <h2>Ajouts récents</h2>
                <p>Derniers certifiés enregistrés.</p>
              </div>
              <a href="/earners">Voir tout</a>
            </div>
            <CertificateList
              items={recentAdditions}
              emptyMessage="Aucun certifié enregistré pour le moment."
            />
          </article>
        </section>
      </div>
    </main>
  );
}
