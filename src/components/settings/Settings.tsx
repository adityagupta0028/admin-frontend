import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { Plus } from "lucide-react";
import { toast } from "sonner@2.0.3";

export function Settings() {
  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

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
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="mb-6">
        <h1>Settings</h1>
        <p className="text-gray-500 mt-1">Manage your store settings and preferences</p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-white border border-gray-200">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="admin">Admin Account</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>Basic details about your jewelry store</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="store-name">Store Name</Label>
                <Input id="store-name" defaultValue="Luxe Jewels" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="store-email">Contact Email</Label>
                <Input id="store-email" type="email" defaultValue="contact@luxejewels.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="store-phone">Phone Number</Label>
                <Input id="store-phone" defaultValue="+1 (555) 123-4567" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="store-address">Store Address</Label>
                <Input id="store-address" defaultValue="123 Luxury Lane, New York, NY 10001" />
              </div>
              <Separator />
              <div className="grid gap-2">
                <Label htmlFor="currency">Currency</Label>
                <Select defaultValue="usd">
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD - US Dollar ($)</SelectItem>
                    <SelectItem value="eur">EUR - Euro (€)</SelectItem>
                    <SelectItem value="gbp">GBP - British Pound (£)</SelectItem>
                    <SelectItem value="jpy">JPY - Japanese Yen (¥)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="est">
                  <SelectTrigger id="timezone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="est">Eastern Time (ET)</SelectItem>
                    <SelectItem value="cst">Central Time (CT)</SelectItem>
                    <SelectItem value="mst">Mountain Time (MT)</SelectItem>
                    <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-gradient-to-r from-[var(--gold)] to-[var(--gold-dark)]" onClick={handleSave}>
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>Connect your social media profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input id="facebook" placeholder="https://facebook.com/yourpage" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input id="instagram" placeholder="https://instagram.com/yourpage" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="twitter">Twitter / X</Label>
                <Input id="twitter" placeholder="https://twitter.com/yourpage" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pinterest">Pinterest</Label>
                <Input id="pinterest" placeholder="https://pinterest.com/yourpage" />
              </div>
              <Button className="bg-gradient-to-r from-[var(--gold)] to-[var(--gold-dark)]" onClick={handleSave}>
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Tax Settings</CardTitle>
              <CardDescription>Configure tax rates and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="tax-rate">Default Tax Rate (%)</Label>
                <Input id="tax-rate" type="number" defaultValue="8.5" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tax-number">Tax ID / Business Number</Label>
                <Input id="tax-number" placeholder="Enter your tax identification number" />
              </div>
              <Button className="bg-gradient-to-r from-[var(--gold)] to-[var(--gold-dark)]" onClick={handleSave}>
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Payment Gateways</CardTitle>
              <CardDescription>Manage accepted payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p>Credit/Debit Cards</p>
                  <p className="text-gray-500" style={{ fontSize: '0.875rem' }}>Accept Visa, Mastercard, Amex</p>
                </div>
                <Badge className="bg-green-50 text-green-700 border-green-200">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p>PayPal</p>
                  <p className="text-gray-500" style={{ fontSize: '0.875rem' }}>PayPal checkout integration</p>
                </div>
                <Badge className="bg-green-50 text-green-700 border-green-200">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p>Bank Transfer</p>
                  <p className="text-gray-500" style={{ fontSize: '0.875rem' }}>Direct bank transfers</p>
                </div>
                <Badge className="bg-gray-50 text-gray-700 border-gray-200">Inactive</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipping Settings */}
        <TabsContent value="shipping" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Shipping Zones</CardTitle>
              <CardDescription>Configure shipping rates by location</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p>Domestic Shipping (USA)</p>
                  <p className="text-gray-500" style={{ fontSize: '0.875rem' }}>Standard: $15 | Express: $35</p>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p>International Shipping</p>
                  <p className="text-gray-500" style={{ fontSize: '0.875rem' }}>Starts from $45</p>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
              <Button className="bg-gradient-to-r from-[var(--gold)] to-[var(--gold-dark)]">
                <Plus className="w-4 h-4 mr-2" />
                Add Shipping Zone
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Free Shipping</CardTitle>
              <CardDescription>Set minimum order value for free shipping</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="free-shipping">Minimum Order Amount ($)</Label>
                <Input id="free-shipping" type="number" defaultValue="500" />
                <p className="text-gray-500" style={{ fontSize: '0.875rem' }}>Orders above this amount qualify for free shipping</p>
              </div>
              <Button className="bg-gradient-to-r from-[var(--gold)] to-[var(--gold-dark)]" onClick={handleSave}>
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admin Account Settings */}
        <TabsContent value="admin" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Admin Profile</CardTitle>
              <CardDescription>Update your admin account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="admin-name">Full Name</Label>
                <Input id="admin-name" defaultValue="Admin User" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="admin-email">Email Address</Label>
                <Input id="admin-email" type="email" defaultValue="admin@luxejewels.com" />
              </div>
              <Button className="bg-gradient-to-r from-[var(--gold)] to-[var(--gold-dark)]" onClick={handleSave}>
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your admin password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Button className="bg-gradient-to-r from-[var(--gold)] to-[var(--gold-dark)]" onClick={handleSave}>
                Update Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
