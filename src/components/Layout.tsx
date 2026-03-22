// src/components/Layout.tsx - FINAL VERSION WITH YOUR EXISTING CODE + AUTH
import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, User, LogOut, MessageCircle, Package } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface NavLink {
  path: string;
  label: string;
  subLinks?: { path: string; label: string }[];
}

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isServiceOpen, setIsServiceOpen] = useState(false);

  const navLinks: NavLink[] = [
    { path: "/", label: "Home" },
    {
      path: "/service",
      label: "Service",
      subLinks: [
        { path: "/travel", label: "Travel" },
        { path: "/tour-packages", label: "Tour Packages" },
        { path: "/payment", label: "Travel Banking" },
        { path: "/insurance", label: "Travel Insurance" },
      ],
    },
  ];

  // --- FIXED: Highlight "Service" if on ANY subpage ---
  const isActive = (link: NavLink) => {
    if (location.pathname === link.path) return true;
    if (link.subLinks) {
      return link.subLinks.some((sub) => location.pathname.startsWith(sub.path));
    }
    return false;
  };

  // --- Helper: Is a sublink active? ---
  const isSubActive = (subPath: string) => location.pathname === subPath;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-sm" style={{ backgroundColor: "#9ABDDC" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="OPENSKAI Logo"
                className="h-10 w-auto transition-transform group-hover:scale-110"
              />
              <img src="name.png" alt="OPENSKAI Brand" className="h-8 w-auto" />
            </Link>

            {/* Nav Links */}
            <div className="flex items-center gap-1">
              {navLinks.map((link) => {
                const active = isActive(link);
                const hasSubLinks = !!link.subLinks;

                return (
                  <div key={link.path} className="relative group">
                    {/* Main Nav Item */}
                    <Link
                      to={link.path}
                      onClick={() => hasSubLinks && setIsServiceOpen(!isServiceOpen)}
                      className={`
                        flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium
                        transition-all duration-200
                        ${active ? "text-white shadow-md" : "text-white/80 hover:text-white"}
                      `}
                      style={active ? { backgroundColor: "#001540" } : {}}
                    >
                      {link.label}
                      {hasSubLinks && (
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isServiceOpen ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </Link>

                    {/* Dropdown Menu */}
                    {hasSubLinks && (
                      <div
                        className={`
                          absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl
                          ring-1 ring-black ring-opacity-5 overflow-hidden
                          transition-all duration-200 ease-out origin-top
                          ${
                            isServiceOpen
                              ? "opacity-100 scale-y-100 pointer-events-auto"
                              : "opacity-0 scale-y-95 pointer-events-none"
                          }
                          md:pointer-events-none md:opacity-0 md:scale-y-95
                          md:group-hover:opacity-100 md:group-hover:scale-y-100 md:group-hover:pointer-events-auto
                        `}
                        onMouseEnter={() => setIsServiceOpen(true)}
                        onMouseLeave={() => setIsServiceOpen(false)}
                      >
                        {link.subLinks.map((subLink) => {
                          const subActive = isSubActive(subLink.path);
                          return (
                            <Link
                              key={subLink.path}
                              to={subLink.path}
                              className={`
                                block px-5 py-3 text-sm font-medium transition-colors
                                ${subActive
                                  ? "bg-[#001540] text-white"
                                  : "text-gray-700 hover:bg-gray-50 hover:text-[#001540]"
                                }
                              `}
                              onClick={() => setIsServiceOpen(false)}
                            >
                              {subLink.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* RIGHT SIDE - AUTH SECTION (NEW) */}
            <div className="flex items-center gap-3">
              {user ? (
                // LOGGED IN - Show User Menu
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="relative h-10 w-10 rounded-full hover:bg-white/10"
                    >
                      <Avatar className="h-10 w-10 border-2 border-white/20">
                        <AvatarImage src={user.photo_url || undefined} alt={user.full_name} />
                        <AvatarFallback style={{ backgroundColor: '#001540', color: 'white' }}>
                          {user.full_name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.full_name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {/* Support Access Status */}
                    <div className="px-2 py-2">
                      {user.support_access.has_access ? (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Support Status</span>
                          <Badge className="bg-green-500 text-xs">Active</Badge>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Support Status</span>
                          <Badge variant="outline" className="text-xs">No Access</Badge>
                        </div>
                      )}
                    </div>
                    
                    <DropdownMenuSeparator />
                    
                    {/* My Bookings */}
                    <DropdownMenuItem onClick={() => navigate('/my-bookings')}>
                      <Package className="mr-2 h-4 w-4" />
                      <span>My Bookings</span>
                    </DropdownMenuItem>
                    
                    {/* Customer Support */}
                    <DropdownMenuItem onClick={() => navigate('/support-access')}>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      <span>Customer Support</span>
                      {!user.support_access.has_access && (
                        <Badge variant="outline" className="ml-auto text-xs">Get Access</Badge>
                      )}
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    {/* Logout */}
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                // NOT LOGGED IN - Show Sign In Button
                <Button
                  onClick={() => navigate('/auth')}
                  style={{ backgroundColor: '#001540' }}
                  className="text-white hover:opacity-90"
                >
                  <User className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
};
