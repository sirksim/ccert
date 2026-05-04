import type { EarnerWithCertificate } from "@databases/types";

export default function EditEarner({
  earner,
}: {
  earner: EarnerWithCertificate;
}) {
  return (
    <>
      <h2>Update Earner</h2>
      <form id="addEarnerForm">
        <fieldset>
          <legend>Earner Information</legend>
          <div>
            <label htmlFor="first_name">First Name</label>
            <input
              value={earner.first_name}
              type="text"
              id="first_name"
              name="first_name"
              required
            />
          </div>
          <div>
            <label htmlFor="last_name">Last Name</label>
            <input
              value={earner.last_name}
              type="text"
              id="last_name"
              name="last_name"
              required
            />
          </div>
          <div>
            <label htmlFor="profile_url">Profile URL</label>
            <input
              value={earner.profile_url}
              type="url"
              id="profile_url"
              name="profile_url"
              required
            />
          </div>
          <div>
            <label htmlFor="job_title">Job Title</label>
            <input
              value={earner.job_title}
              type="text"
              id="job_title"
              name="job_title"
              required
            />
          </div>
          <div>
            <label htmlFor="company_name">Company Name</label>
            <input
              value={earner.company_name}
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
              checked={earner.is_laureat === 1}
            />
            <label htmlFor="is_laureat">Is Laureate?</label>
          </div>
        </fieldset>
        <fieldset>
          <legend>Certificate Details</legend>
          <div>
            <label htmlFor="issued_at">Issue Date</label>
            <input
              value={earner.issued_at || ""}
              type="date"
              id="issued_at"
              name="issued_at"
              required
            />
          </div>
          <div>
            <label htmlFor="code">Code</label>
            <input
              value={earner.certificate_code || ""}
              type="text"
              id="code"
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
