type LayoutProps = {
  children: any;
  styles?: string[];
  scripts?: string[];
};
export default function Layout(props: LayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>CNMP Certification Platform</title>
        <link rel="stylesheet" href="/styles/layout.css" />
        {props.styles &&
          props.styles.map((style) => (
            <link rel="stylesheet" href={`styles/${style}.css`} />
          ))}
        <script src="/scripts/font-awesome.js" crossOrigin="anonymous"></script>
        <script src="/scripts/layout.js" defer></script>
        {props.scripts &&
          props.scripts.map((script) => (
            <script src={`scripts/${script}.js`} defer></script>
          ))}
      </head>
      <body>
        <header>
          <div className="container">
            <div>
              <span>Plateforme de certification</span>
            </div>
            <nav>
              <ul>
                <li>
                  <i class="fa-solid fa-house"></i>
                  <a href="/">Dashboard</a>
                </li>
                <li>
                  <i class="fa-solid fa-graduation-cap"></i>
                  <a href="/earners">Certifiers</a>
                </li>
                <li>
                  <i class="fa-solid fa-user"></i>
                  <a href="/users">Utilisateur</a>
                </li>
                <li>
                  <i class="fa-solid fa-timeline"></i>
                  <a href="/history">Historiques</a>
                </li>
              </ul>
            </nav>
            <div>
              <a href="/login">Login</a>
              <a href="/profile">Profile</a>
              <button type="button">Logout</button>
            </div>
          </div>
        </header>
        {props.children}
      </body>
    </html>
  );
}
