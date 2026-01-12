"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
    MapPin,
    Plus,
    Edit2,
    Trash2,
    Home,
    Building2,
    MapPinned,
    Check,
    Loader2,
} from "lucide-react";

interface Address {
    id: string;
    name: string;
    phone: string;
    address: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
    type: "HOME" | "OFFICE" | "OTHER";
    isDefault: boolean;
}

const addressTypeIcons = {
    HOME: Home,
    OFFICE: Building2,
    OTHER: MapPinned,
};

type AddressFormData = {
    name: string;
    phone: string;
    address: string;
    landmark: string;
    city: string;
    state: string;
    pincode: string;
    type: "HOME" | "OFFICE" | "OTHER";
    isDefault: boolean;
};

const emptyAddress: AddressFormData = {
    name: "",
    phone: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    type: "HOME",
    isDefault: false,
};

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<AddressFormData>(emptyAddress);

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const res = await fetch("/api/address");
            const data = await res.json();
            if (data.addresses) {
                setAddresses(data.addresses);
            }
        } catch (error) {
            console.error("Failed to fetch addresses:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        setSaving(true);
        try {
            const url = editingId ? `/api/address/${editingId}` : "/api/address";
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                throw new Error("Failed to save address");
            }

            const data = await res.json();

            if (editingId) {
                setAddresses(
                    addresses.map((addr) =>
                        addr.id === editingId ? data.address : addr
                    )
                );
                toast.success("Address updated successfully");
            } else {
                setAddresses([...addresses, data.address]);
                toast.success("Address added successfully");
            }

            setShowForm(false);
            setEditingId(null);
            setFormData(emptyAddress);
        } catch (error) {
            toast.error("Failed to save address");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (address: Address) => {
        setFormData({
            name: address.name,
            phone: address.phone,
            address: address.address,
            landmark: address.landmark || "",
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            type: address.type,
            isDefault: address.isDefault,
        });
        setEditingId(address.id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/address/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error("Failed to delete address");
            }

            setAddresses(addresses.filter((addr) => addr.id !== id));
            toast.success("Address deleted successfully");
        } catch (error) {
            toast.error("Failed to delete address");
        }
    };

    const handleSetDefault = async (id: string) => {
        const address = addresses.find((a) => a.id === id);
        if (!address || address.isDefault) return;

        try {
            const res = await fetch(`/api/address/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...address, isDefault: true }),
            });

            if (!res.ok) throw new Error();

            setAddresses(
                addresses.map((addr) => ({
                    ...addr,
                    isDefault: addr.id === id,
                }))
            );
            toast.success("Default address updated");
        } catch {
            toast.error("Failed to update default address");
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2].map((i) => (
                        <Skeleton key={i} className="h-40 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    My Addresses
                </h2>
                <Dialog open={showForm} onOpenChange={(open) => {
                    setShowForm(open);
                    if (!open) {
                        setEditingId(null);
                        setFormData(emptyAddress);
                    }
                }}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Address
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>
                                {editingId ? "Edit Address" : "Add New Address"}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Full Name</Label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <Label>Phone Number</Label>
                                    <Input
                                        value={formData.phone}
                                        onChange={(e) =>
                                            setFormData({ ...formData, phone: e.target.value })
                                        }
                                        placeholder="9876543210"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label>Address</Label>
                                <Input
                                    value={formData.address}
                                    onChange={(e) =>
                                        setFormData({ ...formData, address: e.target.value })
                                    }
                                    placeholder="House No, Street, Area"
                                />
                            </div>
                            <div>
                                <Label>Landmark (Optional)</Label>
                                <Input
                                    value={formData.landmark}
                                    onChange={(e) =>
                                        setFormData({ ...formData, landmark: e.target.value })
                                    }
                                    placeholder="Near..."
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label>City</Label>
                                    <Input
                                        value={formData.city}
                                        onChange={(e) =>
                                            setFormData({ ...formData, city: e.target.value })
                                        }
                                    />
                                </div>
                                <div>
                                    <Label>State</Label>
                                    <Input
                                        value={formData.state}
                                        onChange={(e) =>
                                            setFormData({ ...formData, state: e.target.value })
                                        }
                                    />
                                </div>
                                <div>
                                    <Label>Pincode</Label>
                                    <Input
                                        value={formData.pincode}
                                        onChange={(e) =>
                                            setFormData({ ...formData, pincode: e.target.value })
                                        }
                                    />
                                </div>
                            </div>
                            <div>
                                <Label>Address Type</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value: "HOME" | "OFFICE" | "OTHER") =>
                                        setFormData({ ...formData, type: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="HOME">Home</SelectItem>
                                        <SelectItem value="OFFICE">Office</SelectItem>
                                        <SelectItem value="OTHER">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={handleSubmit} disabled={saving} className="w-full">
                                {saving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : editingId ? (
                                    "Update Address"
                                ) : (
                                    "Save Address"
                                )}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {addresses.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No addresses saved</h3>
                        <p className="text-muted-foreground mb-4">
                            Add your first address for faster checkout
                        </p>
                        <Button onClick={() => setShowForm(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Address
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => {
                        const Icon = addressTypeIcons[addr.type];
                        return (
                            <Card key={addr.id} className={addr.isDefault ? "ring-2 ring-primary" : ""}>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Icon className="w-4 h-4" />
                                            {addr.name}
                                            <Badge variant="outline" className="text-xs">
                                                {addr.type}
                                            </Badge>
                                        </div>
                                        {addr.isDefault && (
                                            <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                                                <Check className="w-3 h-3 mr-1" />
                                                Default
                                            </Badge>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm text-muted-foreground mb-4">
                                        <p>{addr.address}</p>
                                        {addr.landmark && <p>{addr.landmark}</p>}
                                        <p>
                                            {addr.city}, {addr.state} - {addr.pincode}
                                        </p>
                                        <p className="mt-2">📞 {addr.phone}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEdit(addr)}
                                        >
                                            <Edit2 className="w-3 h-3 mr-1" />
                                            Edit
                                        </Button>
                                        {!addr.isDefault && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleSetDefault(addr.id)}
                                            >
                                                Set as Default
                                            </Button>
                                        )}
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-600">
                                                    <Trash2 className="w-3 h-3 mr-1" />
                                                    Delete
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete Address?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to delete this address? This
                                                        action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDelete(addr.id)}
                                                        className="bg-red-600 hover:bg-red-700"
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
