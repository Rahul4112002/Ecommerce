"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Check, Eye, Sun, Glasses, Upload, Phone, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/helpers";

// Lens configuration options with prices
export const LENS_TYPES = [
    { id: "zero-power", name: "Zero Power", description: "Fashion frame without any power", price: 0, icon: Glasses },
    { id: "single-vision", name: "Single Vision", description: "Single power for distance or reading", price: 299, icon: Eye },
    { id: "bifocal", name: "Bifocal", description: "Two powers - distance and reading", price: 599, icon: Eye },
    { id: "progressive", name: "Progressive", description: "Smooth transition for all distances", price: 999, icon: Eye },
];

export const LENS_PACKAGES = [
    { id: "classic", name: "Classic", description: "Anti-glare coating", price: 0, recommended: false },
    { id: "blu-cut", name: "Blu Cut", description: "Blue light protection for screens", price: 199, recommended: true },
    { id: "photochromic", name: "Photochromic", description: "Auto-darkens in sunlight", price: 499, recommended: false },
    { id: "polarized", name: "Polarized", description: "Reduces glare (for sunglasses)", price: 399, recommended: false },
];

export const PRESCRIPTION_OPTIONS = [
    { id: "upload", name: "Upload Prescription", description: "Upload photo of your prescription", icon: Upload },
    { id: "later", name: "Send Later", description: "Share via WhatsApp/Email after order", icon: Phone },
];

export const LENS_THICKNESS = [
    { id: "standard", name: "Standard", description: "For low power (±2.00)", price: 0 },
    { id: "thin", name: "Thin", description: "For medium power (±4.00)", price: 199 },
    { id: "ultra-thin", name: "Ultra Thin", description: "For high power (±6.00+)", price: 399 },
];

export interface LensOptions {
    lensType: string;
    lensPackage: string;
    prescriptionOption: string;
    prescriptionImage?: string;
    lensThickness: string;
    totalLensPrice: number;
}

interface LensCustomizationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (lensOptions: LensOptions) => void;
    productName: string;
    productImage: string;
    basePrice: number;
}

