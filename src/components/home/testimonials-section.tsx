import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Rahul Sharma",
    location: "Mumbai",
    rating: 5,
    comment: "Excellent quality frames at amazing prices! The delivery was super fast and the frame fits perfectly. Highly recommended!",
    avatar: "RS",
  },
  {
    id: 2,
    name: "Priya Patel",
    location: "Delhi",
    rating: 5,
    comment: "Love my new cat-eye frames! The color is exactly as shown in the pictures. Customer service was very helpful too.",
    avatar: "PP",
  },
  {
    id: 3,
    name: "Amit Kumar",
    location: "Bangalore",
    rating: 4,
    comment: "Good collection of frames for men. Found the perfect aviator style I was looking for. Will definitely order again!",
    avatar: "AK",
  },
  {
    id: 4,
    name: "Sneha Reddy",
    location: "Hyderabad",
    rating: 5,
    comment: "Ordered frames for my kids and they love it! Sturdy build and vibrant colors. Great value for money.",
    avatar: "SR",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 md:py-20 bg-black">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 rounded-full border border-gold/30 text-gold text-sm font-medium mb-4">
            Customer Reviews
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            What Our <span className="text-gold">Customers</span> Say
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Join thousands of happy customers who found their perfect frames with us
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="group bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 hover:border-gold/40 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-gold/5"
            >
              {/* Quote Icon */}
              <Quote className="h-8 w-8 text-gold/30 mb-4" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < testimonial.rating
                        ? "text-gold fill-gold"
                        : "text-gray-600"
                      }`}
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-gray-300 text-sm mb-6 line-clamp-4 leading-relaxed">
                &quot;{testimonial.comment}&quot;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
                <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold-dark text-black rounded-full flex items-center justify-center font-bold text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm text-white">{testimonial.name}</p>
                  <p className="text-xs text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-12">
          <div className="text-center">
            <p className="text-4xl font-bold text-gold">10,000+</p>
            <p className="text-sm text-gray-500 mt-1">Happy Customers</p>
          </div>
          <div className="h-12 w-px bg-gray-800 hidden md:block" />
          <div className="text-center">
            <p className="text-4xl font-bold text-gold">4.8/5</p>
            <p className="text-sm text-gray-500 mt-1">Average Rating</p>
          </div>
          <div className="h-12 w-px bg-gray-800 hidden md:block" />
          <div className="text-center">
            <p className="text-4xl font-bold text-gold">500+</p>
            <p className="text-sm text-gray-500 mt-1">5-Star Reviews</p>
          </div>
        </div>
      </div>
    </section>
  );
}
