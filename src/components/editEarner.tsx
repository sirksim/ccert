import type { EarnerWithCertificate } from "@databases/types";

export default function EditEarner({
  earner,
}: {
  earner: EarnerWithCertificate;
}) {
  return (
    <>
      <h2>Update Earner</h2>
      <form id="editEarnerForm">
        <fieldset>
          <legend>Earner Information</legend>
          <div>
            <label htmlFor="edit_first_name">First Name</label>
            <input
              value={earner.first_name}
              type="text"
              id="edit_first_name"
              name="first_name"
              required
            />
          </div>
          <div>
            <label htmlFor="edit_last_name">Last Name</label>
            <input
              value={earner.last_name}
              type="text"
              id="edit_last_name"
              name="last_name"
              required
            />
          </div>
          <div>
            <label htmlFor="edit_profile_url">Profile URL</label>
            <input
              value={earner.profile_url}
              type="url"
              id="edit_profile_url"
              name="profile_url"
              required
            />
          </div>
          <div>
            <label htmlFor="edit_job_title">Job Title</label>
            <input
              value={earner.job_title}
              type="text"
              id="edit_job_title"
              name="job_title"
              required
            />
          </div>
          <div>
            <label htmlFor="edit_company_name">Company Name</label>
            <input
              value={earner.company_name}
              type="text"
              id="edit_company_name"
              name="company_name"
              required
            />
          </div>
          <div>
            <input
              type="checkbox"
              id="edit_is_laureat"
              name="is_laureat"
              value="1"
              checked={earner.is_laureat === 1}
            />
            <label htmlFor="edit_is_laureat">Is Laureate?</label>
          </div>
        </fieldset>
        <fieldset>
          <legend>Certificate Details</legend>
          <div>
            <label htmlFor="edit_issued_at">Issue Date</label>
            <input
              value={earner.issued_at || ""}
              type="date"
              id="edit_issued_at"
              name="issued_at"
              required
            />
          </div>
          <div>
            <label htmlFor="edit_code">Code</label>
            <input
              value={earner.certificate_code || ""}
              type="text"
              id="edit_code"
              name="code"
              required
            />
          </div>
        </fieldset>
        <button type="submit">Update Earner</button>
        <button type="button" command="close" commandfor="editEarnerDialog">
          Cancel
        </button>
      </form>
    </>
  );
}
