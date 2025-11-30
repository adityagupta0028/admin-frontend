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
import { Search, Download, Calendar } from "lucide-react";
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

const transactions = [
  { 
    id: "TXN-98234", 
    user: "Emma Wilson", 
    orderId: "#ORD-1234", 
    amount: "$2,450", 
    method: "Credit Card", 
    status: "Success", 
    date: "Nov 1, 2025, 10:24 AM" 
  },
  { 
    id: "TXN-98235", 
    user: "James Brown", 
    orderId: "#ORD-1235", 
    amount: "$1,890", 
    method: "PayPal", 
    status: "Success", 
    date: "Nov 1, 2025, 2:15 PM" 
  },
  { 
    id: "TXN-98236", 
    user: "Sofia Garcia", 
    orderId: "#ORD-1236", 
    amount: "$3,200", 
    method: "Debit Card", 
    status: "Success", 
    date: "Nov 2, 2025, 9:30 AM" 
  },
  { 
    id: "TXN-98237", 
    user: "Oliver Smith", 
    orderId: "#ORD-1237", 
    amount: "$890", 
    method: "Bank Transfer", 
    status: "Pending", 
    date: "Nov 2, 2025, 4:45 PM" 
  },
  { 
    id: "TXN-98238", 
    user: "Isabella Davis", 
    orderId: "#ORD-1238", 
    amount: "$5,670", 
    method: "Credit Card", 
    status: "Success", 
    date: "Nov 3, 2025, 11:20 AM" 
  },
  { 
    id: "TXN-98239", 
    user: "Michael Johnson", 
    orderId: "#ORD-1239", 
    amount: "$1,230", 
    method: "PayPal", 
    status: "Failed", 
    date: "Nov 3, 2025, 3:00 PM" 
  },
];

export function TransactionManagement() {
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
            <BreadcrumbPage>Transactions</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1>Transaction Management</h1>
          <p className="text-gray-500 mt-1">View and manage all payment transactions</p>
        </div>
        <Button className="bg-gradient-to-r from-[var(--gold)] to-[var(--gold-dark)] hover:opacity-90">
          <Download className="w-4 h-4 mr-2" />
          Export to CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search by transaction ID or user..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="card">Credit/Debit Card</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Date Range
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>All Transactions ({transactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Mode</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date & Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell className="font-mono">{txn.id}</TableCell>
                  <TableCell>{txn.user}</TableCell>
                  <TableCell className="text-blue-600">{txn.orderId}</TableCell>
                  <TableCell>{txn.amount}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-gray-50 border-gray-200">
                      {txn.method}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        txn.status === "Success"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : txn.status === "Pending"
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }
                    >
                      {txn.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500">{txn.date}</TableCell>
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
