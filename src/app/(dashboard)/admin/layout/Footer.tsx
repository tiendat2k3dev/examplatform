const Footer = () => {
  return (
    <footer
      className="d-flex align-items-center justify-content-between px-3 bg-light border-top text-dark"
      style={{ height: "35px", fontSize: "12px" }}
    >
      {/* Copyright */}
      <span className="text-nowrap">
        © 2024 CodeGym Quiz. All rights reserved.
      </span>

      {/* Links */}
      <div className="d-flex align-items-center gap-3">
        <a href="#" className="text-dark text-decoration-none text-nowrap">
          Privacy Policy
        </a>

        <a href="#" className="text-dark text-decoration-none text-nowrap">
          Terms of Service
        </a>

        <a href="#" className="text-dark text-decoration-none text-nowrap">
          Help Center
        </a>

        <a href="#" className="text-dark text-decoration-none text-nowrap">
          Contact Support
        </a>
      </div>
    </footer>
  );
};

export default Footer;
