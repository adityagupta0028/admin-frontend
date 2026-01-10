import { 
  LayoutDashboard, 
  Users, 
  FolderTree, 
  Package, 
  ShoppingCart, 
  CreditCard, 
  Image, 
  HelpCircle, 
  FileText, 
  Settings, 
  LogOut,
  Crown,
  Filter
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "../ui/utils";
import { useAppDispatch } from "../../store/hooks";
import { logout } from "../../store/slices/authSlice";
import { useLogoutMutation } from "../../store/api/authApi";
import { toast } from "sonner";

const menuItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/user", label: "Users", icon: Users },
  { path: "/category", label: "Categories", icon: FolderTree },
  { path: "/subcategory", label: "SubCategories", icon: FolderTree },
  { path: "/product", label: "Products", icon: Package },
  { path: "/order", label: "Orders", icon: ShoppingCart },
  { path: "/transaction", label: "Transactions", icon: CreditCard },
  { path: "/banner", label: "Banners", icon: Image },
  { path: "/faq", label: "FAQs", icon: HelpCircle },
  { path: "/cms", label: "CMS", icon: FileText },
  { path: "/filter", label: "Filter Management", icon: Filter },
  { path: "/setting", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logoutMutation] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (err) {
      console.error("Logout API error:", err);
    }
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="w-64 bg-white border-r border-border h-screen flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Crown className="w-8 h-8 text-[var(--gold)]" />
        <span className="ml-3 tracking-wide text-[var(--gold)]" style={{ fontWeight: 600, fontSize: '1.25rem' }}>
          Luxe Jewels
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "w-full flex items-center px-3 py-2.5 mb-1 rounded-lg transition-all",
                  isActive
                    ? "bg-gradient-to-r from-[var(--gold)] to-[var(--gold-dark)] text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-50"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-500")} />
                  <span className="ml-3" style={{ fontSize: '0.9375rem' }}>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-3 border-t border-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2.5 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="ml-3" style={{ fontSize: '0.9375rem' }}>Logout</span>
        </button>
      </div>
    </div>
  );
}
