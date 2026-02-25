"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Upload, X, Plus } from "lucide-react";

const CATEGORIES = ['Venue', 'Catering', 'Photography', 'Music', 'Decor', 'Attire', 'Other'];
const PRICE_RANGES = ['₹', '₹₹', '₹₹₹', '₹₹₹₹'];

export default function VendorRegistrationPage() {
    const router = useRouter();
    const supabase = createClient();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Form data
    const [businessName, setBusinessName] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [priceRange, setPriceRange] = useState("");
    const [location, setLocation] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [services, setServices] = useState<string[]>([""]);
    const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const addService = () => setServices([...services, ""]);
    const removeService = (index: number) => setServices(services.filter((_, i) => i !== index));
    const updateService = (index: number, value: string) => {
        const newServices = [...services];
        newServices[index] = value;
        setServices(newServices);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        setLoading(true);
        const uploadedUrls: string[] = [];

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `vendor-portfolio/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(filePath);

                uploadedUrls.push(publicUrl);
            }

            setPortfolioImages([...portfolioImages, ...uploadedUrls]);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const removeImage = (index: number) => {
        setPortfolioImages(portfolioImages.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError("");

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            // Create vendor profile
            const { data: vendor, error: vendorError } = await supabase
                .from('vendors')
                .insert({
                    name: businessName,
                    category,
                    description,
                    price_range: priceRange,
                    location,
                    contact_email: contactEmail,
                    services: services.filter(s => s.trim()),
                    portfolio_images: portfolioImages,
                    owner_id: user.id,
                    status: 'pending', // Requires admin approval
                })
                .select()
                .single();

            if (vendorError) throw vendorError;

            // Update user profile to vendor role
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    role: 'vendor',
                    vendor_id: vendor.id,
                })
                .eq('id', user.id);

            if (profileError) throw profileError;

            // Success - redirect to pending approval page
            router.push('/vendor/pending-approval');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-alabaster py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-serif text-charcoal mb-2">Become a Vendor</h1>
                    <p className="text-taupe">Join our marketplace and connect with event planners</p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-8">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= s ? 'bg-terra-cotta text-white' : 'bg-gray-200 text-gray-500'
                                    }`}
                            >
                                {s}
                            </div>
                            {s < 3 && (
                                <div
                                    className={`w-16 h-1 ${step > s ? 'bg-terra-cotta' : 'bg-gray-200'}`}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-sm p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Step 1: Business Info */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-serif text-charcoal mb-4">Business Information</h2>

                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-2">
                                    Business Name *
                                </label>
                                <input
                                    type="text"
                                    value={businessName}
                                    onChange={(e) => setBusinessName(e.target.value)}
                                    className="input-field"
                                    placeholder="Your business name"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-2">
                                    Category *
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="input-field"
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {CATEGORIES.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-2">
                                    Description *
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="input-field"
                                    rows={4}
                                    placeholder="Tell us about your business and services"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-charcoal mb-2">
                                        Price Range *
                                    </label>
                                    <select
                                        value={priceRange}
                                        onChange={(e) => setPriceRange(e.target.value)}
                                        className="input-field"
                                        required
                                    >
                                        <option value="">Select range</option>
                                        {PRICE_RANGES.map((range) => (
                                            <option key={range} value={range}>{range}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-charcoal mb-2">
                                        Location *
                                    </label>
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="input-field"
                                        placeholder="City, State"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-2">
                                    Contact Email *
                                </label>
                                <input
                                    type="email"
                                    value={contactEmail}
                                    onChange={(e) => setContactEmail(e.target.value)}
                                    className="input-field"
                                    placeholder="business@example.com"
                                    required
                                />
                            </div>

                            <button
                                onClick={() => setStep(2)}
                                disabled={!businessName || !category || !description || !priceRange || !location || !contactEmail}
                                className="btn-primary w-full"
                            >
                                Next: Services
                            </button>
                        </div>
                    )}

                    {/* Step 2: Services & Portfolio */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-serif text-charcoal mb-4">Services & Portfolio</h2>

                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-2">
                                    Services Offered
                                </label>
                                {services.map((service, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={service}
                                            onChange={(e) => updateService(index, e.target.value)}
                                            className="input-field flex-1"
                                            placeholder="e.g., Full-day photography package"
                                        />
                                        {services.length > 1 && (
                                            <button
                                                onClick={() => removeService(index)}
                                                className="btn-secondary"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    onClick={addService}
                                    className="btn-secondary mt-2"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Service
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-2">
                                    Portfolio Images
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        id="portfolio-upload"
                                    />
                                    <label htmlFor="portfolio-upload" className="cursor-pointer">
                                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-taupe">Click to upload images</p>
                                    </label>
                                </div>

                                {portfolioImages.length > 0 && (
                                    <div className="grid grid-cols-3 gap-4 mt-4">
                                        {portfolioImages.map((url, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={url}
                                                    alt={`Portfolio ${index + 1}`}
                                                    className="w-full h-32 object-cover rounded-lg"
                                                />
                                                <button
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setStep(1)}
                                    className="btn-secondary flex-1"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={() => setStep(3)}
                                    className="btn-primary flex-1"
                                >
                                    Next: Review
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Review & Submit */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-serif text-charcoal mb-4">Review & Submit</h2>

                            <div className="bg-alabaster rounded-lg p-6 space-y-4">
                                <div>
                                    <p className="text-sm text-taupe">Business Name</p>
                                    <p className="font-medium text-charcoal">{businessName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-taupe">Category</p>
                                    <p className="font-medium text-charcoal">{category}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-taupe">Description</p>
                                    <p className="text-charcoal">{description}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-taupe">Price Range</p>
                                        <p className="font-medium text-charcoal">{priceRange}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-taupe">Location</p>
                                        <p className="font-medium text-charcoal">{location}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-taupe">Services ({services.filter(s => s.trim()).length})</p>
                                    <ul className="list-disc list-inside text-charcoal">
                                        {services.filter(s => s.trim()).map((s, i) => (
                                            <li key={i}>{s}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <p className="text-sm text-taupe">Portfolio Images</p>
                                    <p className="font-medium text-charcoal">{portfolioImages.length} images uploaded</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    checked={agreedToTerms}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    className="mt-1"
                                />
                                <label htmlFor="terms" className="text-sm text-charcoal">
                                    I agree to the Terms of Service and understand that my vendor profile will be reviewed by an administrator before being published on the marketplace.
                                </label>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setStep(2)}
                                    className="btn-secondary flex-1"
                                    disabled={loading}
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={!agreedToTerms || loading}
                                    className="btn-primary flex-1"
                                >
                                    {loading ? 'Submitting...' : 'Submit for Approval'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
