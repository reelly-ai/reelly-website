export default function S02Navbar() {
  return (
    <div data-animation="over-right" className="navbar w-nav" data-easing2="ease" data-easing="ease" data-collapse="medium" role="banner" data-no-scroll="1" data-duration="400" data-doc-height="1">
      <div className="container w-container">
        <div className="navbar-wrapper">
          <a href="/" className="brand w-nav-brand">
            <img src="/cdn/6297c98631a984c162542adb/62cd5b307ea6f83ab2ffe65a_logo-reelly.png" loading="lazy" height="Auto" alt="" className="reelly-logo" />
          </a>
          <div className="profile-butoom">
            <a data-ms-content="!members" href="/password/sign-up" className="header-button registration w-button">
              Sign up
            </a>
            <a href="/agent-profile" className="header-button profile w-button">
              Profile
            </a>
            <a href="#/ms/logout" className="header-button log-out w-button">
              Log out
            </a>
          </div>
          <div className="menu-button w-nav-button">
            <img src="/cdn/6297c98631a984c162542adb/62bac866f04e59745e88ef32_Group-1394.svg" loading="lazy" alt="" width="24" />
          </div>
          <nav role="navigation" className="nav-menu hero w-nav-menu">
            <a href="/" className="nav-link mignait-blue ecosystem buyers w-nav-link">
              Ecosystem
            </a>
            <a href="/agent" className="nav-link mignait-blue ecosystem buyers w-nav-link">
              For Agents
            </a>
            <a href="/for-developer" id="reelly.io-developer" className="nav-link mignait-blue ecosystem buyers w-nav-link">
              For Developers
            </a>
            <a href="/buyers" aria-current="page" className="nav-link mignait-blue ecosystem buyers w-nav-link w--current">
              For Buyers
            </a>
            <a href="/investor" className="nav-link mignait-blue ecosystem buyers w-nav-link">
              For Investor
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
}
