"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Store,
  Bell,
  CreditCard,
  Truck,
  Mail,
  Shield,
  Save,
  Loader2,
} from "lucide-react";

interface SettingsSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const sections: SettingsSection[] = [
  {
    id: "store",
    title: "Store Settings",
    description: "General store information and configuration",
    icon: Store,
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Email and push notification preferences",
    icon: Bell,
  },
  {
    id: "payments",
    title: "Payments",
    description: "Payment gateway configuration",
    icon: CreditCard,
  },
  {
    id: "shipping",
    title: "Shipping",
    description: "Shipping zones and rates",
    icon: Truck,
  },
  {
    id: "email",
    title: "Email Templates",
    description: "Customize transactional emails",
    icon: Mail,
  },
  {
    id: "security",
    title: "Security",
    description: "Security and access settings",
    icon: Shield,
  },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("store");
  const [isSaving, setIsSaving] = useState(false);

  // Store settings state
  const [storeSettings, setStoreSettings] = useState({
    storeName: "LeeHit Eyewear",
    email: "leehiteyewear@gmail.com",
    phone: "+91 98334 41511",
    address: "Mumbai, Maharashtra, India",
    currency: "INR",
    timezone: "Asia/Kolkata",
  });

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    orderConfirmation: true,
    orderShipped: true,
    orderDelivered: true,
    lowStockAlert: true,
    newUserSignup: false,
    newsletterSubscription: true,
  });

  // Shipping settings state
  const [shippingSettings, setShippingSettings] = useState({
    freeShippingThreshold: 999,
    standardShippingRate: 99,
    expressShippingRate: 199,
    estimatedDelivery: "5-7 business days",
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Settings saved successfully");
    setIsSaving(false);
  };

  const inputClasses = "w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-gold/50 focus:border-gold placeholder:text-gray-500";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-2";

  const renderStoreSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>Store Name</label>
          <input
            type="text"
            value={storeSettings.storeName}
            onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>Contact Email</label>
          <input
            type="email"
            value={storeSettings.email}
            onChange={(e) => setStoreSettings({ ...storeSettings, email: e.target.value })}
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>Phone Number</label>
          <input
            type="tel"
            value={storeSettings.phone}
            onChange={(e) => setStoreSettings({ ...storeSettings, phone: e.target.value })}
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>Currency</label>
          <select
            value={storeSettings.currency}
            onChange={(e) => setStoreSettings({ ...storeSettings, currency: e.target.value })}
            className={inputClasses}
          >
            <option value="INR">Indian Rupee (₹)</option>
            <option value="USD">US Dollar ($)</option>
            <option value="EUR">Euro (€)</option>
            <option value="GBP">British Pound (£)</option>
          </select>
        </div>
      </div>
      <div>
        <label className={labelClasses}>Store Address</label>
        <textarea
          value={storeSettings.address}
          onChange={(e) => setStoreSettings({ ...storeSettings, address: e.target.value })}
          rows={3}
          className={inputClasses}
        />
      </div>
      <div>
        <label className={labelClasses}>Timezone</label>
        <select
          value={storeSettings.timezone}
          onChange={(e) => setStoreSettings({ ...storeSettings, timezone: e.target.value })}
          className={inputClasses}
        >
          <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
          <option value="America/New_York">America/New_York (EST)</option>
          <option value="Europe/London">Europe/London (GMT)</option>
          <option value="Asia/Dubai">Asia/Dubai (GST)</option>
        </select>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-4">
      <p className="text-sm text-gray-400 mb-6">
        Choose which notifications you want to receive
      </p>
      {Object.entries(notificationSettings).map(([key, value]) => (
        <div key={key} className="flex items-center justify-between py-3 border-b border-gray-700">
          <div>
            <p className="font-medium text-white">
              {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
            </p>
            <p className="text-sm text-gray-400">
              {key === "orderConfirmation" && "Notify when a new order is placed"}
              {key === "orderShipped" && "Notify when an order is shipped"}
              {key === "orderDelivered" && "Notify when an order is delivered"}
              {key === "lowStockAlert" && "Alert when product stock is low"}
              {key === "newUserSignup" && "Notify when a new user registers"}
              {key === "newsletterSubscription" && "Notify on newsletter subscriptions"}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => setNotificationSettings({ ...notificationSettings, [key]: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gold/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
          </label>
        </div>
      ))}
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <p className="text-sm text-yellow-400">
          Payment gateway integration requires additional setup. Configure Razorpay keys in environment variables.
        </p>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-700 rounded-lg bg-gray-800/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="font-medium text-white">Razorpay</p>
              <p className="text-sm text-gray-400">Accept UPI, cards & netbanking</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 text-sm rounded-full">
            Active
          </span>
        </div>
        <div className="flex items-center justify-between p-4 border border-gray-700 rounded-lg bg-gray-800/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
              <Truck className="h-6 w-6 text-gray-400" />
            </div>
            <div>
              <p className="font-medium text-white">Cash on Delivery</p>
              <p className="text-sm text-gray-400">Pay when you receive</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 text-sm rounded-full">
            Active
          </span>
        </div>
      </div>
    </div>
  );

  const renderShippingSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>Free Shipping Threshold (₹)</label>
          <input
            type="number"
            value={shippingSettings.freeShippingThreshold}
            onChange={(e) => setShippingSettings({ ...shippingSettings, freeShippingThreshold: Number(e.target.value) })}
            className={inputClasses}
          />
          <p className="mt-1 text-xs text-gray-500">Orders above this amount get free shipping</p>
        </div>
        <div>
          <label className={labelClasses}>Standard Shipping Rate (₹)</label>
          <input
            type="number"
            value={shippingSettings.standardShippingRate}
            onChange={(e) => setShippingSettings({ ...shippingSettings, standardShippingRate: Number(e.target.value) })}
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>Express Shipping Rate (₹)</label>
          <input
            type="number"
            value={shippingSettings.expressShippingRate}
            onChange={(e) => setShippingSettings({ ...shippingSettings, expressShippingRate: Number(e.target.value) })}
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>Estimated Delivery Time</label>
          <input
            type="text"
            value={shippingSettings.estimatedDelivery}
            onChange={(e) => setShippingSettings({ ...shippingSettings, estimatedDelivery: e.target.value })}
            className={inputClasses}
          />
        </div>
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <p className="text-sm text-blue-400">
          Email templates are sent automatically based on order status changes.
        </p>
      </div>
      <div className="space-y-4">
        {[
          { name: "Order Confirmation", status: "Active" },
          { name: "Order Shipped", status: "Active" },
          { name: "Order Delivered", status: "Active" },
          { name: "Password Reset", status: "Active" },
          { name: "Welcome Email", status: "Active" },
          { name: "Abandoned Cart Reminder", status: "Disabled" },
        ].map((template) => (
          <div key={template.name} className="flex items-center justify-between p-4 border border-gray-700 rounded-lg bg-gray-800/50">
            <div className="flex items-center gap-4">
              <Mail className="h-5 w-5 text-gray-400" />
              <span className="font-medium text-white">{template.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 text-sm rounded-full ${template.status === "Active"
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                }`}>
                {template.status}
              </span>
              <button className="text-gold hover:text-gold/80 text-sm font-medium">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-700 rounded-lg bg-gray-800/50">
          <div>
            <p className="font-medium text-white">Two-Factor Authentication</p>
            <p className="text-sm text-gray-400">Add an extra layer of security to admin accounts</p>
          </div>
          <button className="px-4 py-2 bg-gold text-black rounded-lg hover:bg-gold/90 transition-colors text-sm font-medium">
            Enable
          </button>
        </div>
        <div className="flex items-center justify-between p-4 border border-gray-700 rounded-lg bg-gray-800/50">
          <div>
            <p className="font-medium text-white">Session Timeout</p>
            <p className="text-sm text-gray-400">Automatically log out after period of inactivity</p>
          </div>
          <select className="px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-gold/50 focus:border-gold">
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="120">2 hours</option>
            <option value="240">4 hours</option>
          </select>
        </div>
        <div className="flex items-center justify-between p-4 border border-gray-700 rounded-lg bg-gray-800/50">
          <div>
            <p className="font-medium text-white">Password Requirements</p>
            <p className="text-sm text-gray-400">Minimum 8 characters with uppercase, lowercase, and numbers</p>
          </div>
          <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 text-sm rounded-full">
            Enforced
          </span>
        </div>
      </div>
    </div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case "store": return renderStoreSettings();
      case "notifications": return renderNotificationSettings();
      case "payments": return renderPaymentSettings();
      case "shipping": return renderShippingSettings();
      case "email": return renderEmailSettings();
      case "security": return renderSecuritySettings();
      default: return renderStoreSettings();
    }
  };

  const activeSectionData = sections.find((s) => s.id === activeSection);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1">
          Manage your store configuration and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Scrollable on mobile */}
        <div className="lg:col-span-1">
          <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left whitespace-nowrap ${activeSection === section.id
                    ? "bg-gold/20 text-gold border border-gold/30"
                    : "text-gray-400 hover:bg-gray-800 border border-transparent"
                  }`}
              >
                <section.icon className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">{section.title}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl border border-gray-800 p-6">
            <div className="mb-6 pb-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">{activeSectionData?.title}</h2>
              <p className="text-gray-400 text-sm mt-1">{activeSectionData?.description}</p>
            </div>

            {renderActiveSection()}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-700 flex justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2 bg-gold text-black rounded-lg hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
