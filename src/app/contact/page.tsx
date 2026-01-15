import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
    title: "Contact Us | LeeHit Eyewear",
    description: "Get in touch with LeeHit Eyewear. We're here to help with your eyewear needs.",
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="bg-gradient-to-b from-black to-gray-950 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Contact <span className="text-gold">Us</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>
            </div>

            {/* Contact Info Cards */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {/* Phone */}
                    <div className="bg-card border border-gold/20 rounded-xl p-8 text-center hover:border-gold/40 transition-colors">
                        <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Phone className="w-8 h-8 text-gold" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Call Us</h3>
                        <p className="text-gray-400 mb-4">Mon-Sat, 10AM - 7PM</p>
                        <a href="tel:+919833441511" className="text-gold hover:text-gold-light text-lg font-medium">
                            +91 9833441511
                        </a>
                    </div>

                    {/* Email */}
                    <div className="bg-card border border-gold/20 rounded-xl p-8 text-center hover:border-gold/40 transition-colors">
                        <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Mail className="w-8 h-8 text-gold" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Email Us</h3>
                        <p className="text-gray-400 mb-4">We reply within 24 hours</p>
                        <a href="mailto:leehiteyewear@gmail.com" className="text-gold hover:text-gold-light text-lg font-medium">
                            leehiteyewear@gmail.com
                        </a>
                    </div>

                    {/* WhatsApp */}
                    <div className="bg-card border border-gold/20 rounded-xl p-8 text-center hover:border-gold/40 transition-colors">
                        <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <MessageCircle className="w-8 h-8 text-gold" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">WhatsApp</h3>
                        <p className="text-gray-400 mb-4">Quick responses</p>
                        <a
                            href="https://wa.me/919833441511?text=Hi, I have a query about LeeHit Eyewear"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gold hover:text-gold-light text-lg font-medium"
                        >
                            +91 9833441511
                        </a>
                    </div>
                </div>

                {/* Location Section */}
                <div className="bg-card border border-gold/20 rounded-xl p-8 md:p-12">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                                    <MapPin className="w-6 h-6 text-gold" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">Our Location</h2>
                            </div>
                            <p className="text-gray-300 text-lg mb-4">
                                Mira Bhyandar, Mumbai<br />
                                Maharashtra - 401105<br />
                                India
                            </p>
                            <div className="flex items-center gap-3 text-gray-400">
                                <Clock className="w-5 h-5 text-gold" />
                                <span>Open: Monday - Saturday, 10:00 AM - 7:00 PM</span>
                            </div>
                        </div>
                        <div className="bg-gray-800 rounded-xl h-64 flex items-center justify-center">
                            <div className="text-center">
                                <MapPin className="w-12 h-12 text-gold mx-auto mb-4" />
                                <p className="text-gray-400">Mira Bhyandar, Mumbai</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-16">
                    <p className="text-gray-400 mb-6">
                        Prefer to reach out via WhatsApp for faster response?
                    </p>
                    <Button asChild className="bg-gold hover:bg-gold-light text-black font-semibold px-8 py-6 text-lg">
                        <a
                            href="https://wa.me/919833441511?text=Hi, I have a query about LeeHit Eyewear"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <MessageCircle className="w-5 h-5 mr-2" />
                            Chat on WhatsApp
                        </a>
                    </Button>
                </div>
            </div>
        </div>
    );
}
