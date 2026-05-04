import type { EarnerWithCertificate } from "@databases/types";

export default function Earners({
  earners,
}: {
  earners: EarnerWithCertificate[];
}) {
  return (
    <main>
      <div className="container">
        <header>
          <div>
            <h1>Earners</h1>
            {earners && (
              <p>
                {earners.length} earner{earners.length > 1 ? "s" : ""}
              </p>
            )}
          </div>
          <button command="show-modal" commandfor="addEarnerDialog">
            Add New Earner
          </button>
        </header>
        {earners && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>
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
                  <tr>
                    <td>
                      <input type="checkbox" name="selectOne" />
                    </td>
                    <td>{earner.profile_url}</td>
                    <td>{earner.full_name}</td>
                    <td>{earner.job_title}</td>
                    <td>{earner.company_name}</td>
                    <td>{earner.is_laureat}</td>
                    <td>{earner.certificate_code}</td>
                    <td>{earner.certificate_status}</td>
                    <td>{earner.issued_at}</td>
                    <td>{earner.expiry_date}</td>
                    <td>
                      <button
                        data-id={earner.earner_id.toBase64()}
                        className="showActionPopoverBtn"
                        popovertarget="showActionPopover"
                      >
                        ...
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot></tfoot>
            </table>
          </div>
        )}
      </div>
      <div id="showActionPopover" popover="auto">
        <button id="editEarnerBtn">Edit</button>
        <button>Delete</button>
      </div>
      <dialog id="addEarnerDialog">
        <h2>Add New Earner</h2>
        <form id="addEarnerForm">
          <fieldset>
            <legend>Earner Information</legend>
            <div>
              <label htmlFor="first_name">First Name</label>
              <input type="text" id="first_name" name="first_name" required />
            </div>
            <div>
              <label htmlFor="last_name">Last Name</label>
              <input type="text" id="last_name" name="last_name" required />
            </div>
            <div>
              <label htmlFor="profile_url">Profile URL</label>
              <input type="url" id="profile_url" name="profile_url" required />
            </div>
            <div>
              <label htmlFor="job_title">Job Title</label>
              <input type="text" id="job_title" name="job_title" required />
            </div>
            <div>
              <label htmlFor="company_name">Company Name</label>
              <input
                type="text"
                id="company_name"
                name="company_name"
                required
              />
            </div>
            <div>
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
            <div>
              <label htmlFor="issued_at">Issue Date</label>
              <input type="date" id="issued_at" name="issued_at" required />
            </div>
            <div>
              <label htmlFor="code">Code</label>
              <input type="text" id="code" name="code" required />
            </div>
          </fieldset>
          <button type="submit">Add Earner</button>
          <button type="button" command="close" commandfor="addEarnerDialog">
            Cancel
          </button>
        </form>
      </dialog>
    </main>
  );
}
