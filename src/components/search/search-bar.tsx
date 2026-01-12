"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/helpers";

// Simple hook implementation if it doesn't exist
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}

interface Suggestion {
    id: string;
    name: string;
    slug: string;
    price: number;
    image: string;
    category: string;
}

export function SearchBar({ className }: { className?: string }) {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const debouncedQuery = useDebounce(query, 300);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (debouncedQuery.length < 2) {
                setSuggestions([]);
                return;
            }

            setIsLoading(true);
            try {
                const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(debouncedQuery)}`);
                if (res.ok) {
                    const data = await res.json();
                    setSuggestions(data.suggestions);
                    setIsOpen(true);
                }
            } catch (error) {
                console.error("Failed to fetch suggestions:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSuggestions();
    }, [debouncedQuery]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            setIsOpen(false);
            router.push(`/products?search=${encodeURIComponent(query)}`);
        }
    };

    return (
        <div ref={containerRef} className={`relative w-full ${className}`}>
            <form onSubmit={handleSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    type="search"
                    placeholder="Search for frames..."
                    className="pl-10 pr-10"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if (e.target.value.length === 0) setIsOpen(false);
                    }}
                    onFocus={() => {
                        if (suggestions.length > 0) setIsOpen(true);
                    }}
                />
                {isLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    </div>
                )}
                {!isLoading && query && (
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        onClick={() => {
                            setQuery("");
                            setSuggestions([]);
                            setIsOpen(false);
                        }}
                    >
                        <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    </button>
                )}
            </form>

            {/* Suggestions Dropdown */}
            {isOpen && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border z-50 overflow-hidden">
                    <ul className="py-2">
                        {suggestions.map((product) => (
                            <li key={product.id}>
                                <Link
                                    href={`/products/${product.slug}`}
                                    className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-sm truncate">{product.name}</h4>
                                        <p className="text-xs text-muted-foreground">{product.category}</p>
                                    </div>
                                    <div className="text-sm font-semibold text-primary">
                                        {formatPrice(product.price)}
                                    </div>
                                </Link>
                            </li>
                        ))}
                        <li className="border-t mt-1">
                            <button
                                className="w-full text-left px-4 py-3 text-sm text-primary hover:bg-gray-50 flex items-center justify-between font-medium"
                                onClick={(e) => {
                                    handleSubmit(e);
                                }}
                            >
                                View all results for "{query}"
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}
