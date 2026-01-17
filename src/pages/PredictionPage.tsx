import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Wine, ArrowLeft, RotateCcw } from "lucide-react";
import { CircularProgress } from "@mui/material";
import { Card, CardContent, Button, useToast } from "@/components/ui";
import axios from "axios";

interface WineFormData {
  fixed_acidity: string;
  volatile_acidity: string;
  citric_acid: string;
  residual_sugar: string;
  chlorides: string;
  free_sulfur_dioxide: string;
  total_sulfur_dioxide: string;
  density: string;
  pH: string;
  sulphates: string;
  alcohol: string;
}

interface PredictionResult {
  quality: number;
  category: "Poor" | "Average" | "Good" | "Excellent";
  confidence: number;
}

const getQualityInfo = (
  quality: number,
): { category: string; color: string; bgClass: string; gradient: string } => {
  if (quality <= 4)
    return {
      category: "Poor",
      color: "#ef4444",
      bgClass: "quality-poor",
      gradient: "from-red-500 to-red-600",
    };
  if (quality <= 5)
    return {
      category: "Average",
      color: "#f97316",
      bgClass: "quality-average",
      gradient: "from-orange-500 to-orange-600",
    };
  if (quality <= 6)
    return {
      category: "Good",
      color: "#22c55e",
      bgClass: "quality-good",
      gradient: "from-green-500 to-green-600",
    };
  return {
    category: "Excellent",
    color: "#d4af37",
    bgClass: "quality-excellent",
    gradient: "from-gold-400 to-gold-600",
  };
};

export function PredictionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<WineFormData | null>(null);

  useEffect(() => {
    const data = location.state?.formData as WineFormData;
    if (!data) {
      showToast("error", "No wine data provided");
      navigate("/");
      return;
    }

    setFormData(data);
    makePrediction(data);
  }, []);

  const makePrediction = async (data: WineFormData) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/predict", {
        fixed_acidity: Number(data.fixed_acidity),
        volatile_acidity: Number(data.volatile_acidity),
        citric_acid: Number(data.citric_acid),
        residual_sugar: Number(data.residual_sugar),
        chlorides: Number(data.chlorides),
        free_sulfur_dioxide: Number(data.free_sulfur_dioxide),
        total_sulfur_dioxide: Number(data.total_sulfur_dioxide),
        density: Number(data.density),
        pH: Number(data.pH),
        sulphates: Number(data.sulphates),
        alcohol: Number(data.alcohol),
      });

      setResult({
        quality: response.data.quality,
        category: response.data.category,
        confidence: response.data.confidence,
      });
      showToast("success", "Prediction successful!");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to get prediction";
      showToast("error", `Error: ${errorMessage}`);
      console.error("Prediction error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (formData) {
      makePrediction(formData);
    }
  };

  const qualityInfo = result ? getQualityInfo(result.quality) : null;

  return (
    <section className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-wine-950 via-wine-900 to-wine-950">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-cream-50 mb-4">
            Wine Quality Prediction Results
          </h1>
          <p className="text-cream-200 text-lg">
            AI-powered analysis of your wine properties
          </p>
        </motion.div>

        {/* Results Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-wine-900/50 border-gold-400/20 shadow-2xl">
            <CardContent className="p-8">
              {isLoading ? (
                <div className="text-center py-16">
                  <CircularProgress
                    size={80}
                    sx={{
                      color: "#D4AF37",
                      marginBottom: "24px",
                    }}
                  />
                  <p className="text-cream-200 text-lg">
                    Analyzing wine properties...
                  </p>
                  <p className="text-cream-400/60 text-sm mt-2">
                    Our AI is processing your data
                  </p>
                </div>
              ) : result && qualityInfo ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8"
                >
                  {/* Quality Score */}
                  <div
                    className={`bg-linear-to-r ${qualityInfo.gradient} p-0.5 rounded-lg`}
                  >
                    <div className="bg-wine-950 rounded-lg p-8 text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 20,
                        }}
                      >
                        <div className="text-7xl font-bold text-transparent bg-clip-text bg-linear-to-r from-gold-400 to-gold-300 mb-4">
                          {result.quality.toFixed(1)}
                        </div>
                      </motion.div>
                      <p className="text-cream-200 text-xl mb-4">
                        Predicted Quality Score
                      </p>
                      <div className="flex items-center justify-center gap-3">
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold text-white bg-linear-to-r ${qualityInfo.gradient}`}
                        >
                          {qualityInfo.category}
                        </span>
                      </div>
                      {result.confidence && (
                        <div className="mt-6">
                          <p className="text-cream-400/80 text-sm mb-2">
                            Confidence Level
                          </p>
                          <div className="w-full bg-wine-900 rounded-full h-2.5">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${result.confidence * 100}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className={`bg-linear-to-r ${qualityInfo.gradient} h-2.5 rounded-full`}
                            />
                          </div>
                          <p className="text-gold-400 font-semibold mt-2">
                            {(result.confidence * 100).toFixed(1)}%
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Wine Properties Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData &&
                      Object.entries(formData).map(([key, value]) => (
                        <div
                          key={key}
                          className="bg-wine-800/30 rounded-lg p-4"
                        >
                          <p className="text-cream-400/60 text-xs mb-1 capitalize">
                            {key.replace(/_/g, " ")}
                          </p>
                          <p className="text-cream-200 font-semibold">
                            {value}
                          </p>
                        </div>
                      ))}
                  </div>
                </motion.div>
              ) : (
                <div className="text-center py-16">
                  <Wine className="w-24 h-24 mx-auto text-cream-400/40 mb-4" />
                  <p className="text-cream-200 text-lg mb-2">
                    Failed to get prediction
                  </p>
                  <p className="text-cream-400/60 text-sm">Please try again</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8 pt-8 border-t border-gold-400/10">
                <Button
                  onClick={() => navigate("/")}
                  className="flex-1 bg-wine-800/50 border border-gold-400/30 text-cream-200 hover:bg-wine-800 hover:border-gold-400/60"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
                {!isLoading && result && (
                  <Button
                    onClick={handleRetry}
                    className="flex-1 bg-linear-to-r from-gold-400 to-gold-300 text-wine-950 font-semibold"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Retry Prediction
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
