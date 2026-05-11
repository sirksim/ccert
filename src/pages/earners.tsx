import type { EarnerWithCertificate } from "@databases/types";

export default function Earners({
  earners,
}: {
  earners: EarnerWithCertificate[];
}) {
  return (
    <main>
      <div className="container">
        <header className="page-header">
          <div className="header-titles">
            <h1>Earners</h1>
            {earners && (
              <p className="subtitle">
                {earners.length} earner{earners.length > 1 ? "s" : ""}
              </p>
            )}
          </div>
          <button
            className="btn-primary"
            command="show-modal"
            commandfor="addEarnerDialog"
          >
            Add New Earner
          </button>
        </header>

        {earners && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th className="w-checkbox">
                    <input type="checkbox" name="selectAll" id="selectAll" />
                  </th>
                  <th>Avatar</th>
                  <th>Name</th>
                  <th>Job</th>
                  <th>Company</th>
                  <th>Laureat</th>
                  <th>Code</th>
                  <th>Status</th>
                  <th>Issued At</th>
                  <th>Expiry Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {earners.map((earner) => (
                  <tr key={earner.earner_id.toBase64()}>
                    <td data-label="Sélectionner">
                      <input type="checkbox" name="selectOne" />
                    </td>
                    <td data-label="Avatar">
                      <div className="avatar avatar-sm">
                        <span>
                          {earner.last_name[0]}
                          {earner.first_name[0]}
                        </span>
                      </div>
                    </td>
                    <td
                      data-label="Full Name"
                      className="font-semibold text-main"
                    >
                      {earner.full_name}
                    </td>
                    <td data-label="Job Title">{earner.job_title}</td>
                    <td data-label="Company Name">{earner.company_name}</td>
                    <td data-label="Laureat">
                      <span
                        className={
                          earner.is_laureat === 1 ? "badge badge-laureat" : ""
                        }
                      >
                        {earner.is_laureat === 1 && (
                          <i class="fa-solid fa-star"></i>
                        )}
                        {earner.is_laureat === 1 ? "Laureate" : ""}
                      </span>
                    </td>
                    <td data-label="Code" className="font-mono">
                      {earner.certificate_code}
                    </td>
                    <td data-label="Status">
                      <span
                        className={`badge ${earner.certificate_status === "valide" ? "badge-success" : "badge-danger"}`}
                      >
                        {earner.certificate_status}
                      </span>
                    </td>
                    <td data-label="Issued At">
                      <relative-time datetime={earner.issued_at}>
                        {earner.issued_at}
                      </relative-time>
                    </td>
                    <td data-label="Expiry Date">
                      <relative-time datetime={earner.expiry_date}>
                        {earner.expiry_date}
                      </relative-time>
                    </td>
                    <td data-label="Action" className="actions-cell">
                      <button
                        data-id={earner.earner_id.toBase64()}
                        className="btn-icon showActionPopoverBtn"
                        popovertarget="showActionPopover"
                      >
                        ⋮
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div>
          Showing {earners.length} of {earners.length}
        </div>
      </div>

      <div id="showActionPopover" popover="auto" className="action-menu">
        <button id="editEarnerBtn" className="menu-item">
          Modifier
        </button>
        <button className="menu-item text-danger">Supprimer</button>
      </div>

      <dialog id="addEarnerDialog" className="modal">
        <div className="modal-header">
          <h2>Add New Earner</h2>
          <button
            className="btn-icon close-btn"
            command="close"
            commandfor="addEarnerDialog"
          >
            ×
          </button>
        </div>
        <form id="addEarnerForm">
          <fieldset>
            <legend>Earner Information</legend>
            <div className="form-group">
              <label htmlFor="first_name">First Name</label>
              <input type="text" id="first_name" name="first_name" required />
            </div>
            <div className="form-group">
              <label htmlFor="last_name">Last Name</label>
              <input type="text" id="last_name" name="last_name" required />
            </div>
            <div className="form-group">
              <label htmlFor="profile_url">Profile URL</label>
              <input type="url" id="profile_url" name="profile_url" required />
            </div>
            <div className="form-group">
              <label htmlFor="job_title">Job Title</label>
              <input type="text" id="job_title" name="job_title" required />
            </div>
            <div className="form-group">
              <label htmlFor="company_name">Company Name</label>
              <input
                type="text"
                id="company_name"
                name="company_name"
                required
              />
            </div>
            <div className="form-checkbox">
              <input
                type="checkbox"
                id="is_laureat"
                name="is_laureat"
                value="1"
              />
              <label htmlFor="is_laureat">Is Laureate?</label>
            </div>
          </fieldset>

          <fieldset>
            <legend>Certificate Details</legend>
            <div className="form-group">
              <label htmlFor="issued_at">Issue Date</label>
              <input type="date" id="issued_at" name="issued_at" required />
            </div>
            <div className="form-group">
              <label htmlFor="code">Code</label>
              <input type="text" id="code" name="code" required />
            </div>
          </fieldset>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-outline"
              command="close"
              commandfor="addEarnerDialog"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Earner
            </button>
          </div>
        </form>
      </dialog>
    </main>
  );
}
