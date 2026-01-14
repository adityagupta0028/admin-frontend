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
import { Search, Eye, Download, Calendar, Loader2 } from "lucide-react";
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
import { useGetOrdersQuery, useGetOrderByIdQuery, useUpdateOrderStatusMutation, Order } from "../../store/api/orderApi";
import { toast } from "sonner";

export function OrderManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [newOrderStatus, setNewOrderStatus] = useState<string>("");
  const [trackingNumber, setTrackingNumber] = useState<string>("");

  const limit = 10;

  // Fetch orders
  const { data: ordersData, isLoading, error, refetch } = useGetOrdersQuery({
    page,
    limit,
    search: search || undefined,
    paymentStatus: paymentStatusFilter && paymentStatusFilter !== "all" ? paymentStatusFilter : undefined,
    status: orderStatusFilter && orderStatusFilter !== "all" ? orderStatusFilter : undefined,
  });

  // Fetch selected order details
  const { data: orderDetailData, isLoading: isLoadingOrderDetail } = useGetOrderByIdQuery(
    selectedOrderId || "",
    { skip: !selectedOrderId }
  );

  // Update order status mutation
  const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

  const orders = ordersData?.data?.orders || [];
  const pagination = ordersData?.data?.pagination || { page: 1, limit: 10, total: 0, pages: 1 };
  const selectedOrder = orderDetailData?.data;

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  const getCustomerName = (order: Order) => {
    if (typeof order.customerId === "object" && order.customerId !== null) {
      return order.customerId.name || "N/A";
    }
    return "N/A";
  };

  const getCustomerEmail = (order: Order) => {
    if (typeof order.customerId === "object" && order.customerId !== null) {
      return order.customerId.email || "N/A";
    }
    return "N/A";
  };

  const getPaymentStatusBadgeClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-50 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "failed":
        return "bg-red-50 text-red-700 border-red-200";
      case "refunded":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getOrderStatusBadgeClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-50 text-green-700 border-green-200";
      case "shipped":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "processing":
      case "confirmed":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      case "pending":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const handleViewOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setNewOrderStatus("");
    setTrackingNumber("");
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrderId) return;

    try {
      await updateOrderStatus({
        id: selectedOrderId,
        orderStatus: newOrderStatus || undefined,
        trackingNumber: trackingNumber || undefined,
      }).unwrap();
      toast.success("Order status updated successfully");
      refetch();
      setNewOrderStatus("");
      setTrackingNumber("");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update order status");
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1); // Reset to first page on search
  };

  const handleFilterChange = () => {
    setPage(1); // Reset to first page on filter change
  };

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#" onClick={(e) => e.preventDefault()}>
              Dashboard
            </BreadcrumbLink>
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
              <Input
                placeholder="Search by order ID or customer..."
                className="pl-10"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
            <Select
              value={paymentStatusFilter}
              onValueChange={(value) => {
                setPaymentStatusFilter(value);
                handleFilterChange();
              }}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={orderStatusFilter}
              onValueChange={(value) => {
                setOrderStatusFilter(value);
                handleFilterChange();
              }}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Delivery Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" disabled>
              <Calendar className="w-4 h-4 mr-2" />
              Date Range
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>
            All Orders ({pagination.total || 0})
            {isLoading && <Loader2 className="inline-block ml-2 w-4 h-4 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-center py-8 text-red-500">
              Error loading orders. Please try again.
            </div>
          )}

          {!isLoading && !error && orders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No orders found.
            </div>
          )}

          {!isLoading && !error && orders.length > 0 && (
            <>
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
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">
                        #{order.orderNumber || order._id.slice(-8)}
                      </TableCell>
                      <TableCell>{getCustomerName(order)}</TableCell>
                      <TableCell>{formatCurrency(order.total)}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getPaymentStatusBadgeClass(order.paymentStatus)}
                        >
                          {order.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getOrderStatusBadgeClass(order.orderStatus)}
                        >
                          {order.orderStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {formatDate(order.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewOrder(order._id)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>
                                Order Details - #{selectedOrder?.orderNumber || selectedOrder?._id.slice(-8)}
                              </DialogTitle>
                              <DialogDescription>
                                Complete order information and tracking
                              </DialogDescription>
                            </DialogHeader>
                            {isLoadingOrderDetail ? (
                              <div className="flex justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin" />
                              </div>
                            ) : selectedOrder ? (
                              <div className="space-y-4">
                                {/* Order Information */}
                                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                  <div>
                                    <p className="text-gray-500 text-sm">Customer</p>
                                    <p className="font-medium">{getCustomerName(selectedOrder)}</p>
                                    <p className="text-sm text-gray-600">{getCustomerEmail(selectedOrder)}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500 text-sm">Order Date</p>
                                    <p className="font-medium">{formatDate(selectedOrder.createdAt)}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500 text-sm">Total Amount</p>
                                    <p className="font-medium">{formatCurrency(selectedOrder.total)}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500 text-sm">Items</p>
                                    <p className="font-medium">{selectedOrder.items.length} item(s)</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500 text-sm">Payment Method</p>
                                    <p className="font-medium capitalize">
                                      {selectedOrder.paymentMethod?.replace("_", " ") || "N/A"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500 text-sm">Tracking Number</p>
                                    <p className="font-medium">
                                      {selectedOrder.trackingNumber || "Not assigned"}
                                    </p>
                                  </div>
                                </div>

                                {/* Shipping Address */}
                                {selectedOrder.shippingAddress && (
                                  <div className="p-4 border border-gray-200 rounded-lg">
                                    <p className="text-gray-500 mb-2 text-sm font-medium">
                                      Shipping Address
                                    </p>
                                    <div className="text-sm">
                                      <p>{selectedOrder.shippingAddress.fullName}</p>
                                      <p>{selectedOrder.shippingAddress.addressLine1}</p>
                                      {selectedOrder.shippingAddress.addressLine2 && (
                                        <p>{selectedOrder.shippingAddress.addressLine2}</p>
                                      )}
                                      <p>
                                        {selectedOrder.shippingAddress.city},{" "}
                                        {selectedOrder.shippingAddress.state}{" "}
                                        {selectedOrder.shippingAddress.postalCode}
                                      </p>
                                      <p>{selectedOrder.shippingAddress.country}</p>
                                      <p className="mt-2">
                                        Phone: {selectedOrder.shippingAddress.phoneNumber}
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {/* Order Items */}
                                <div className="p-4 border border-gray-200 rounded-lg">
                                  <p className="text-gray-500 mb-3 text-sm font-medium">Order Items</p>
                                  <div className="space-y-3">
                                    {selectedOrder.items.map((item, index) => (
                                      <div
                                        key={index}
                                        className="flex gap-3 p-2 bg-gray-50 rounded"
                                      >
                                        {item.productId &&
                                          typeof item.productId === "object" &&
                                          item.productId.images &&
                                          item.productId.images.length > 0 && (
                                            <img
                                              src={
                                                item.productId.images[0].startsWith("http")
                                                  ? item.productId.images[0]
                                                  : `http://localhost:8081${item.productId.images[0]}`
                                              }
                                              alt={item.productName}
                                              className="w-16 h-16 object-cover rounded"
                                            />
                                          )}
                                        <div className="flex-1">
                                          <p className="font-medium text-sm">{item.productName}</p>
                                          <p className="text-xs text-gray-500">
                                            SKU: {item.product_id}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            Quantity: {item.quantity} ×{" "}
                                            {formatCurrency(item.discountedPrice || item.price)}
                                          </p>
                                          <p className="text-sm font-medium mt-1">
                                            {formatCurrency(
                                              (item.discountedPrice || item.price) * item.quantity
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Order Summary */}
                                <div className="p-4 border border-gray-200 rounded-lg">
                                  <p className="text-gray-500 mb-3 text-sm font-medium">
                                    Order Summary
                                  </p>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span>Subtotal:</span>
                                      <span>{formatCurrency(selectedOrder.subtotal)}</span>
                                    </div>
                                    {selectedOrder.discount > 0 && (
                                      <div className="flex justify-between text-red-600">
                                        <span>Discount:</span>
                                        <span>-{formatCurrency(selectedOrder.discount)}</span>
                                      </div>
                                    )}
                                    <div className="flex justify-between">
                                      <span>Shipping:</span>
                                      <span>
                                        {selectedOrder.shipping > 0
                                          ? formatCurrency(selectedOrder.shipping)
                                          : "Free"}
                                      </span>
                                    </div>
                                    {selectedOrder.tax > 0 && (
                                      <div className="flex justify-between">
                                        <span>Tax:</span>
                                        <span>{formatCurrency(selectedOrder.tax)}</span>
                                      </div>
                                    )}
                                    <div className="flex justify-between font-bold pt-2 border-t">
                                      <span>Total:</span>
                                      <span>{formatCurrency(selectedOrder.total)}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Update Status */}
                                <div className="space-y-3 p-4 border border-gray-200 rounded-lg">
                                  <p className="text-gray-500 mb-2 text-sm font-medium">
                                    Update Order Status
                                  </p>
                                  <div className="space-y-2">
                                    <Select
                                      value={newOrderStatus || selectedOrder.orderStatus}
                                      onValueChange={setNewOrderStatus}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select Status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="confirmed">Confirmed</SelectItem>
                                        <SelectItem value="processing">Processing</SelectItem>
                                        <SelectItem value="shipped">Shipped</SelectItem>
                                        <SelectItem value="delivered">Delivered</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <Input
                                      placeholder="Tracking Number (optional)"
                                      value={trackingNumber}
                                      onChange={(e) => setTrackingNumber(e.target.value)}
                                    />
                                    <Button
                                      className="w-full bg-gradient-to-r from-[var(--gold)] to-[var(--gold-dark)]"
                                      onClick={handleUpdateStatus}
                                      disabled={isUpdating}
                                    >
                                      {isUpdating ? (
                                        <>
                                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                          Updating...
                                        </>
                                      ) : (
                                        "Update Status"
                                      )}
                                    </Button>
                                  </div>
                                </div>

                                {/* Notes */}
                                {selectedOrder.notes && (
                                  <div className="p-4 border border-gray-200 rounded-lg">
                                    <p className="text-gray-500 mb-2 text-sm font-medium">Notes</p>
                                    <p className="text-sm">{selectedOrder.notes}</p>
                                  </div>
                                )}

                                <Button variant="outline" className="w-full" disabled>
                                  <Download className="w-4 h-4 mr-2" />
                                  Download Invoice
                                </Button>
                              </div>
                            ) : null}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (page > 1) handlePageChange(page - 1);
                          }}
                          className={page === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                        (pageNum) => (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(pageNum);
                              }}
                              isActive={pageNum === page}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (page < pagination.pages) handlePageChange(page + 1);
                          }}
                          className={
                            page >= pagination.pages ? "pointer-events-none opacity-50" : ""
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
