"use client";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { TSHIRT_COLORS, Design } from "@/lib/data";
import TShirtMockup from "@/components/TShirtMockup";
import LoginModal from "@/components/LoginModal";
import { Zap, RefreshCw, Globe, Lock, ShoppingCart, Wand2, Lightbulb } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const TIPS = [
  "Try: 'Minimalist mountain range at dusk, single line art'",
  "Try: 'Abstract galaxy swirl, dark background, neon colors'",
  "Try: 'Japanese wave pattern, geometric, black and white'",
  "Try: 'Retro 70s sunset with palm trees, vintage style'",
  "Try: 'Cyberpunk cat portrait, neon pink and cyan'",
];


type Step = "configure" | "generating" | "preview" | "publish";

export default function DesignPage() {
  const { isLoggedIn, addDesign, myDesigns } = useApp();
  const router = useRouter();

  const [step, setStep] = useState<Step>("configure");
  const [selectedColor, setSelectedColor] = useState(TSHIRT_COLORS[0]);
  const [selectedType, setSelectedType] = useState<"Unisex" | "Women" | "Kids">("Unisex");
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState("");
  const [tip] = useState(TIPS[Math.floor(Math.random() * TIPS.length)]);
  const [published, setPublished] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [imageReady, setImageReady] = useState(false);

  const dailyLimit = 3;
  const usedToday = isLoggedIn ? 1 : 0;

  const handleGenerate = async () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    if (!prompt.trim()) return;

    setStep("generating");
    setProgress(0);

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

    setImageReady(false);
    setGeneratedImage(imageUrl);
    setTitle(prompt.split(" ").slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "));
  };

  const handlePublish = () => {
    if (!generatedImage) return;

    const newDesign: Design = {
      id: `user-${Date.now()}`,
      title: title || "My Design",
      prompt,
      imageUrl: generatedImage,
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

  const handleImageLoad = () => {
    setImageReady(true);
    setStep("preview");
  };

  const handleReset = () => {
    setStep("configure");
    setGeneratedImage(null);
    setPrompt("");
    setProgress(0);
    setPublished(false);
    setImageReady(false);
  };

  return (
    <main className="pt-16 min-h-screen bg-gray-50">
      <LoginModal
        open={showLoginModal}
        onSuccess={() => { setShowLoginModal(false); handleGenerate(); }}
        onClose={() => setShowLoginModal(false)}
      />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Design Studio</h1>
          {isLoggedIn && (
            <p className="text-sm text-gray-400 mt-1">
              {usedToday}/{dailyLimit} generations used today
            </p>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left — Controls */}
          <div className="space-y-6">
            {/* Step 1: Type */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-sm font-semibold mb-4 text-gray-700">1 — T-Shirt Type</h2>
              <div className="flex gap-2 mb-5">
                {(["Unisex", "Women", "Kids"] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setSelectedType(t)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedType === t ? "bg-black text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <p className="text-xs text-gray-500 mb-3 font-medium">Color</p>
              <div className="flex flex-wrap gap-2">
                {TSHIRT_COLORS.map(c => (
                  <button
                    key={c.hex}
                    onClick={() => setSelectedColor(c)}
                    title={c.name}
                    className={`w-7 h-7 rounded-full transition-all ${
                      selectedColor.hex === c.hex ? "ring-2 ring-indigo-500 ring-offset-2 scale-110" : "hover:scale-105"
                    }`}
                    style={{
                      backgroundColor: c.hex,
                      border: c.hex === "#ffffff" ? "1.5px solid #e5e7eb" : "none",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Step 2: Prompt */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-sm font-semibold mb-4 text-gray-700">2 — Describe Your Design</h2>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="e.g. A minimalist mountain range at dusk with a single continuous line..."
                rows={4}
                className="w-full text-sm border border-gray-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50 placeholder:text-gray-400"
              />
              <div className="mt-2 flex items-start gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-400 italic">{tip}</p>
              </div>
            </div>

            {/* Generate button */}
            {step === "configure" && (
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim()}
                className="w-full bg-indigo-500 text-white py-4 rounded-2xl font-semibold text-base hover:bg-indigo-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Wand2 className="w-5 h-5" />
                Generate Design
              </button>
            )}

            {/* Generating */}
            {step === "generating" && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-indigo-500 animate-pulse" />
                  <span className="text-sm font-medium">Creating your design...</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-indigo-500 rounded-full"
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">{Math.round(progress)}%</p>
              </div>
            )}

            {/* Preview controls */}
            {(step === "preview" || step === "publish") && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
                <h2 className="text-sm font-semibold text-gray-700">3 — Publish Settings</h2>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Visibility</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsPublic(true)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all ${
                        isPublic ? "bg-black text-white" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" /> Public
                    </button>
                    <button
                      onClick={() => setIsPublic(false)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all ${
                        !isPublic ? "bg-black text-white" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" /> Private
                    </button>
                  </div>
                </div>

                {step === "preview" && !published && (
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleReset}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" /> Regenerate
                    </button>
                    <button
                      onClick={handlePublish}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-600 transition-colors"
                    >
                      <Globe className="w-4 h-4" /> Publish
                    </button>
                  </div>
                )}

                {published && (
                  <div className="bg-green-50 text-green-700 rounded-xl px-4 py-3 text-sm text-center font-medium">
                    🎉 Design published! Start earning when someone buys it.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right — Preview */}
          <div className="sticky top-24">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 aspect-square flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                {(step === "generating" || (step !== "configure" && !imageReady)) ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm text-gray-500 font-medium">Crafting your design…</p>
                    <p className="text-xs text-gray-400 mt-1">This usually takes 5–15 seconds</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="mockup"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="w-full"
                  >
                    <TShirtMockup
                      color={selectedColor.hex}
                      designUrl={generatedImage || undefined}
                      className="w-full max-w-xs mx-auto"
                      onImageLoad={handleImageLoad}
                    />
                    {!generatedImage && (
                      <p className="text-center text-xs text-gray-400 mt-4">
                        Your design will appear here
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {generatedImage && (
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-400">
                    {selectedColor.name} · {selectedType}
                  </p>
                </div>
              )}
            </div>

            {(step === "preview" || step === "publish") && (
              <button
                onClick={() => {
                  const d = myDesigns[0];
                  if (d) router.push(`/product/${d.id}`);
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
