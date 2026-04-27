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
              <li>
                <a href="/">Dashboard</a>
              </li>
              <li>
                <a href="/earners">Certifiers</a>
              </li>
              <li>
                <a href="/users">Utilisateur</a>
              </li>
              <li>
                <a href="/history">Historiques</a>
              </li>
            </nav>
            <div>
              <a href="/profile">View Profile</a>
              <br />
              <button type="button">Logout</button>
            </div>
          </div>
        </header>
        {props.children}
      </body>
    </html>
  );
}
