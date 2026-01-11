import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join thousands of happy customers who found their perfect frames with us
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                {/* Quote Icon */}
                <Quote className="h-8 w-8 text-primary/20 mb-4" />
                
                {/* Rating */}
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-4">
                  &quot;{testimonial.comment}&quot;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{testimonial.name}</p>
                    <p className="text-xs text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-gray-400">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-800">10,000+</p>
            <p className="text-sm">Happy Customers</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-800">4.8/5</p>
            <p className="text-sm">Average Rating</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-800">500+</p>
            <p className="text-sm">5-Star Reviews</p>
          </div>
        </div>
      </div>
    </section>
  );
}
