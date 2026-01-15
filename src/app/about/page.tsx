import { Glasses, Eye, Heart, Award, Users, ShieldCheck } from "lucide-react";

export const metadata = {
    title: "About Us | LeeHit Eyewear",
    description: "Learn about LeeHit Eyewear - Your trusted destination for premium eyeframes.",
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="bg-gradient-to-b from-black to-gray-950 py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Glasses className="w-10 h-10 text-gold" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        About <span className="text-gold">LeeHit Eyewear</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Your trusted destination for premium, stylish, and affordable eyewear.
                    </p>
                </div>
            </div>

            {/* Our Mission */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-card border border-gold/20 rounded-xl p-8 md:p-12 mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <Eye className="w-8 h-8 text-gold" />
                            <h2 className="text-2xl md:text-3xl font-bold text-white">Our Mission</h2>
                        </div>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            At LeeHit Eyewear, we believe that everyone deserves to look and feel great without
                            breaking the bank. Our mission is to provide high-quality, stylish eyeframes at
                            affordable prices, making premium eyewear accessible to all.
                        </p>
                    </div>

                    {/* Why Choose Us */}
                    <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
                        Why Choose <span className="text-gold">Us?</span>
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                        <div className="bg-card border border-gold/20 rounded-xl p-6 text-center hover:border-gold/40 transition-colors">
                            <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Award className="w-7 h-7 text-gold" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Premium Quality</h3>
                            <p className="text-gray-400 text-sm">
                                All our frames are crafted from high-quality materials ensuring durability and comfort.
                            </p>
                        </div>

                        <div className="bg-card border border-gold/20 rounded-xl p-6 text-center hover:border-gold/40 transition-colors">
                            <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Heart className="w-7 h-7 text-gold" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Affordable Prices</h3>
                            <p className="text-gray-400 text-sm">
                                Get designer-quality frames without the designer price tag. Value for money guaranteed.
                            </p>
                        </div>

                        <div className="bg-card border border-gold/20 rounded-xl p-6 text-center hover:border-gold/40 transition-colors">
                            <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-7 h-7 text-gold" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Customer First</h3>
                            <p className="text-gray-400 text-sm">
                                Your satisfaction is our priority. Dedicated support via WhatsApp & email.
                            </p>
                        </div>

                        <div className="bg-card border border-gold/20 rounded-xl p-6 text-center hover:border-gold/40 transition-colors">
                            <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Glasses className="w-7 h-7 text-gold" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Wide Collection</h3>
                            <p className="text-gray-400 text-sm">
                                From classic to trendy, we have frames for every face shape, style, and occasion.
                            </p>
                        </div>

                        <div className="bg-card border border-gold/20 rounded-xl p-6 text-center hover:border-gold/40 transition-colors">
                            <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShieldCheck className="w-7 h-7 text-gold" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Easy Returns</h3>
                            <p className="text-gray-400 text-sm">
                                7-day hassle-free return policy. Not satisfied? We'll make it right.
                            </p>
                        </div>

                        <div className="bg-card border border-gold/20 rounded-xl p-6 text-center hover:border-gold/40 transition-colors">
                            <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Award className="w-7 h-7 text-gold" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">100% Authentic</h3>
                            <p className="text-gray-400 text-sm">
                                Every frame we sell is 100% genuine and comes with quality assurance.
                            </p>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-gradient-to-r from-gold/10 to-gold/5 border border-gold/30 rounded-xl p-8 text-center">
                        <h2 className="text-2xl font-bold text-white mb-4">Get in Touch</h2>
                        <p className="text-gray-300 mb-6">
                            Have questions? We'd love to hear from you!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center text-gray-400">
                            <div className="flex items-center justify-center gap-2">
                                <span className="text-gold">📧</span>
                                <a href="mailto:leehiteyewear@gmail.com" className="hover:text-white transition-colors">
                                    leehiteyewear@gmail.com
                                </a>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <span className="text-gold">📞</span>
                                <a href="tel:+919833441511" className="hover:text-white transition-colors">
                                    +91 9833441511
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
