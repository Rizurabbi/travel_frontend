import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/service", label: "Service" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 backdrop-blur-sm" style={{ backgroundColor: '#9ABDDC' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 group">
              {/* Logo Image - Place your logo file at public/logo.png */}
              <img 
                src="/logo.png" 
                alt="OPENSKAI Logo" 
                className="h-10 w-auto transition-transform group-hover:scale-110"
              />
              {/* Brand Image - Place your brand image file at public/brand-image.png */}
              <img 
                src="name.png" 
                alt="OPENSKAI Brand" 
                className="h-8 w-auto"
              />
            </Link>

            <div className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    location.pathname === link.path
                      ? "text-white shadow-md"
                      : "text-white/80 hover:text-white"
                  }`}
                  style={location.pathname === link.path ? { backgroundColor: '#001540' } : {}}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
};