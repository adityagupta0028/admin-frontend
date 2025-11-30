import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TrendingUp, ShoppingCart, Users, Package, DollarSign } from "lucide-react";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const kpiData = [
  {
    title: "Total Sales",
    value: "$124,580",
    change: "+12.5%",
    icon: DollarSign,
    trend: "up",
  },
  {
    title: "Total Orders",
    value: "1,248",
    change: "+8.2%",
    icon: ShoppingCart,
    trend: "up",
  },
  {
    title: "Active Users",
    value: "3,456",
    change: "+5.7%",
    icon: Users,
    trend: "up",
  },
  {
    title: "Pending Shipments",
    value: "42",
    change: "-3.1%",
    icon: Package,
    trend: "down",
  },
];

const recentOrders = [
  { id: "#ORD-1234", customer: "Emma Wilson", amount: "$2,450", status: "Delivered", date: "Nov 1, 2025" },
  { id: "#ORD-1235", customer: "James Brown", amount: "$1,890", status: "Shipped", date: "Nov 1, 2025" },
  { id: "#ORD-1236", customer: "Sofia Garcia", amount: "$3,200", status: "Processing", date: "Nov 2, 2025" },
  { id: "#ORD-1237", customer: "Oliver Smith", amount: "$890", status: "Pending", date: "Nov 2, 2025" },
  { id: "#ORD-1238", customer: "Isabella Davis", amount: "$5,670", status: "Delivered", date: "Nov 3, 2025" },
];

const salesData = [
  { month: "May", sales: 45000 },
  { month: "Jun", sales: 52000 },
  { month: "Jul", sales: 48000 },
  { month: "Aug", sales: 61000 },
  { month: "Sep", sales: 58000 },
  { month: "Oct", sales: 72000 },
  { month: "Nov", sales: 85000 },
];

export function Dashboard() {
  return (
    <div>
      <div className="mb-6">
        <h1>Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-500" style={{ fontSize: '0.875rem' }}>{kpi.title}</p>
                    <h2 className="mt-2">{kpi.value}</h2>
                    <div className="flex items-center mt-2 gap-1">
                      <TrendingUp className={`w-4 h-4 ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
                      <span className={`${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} style={{ fontSize: '0.875rem' }}>
                        {kpi.change}
                      </span>
                      <span className="text-gray-400" style={{ fontSize: '0.875rem' }}>vs last month</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-[var(--gold)] to-[var(--gold-dark)] p-3 rounded-lg">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Sales Chart */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Monthly Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="var(--gold)" 
                  strokeWidth={3}
                  dot={{ fill: 'var(--gold)', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-gray-600">Products Listed</span>
              <span>842</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-gray-600">Low Stock Items</span>
              <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">12</Badge>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-gray-600">Categories</span>
              <span>24</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-gray-600">Avg. Order Value</span>
              <span>$2,340</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Conversion Rate</span>
              <span className="text-green-600">3.2%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        order.status === "Delivered"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : order.status === "Shipped"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : order.status === "Processing"
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500">{order.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
