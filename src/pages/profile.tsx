export default function Profile() {
  return (
    <main className="profile-container">
      <div className="profile-card">
        <header className="profile-header">
          <div className="avatar">
            <span>JD</span>
          </div>
          <div className="profile-titles">
            <h1>John Doe</h1>
            <p className="role-title">Administrateur</p>
          </div>
        </header>

        <hr className="divider" />

        <section className="profile-details">
          <div className="detail-group">
            <h3>Email</h3>
            <p>john.doe@cnmp.ht</p>
          </div>
          <div className="detail-group">
            <h3>Rôle</h3>
            <p>Admin</p>
          </div>
          <div className="detail-group">
            <h3>Dernière connexion</h3>
            <p>Aujourd'hui, 10:45</p>
          </div>
        </section>

        <footer className="profile-actions">
          <button className="btn-primary">Modifier le profil</button>
          <button className="btn-outline">Changer le mot de passe</button>
        </footer>
      </div>
    </main>
  );
}
// export default function Profile() {
//   return (
//     <main className="profile-container">
//       <div className="profle-card">
//         {/* Header Section: Avatar & Titles */}
//         <header className="profile-header">
//           <div className="avatar">
//             {/* Fallback initials if no image is provided */}
//             <span>JD</span>
//           </div>
//           <div className="profile-titles">
//             <h1>John Doe</h1>
//             <p className="job-title">Senior Software Engineer</p>
//             <p className="company">Tech Corp Inc.</p>
//           </div>
//         </header>

//         <hr className="divider" />

//         {/* Details Section */}
//         <section className="profile-details">
//           <div className="detail-group">
//             <h3>Email</h3>
//             <p>john.doe@techcorp.com</p>
//           </div>
//           <div className="detail-group">
//             <h3>Role</h3>
//             <p>Admin</p>
//           </div>
//           <div className="detail-group">
//             <h3>Status</h3>
//             <p>
//               <span className="badge">Laureat</span>
//             </p>
//           </div>
//         </section>

//         {/* Action Section */}
//         <footer className="profile-actions">
//           <button className="btn-primary">Edit Profile</button>
//           <button className="btn-outline">Reset Password</button>
//         </footer>
//       </div>
//     </main>
//   );
// }
