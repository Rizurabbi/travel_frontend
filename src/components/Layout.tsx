// src/components/Layout.tsx
import { ReactNode, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, MessageCircle, Package, User } from "lucide-react";
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

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [languageDropdown, setLanguageDropdown] = useState(false);
  const isHomeRoute = ["/", "/es", "/fr", "/de"].includes(location.pathname);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="sticky top-0 z-50" style={{ backgroundColor: '#2185FF', borderBottom: 'none' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-end h-16">
            <div className="flex items-center gap-6">
              {!isHomeRoute && (
                <button
                  onClick={() => navigate("/")}
                  className="text-white hover:opacity-80 transition-opacity font-medium text-sm"
                >
                  Home
                </button>
              )}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full hover:bg-white/10"
                    >
                      <Avatar className="h-10 w-10 border-2 border-white/20">
                        <AvatarImage src={user.photo_url || undefined} alt={user.full_name} />
                        <AvatarFallback style={{ backgroundColor: "#001540", color: "white" }}>
                          {user.full_name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.full_name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
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
                    <DropdownMenuItem onClick={() => navigate("/my-bookings")}>
                      <Package className="mr-2 h-4 w-4" />
                      <span>My Bookings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/support-access")}>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      <span>Customer Support</span>
                      {!user.support_access.has_access && (
                        <Badge variant="outline" className="ml-auto text-xs">Get Access</Badge>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={() => navigate("/auth")}
                  variant="ghost"
                  className="text-white hover:bg-white/10 hover:text-white px-0"
                >
                  <User className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              )}
              <div className="relative">
                <button
                  onClick={() => setLanguageDropdown(!languageDropdown)}
                  className="flex items-center gap-1 text-white hover:opacity-80 transition-opacity font-medium text-sm"
                >
                  Language <ChevronDown size={14} />
                </button>
                {languageDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-36 bg-white rounded-lg shadow-xl z-50">
                    <button onClick={() => { navigate('/'); setLanguageDropdown(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800">English</button>
                    <button onClick={() => { navigate('/es'); setLanguageDropdown(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800">Español</button>
                    <button onClick={() => { navigate('/fr'); setLanguageDropdown(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800">Français</button>
                    <button onClick={() => { navigate('/de'); setLanguageDropdown(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800">Deutsch</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1">{children}</main>
    </div>
  );
};
