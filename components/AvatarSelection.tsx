"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AvatarSelectionProps {
    currentAvatar: string;
    userName: string;
    onAvatarUpdate?: (newAvatar: string) => void;
}

export function AvatarSelection({ currentAvatar, userName, onAvatarUpdate }: AvatarSelectionProps) {
    const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setSelectedAvatar(currentAvatar);
    }, [currentAvatar]);

    const avatarStyles = [
        'lorelei', 'adventurer', 'micah', 'dylan', 'notionists',
        'avataaars', 'open-peeps', 'personas', 'croodles', 'croodles-neutral',
        'bottts', 'miniavs', 'fun-emoji', 'big-smile', 'big-ears',
        'pixel-art', 'thumbs'
    ];

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ avatar: selectedAvatar }),
            });

            if (!res.ok) {
                throw new Error('Failed to update avatar');
            }

            toast.success('Avatar updated successfully');
            setIsOpen(false);
            router.refresh();
            if (onAvatarUpdate) {
                onAvatarUpdate(selectedAvatar);
            }
        } catch (error) {
            toast.error('Failed to update avatar');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div className="relative group cursor-pointer">
                    <div className="w-24 h-24 rounded-full border-4 border-primary/20 overflow-hidden group-hover:border-primary transition-colors">
                        <img
                            src={`https://api.dicebear.com/7.x/${currentAvatar || 'adventurer-neutral'}/svg?seed=${userName}`}
                            alt="Profile Avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs font-medium">Change</span>
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Choose Avatar Style</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-5 gap-4 py-4">
                    {avatarStyles.map((style) => (
                        <div
                            key={style}
                            className={`cursor-pointer rounded-full p-1 border-2 transition-all ${selectedAvatar === style
                                    ? 'border-primary scale-110'
                                    : 'border-transparent hover:scale-105'
                                }`}
                            onClick={() => setSelectedAvatar(style)}
                        >
                            <img
                                src={`https://api.dicebear.com/7.x/${style}/svg?seed=${userName}`}
                                alt={style}
                                className="w-full h-full rounded-full bg-secondary/50"
                            />
                        </div>
                    ))}
                </div>
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
