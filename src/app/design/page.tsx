"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useApp } from "@/context/AppContext";
import { Design } from "@/lib/data";
import LoginModal from "@/components/LoginModal";
import { Zap, RefreshCw, Globe, Lock, ShoppingCart, Wand2, Lightbulb, Shirt, Upload, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const TIPS = [
  "Try: 'Minimalist mountain range at dusk, single line art'",
  "Try: 'Abstract galaxy swirl, dark background, neon colors'",
  "Try: 'Japanese wave pattern, geometric, black and white'",
  "Try: 'Retro 70s sunset with palm trees, vintage style'",
  "Try: 'Cyberpunk cat portrait, neon pink and cyan'",
];

interface ProductColor { name: string; hex: string; image?: string; }

type Step = "configure" | "uploading" | "generating" | "mockup" | "preview" | "publish";
type DesignMode = "ai" | "upload";

function DesignPageInner() {
  const { isLoggedIn, addDesign } = useApp();
  const router = useRouter();
  const params = useSearchParams();

  const productId = params.get("productId");
  const initColorName = params.get("colorName") ?? "Black";
  const initColorHex = params.get("colorHex") ?? "#14191e";
  const initSize = params.get("size") ?? "M";

  const [step, setStep] = useState<Step>("configure");
  const [mode, setMode] = useState<DesignMode>("ai");
  const [colors, setColors] = useState<ProductColor[]>([{ name: initColorName, hex: initColorHex }]);
  const [sizes, setSizes] = useState<string[]>([initSize]);
  const [selectedColor, setSelectedColor] = useState<ProductColor>({ name: initColorName, hex: initColorHex });
  const [selectedSize, setSelectedSize] = useState(initSize);
  const [prompt, setPrompt] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [mockupUrl, setMockupUrl] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState("");
  const [tip] = useState(TIPS[Math.floor(Math.random() * TIPS.length)]);
  const [published, setPublished] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mockupError, setMockupError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch product colors/sizes from Printful if productId given
  useEffect(() => {
    if (!productId) return;
    fetch(`/api/printful/store-products/${productId}`)
      .then(r => r.json())
      .then(data => {
        if (data.colors?.length || data.variants?.length) {
          // Build color list with one image per color from variants
          const variantMap = new Map<string, string>();
          for (const v of (data.variants ?? [])) {
            if (v.image && !variantMap.has(v.color)) variantMap.set(v.color, v.image);
          }
          const colorsWithImages: ProductColor[] = (data.colors ?? []).map((c: ProductColor) => ({
            ...c,
            image: variantMap.get(c.name),
          }));
          setColors(colorsWithImages);
          const match = colorsWithImages.find((c) => c.name === initColorName) ?? colorsWithImages[0];
          setSelectedColor(match);
        }
        if (data.sizes?.length) {
          setSizes(data.sizes);
          const matchSize = data.sizes.includes(initSize) ? initSize : data.sizes[0];
          setSelectedSize(matchSize);
        }
      })
      .catch(() => {});
  }, [productId, initColorName, initSize]);

  const pollMockup = async (taskKey: string): Promise<string | null> => {
    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, 2000));
      const res = await fetch(`/api/printful/mockup-status?taskKey=${taskKey}`);
      const data = await res.json();
      if (data.status === "completed" && data.mockupUrl) return data.mockupUrl;
      if (data.status === "failed") break;
    }
    return null;
  };

  const generateMockup = async (imageUrl: string, colorName: string) => {
    try {
      const body: Record<string, string> = { designUrl: imageUrl, colorName };
      if (productId) body.productId = productId;
      const res = await fetch("/api/printful/mockup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.taskKey) {
        const url = await pollMockup(data.taskKey);
        if (url) { setMockupUrl(url); return; }
      }
    } catch (e) {
      console.error("[Mockup error]", e);
    }
    setMockupError(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);
    const reader = new FileReader();
    reader.onload = ev => setUploadPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!isLoggedIn) { setShowLoginModal(true); return; }

    if (mode === "upload") {
      if (!uploadedFile) return;
      setStep("uploading");
      try {
        const form = new FormData();
        form.append("file", uploadedFile);
        const res = await fetch("/api/upload", { method: "POST", body: form });
        const data = await res.json();
        if (!data.url) throw new Error("Upload failed");
        setGeneratedImage(data.url);
        setTitle(uploadedFile.name.replace(/\.[^.]+$/, "").slice(0, 30));
        setStep("mockup");
        await generateMockup(data.url, selectedColor.name);
        setStep("preview");
      } catch {
        setMockupError(true);
        setStep("configure");
      }
      return;
    }

    if (!prompt.trim()) return;
    setStep("generating");
    setProgress(0);
    setMockupUrl(null);
    setMockupError(false);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) { clearInterval(interval); return 95; }
        return prev + Math.random() * 15;
      });
    }, 200);

    const tshirtPrompt = `t-shirt graphic print, ${prompt}, white background, high contrast, centered, bold graphic art style, no photograph, illustration`;
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(tshirtPrompt)}?model=flux&width=512&height=512&nologo=true&seed=${Date.now()}`;

    await new Promise(r => setTimeout(r, 2800));
    clearInterval(interval);
    setProgress(100);

    setGeneratedImage(imageUrl);
    setTitle(prompt.split(" ").slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "));
    setStep("mockup");
    await generateMockup(imageUrl, selectedColor.name);
    setStep("preview");
  };

  const handleColorChange = (c: ProductColor) => {
    setSelectedColor(c);
    // No re-generation needed — overlay mode shows design on top of color photo instantly
  };

  const handlePublish = () => {
    if (!generatedImage) return;
    const newDesign: Design = {
      id: `user-${Date.now()}`,
      title: title || "My Design",
      prompt,
      imageUrl: mockupUrl ?? generatedImage,
      color: selectedColor.hex,
      creator: "you",
      creatorAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=you",
      price: 24.99,
      sales: 0,
      isPublic,
      country: "TR",
      createdAt: new Date().toISOString(),
    };
    addDesign(newDesign);
    setPublished(true);
    setStep("publish");
  };

  const handleReset = () => {
    setStep("configure");
    setGeneratedImage(null);
    setMockupUrl(null);
    setPrompt("");
    setProgress(0);
    setPublished(false);
    setMockupError(false);
    setUploadedFile(null);
    setUploadPreview(null);
  };

  const isWorking = step === "generating" || step === "uploading" || step === "mockup";
  const canGenerate = mode === "ai" ? !!prompt.trim() : !!uploadedFile;

  return (
    <main className="pt-16 min-h-screen bg-gray-50">
      <LoginModal
        open={showLoginModal}
        onSuccess={() => { setShowLoginModal(false); handleGenerate(); }}
        onClose={() => setShowLoginModal(false)}
      />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Design Studio</h1>
            {isLoggedIn && <p className="text-sm text-gray-400 mt-1">Free plan: 3 generations/day</p>}
          </div>
          {productId && (
            <button onClick={() => router.back()} className="text-sm text-gray-400 hover:text-black transition-colors">
              ← Back to product
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left — Controls */}
          <div className="space-y-6">

            {/* Color */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-sm font-semibold mb-3 text-gray-700">Color — <span className="font-normal text-gray-400">{selectedColor.name}</span></h2>
              <div className="flex flex-wrap gap-2">
                {colors.map(c => (
                  <button
                    key={c.name}
                    onClick={() => handleColorChange(c)}
                    title={c.name}
                    disabled={isWorking}
                    className={`w-8 h-8 rounded-full transition-all disabled:opacity-50 ${
                      selectedColor.name === c.name ? "ring-2 ring-indigo-500 ring-offset-2 scale-110" : "hover:scale-105"
                    }`}
                    style={{
                      backgroundColor: c.hex,
                      border: c.hex === "#ffffff" || c.hex === "#fff" ? "1.5px solid #e5e7eb" : "none",
                    }}
                  />
                ))}
              </div>

              {/* Size */}
              {sizes.length > 0 && (
                <div className="mt-5">
                  <p className="text-xs font-medium text-gray-500 mb-2">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map(s => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        disabled={isWorking}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all disabled:opacity-50 ${
                          selectedSize === s ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Design Input */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              {/* Mode toggle */}
              <div className="flex gap-2 mb-5">
                <button
                  onClick={() => setMode("ai")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    mode === "ai" ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Wand2 className="w-4 h-4" /> AI Generate
                </button>
                <button
                  onClick={() => setMode("upload")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    mode === "upload" ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Upload className="w-4 h-4" /> Upload Image
                </button>
              </div>

              {mode === "ai" ? (
                <>
                  <textarea
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    placeholder="e.g. A minimalist mountain range at dusk with a single continuous line..."
                    rows={4}
                    disabled={isWorking}
                    className="w-full text-sm border border-gray-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50 placeholder:text-gray-400 disabled:opacity-50"
                  />
                  <div className="mt-2 flex items-start gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-400 italic">{tip}</p>
                  </div>
                </>
              ) : (
                <div>
                  {uploadPreview ? (
                    <div className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={uploadPreview} alt="Upload preview" className="w-full h-48 object-contain rounded-xl border border-gray-200 bg-gray-50" />
                      <button
                        onClick={() => { setUploadedFile(null); setUploadPreview(null); }}
                        className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center hover:bg-black transition-colors"
                      >
                        <X className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-36 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all"
                    >
                      <Upload className="w-6 h-6 text-gray-400" />
                      <p className="text-sm text-gray-400">Click to upload JPG, PNG or SVG</p>
                      <p className="text-xs text-gray-300">Max 10MB</p>
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/svg+xml,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            {/* Generate button */}
            {step === "configure" && (
              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className="w-full bg-indigo-500 text-white py-4 rounded-2xl font-semibold text-base hover:bg-indigo-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Wand2 className="w-5 h-5" />
                {mode === "ai" ? "Generate Design" : "Apply My Design"}
              </button>
            )}

            {/* Progress bars */}
            {step === "uploading" && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <Upload className="w-4 h-4 text-indigo-500 animate-pulse" />
                  <span className="text-sm font-medium">Uploading your design…</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-indigo-500 rounded-full" animate={{ width: "80%" }} transition={{ duration: 1.5 }} />
                </div>
              </div>
            )}

            {step === "generating" && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-indigo-500 animate-pulse" />
                  <span className="text-sm font-medium">Creating your design…</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-indigo-500 rounded-full" animate={{ width: `${Math.min(progress, 100)}%` }} transition={{ duration: 0.2 }} />
                </div>
                <p className="text-xs text-gray-400 mt-2">{Math.round(progress)}%</p>
              </div>
            )}

            {step === "mockup" && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <Shirt className="w-4 h-4 text-indigo-500 animate-pulse" />
                  <span className="text-sm font-medium">Generating product mockup…</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-indigo-400 rounded-full" animate={{ width: ["20%", "80%", "60%", "90%"] }} transition={{ duration: 12, ease: "easeInOut" }} />
                </div>
                <p className="text-xs text-gray-400 mt-2">Placing your design on a real product photo…</p>
              </div>
            )}

            {/* Publish controls */}
            {(step === "preview" || step === "publish") && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
                <h2 className="text-sm font-semibold text-gray-700">Publish Settings</h2>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Title</label>
                  <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-300" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Visibility</label>
                  <div className="flex gap-2">
                    <button onClick={() => setIsPublic(true)} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all ${isPublic ? "bg-black text-white" : "bg-gray-100 text-gray-600"}`}>
                      <Globe className="w-3.5 h-3.5" /> Public
                    </button>
                    <button onClick={() => setIsPublic(false)} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all ${!isPublic ? "bg-black text-white" : "bg-gray-100 text-gray-600"}`}>
                      <Lock className="w-3.5 h-3.5" /> Private
                    </button>
                  </div>
                </div>
                {step === "preview" && !published && (
                  <div className="flex gap-2 pt-2">
                    <button onClick={handleReset} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                      <RefreshCw className="w-4 h-4" /> Regenerate
                    </button>
                    <button onClick={handlePublish} className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-600 transition-colors">
                      <Globe className="w-4 h-4" /> Publish
                    </button>
                  </div>
                )}
                {published && <div className="bg-green-50 text-green-700 rounded-xl px-4 py-3 text-sm text-center font-medium">🎉 Design published! Start earning when someone buys it.</div>}
              </div>
            )}
          </div>

          {/* Right — Preview */}
          <div className="sticky top-24">
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden aspect-square flex flex-col items-center justify-center p-8">
              <AnimatePresence mode="wait">
                {isWorking ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm text-gray-500 font-medium">
                      {step === "generating" ? "Crafting your design…" : step === "uploading" ? "Uploading…" : "Generating product mockup…"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {step === "mockup" ? "Placing design on real product photo" : "This takes a few seconds"}
                    </p>
                  </motion.div>
                ) : step === "configure" ? (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                    <div className="w-24 h-24 rounded-full bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center mx-auto mb-4">
                      <Wand2 className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-sm text-gray-400">Your design will appear here</p>
                  </motion.div>
                ) : (mockupUrl && !mockupError) || (generatedImage && selectedColor.image) ? (
                  <motion.div key="mockup" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="w-full h-full flex items-center justify-center relative">
                    {mockupUrl && !mockupError ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={mockupUrl} alt="Product mockup" className="w-full h-full object-contain" />
                    ) : (
                      // Overlay mode: product photo + design on top
                      <div className="relative w-full h-full flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={selectedColor.image} alt="Product" className="w-full h-full object-contain" />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={generatedImage!}
                          alt="Design"
                          className="absolute"
                          style={{ width: "38%", height: "38%", objectFit: "contain", top: "22%", left: "31%" }}
                        />
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div key="fallback" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm text-gray-500">Generating mockup…</p>
                  </motion.div>
                )}
              </AnimatePresence>
              {(step === "preview" || step === "publish") && (
                <p className="text-xs text-gray-400 mt-3">{selectedColor.name} · {selectedSize}</p>
              )}
            </div>

            {(step === "preview" || step === "publish") && (
              <button
                onClick={() => {
                  if (!generatedImage) return;
                  const p = new URLSearchParams({
                    designUrl: generatedImage,
                    color: selectedColor.hex,
                    colorName: selectedColor.name,
                    size: selectedSize,
                    ...(productId ? { productId } : {}),
                  });
                  router.push(`/checkout?${p.toString()}`);
                }}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-black text-white py-3.5 rounded-2xl font-medium hover:bg-gray-800 transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                Buy This Design — $24.99
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function DesignPage() {
  return (
    <Suspense fallback={<div className="pt-16 min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin" /></div>}>
      <DesignPageInner />
    </Suspense>
  );
}
