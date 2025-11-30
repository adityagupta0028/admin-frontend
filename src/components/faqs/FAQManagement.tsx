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
import { Search, Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";

const faqs = [
  { 
    id: 1, 
    question: "What is your return policy?", 
    answer: "We offer a 30-day return policy on all unworn jewelry with original packaging and tags.",
    category: "Returns",
    status: "Published"
  },
  { 
    id: 2, 
    question: "Do you offer international shipping?", 
    answer: "Yes, we ship to over 50 countries worldwide with secure and insured delivery.",
    category: "Shipping",
    status: "Published"
  },
  { 
    id: 3, 
    question: "Are your diamonds certified?", 
    answer: "All our diamonds come with GIA or IGI certification guaranteeing authenticity and quality.",
    category: "Products",
    status: "Published"
  },
  { 
    id: 4, 
    question: "How do I determine my ring size?", 
    answer: "We provide a free ring sizing guide and offer complimentary resizing within 60 days of purchase.",
    category: "Sizing",
    status: "Published"
  },
  { 
    id: 5, 
    question: "What payment methods do you accept?", 
    answer: "We accept all major credit cards, PayPal, and bank transfers for purchases.",
    category: "Payment",
    status: "Draft"
  },
];

export function FAQManagement() {
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
            <BreadcrumbPage>FAQs</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1>FAQ Management</h1>
          <p className="text-gray-500 mt-1">Manage frequently asked questions for your customers</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-[var(--gold)] to-[var(--gold-dark)] hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Add FAQ
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New FAQ</DialogTitle>
              <DialogDescription>Create a new frequently asked question.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="faq-question">Question</Label>
                <Input id="faq-question" placeholder="Enter your question..." />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="faq-answer">Answer</Label>
                <Textarea id="faq-answer" placeholder="Enter the answer..." rows={5} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="faq-category">Category</Label>
                <Select>
                  <SelectTrigger id="faq-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="products">Products</SelectItem>
                    <SelectItem value="shipping">Shipping</SelectItem>
                    <SelectItem value="returns">Returns</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="sizing">Sizing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="faq-publish">Publish to Website</Label>
                  <p className="text-gray-500" style={{ fontSize: '0.875rem' }}>Make this FAQ visible to customers</p>
                </div>
                <Switch id="faq-publish" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button className="bg-gradient-to-r from-[var(--gold)] to-[var(--gold-dark)]" onClick={() => setIsAddOpen(false)}>
                Create FAQ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6 shadow-sm">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search FAQs..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="products">Products</SelectItem>
                <SelectItem value="shipping">Shipping</SelectItem>
                <SelectItem value="returns">Returns</SelectItem>
                <SelectItem value="payment">Payment</SelectItem>
                <SelectItem value="sizing">Sizing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* FAQs Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>All FAQs ({faqs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Answer</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faqs.map((faq) => (
                <TableRow key={faq.id}>
                  <TableCell className="max-w-xs">{faq.question}</TableCell>
                  <TableCell className="text-gray-600 max-w-md truncate">{faq.answer}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {faq.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        faq.status === "Published"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                      }
                    >
                      {faq.status === "Published" ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                      {faq.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
