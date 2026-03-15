import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import { Search, Eye, Loader2 } from "lucide-react";
import { useGetCustomRingRequestsQuery, type CustomRingRequest } from "../../store/api/customRingRequestApi";

const IMAGE_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8081";

function getImageUrl(path?: string) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function formatDate(dateString: string) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function statusClass(status: string) {
  switch (status) {
    case "New":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "In Review":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "Contacted":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "Completed":
      return "bg-green-50 text-green-700 border-green-200";
    case "Closed":
      return "bg-gray-50 text-gray-700 border-gray-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

export function CustomRingRequestManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<CustomRingRequest | null>(null);

  const limit = 10;
  const { data, isLoading, error } = useGetCustomRingRequestsQuery({
    page,
    limit,
    search: search || undefined,
    status: status === "all" ? undefined : status,
  });

  const requests = data?.data?.requests || [];
  const pagination = data?.data?.pagination || { page: 1, limit, total: 0, pages: 1 };

  return (
    <div>
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#" onClick={(e) => e.preventDefault()}>
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Custom Ring Requests</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-6">
        <h1>Custom Ring Requests</h1>
        <p className="text-gray-500 mt-1">Review customer custom design submissions</p>
      </div>

      <Card className="mb-6 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, phone..."
                className="pl-10"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="In Review">In Review</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>
            All Requests ({pagination.total || 0})
            {isLoading && <Loader2 className="inline-block ml-2 w-4 h-4 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-center py-8 text-red-500">
              Failed to load custom ring requests.
            </div>
          )}

          {!isLoading && !error && requests.length === 0 && (
            <div className="text-center py-8 text-gray-500">No custom ring requests found.</div>
          )}

          {!isLoading && !error && requests.length > 0 && (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Metal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request._id}>
                      <TableCell>
                        {request.inspirationImages?.length > 0 ? (
                          <img
                            src={getImageUrl(request.inspirationImages[0])}
                            alt="Reference"
                            className="w-12 h-12 object-cover rounded border border-gray-200"
                          />
                        ) : (
                          <span className="text-gray-400 text-sm">No image</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{request.fullName}</div>
                        <div className="text-xs text-gray-500">{request.email}</div>
                      </TableCell>
                      <TableCell>{request.metalPreference}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusClass(request.status)}>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500">{formatDate(request.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedRequest(request)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[760px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Custom Ring Request Details</DialogTitle>
                              <DialogDescription>
                                Submitted on {selectedRequest ? formatDate(selectedRequest.createdAt) : "N/A"}
                              </DialogDescription>
                            </DialogHeader>

                            {selectedRequest && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                  <div>
                                    <p className="text-xs text-gray-500">Full Name</p>
                                    <p className="font-medium">{selectedRequest.fullName}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Email</p>
                                    <p className="font-medium">{selectedRequest.email}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Phone</p>
                                    <p className="font-medium">{selectedRequest.phone || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Metal Preference</p>
                                    <p className="font-medium">{selectedRequest.metalPreference}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Status</p>
                                    <Badge variant="outline" className={statusClass(selectedRequest.status)}>
                                      {selectedRequest.status}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Inspiration URL</p>
                                    {selectedRequest.inspirationUrl ? (
                                      <a
                                        href={selectedRequest.inspirationUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-600 hover:underline break-all"
                                      >
                                        {selectedRequest.inspirationUrl}
                                      </a>
                                    ) : (
                                      <p className="font-medium">N/A</p>
                                    )}
                                  </div>
                                </div>

                                <div className="p-4 border border-gray-200 rounded-lg">
                                  <p className="text-xs text-gray-500 mb-1">Design Requirements</p>
                                  <p className="text-sm whitespace-pre-wrap">{selectedRequest.designRequirements}</p>
                                </div>

                                <div className="p-4 border border-gray-200 rounded-lg">
                                  <p className="text-xs text-gray-500 mb-3">Reference Images</p>
                                  {selectedRequest.inspirationImages?.length ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                      {selectedRequest.inspirationImages.map((imagePath, idx) => (
                                        <a href={getImageUrl(imagePath)} target="_blank" rel="noreferrer" key={imagePath + idx}>
                                          <img
                                            src={getImageUrl(imagePath)}
                                            alt={`Reference ${idx + 1}`}
                                            className="w-full h-28 object-cover rounded border border-gray-200"
                                          />
                                        </a>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-gray-500">No uploaded images.</p>
                                  )}
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {pagination.pages > 1 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (page > 1) setPage(page - 1);
                          }}
                          className={page === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>

                      {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pageNum) => (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setPage(pageNum);
                            }}
                            isActive={page === pageNum}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (page < pagination.pages) setPage(page + 1);
                          }}
                          className={page >= pagination.pages ? "pointer-events-none opacity-50" : ""}
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
