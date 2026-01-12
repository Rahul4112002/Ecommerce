"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/helpers";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  userName: string | null;
  userImage: string | null;
  createdAt: Date;
  isVerified: boolean;
}

interface ProductReviewsProps {
  reviews: Review[];
  avgRating: number;
  reviewCount: number;
}

export function ProductReviews({ reviews, avgRating, reviewCount }: ProductReviewsProps) {
  if (reviewCount === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  // Rating distribution
  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: (reviews.filter((r) => r.rating === rating).length / reviewCount) * 100,
  }));

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="text-center md:text-left">
          <div className="text-5xl font-bold text-primary">{avgRating}</div>
          <div className="flex items-center justify-center md:justify-start gap-1 my-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`text-xl ${i < Math.round(avgRating) ? "text-yellow-400" : "text-gray-300"}`}
              >
                ★
              </span>
            ))}
          </div>
          <p className="text-muted-foreground">{reviewCount} reviews</p>
        </div>

        {/* Rating Distribution */}
        <div className="flex-1 space-y-2 w-full md:max-w-sm">
          {ratingCounts.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center gap-3">
              <span className="text-sm w-8">{rating} ★</span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground w-8">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-6 last:border-0">
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src={review.userImage || undefined} />
                <AvatarFallback>
                  {review.userName?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium">{review.userName || "Anonymous"}</span>
                  {review.isVerified && (
                    <Badge variant="secondary" className="text-xs">
                      Verified Purchase
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(new Date(review.createdAt))}
                  </span>
                </div>
                
                {review.title && (
                  <h4 className="font-medium mt-2">{review.title}</h4>
                )}
                
                {review.comment && (
                  <p className="text-muted-foreground mt-1">{review.comment}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
