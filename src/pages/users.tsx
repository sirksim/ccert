import Pagination from "@components/pagination";
import type { User } from "@databases/types";

type PaginationMeta = {
  page: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
};

export default function Users({
  users,
  pagination,
}: {
  users: User[];
  pagination: PaginationMeta;
}) {
  return (
    <main>
      <div className="container">
        <header>
          <div>
            <h1>Users</h1>
            {users && (
              <p>
                {users.length} user{users.length > 1 ? "s" : ""}
              </p>
            )}
          </div>
          <button command="show-modal" commandfor="addUserDialog">
            Add New User
          </button>
        </header>
        {users && (
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" name="selectAll" id="selectAll" />
                  </th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Last Login</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr>
                    <td data-label="Sélectionner">
                      <input type="checkbox" name="selectOne" />
                    </td>
                    <td data-label="First Name">{user.first_name}</td>
                    <td data-label="Last Name">{user.last_name}</td>
                    <td data-label="Email">{user.email}</td>
                    <td data-label="Role">{user.role_id}</td>
                    <td data-label="Last Login">{user.last_login || "N/A"}</td>
                    <td data-label="Action">
                      <button
                        data-id={user.id.toBase64()}
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
        <Pagination basePath="/users" {...pagination} />
      </div>
      <div id="showActionPopover" popover="auto">
        <button id="editUserBtn">Edit</button>
        <button>Delete</button>
      </div>
      <dialog id="addUserDialog">
        <h2>Add User</h2>
        <form id="addUserForm">
          <div>
            <label htmlFor="last_name">Last Name</label>
            <input type="text" name="last_name" required />
          </div>
          <div>
            <label htmlFor="first_name">First Name</label>
            <input type="text" id="first_name" name="first_name" required />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
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
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" required />
          </div>
          <div>
            <label htmlFor="confirm_password">Confirm Password</label>
            <input
              type="password"
              name="confirm_password"
              id="confirm_password"
              required
            />
          </div>
          <div>
            <button>Add User</button>
            <button type="button" command="close" commandfor="addUserDialog">
              Cancel
            </button>
          </div>
        </form>
      </dialog>
    </main>
  );
}
