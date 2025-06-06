import React, { useState, useEffect, useRef } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "../utils/supabase";
import toast, { Toaster } from "react-hot-toast";

interface Review {
  id: string;
  name: string;
  review: string;
  rating: number;
  created_at: string;
}

const Testimonials = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<{ name: string; review: string; rating: number }>({
    name: "",
    review: "",
    rating: 0,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fetch reviews from Supabase
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("id, name, review, rating, created_at")
          .order("created_at", { ascending: false });
        if (error) {
          throw error;
        }
        setReviews(data || []);
      } catch (error: any) {
        console.error("Error fetching reviews:", error.message);
        setFormError("রিভিউ লোড করতে ত্রুটি হয়েছে।");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle star rating click
  const handleStarClick = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  // Handle star hover
  const handleStarHover = (rating: number) => {
    setHoveredRating(rating);
  };

  // Handle mouse leave from stars
  const handleStarMouseLeave = () => {
    setHoveredRating(0);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, review, rating } = formData;

    // Validation
    if (!name.trim() || !review.trim()) {
      setFormError("নাম এবং রিভিউ পূরণ করুন।");
      return;
    }
    if (name.length > 50 || review.length > 500) {
      setFormError("নাম ৫০ অক্ষর এবং রিভিউ ৫০০ অক্ষরের মধ্যে হতে হবে।");
      return;
    }
    if (rating < 1 || rating > 5) {
      setFormError("অনুগ্রহ করে ১ থেকে ৫ স্টারের মধ্যে রেটিং দিন।");
      return;
    }

    try {
      const { error } = await supabase
        .from("reviews")
        .insert([{ name: name.trim(), review: review.trim(), rating }]);
      if (error) {
        throw error;
      }
      setFormData({ name: "", review: "", rating: 0 });
      setFormError(null);
      toast.success("রিভিউ সফলভাবে জমা দেওয়া হয়েছে!", {
        position: "top-right",
        duration: 3000,
      });
      // Refresh reviews
      const { data } = await supabase
        .from("reviews")
        .select("id, name, review, rating, created_at")
        .order("created_at", { ascending: false });
      setReviews(data || []);
      // Scroll to the start to show the new review
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
      }
    } catch (error: any) {
      setFormError("রিভিউ জমা দিতে ত্রুটি হয়েছে।");
      console.error(error.message);
    }
  };

  // Scroll left
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  // Scroll right
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
      : "0.0";

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <Toaster />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            গ্রাহকদের মতামত
          </h2>
          <p className="text-lg text-gray-600">আমাদের সন্তুষ্ট গ্রাহকদের অভিজ্ঞতা শুনুন</p>
        </div>

        {/* Reviews Display */}
        {loading ? (
          <p className="text-center text-gray-600">লোডিং...</p>
        ) : reviews.length === 0 ? (
          <p className="text-center text-gray-600">কোনো রিভিউ নেই। প্রথম রিভিউ দিন!</p>
        ) : (
          <div className="relative mb-16">
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto space-x-4 scroll-smooth"
              style={{
                scrollbarWidth: "none", // Firefox
                msOverflowStyle: "none", // IE and Edge
              }}
            >
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 relative min-w-[280px] max-w-[280px]"
                >
                  <div className="absolute top-4 right-4 text-green-500">
                    <Quote className="h-6 w-6 opacity-20" />
                  </div>
                  <div className="mb-4">
                    <h3 className="text-md font-bold text-gray-900">{review.name}</h3>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed italic text-sm">"{review.review}"</p>
                </div>
              ))}
            </div>
            {/* Hide Scrollbar for Webkit Browsers */}
            <style>
              {`
                .flex::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>
            {/* Navigation Arrows */}
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-2 rounded-full shadow-md hover:bg-green-700 transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-2 rounded-full shadow-md hover:bg-green-700 transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        )}

        {/* Average Rating */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center space-x-2 bg-green-100 px-6 py-3 rounded-full">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(parseFloat(averageRating))
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-700 font-semibold">{averageRating}/৫ রেটিং</span>
            <span className="text-gray-500">{reviews.length}+ রিভিউ</span>
          </div>
        </div>

        {/* Review Form */}
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl mx-auto transform transition-all hover:scale-105 duration-300 border border-green-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center animate-pulse">
            আপনার রিভিউ দিন
          </h3>
          {formError && (
            <div className="mb-4 text-red-600 text-center bg-red-100 p-2 rounded-md">
              {formError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-800"
              >
                নাম
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-2 block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 transition-colors duration-200"
                placeholder="আপনার নাম লিখুন"
                maxLength={50}
              />
            </div>
            <div>
              <label
                htmlFor="review"
                className="block text-sm font-semibold text-gray-800"
              >
                রিভিউ
              </label>
              <textarea
                id="review"
                name="review"
                value={formData.review}
                onChange={handleInputChange}
                className="mt-2 block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 transition-colors duration-200"
                placeholder="আপনার অভিজ্ঞতা শেয়ার করুন"
                rows={5}
                maxLength={500}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                রেটিং
              </label>
              <div
                className="flex space-x-1"
                onMouseLeave={handleStarMouseLeave}
              >
                {[...Array(5)].map((_, i) => {
                  const starIndex = i + 1;
                  return (
                    <Star
                      key={i}
                      className={`h-8 w-8 cursor-pointer transition-transform duration-200 transform hover:scale-125 ${
                        starIndex <= (hoveredRating || formData.rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                      onClick={() => handleStarClick(starIndex)}
                      onMouseEnter={() => handleStarHover(starIndex)}
                    />
                  );
                })}
              </div>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-full font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                রিভিউ জমা দিন
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;