import type { User } from "@databases/types";

export default function Users({ users }: { users: User[] }) {
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
                    <td>
                      <input type="checkbox" name="selectOne" />
                    </td>
                    <td>{user.first_name}</td>
                    <td>{user.last_name}</td>
                    <td>{user.email}</td>
                    <td>{user.role_id}</td>
                    <td>{user.last_login || "N/A"}</td>
                    <td>
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
