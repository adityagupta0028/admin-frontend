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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Search, Plus, Edit, Eye } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";

const pages = [
  { 
    id: 1, 
    title: "About Us", 
    slug: "about-us", 
    lastUpdated: "Oct 28, 2025",
    status: "Published"
  },
  { 
    id: 2, 
    title: "Privacy Policy", 
    slug: "privacy-policy", 
    lastUpdated: "Oct 15, 2025",
    status: "Published"
  },
  { 
    id: 3, 
    title: "Terms & Conditions", 
    slug: "terms-conditions", 
    lastUpdated: "Oct 15, 2025",
    status: "Published"
  },
  { 
    id: 4, 
    title: "Shipping Policy", 
    slug: "shipping-policy", 
    lastUpdated: "Nov 2, 2025",
    status: "Published"
  },
  { 
    id: 5, 
    title: "Return Policy", 
    slug: "return-policy", 
    lastUpdated: "Oct 20, 2025",
    status: "Draft"
  },
];

export function CMSManagement() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

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
            <BreadcrumbPage>CMS</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1>Content Management System</h1>
          <p className="text-gray-500 mt-1">Manage static pages and website content</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-[var(--gold)] to-[var(--gold-dark)] hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Add Page
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Page</DialogTitle>
              <DialogDescription>Add a new static page to your website.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="page-title">Page Title</Label>
                <Input id="page-title" placeholder="e.g., Warranty Information" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="page-slug">URL Slug</Label>
                <Input id="page-slug" placeholder="e.g., warranty-information" />
                <p className="text-gray-500" style={{ fontSize: '0.75rem' }}>URL: yoursite.com/<span className="text-[var(--gold)]">warranty-information</span></p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="page-content">Page Content</Label>
                <Textarea id="page-content" placeholder="Enter page content..." rows={10} />
                <p className="text-gray-500" style={{ fontSize: '0.75rem' }}>Supports HTML and Markdown formatting</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Save as Draft</Button>
              <Button className="bg-gradient-to-r from-[var(--gold)] to-[var(--gold-dark)]" onClick={() => setIsAddOpen(false)}>
                Publish Page
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="mb-6 shadow-sm">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search pages..." className="pl-10" />
          </div>
        </CardContent>
      </Card>

      {/* Pages Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>All Pages ({pages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Page Title</TableHead>
                <TableHead>URL Slug</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell>{page.title}</TableCell>
                  <TableCell className="text-gray-600">/{page.slug}</TableCell>
                  <TableCell className="text-gray-500">{page.lastUpdated}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        page.status === "Published"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                      }
                    >
                      {page.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Edit Page - {page.title}</DialogTitle>
                            <DialogDescription>Update page content and settings.</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="edit-title">Page Title</Label>
                              <Input id="edit-title" defaultValue={page.title} />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-slug">URL Slug</Label>
                              <Input id="edit-slug" defaultValue={page.slug} />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-content">Page Content</Label>
                              <Textarea 
                                id="edit-content" 
                                defaultValue="Your existing page content goes here. This is a rich text editor area where you can format text, add images, and more." 
                                rows={12} 
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                            <Button variant="outline">Save as Draft</Button>
                            <Button className="bg-gradient-to-r from-[var(--gold)] to-[var(--gold-dark)]" onClick={() => setIsEditOpen(false)}>
                              Update & Publish
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
