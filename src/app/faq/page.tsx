"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, ShoppingBag, Truck, RotateCcw, Eye } from "lucide-react";

const faqs = [
    {
        category: "Orders & Payment",
        icon: ShoppingBag,
        questions: [
            {
                q: "How do I place an order?",
                a: "Simply browse our collection, select your preferred frame, add it to cart, and proceed to checkout. You can pay using UPI, Credit/Debit Card, Net Banking, or choose Cash on Delivery (COD)."
            },
            {
                q: "What payment methods do you accept?",
                a: "We accept all major payment methods including UPI (Google Pay, PhonePe, Paytm), Credit Cards, Debit Cards, Net Banking, and Cash on Delivery (COD) for orders within India."
            },
            {
                q: "Can I cancel my order?",
                a: "Yes, you can cancel your order before it is shipped. Once shipped, you'll need to wait for delivery and then initiate a return. Contact us via WhatsApp at +91 9833441511 for quick assistance."
            },
        ]
    },
    {
        category: "Shipping & Delivery",
        icon: Truck,
        questions: [
            {
                q: "How long does delivery take?",
                a: "Standard delivery takes 5-7 business days across India. Metro cities may receive orders within 3-5 business days. You'll receive tracking details once your order is shipped."
            },
            {
                q: "Do you offer free shipping?",
                a: "Yes! We offer FREE shipping on all orders above ₹999. For orders below ₹999, a nominal shipping fee of ₹49 is applicable."
            },
            {
                q: "Do you deliver to my location?",
                a: "We deliver across India. Simply enter your pincode during checkout to check delivery availability and estimated delivery time for your area."
            },
        ]
    },
    {
        category: "Returns & Exchange",
        icon: RotateCcw,
        questions: [
            {
                q: "What is your return policy?",
                a: "We offer a 7-day return/exchange policy. If you're not satisfied with your purchase, you can return or exchange it within 7 days of delivery. The product must be unused and in original packaging."
            },
            {
                q: "How do I initiate a return?",
                a: "Contact us via WhatsApp at +91 9833441511 or email at leehiteyewear@gmail.com with your order details. Our team will guide you through the return process and arrange pickup."
            },
        ]
    },
    {
        category: "Product Information",
        icon: Eye,
        questions: [
            {
                q: "Are your frames original?",
                a: "Yes, all our frames are 100% original and sourced directly from authorized manufacturers. We guarantee authenticity and quality of every product we sell."
            },
            {
                q: "Do you provide prescription lenses?",
                a: "Currently, we sell frames only. You can get prescription lenses fitted at any local optical store after purchasing frames from us."
            },
        ]
    },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gold/10 rounded-lg overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left text-white hover:text-gold transition-colors"
            >
                <span className="font-medium pr-4">{question}</span>
                <ChevronDown className={`w-5 h-5 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="px-4 pb-4 text-gray-400">
                    {answer}
                </div>
            )}
        </div>
    );
}

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="bg-gradient-to-b from-black to-gray-950 py-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <HelpCircle className="w-10 h-10 text-gold" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Frequently Asked <span className="text-gold">Questions</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Find answers to common questions about orders, shipping, returns, and more.
                    </p>
                </div>
            </div>

            {/* FAQ Sections */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto space-y-12">
                    {faqs.map((section, index) => (
                        <div key={index} className="bg-card border border-gold/20 rounded-xl p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                                    <section.icon className="w-6 h-6 text-gold" />
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold text-white">{section.category}</h2>
                            </div>

                            <div className="space-y-3">
                                {section.questions.map((faq, faqIndex) => (
                                    <FAQItem key={faqIndex} question={faq.q} answer={faq.a} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Still Have Questions */}
                <div className="text-center mt-16 bg-card border border-gold/20 rounded-xl p-8 md:p-12 max-w-2xl mx-auto">
                    <h3 className="text-2xl font-bold text-white mb-4">Still have questions?</h3>
                    <p className="text-gray-400 mb-6">
                        Can't find the answer you're looking for? Our support team is here to help.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="https://wa.me/919833441511?text=Hi, I have a question about LeeHit Eyewear"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-light text-black font-semibold px-6 py-3 rounded-lg transition-colors"
                        >
                            Chat on WhatsApp
                        </a>
                        <a
                            href="mailto:leehiteyewear@gmail.com"
                            className="inline-flex items-center justify-center gap-2 border border-gold/50 text-gold hover:bg-gold/10 font-semibold px-6 py-3 rounded-lg transition-colors"
                        >
                            Email Us
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
