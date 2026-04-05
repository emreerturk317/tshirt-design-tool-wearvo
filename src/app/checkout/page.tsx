"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Loader2, ShoppingBag } from "lucide-react";

const SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

function CheckoutForm() {
  const params = useSearchParams();
  const router = useRouter();
  const designUrl = params.get("designUrl") ?? "";
  const color = params.get("color") ?? "#000000";

  const [size, setSize] = useState("M");
  const [form, setForm] = useState({
    name: "",
    address1: "",
    city: "",
    country_code: "",
    zip: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/printful/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          designUrl,
          size,
          color,
          recipient: {
            name: form.name,
            address1: form.address1,
            city: form.city,
            country_code: form.country_code.toUpperCase(),
            zip: form.zip,
            email: form.email,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Order failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-sm">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Order Placed!</h1>
          <p className="text-gray-500 mb-6">Your design is being printed and will ship soon.</p>
          <button
            onClick={() => router.push("/design")}
            className="bg-black text-white px-6 py-3 rounded-2xl font-medium hover:bg-gray-800 transition-colors"
          >
            Create Another Design
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Size */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">Size</h2>
              <div className="flex flex-wrap gap-2">
                {SIZES.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      size === s ? "bg-black text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
              <h2 className="text-sm font-semibold text-gray-700">Shipping Address</h2>
              {[
                { name: "name", label: "Full Name", placeholder: "John Doe" },
                { name: "email", label: "Email", placeholder: "john@example.com" },
                { name: "address1", label: "Address", placeholder: "123 Main St" },
                { name: "city", label: "City", placeholder: "Istanbul" },
                { name: "country_code", label: "Country Code", placeholder: "TR" },
                { name: "zip", label: "ZIP / Postal Code", placeholder: "34000" },
              ].map(field => (
                <div key={field.name}>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">{field.label}</label>
                  <input
                    type={field.name === "email" ? "email" : "text"}
                    name={field.name}
                    value={form[field.name as keyof typeof form]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50"
                  />
                </div>
              ))}
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-black text-white py-4 rounded-2xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Placing order…</>
              ) : (
                <><ShoppingBag className="w-4 h-4" /> Place Order — $24.99</>
              )}
            </button>
          </form>

          {/* Order Summary */}
          <div className="sticky top-24">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">Order Summary</h2>
              <div
                className="w-full aspect-square rounded-xl mb-4 flex items-center justify-center"
                style={{ backgroundColor: color }}
              >
                {designUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={designUrl} alt="Design" className="w-1/2 h-1/2 object-contain" />
                )}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>T-Shirt ({size})</span>
                  <span>$24.99</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t border-gray-100 pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>$24.99+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>}>
      <CheckoutForm />
    </Suspense>
  );
}