export function LensCustomizationModal({
    isOpen,
    onClose,
    onConfirm,
    productName,
    productImage,
    basePrice,
}: LensCustomizationModalProps) {
    const [step, setStep] = useState(1);
    const [selectedLensType, setSelectedLensType] = useState("");
    const [selectedPackage, setSelectedPackage] = useState("");
    const [selectedPrescription, setSelectedPrescription] = useState("");
    const [selectedThickness, setSelectedThickness] = useState("");

    const totalSteps = 4;

    // Calculate lens price
    const lensTypePrice = LENS_TYPES.find((l) => l.id === selectedLensType)?.price || 0;
    const packagePrice = LENS_PACKAGES.find((p) => p.id === selectedPackage)?.price || 0;
    const thicknessPrice = LENS_THICKNESS.find((t) => t.id === selectedThickness)?.price || 0;
    const totalLensPrice = lensTypePrice + packagePrice + thicknessPrice;
    const finalPrice = basePrice + totalLensPrice;

    const handleNext = () => {
        if (step < totalSteps) {
            // Skip prescription step for zero power
            if (step === 1 && selectedLensType === "zero-power") {
                setSelectedPrescription("none");
                setStep(3); // Skip to thickness
            } else {
                setStep(step + 1);
            }
        }
    };

    const handleBack = () => {
        if (step > 1) {
            // Handle going back from thickness when lens type was zero power
            if (step === 3 && selectedLensType === "zero-power") {
                setStep(1);
            } else {
                setStep(step - 1);
            }
        }
    };

    const handleConfirm = () => {
        onConfirm({
            lensType: selectedLensType,
            lensPackage: selectedPackage,
            prescriptionOption: selectedPrescription,
            lensThickness: selectedThickness,
            totalLensPrice,
        });
        // Reset state
        setStep(1);
        setSelectedLensType("");
        setSelectedPackage("");
        setSelectedPrescription("");
        setSelectedThickness("");
    };

    const canProceed = () => {
        switch (step) {
            case 1:
                return !!selectedLensType;
            case 2:
                return !!selectedPrescription;
            case 3:
                return !!selectedThickness;
            case 4:
                return !!selectedPackage;
            default:
                return false;
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-4">
                        <div className="text-center mb-6">
                            <h3 className="text-lg font-semibold">Select Lens Type</h3>
                            <p className="text-sm text-muted-foreground">Choose based on your vision needs</p>
                        </div>
                        <div className="grid gap-3">
                            {LENS_TYPES.map((lens) => {
                                const Icon = lens.icon;
                                return (
                                    <button
                                        key={lens.id}
                                        onClick={() => setSelectedLensType(lens.id)}
                                        className={`p-4 rounded-lg border-2 text-left transition-all ${selectedLensType === lens.id
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-muted-foreground"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-full ${selectedLensType === lens.id ? "bg-primary/10" : "bg-muted"}`}>
                                                    <Icon className={`w-5 h-5 ${selectedLensType === lens.id ? "text-primary" : "text-muted-foreground"}`} />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{lens.name}</p>
                                                    <p className="text-sm text-muted-foreground">{lens.description}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {lens.price > 0 ? (
                                                    <span className="text-sm font-medium">+{formatPrice(lens.price)}</span>
                                                ) : (
                                                    <span className="text-sm text-green-600 font-medium">Free</span>
                                                )}
                                                {selectedLensType === lens.id && <Check className="w-5 h-5 text-primary" />}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-4">
                        <div className="text-center mb-6">
                            <h3 className="text-lg font-semibold">Prescription Details</h3>
                            <p className="text-sm text-muted-foreground">How would you like to share your prescription?</p>
                        </div>
                        <div className="grid gap-3">
                            {PRESCRIPTION_OPTIONS.map((option) => {
                                const Icon = option.icon;
                                return (
                                    <button
                                        key={option.id}
                                        onClick={() => setSelectedPrescription(option.id)}
                                        className={`p-4 rounded-lg border-2 text-left transition-all ${selectedPrescription === option.id
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-muted-foreground"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-full ${selectedPrescription === option.id ? "bg-primary/10" : "bg-muted"}`}>
                                                    <Icon className={`w-5 h-5 ${selectedPrescription === option.id ? "text-primary" : "text-muted-foreground"}`} />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{option.name}</p>
                                                    <p className="text-sm text-muted-foreground">{option.description}</p>
                                                </div>
                                            </div>
                                            {selectedPrescription === option.id && <Check className="w-5 h-5 text-primary" />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mt-4">
                            <p className="text-sm text-blue-800">
                                💡 <strong>Tip:</strong> You can also visit a local optician to get your lens fitted after receiving the frame.
                            </p>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-4">
                        <div className="text-center mb-6">
                            <h3 className="text-lg font-semibold">Lens Thickness</h3>
                            <p className="text-sm text-muted-foreground">Select based on your power range</p>
                        </div>
                        <div className="grid gap-3">
                            {LENS_THICKNESS.map((thickness) => (
                                <button
                                    key={thickness.id}
                                    onClick={() => setSelectedThickness(thickness.id)}
                                    className={`p-4 rounded-lg border-2 text-left transition-all ${selectedThickness === thickness.id
                                            ? "border-primary bg-primary/5"
                                            : "border-border hover:border-muted-foreground"
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{thickness.name}</p>
                                            <p className="text-sm text-muted-foreground">{thickness.description}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {thickness.price > 0 ? (
                                                <span className="text-sm font-medium">+{formatPrice(thickness.price)}</span>
                                            ) : (
                                                <span className="text-sm text-green-600 font-medium">Free</span>
                                            )}
                                            {selectedThickness === thickness.id && <Check className="w-5 h-5 text-primary" />}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-4">
                        <div className="text-center mb-6">
                            <h3 className="text-lg font-semibold">Lens Package</h3>
                            <p className="text-sm text-muted-foreground">Choose coating and protection</p>
                        </div>
                        <div className="grid gap-3">
                            {LENS_PACKAGES.map((pkg) => (
                                <button
                                    key={pkg.id}
                                    onClick={() => setSelectedPackage(pkg.id)}
                                    className={`p-4 rounded-lg border-2 text-left transition-all relative ${selectedPackage === pkg.id
                                            ? "border-primary bg-primary/5"
                                            : "border-border hover:border-muted-foreground"
                                        }`}
                                >
                                    {pkg.recommended && (
                                        <span className="absolute -top-2 right-3 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                                            Recommended
                                        </span>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{pkg.name}</p>
                                            <p className="text-sm text-muted-foreground">{pkg.description}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {pkg.price > 0 ? (
                                                <span className="text-sm font-medium">+{formatPrice(pkg.price)}</span>
                                            ) : (
                                                <span className="text-sm text-green-600 font-medium">Included</span>
                                            )}
                                            {selectedPackage === pkg.id && <Check className="w-5 h-5 text-primary" />}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Glasses className="w-5 h-5" />
                        Customize Your Lens
                    </DialogTitle>
                </DialogHeader>

                {/* Progress Bar */}
                <div className="flex items-center gap-2 mb-4">
                    {Array.from({ length: totalSteps }).map((_, i) => (
                        <div key={i} className="flex-1 flex items-center">
                            <div
                                className={`h-2 flex-1 rounded-full transition-colors ${i < step ? "bg-primary" : "bg-muted"
                                    }`}
                            />
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                {renderStep()}

                <Separator className="my-4" />

                {/* Price Summary */}
                <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Frame Price</span>
                        <span>{formatPrice(basePrice)}</span>
                    </div>
                    {totalLensPrice > 0 && (
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Lens Customization</span>
                            <span>+{formatPrice(totalLensPrice)}</span>
                        </div>
                    )}
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span className="text-primary">{formatPrice(finalPrice)}</span>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-3 mt-4">
                    {step > 1 && (
                        <Button variant="outline" onClick={handleBack} className="flex-1">
                            Back
                        </Button>
                    )}
                    {step < totalSteps ? (
                        <Button onClick={handleNext} disabled={!canProceed()} className="flex-1">
                            Continue
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    ) : (
                        <Button onClick={handleConfirm} disabled={!canProceed()} className="flex-1">
                            Add to Cart
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Helper function to get lens details summary
export function getLensOptionsSummary(options: LensOptions): string {
    const lensType = LENS_TYPES.find((l) => l.id === options.lensType)?.name || "";
    const lensPackage = LENS_PACKAGES.find((p) => p.id === options.lensPackage)?.name || "";
    const thickness = LENS_THICKNESS.find((t) => t.id === options.lensThickness)?.name || "";

    return `${lensType} • ${lensPackage} • ${thickness}`;
}
