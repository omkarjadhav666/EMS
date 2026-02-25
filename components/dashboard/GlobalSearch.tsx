"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

interface GlobalSearchProps {
    user: any;
}

export function GlobalSearch({ user }: GlobalSearchProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<{
        events: any[];
        vendors: any[];
    }>({ events: [], vendors: [] });
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query.trim()) {
                setResults({ events: [], vendors: [] });
                return;
            }

            setLoading(true);
            try {
                // Search Vendors
                const { data: vendorsData } = await supabase
                    .from("vendors")
                    .select("id, name, category, image_url")
                    .ilike("name", `%${query}%`)
                    .limit(5);

                // Search Events
                const { data: eventsData, error: eventsError } = await supabase
                    .from("events")
                    .select("id, title, date, user_id")
                    .ilike("title", `%${query}%`)
                    .limit(10);

                if (eventsError) {
                    console.error("Events fetch error:", eventsError);
                }

                // Filter events: belongs to the current user
                const filteredEvents = (eventsData || []).filter(
                    (event) => event.user_id === user?.id
                ).slice(0, 5); // Keep top 5

                setResults({
                    events: filteredEvents,
                    vendors: vendorsData || [],
                });
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimeout = setTimeout(fetchResults, 300);
        return () => clearTimeout(debounceTimeout);
    }, [query, supabase, user]);

    return (
        <>
            <div className="relative w-full group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-hover:text-gold-leaf-500 transition-colors" />
                <input
                    type="text"
                    placeholder="Search events, vendors... (Ctrl+K)"
                    className="w-full pl-10 pr-4 py-2 bg-alabaster border border-stone-100 rounded-full text-sm focus:outline-none focus:border-gold-leaf-300 focus:ring-1 focus:ring-gold-leaf-300 transition-all placeholder:text-stone-400 cursor-pointer shadow-sm"
                    readOnly
                    onClick={() => setOpen(true)}
                />
            </div>

            <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
                <CommandInput
                    placeholder="Type a command or search..."
                    value={query}
                    onValueChange={setQuery}
                />
                <CommandList>
                    {loading && <div className="p-4 text-center text-sm text-taupe">Searching...</div>}
                    {!loading && results.events.length === 0 && results.vendors.length === 0 && query && (
                        <CommandEmpty>No results found.</CommandEmpty>
                    )}

                    {results.events.length > 0 && (
                        <CommandGroup heading="Events">
                            {results.events.map((event) => (
                                <CommandItem
                                    key={event.id}
                                    onSelect={() => {
                                        setOpen(false);
                                        if (event.user_id === user?.id) {
                                            router.push(`/dashboard/events/${event.id}`);
                                        } else {
                                            router.push(`/events/${event.id}`); // Assuming a public events route exists
                                        }
                                    }}
                                    className="flex items-center gap-3 p-2 cursor-pointer"
                                >
                                    <div className="w-8 h-8 rounded-md bg-stone-100 flex items-center justify-center shrink-0">
                                        <Search className="w-4 h-4 text-stone-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{event.title}</p>
                                        <p className="text-xs text-taupe">{new Date(event.date).toLocaleDateString()}</p>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}

                    {results.vendors.length > 0 && (
                        <CommandGroup heading="Vendors">
                            {results.vendors.map((vendor) => (
                                <CommandItem
                                    key={vendor.id}
                                    onSelect={() => {
                                        setOpen(false);
                                        router.push(`/vendors/${vendor.id}`);
                                    }}
                                    className="flex items-center gap-3 p-2 cursor-pointer"
                                >
                                    {vendor.image_url ? (
                                        <img src={vendor.image_url} alt={vendor.name} className="w-8 h-8 rounded-md object-cover" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-md bg-stone-100 flex items-center justify-center shrink-0">
                                            <Search className="w-4 h-4 text-stone-400" />
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm font-medium">{vendor.name}</p>
                                        <p className="text-xs text-taupe">{vendor.category}</p>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                </CommandList>
            </CommandDialog>
        </>
    );
}
