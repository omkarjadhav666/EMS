"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { TimelineItem } from "./types";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash2, Edit, Save, X, Loader2, Clock, AlertCircle, CalendarClock, Hourglass, ListOrdered, Sparkles } from "lucide-react";
import { format, differenceInMinutes, differenceInHours } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardTimelineProps {
    eventId: string;
    initialItems: TimelineItem[];
}

// Sortable Item Component with Premium Styling
function SortableTimelineItem({ item, onDelete, onEdit }: { item: TimelineItem; onDelete: (id: string) => void; onEdit: (item: TimelineItem) => void }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="group relative overflow-hidden rounded-xl bg-white/60 backdrop-blur-md border border-white/20 shadow-sm hover:shadow-md transition-all duration-300 mb-3">
            {/* Decorative Circle Accent */}
            <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full bg-gold-leaf-500/10 pointer-events-none" />

            <div className="flex items-center p-5 gap-5 relative z-10">
                {/* Drag Handle */}
                <div {...attributes} {...listeners} className="cursor-grab text-stone-300 hover:text-gold-leaf-500 active:cursor-grabbing transition-colors p-1">
                    <GripVertical className="w-5 h-5" />
                </div>

                {/* Time Section - Big Serif Font */}
                <div className="flex flex-col items-center min-w-[6rem] text-center border-r border-stone-100 pr-5">
                    <span className="font-serif font-bold text-2xl text-charcoal">{format(new Date(item.start_time), 'h:mm')}</span>
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">{format(new Date(item.start_time), 'a')}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-serif text-charcoal font-medium text-lg truncate group-hover:text-gold-leaf-700 transition-colors">{item.title}</h4>
                        </div>
                        {/* End Time Badge if exists */}
                        {item.end_time && (
                            <span className="inline-flex items-center gap-1 text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full uppercase tracking-wide font-bold">
                                <Clock className="w-3 h-3" /> Ends {format(new Date(item.end_time), 'h:mm a')}
                            </span>
                        )}
                    </div>

                    {item.description && (
                        <div className="flex items-center">
                            <p className="text-sm text-stone-500 truncate font-medium">{item.description}</p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(item)} className="p-2 text-stone-400 hover:text-gold-leaf-600 hover:bg-gold-leaf-50 rounded-full transition-colors">
                        <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(item.id)} className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export function DashboardTimeline({ eventId, initialItems }: DashboardTimelineProps) {
    const [items, setItems] = useState<TimelineItem[]>(initialItems);
    const [isAdding, setIsAdding] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editingItem, setEditingItem] = useState<TimelineItem | null>(null);

    // Calculate Stats
    const totalItems = items.length;
    const sortedItems = [...items].sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
    const firstEvent = sortedItems[0];
    const lastEvent = sortedItems[sortedItems.length - 1];

    let durationString = "-";
    if (firstEvent && lastEvent) {
        const start = new Date(firstEvent.start_time);
        const end = lastEvent.end_time ? new Date(lastEvent.end_time) : new Date(lastEvent.start_time);
        const hours = differenceInHours(end, start);
        const minutes = differenceInMinutes(end, start) % 60;
        durationString = `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
    }

    // Form State
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const supabase = createClient();
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        setItems(initialItems.sort((a, b) => a.order - b.order));
    }, [initialItems]);

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over?.id);
                const newItems = arrayMove(items, oldIndex, newIndex);

                // Optimistic update
                const updates = newItems.map((item, index) => ({
                    id: item.id,
                    order: index,
                    event_id: eventId
                }));

                updates.forEach(async (update) => {
                    await supabase.from('timeline_items').update({ order: update.order }).eq('id', update.id);
                });

                return newItems;
            });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this timeline item?")) return;
        setItems(prev => prev.filter(i => i.id !== id));
        await supabase.from('timeline_items').delete().eq('id', id);
    };

    const setupEdit = (item: TimelineItem) => {
        setTitle(item.title);
        setDescription(item.description || "");
        setStartTime(new Date(item.start_time).toISOString().slice(0, 16));
        setEndTime(item.end_time ? new Date(item.end_time).toISOString().slice(0, 16) : "");
        setEditingItem(item);
        setIsAdding(true);
    };

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setStartTime("");
        setEndTime("");
        setIsAdding(false);
        setEditingItem(null);
        setError(null);
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        try {
            const itemData = {
                event_id: eventId,
                title,
                description: description || null,
                start_time: new Date(startTime).toISOString(),
                end_time: endTime ? new Date(endTime).toISOString() : null,
                order: editingItem ? editingItem.order : items.length,
                icon: "star"
            };

            if (editingItem) {
                const { data, error } = await supabase.from('timeline_items').update(itemData).eq('id', editingItem.id).select().single();
                if (error) throw error;
                if (data) {
                    setItems(prev => prev.map(i => i.id === editingItem.id ? data : i));
                    resetForm();
                }
            } else {
                const { data, error } = await supabase.from('timeline_items').insert(itemData).select().single();
                if (error) throw error;
                if (data) {
                    setItems(prev => [...prev, data]);
                    resetForm();
                }
            }
        } catch (err: any) {
            console.error("Error saving timeline item:", err);
            setError(err.message || "Failed to save timeline item. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        // Changed from max-w-4xl to w-full to match GuestList page layout
        <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Summary Cards - Updated to match GuestList Style */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white/60 backdrop-blur-md border-white/20 shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-6 text-center">
                        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-3 text-stone-500">
                            <ListOrdered className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Events</p>
                        <h3 className="text-3xl font-serif text-charcoal mt-1">{totalItems}</h3>
                    </CardContent>
                </Card>

                <Card className="bg-white/60 backdrop-blur-md border-white/20 shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-6 text-center">
                        <div className="w-10 h-10 rounded-full bg-gold-leaf-50 flex items-center justify-center mx-auto mb-3 text-gold-leaf-500">
                            <Hourglass className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-gold-leaf-600/80 uppercase tracking-wider">Total Duration</p>
                        <h3 className="text-3xl font-serif text-gold-leaf-700 mt-1">{durationString}</h3>
                    </CardContent>
                </Card>

                <Card className="bg-white/60 backdrop-blur-md border-white/20 shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-6 text-center">
                        <div className="w-10 h-10 rounded-full bg-sage-50 flex items-center justify-center mx-auto mb-3 text-sage-500">
                            <CalendarClock className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-sage-600/80 uppercase tracking-wider">Earliest Start</p>
                        <h3 className="text-3xl font-serif text-sage-700 mt-1">
                            {firstEvent ? format(new Date(firstEvent.start_time), 'h:mm a') : '-'}
                        </h3>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Area */}
            <div className="bg-transparent space-y-6">
                <div className="flex justify-between items-center px-2">
                    <h3 className="text-lg font-serif font-medium text-charcoal flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-gold-leaf-500" />
                        Timeline
                    </h3>
                    {!isAdding && (
                        <Button
                            onClick={() => setIsAdding(true)}
                            className="bg-charcoal text-white hover:bg-black text-xs h-9"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add Event
                        </Button>
                    )}
                </div>

                {!isAdding && items.length === 0 && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="w-full py-6 mb-8 border-2 border-dashed border-stone-200 rounded-xl flex flex-col items-center justify-center gap-3 text-stone-400 hover:border-gold-leaf-300 hover:bg-gold-leaf-50/10 hover:text-gold-leaf-600 transition-all duration-300 group bg-white/40"
                    >
                        <div className="bg-stone-100 group-hover:bg-gold-leaf-100 p-3 rounded-full transition-colors shadow-sm">
                            <Plus className="w-6 h-6" />
                        </div>
                        <span className="font-serif font-medium text-lg">Add to Timeline</span>
                    </button>
                )}

                {/* Add/Edit Form - Updated to match Guest page aesthetics */}
                {isAdding && (
                    <div className="mb-8 bg-stone-50 border border-stone-100 p-6 rounded-xl shadow-sm animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-serif text-charcoal text-lg flex items-center gap-2">
                                <div className="p-1.5 bg-gold-leaf-100 rounded-md text-gold-leaf-600">
                                    <Plus className="w-4 h-4" />
                                </div>
                                {editingItem ? "Edit Item" : "New Timeline Item"}
                            </h3>
                            <button onClick={resetForm} className="text-stone-400 hover:text-charcoal"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm flex items-center gap-2 animate-in slide-in-from-top-2">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-stone-500 uppercase block">Title *</label>
                                    <input
                                        type="text"
                                        required
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        className="w-full px-3 py-2.5 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-leaf-200 focus:border-gold-leaf-300 transition-all placeholder:text-stone-300"
                                        placeholder="Ceremony Start"
                                        autoFocus
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-stone-500 uppercase block">Description</label>
                                    <input
                                        type="text"
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        className="w-full px-3 py-2.5 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-leaf-200 focus:border-gold-leaf-300 transition-all placeholder:text-stone-300"
                                        placeholder="Optional details..."
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-stone-500 uppercase block">Start Time *</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        min={new Date().toISOString().slice(0, 16)}
                                        value={startTime}
                                        onChange={e => setStartTime(e.target.value)}
                                        className="w-full px-3 py-2.5 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-leaf-200 focus:border-gold-leaf-300 transition-all text-stone-600"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-stone-500 uppercase block">End Time</label>
                                    <input
                                        type="datetime-local"
                                        min={new Date().toISOString().slice(0, 16)}
                                        value={endTime}
                                        onChange={e => setEndTime(e.target.value)}
                                        className="w-full px-3 py-2.5 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-leaf-200 focus:border-gold-leaf-300 transition-all text-stone-600"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end pt-4 border-t border-stone-200/50">
                                <Button
                                    type="submit"
                                    disabled={isSaving}
                                    className="bg-charcoal hover:bg-black text-white px-6 py-2 rounded-lg shadow-sm hover:shadow-md transition-all"
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                    {editingItem ? "Update Item" : "Save Item"}
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Draggable List */}
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={items.map(i => i.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-4">
                            {items.length === 0 && !isAdding && (
                                <div className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-xl border border-dashed border-stone-200">
                                    <div className="bg-stone-100 p-4 rounded-full inline-block mb-4">
                                        <Clock className="w-8 h-8 text-stone-300" />
                                    </div>
                                    <h3 className="text-charcoal font-serif text-xl mb-1">Timeline is Empty</h3>
                                    <p className="text-stone-500 text-sm max-w-xs mx-auto mb-4">Start building your event schedule by adding your first timeline item.</p>
                                    <Button
                                        onClick={() => setIsAdding(true)}
                                        variant="outline"
                                        className="border-stone-200 text-stone-600 hover:text-charcoal hover:bg-white"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add First Event
                                    </Button>
                                </div>
                            )}
                            {items.map((item) => (
                                <SortableTimelineItem
                                    key={item.id}
                                    item={item}
                                    onDelete={handleDelete}
                                    onEdit={setupEdit}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>
        </div>
    );
}
