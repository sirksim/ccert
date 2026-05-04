import type { UserWithRole } from "@databases/types";

export default function EditUser({ user }: { user: UserWithRole }) {
  return (
    <>
      <h2>Update User</h2>
      <form id="editUserForm">
        <div>
          <label htmlFor="last_name">Last Name</label>
          <input
            id="last_name"
            type="text"
            value={user.last_name}
            name="last_name"
            required
          />
        </div>
        <div>
          <label htmlFor="first_name">First Name</label>
          <input
            type="text"
            value={user.first_name}
            id="first_name"
            name="first_name"
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            value={user.email}
            id="email"
            name="email"
            required
          />
          <p></p>
        </div>
        <div>
          <label htmlFor="role_id">Role</label>
          <select name="role_id" id="role_id">
            <option value="1">Admin</option>
            <option value="2">Editor</option>
          </select>
        </div>
        <div>
          <button>Update User</button>
          <button type="button" command="close" commandfor="editUserDialog">
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
