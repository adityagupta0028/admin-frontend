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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Search, Eye, Loader2, ExternalLink } from "lucide-react";
import { useGetAppointmentsQuery, type Appointment } from "../../store/api/appointmentApi";

function formatDate(dateString: string) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatTimeLabel(timeStr?: string) {
  if (!timeStr) return "N/A";
  const [rawHours, rawMinutes] = timeStr.split(":");
  const hours = Number(rawHours);
  const minutes = Number(rawMinutes);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return timeStr;

  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${String(minutes).padStart(2, "0")} ${period}`;
}

function getCustomerName(appointment: Appointment) {
  if (appointment.customerId && typeof appointment.customerId === "object") {
    return appointment.customerId.name || "N/A";
  }
  return "N/A";
}

function getCustomerEmail(appointment: Appointment) {
  if (appointment.customerId && typeof appointment.customerId === "object") {
    return appointment.customerId.email || "N/A";
  }
  return "N/A";
}

function statusClass(status?: string) {
  switch (status) {
    case "Scheduled":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Completed":
      return "bg-green-50 text-green-700 border-green-200";
    case "Cancelled":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

export function AppointmentManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const limit = 10;
  const { data, isLoading, error } = useGetAppointmentsQuery({
    page,
    limit,
    search: search || undefined,
    status: status === "all" ? undefined : status,
  });

  const appointments = data?.data?.appointments || [];
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
            <BreadcrumbPage>Appointments</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-6">
        <h1>Appointment Management</h1>
        <p className="text-gray-500 mt-1">Review and monitor customer appointment requests</p>
      </div>

      <Card className="mb-6 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by meeting ID, purpose, customer..."
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
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>
            All Appointments ({pagination.total || 0})
            {isLoading && <Loader2 className="inline-block ml-2 w-4 h-4 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-center py-8 text-red-500">Failed to load appointments.</div>
          )}

          {!isLoading && !error && appointments.length === 0 && (
            <div className="text-center py-8 text-gray-500">No appointments found.</div>
          )}

          {!isLoading && !error && appointments.length > 0 && (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Meeting ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment) => (
                    <TableRow key={appointment._id}>
                      <TableCell className="font-medium">{appointment.meetingId || "N/A"}</TableCell>
                      <TableCell>
                        <div className="font-medium">{getCustomerName(appointment)}</div>
                        <div className="text-xs text-gray-500">{getCustomerEmail(appointment)}</div>
                      </TableCell>
                      <TableCell className="max-w-[260px] truncate" title={appointment.purpose}>
                        {appointment.purpose || "N/A"}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {formatDate(appointment.availabilityDate)}
                      </TableCell>
                      <TableCell>
                        {formatTimeLabel(appointment.startTime)} - {formatTimeLabel(appointment.endTime)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusClass(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedAppointment(appointment)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Appointment Details</DialogTitle>
                              <DialogDescription>
                                View complete meeting and customer information
                              </DialogDescription>
                            </DialogHeader>

                            {selectedAppointment && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                  <div>
                                    <p className="text-xs text-gray-500">Meeting ID</p>
                                    <p className="font-medium">{selectedAppointment.meetingId || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Status</p>
                                    <Badge
                                      variant="outline"
                                      className={statusClass(selectedAppointment.status)}
                                    >
                                      {selectedAppointment.status}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Customer Name</p>
                                    <p className="font-medium">{getCustomerName(selectedAppointment)}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Customer Email</p>
                                    <p className="font-medium">{getCustomerEmail(selectedAppointment)}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Meeting Date</p>
                                    <p className="font-medium">
                                      {formatDate(selectedAppointment.availabilityDate)}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Meeting Time</p>
                                    <p className="font-medium">
                                      {formatTimeLabel(selectedAppointment.startTime)} -{" "}
                                      {formatTimeLabel(selectedAppointment.endTime)}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Created On</p>
                                    <p className="font-medium">{formatDate(selectedAppointment.createdAt)}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Meeting Link</p>
                                    {selectedAppointment.meetingLink ? (
                                      <a
                                        href={selectedAppointment.meetingLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center text-blue-600 hover:underline break-all"
                                      >
                                        Open Link <ExternalLink className="ml-1 w-3 h-3" />
                                      </a>
                                    ) : (
                                      <p className="font-medium">N/A</p>
                                    )}
                                  </div>
                                </div>

                                <div className="p-4 border border-gray-200 rounded-lg">
                                  <p className="text-xs text-gray-500 mb-1">Purpose</p>
                                  <p className="text-sm whitespace-pre-wrap">
                                    {selectedAppointment.purpose || "N/A"}
                                  </p>
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
