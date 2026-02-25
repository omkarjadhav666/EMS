"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Task } from "./types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createClient } from "@/lib/supabase/client";

interface TaskDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    task?: Task | null; // If null, creating new task
    eventId: string;
    onSave: (task: Task) => void;
    onDelete?: (taskId: string) => void;
}

export function TaskDetailsModal({ isOpen, onClose, task, eventId, onSave, onDelete }: TaskDetailsModalProps) {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<Task>>({
        title: "",
        description: "",
        priority: "medium",
        category: "General",
        is_public: false,
        due_date: undefined
    });

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description || "",
                priority: task.priority || "medium",
                category: task.category || "General",
                is_public: task.is_public || false,
                due_date: task.due_date
            });
        } else {
            setFormData({
                title: "",
                description: "",
                priority: "medium",
                category: "General",
                is_public: false,
                due_date: undefined
            });
        }
    }, [task, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const payload = {
                ...formData,
                event_id: eventId,
                user_id: user.id
            };

            let savedTask: Task | null = null;

            if (task) {
                // Update
                const { data, error } = await supabase
                    .from('event_tasks')
                    .update(payload)
                    .eq('id', task.id)
                    .select()
                    .single();

                if (error) throw error;
                savedTask = data;
            } else {
                // Create
                const { data, error } = await supabase
                    .from('event_tasks')
                    .insert({ ...payload, status: 'pending' }) // Default status
                    .select()
                    .single();

                if (error) throw error;
                savedTask = data;
            }

            if (savedTask) {
                onSave(savedTask);
                onClose();
            }
        } catch (error) {
            console.error("Error saving task:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{task ? "Edit Task" : "New Task"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority</Label>
                            <Select
                                value={formData.priority}
                                onValueChange={val => setFormData(prev => ({ ...prev, priority: val as any }))}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select
                                value={formData.category}
                                onValueChange={val => setFormData(prev => ({ ...prev, category: val }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="General">General</SelectItem>
                                    <SelectItem value="Venue">Venue</SelectItem>
                                    <SelectItem value="Catering">Catering</SelectItem>
                                    <SelectItem value="Music">Music</SelectItem>
                                    <SelectItem value="Decor">Decor</SelectItem>
                                    <SelectItem value="Attire">Attire</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="due_date">Due Date</Label>
                            <Input
                                id="due_date"
                                type="date"
                                min={new Date().toISOString().split('T')[0]}
                                value={formData.due_date ? new Date(formData.due_date).toISOString().split('T')[0] : ''}
                                onChange={e => setFormData(prev => ({ ...prev, due_date: e.target.value ? new Date(e.target.value).toISOString() : undefined }))}
                            />
                        </div>
                        <div className="flex items-center space-x-2 pt-8">
                            <Switch
                                id="is_public"
                                checked={formData.is_public}
                                onCheckedChange={checked => setFormData(prev => ({ ...prev, is_public: checked }))}
                            />
                            <Label htmlFor="is_public">Public Task</Label>
                        </div>
                    </div>

                    <DialogFooter className="flex justify-between sm:justify-between">
                        {task && (
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={() => {
                                    if (confirm("Are you sure you want to delete this task?")) {
                                        onDelete?.(task.id);
                                        onClose();
                                    }
                                }}
                            >
                                Delete
                            </Button>
                        )}
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                            <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Task"}</Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
