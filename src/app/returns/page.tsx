import { RotateCcw, Package, Clock, CheckCircle, XCircle, AlertCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
    title: "Returns & Exchange | LeeHit Eyewear",
    description: "Return and exchange policy for LeeHit Eyewear. Easy 7-day returns.",
};

export default function ReturnsPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="bg-gradient-to-b from-black to-gray-950 py-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <RotateCcw className="w-10 h-10 text-gold" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Returns & <span className="text-gold">Exchange</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Not satisfied with your purchase? We've got you covered with our easy return policy.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">

                    {/* Policy Highlight */}
                    <div className="bg-gradient-to-r from-gold/10 to-gold/5 border border-gold/30 rounded-xl p-8 mb-12 text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Clock className="w-8 h-8 text-gold" />
                            <h2 className="text-3xl font-bold text-white">7-Day Return Policy</h2>
                        </div>
                        <p className="text-gray-300 text-lg">
                            Return or exchange any product within 7 days of delivery. No questions asked!
                        </p>
                    </div>

                    {/* How it Works */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-white mb-8 text-center">How It Works</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-card border border-gold/20 rounded-xl p-6 text-center">
                                <div className="w-12 h-12 bg-gold text-black rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                                <h3 className="text-lg font-semibold text-white mb-2">Contact Us</h3>
                                <p className="text-gray-400 text-sm">
                                    Reach out via WhatsApp or email with your order details and reason for return.
                                </p>
                            </div>
                            <div className="bg-card border border-gold/20 rounded-xl p-6 text-center">
                                <div className="w-12 h-12 bg-gold text-black rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                                <h3 className="text-lg font-semibold text-white mb-2">Pack & Ship</h3>
                                <p className="text-gray-400 text-sm">
                                    Pack the product in original packaging. We'll arrange pickup or provide shipping label.
                                </p>
                            </div>
                            <div className="bg-card border border-gold/20 rounded-xl p-6 text-center">
                                <div className="w-12 h-12 bg-gold text-black rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                                <h3 className="text-lg font-semibold text-white mb-2">Get Refund</h3>
                                <p className="text-gray-400 text-sm">
                                    Once we receive the product, refund will be processed within 5-7 business days.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Eligible / Not Eligible */}
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        {/* Eligible */}
                        <div className="bg-card border border-green-500/30 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <CheckCircle className="w-6 h-6 text-green-500" />
                                <h3 className="text-xl font-semibold text-white">Eligible for Return</h3>
                            </div>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-gray-300">
                                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                                    <span>Unused product in original condition</span>
                                </li>
                                <li className="flex items-start gap-3 text-gray-300">
                                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                                    <span>Product with original packaging and tags</span>
                                </li>
                                <li className="flex items-start gap-3 text-gray-300">
                                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                                    <span>Request within 7 days of delivery</span>
                                </li>
                                <li className="flex items-start gap-3 text-gray-300">
                                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                                    <span>Manufacturing defects or damaged items</span>
                                </li>
                            </ul>
                        </div>

                        {/* Not Eligible */}
                        <div className="bg-card border border-red-500/30 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <XCircle className="w-6 h-6 text-red-500" />
                                <h3 className="text-xl font-semibold text-white">Not Eligible</h3>
                            </div>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-gray-300">
                                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                                    <span>Used or altered products</span>
                                </li>
                                <li className="flex items-start gap-3 text-gray-300">
                                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                                    <span>Products without original packaging</span>
                                </li>
                                <li className="flex items-start gap-3 text-gray-300">
                                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                                    <span>Return request after 7 days</span>
                                </li>
                                <li className="flex items-start gap-3 text-gray-300">
                                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                                    <span>Products with fitted prescription lenses</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Important Note */}
                    <div className="bg-card border border-gold/20 rounded-xl p-6 mb-12">
                        <div className="flex items-start gap-4">
                            <AlertCircle className="w-6 h-6 text-gold shrink-0 mt-1" />
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Important Note</h3>
                                <p className="text-gray-400">
                                    For exchange, the replacement will be shipped after we receive the returned product.
                                    Refunds are processed to the original payment method. COD orders will receive
                                    refund via bank transfer (please provide account details).
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact CTA */}
                    <div className="text-center bg-card border border-gold/20 rounded-xl p-8">
                        <h3 className="text-2xl font-bold text-white mb-4">Need to Return Something?</h3>
                        <p className="text-gray-400 mb-6">
                            Contact our support team and we'll help you with the return process.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild className="bg-gold hover:bg-gold-light text-black font-semibold">
                                <a
                                    href="https://wa.me/919833441511?text=Hi, I want to return/exchange my order"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <MessageCircle className="w-5 h-5 mr-2" />
                                    WhatsApp: +91 9833441511
                                </a>
                            </Button>
                            <Button variant="outline" asChild className="border-gold/50 text-gold hover:bg-gold/10">
                                <a href="mailto:leehiteyewear@gmail.com">
                                    Email Us
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
