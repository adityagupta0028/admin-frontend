import { Search, Bell, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/slices/authSlice";
import { useLogoutMutation } from "../../store/api/authApi";
import { toast } from "sonner";

export function Header() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [logoutMutation] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (err) {
      // Even if API call fails, logout locally
      console.error("Logout API error:", err);
    }
    dispatch(logout());
    toast.success("Logged out successfully");
  };
  return (
    <header className="h-16 bg-white border-b border-border fixed top-0 right-0 left-64 z-10">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search products, orders, users..."
              className="pl-10 bg-gray-50 border-gray-200 rounded-lg"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[var(--gold)] border-2 border-white">
              3
            </Badge>
          </button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 p-1.5 pr-3 rounded-lg hover:bg-gray-50 transition-colors">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className="text-left hidden md:block">
                  <div style={{ fontSize: '0.875rem' }}>{user?.name || "Admin User"}</div>
                  <div className="text-gray-500" style={{ fontSize: '0.75rem' }}>{user?.email || "admin@luxejewels.com"}</div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Preferences</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
