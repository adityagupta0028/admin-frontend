import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Search, Eye, Download, Calendar } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

const orders = [
  { 
    id: "#ORD-1234", 
    customer: "Emma Wilson", 
    total: "$2,450", 
    payment: "Paid", 
    delivery: "Delivered", 
    date: "Nov 1, 2025",
    items: 1,
    address: "123 Main St, New York, NY 10001"
  },
  { 
    id: "#ORD-1235", 
    customer: "James Brown", 
    total: "$1,890", 
    payment: "Paid", 
    delivery: "Shipped", 
    date: "Nov 1, 2025",
    items: 2,
    address: "456 Oak Ave, Los Angeles, CA 90001"
  },
  { 
    id: "#ORD-1236", 
    customer: "Sofia Garcia", 
    total: "$3,200", 
    payment: "Paid", 
    delivery: "Processing", 
    date: "Nov 2, 2025",
    items: 1,
    address: "789 Pine Rd, Chicago, IL 60601"
  },
  { 
    id: "#ORD-1237", 
    customer: "Oliver Smith", 
    total: "$890", 
    payment: "Pending", 
    delivery: "Pending", 
    date: "Nov 2, 2025",
    items: 3,
    address: "321 Elm St, Houston, TX 77001"
  },
  { 
    id: "#ORD-1238", 
    customer: "Isabella Davis", 
    total: "$5,670", 
    payment: "Paid", 
    delivery: "Delivered", 
    date: "Nov 3, 2025",
    items: 2,
    address: "654 Maple Dr, Phoenix, AZ 85001"
  },
];

export function OrderManagement() {
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#" onClick={(e) => e.preventDefault()}>Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Orders</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="mb-6">
        <h1>Order Management</h1>
        <p className="text-gray-500 mt-1">Track and manage customer orders</p>
      </div>

      {/* Filters */}
      <Card className="mb-6 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search by order ID or customer..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Delivery Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Date Range
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>All Orders ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Delivery Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.total}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        order.payment === "Paid"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-yellow-50 text-yellow-700 border-yellow-200"
                      }
                    >
                      {order.payment}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        order.delivery === "Delivered"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : order.delivery === "Shipped"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : order.delivery === "Processing"
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                      }
                    >
                      {order.delivery}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500">{order.date}</TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Order Details - {order.id}</DialogTitle>
                          <DialogDescription>Complete order information and tracking</DialogDescription>
                        </DialogHeader>
                        {selectedOrder && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                              <div>
                                <p className="text-gray-500" style={{ fontSize: '0.875rem' }}>Customer</p>
                                <p>{selectedOrder.customer}</p>
                              </div>
                              <div>
                                <p className="text-gray-500" style={{ fontSize: '0.875rem' }}>Order Date</p>
                                <p>{selectedOrder.date}</p>
                              </div>
                              <div>
                                <p className="text-gray-500" style={{ fontSize: '0.875rem' }}>Total Amount</p>
                                <p>{selectedOrder.total}</p>
                              </div>
                              <div>
                                <p className="text-gray-500" style={{ fontSize: '0.875rem' }}>Items</p>
                                <p>{selectedOrder.items} item(s)</p>
                              </div>
                            </div>
                            <div className="p-4 border border-gray-200 rounded-lg">
                              <p className="text-gray-500 mb-2" style={{ fontSize: '0.875rem' }}>Shipping Address</p>
                              <p>{selectedOrder.address}</p>
                            </div>
                            <div className="flex gap-2">
                              <Select defaultValue={selectedOrder.delivery.toLowerCase()}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Update Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="processing">Processing</SelectItem>
                                  <SelectItem value="shipped">Shipped</SelectItem>
                                  <SelectItem value="delivered">Delivered</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button className="bg-gradient-to-r from-[var(--gold)] to-[var(--gold-dark)]">
                                Update Status
                              </Button>
                            </div>
                            <Button variant="outline" className="w-full">
                              <Download className="w-4 h-4 mr-2" />
                              Download Invoice
                            </Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" onClick={(e) => e.preventDefault()} />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" onClick={(e) => e.preventDefault()} isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" onClick={(e) => e.preventDefault()}>2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" onClick={(e) => e.preventDefault()}>3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" onClick={(e) => e.preventDefault()} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
