import Link from "next/link";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { WhatsAppButton } from "./whatsapp-button";

const footerLinks = {
  shop: [
    { name: "Men's Frames", href: "/products?gender=MEN" },
    { name: "Women's Frames", href: "/products?gender=WOMEN" },
    { name: "Kids' Frames", href: "/products?gender=KIDS" },
    { name: "Sunglasses", href: "/products?category=sunglasses" },
    { name: "New Arrivals", href: "/products?sort=newest" },
  ],
  support: [
    { name: "Contact Us", href: "/contact" },
    { name: "FAQs", href: "/faq" },
    { name: "Shipping Info", href: "/shipping" },
    { name: "Returns & Exchange", href: "/returns" },
    { name: "Track Order", href: "/track-order" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Story", href: "/our-story" },
    { name: "Careers", href: "/careers" },
    { name: "Blog", href: "/blog" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Refund Policy", href: "/refund-policy" },
  ],
};

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "https://facebook.com" },
  { name: "Instagram", icon: Instagram, href: "https://instagram.com" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
  { name: "Youtube", icon: Youtube, href: "https://youtube.com" },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Contact */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold text-white">👓 EyeFrames</span>
            </Link>
            <p className="text-sm mb-6 max-w-md">
              Your one-stop destination for premium eyeframes. We offer a wide range of 
              stylish and affordable frames for men, women, and kids.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a 
                href="tel:+919876543210" 
                className="flex items-center space-x-3 hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </a>
              <a 
                href="mailto:support@eyeframes.com" 
                className="flex items-center space-x-3 hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>support@eyeframes.com</span>
              </a>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>123, Frame Street, Mumbai, Maharashtra - 400001</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            <h3 className="text-white font-semibold mb-4 mt-6">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-800" />

      {/* Bottom Bar */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between text-sm">
          <p>© 2026 EyeFrames. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-2 md:mt-0">
            <span>We accept:</span>
            <div className="flex space-x-2">
              <span className="bg-gray-800 px-2 py-1 rounded text-xs">Visa</span>
              <span className="bg-gray-800 px-2 py-1 rounded text-xs">Mastercard</span>
              <span className="bg-gray-800 px-2 py-1 rounded text-xs">UPI</span>
              <span className="bg-gray-800 px-2 py-1 rounded text-xs">COD</span>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <WhatsAppButton />
    </footer>
  );
}
