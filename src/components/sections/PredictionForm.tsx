import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { RotateCcw, Sparkles, Info } from "lucide-react";
import { Tooltip, Chip } from "@mui/material";
import { Button, Input, Card, CardContent, useToast } from "@/components/ui";
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

const initialFormData: WineFormData = {
  fixed_acidity: "",
  volatile_acidity: "",
  citric_acid: "",
  residual_sugar: "",
  chlorides: "",
  free_sulfur_dioxide: "",
  total_sulfur_dioxide: "",
  density: "",
  pH: "",
  sulphates: "",
  alcohol: "",
};

const sampleData: WineFormData = {
  fixed_acidity: "7.4",
  volatile_acidity: "0.7",
  citric_acid: "0.0",
  residual_sugar: "1.9",
  chlorides: "0.076",
  free_sulfur_dioxide: "11",
  total_sulfur_dioxide: "34",
  density: "0.9978",
  pH: "3.51",
  sulphates: "0.56",
  alcohol: "9.4",
};

interface FormFieldConfig {
  name: keyof WineFormData;
  label: string;
  tooltip: string;
  placeholder: string;
  min: number;
  max: number;
  step: number;
  unit: string;
}

const formFields: FormFieldConfig[] = [
  {
    name: "fixed_acidity",
    label: "Fixed Acidity",
    tooltip: "Most acids involved with wine are fixed or nonvolatile (g/dm³)",
    placeholder: "e.g., 7.4",
    min: 4,
    max: 16,
    step: 0.1,
    unit: "g/dm³",
  },
  {
    name: "volatile_acidity",
    label: "Volatile Acidity",
    tooltip:
      "Amount of acetic acid in wine, at high levels can lead to vinegar taste (g/dm³)",
    placeholder: "e.g., 0.7",
    min: 0.1,
    max: 1.6,
    step: 0.01,
    unit: "g/dm³",
  },
  {
    name: "citric_acid",
    label: "Citric Acid",
    tooltip:
      "Found in small quantities, citric acid adds freshness and flavor (g/dm³)",
    placeholder: "e.g., 0.0",
    min: 0,
    max: 1,
    step: 0.01,
    unit: "g/dm³",
  },
  {
    name: "residual_sugar",
    label: "Residual Sugar",
    tooltip: "Amount of sugar remaining after fermentation (g/dm³)",
    placeholder: "e.g., 1.9",
    min: 0.9,
    max: 16,
    step: 0.1,
    unit: "g/dm³",
  },
  {
    name: "chlorides",
    label: "Chlorides",
    tooltip: "Amount of salt in the wine (g/dm³)",
    placeholder: "e.g., 0.076",
    min: 0.01,
    max: 0.7,
    step: 0.001,
    unit: "g/dm³",
  },
  {
    name: "free_sulfur_dioxide",
    label: "Free Sulfur Dioxide",
    tooltip: "Prevents microbial growth and wine oxidation (mg/dm³)",
    placeholder: "e.g., 11",
    min: 1,
    max: 72,
    step: 1,
    unit: "mg/dm³",
  },
  {
    name: "total_sulfur_dioxide",
    label: "Total Sulfur Dioxide",
    tooltip: "Amount of free and bound forms of SO2 (mg/dm³)",
    placeholder: "e.g., 34",
    min: 6,
    max: 300,
    step: 1,
    unit: "mg/dm³",
  },
  {
    name: "density",
    label: "Density",
    tooltip:
      "Density of wine, close to that of water depending on alcohol and sugar content (g/cm³)",
    placeholder: "e.g., 0.9978",
    min: 0.99,
    max: 1.01,
    step: 0.0001,
    unit: "g/cm³",
  },
  {
    name: "pH",
    label: "pH",
    tooltip:
      "Describes how acidic or basic the wine is on a scale from 0 (very acidic) to 14 (very basic)",
    placeholder: "e.g., 3.51",
    min: 2.8,
    max: 4,
    step: 0.01,
    unit: "",
  },
  {
    name: "sulphates",
    label: "Sulphates",
    tooltip:
      "Wine additive that contributes to SO2 levels, acts as antimicrobial (g/dm³)",
    placeholder: "e.g., 0.56",
    min: 0.3,
    max: 2,
    step: 0.01,
    unit: "g/dm³",
  },
  {
    name: "alcohol",
    label: "Alcohol",
    tooltip: "Percentage of alcohol content in the wine (% vol)",
    placeholder: "e.g., 9.4",
    min: 8,
    max: 15,
    step: 0.1,
    unit: "% vol",
  },
];

// Animated form field component
const AnimatedFormField: React.FC<{
  field: FormFieldConfig;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  index: number;
  isInView: boolean;
}> = ({ field, value, error, onChange, index, isInView }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={isInView ? { opacity: 1, y: 0 } : {}}
    transition={{ delay: 0.3 + index * 0.03 }}
    whileHover={{ scale: 1.02 }}
    className="group"
  >
    <div className="flex items-center gap-2 mb-2">
      <label className="text-sm font-medium text-cream-200 group-hover:text-gold-400 transition-colors">
        {field.label}
      </label>
      <Tooltip title={field.tooltip} arrow placement="top">
        <motion.button
          type="button"
          whileHover={{ scale: 1.2, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          className="focus:outline-none"
        >
          <Info className="w-3.5 h-3.5 text-cream-400/50 cursor-help hover:text-gold-400 transition-colors" />
        </motion.button>
      </Tooltip>
      {field.unit && (
        <Chip
          label={field.unit}
          size="small"
          sx={{
            height: "18px",
            fontSize: "0.65rem",
            backgroundColor: "rgba(212, 175, 55, 0.1)",
            color: "rgba(212, 175, 55, 0.8)",
            border: "1px solid rgba(212, 175, 55, 0.2)",
          }}
        />
      )}
    </div>
    <Input
      type="number"
      step={field.step}
      min={field.min}
      max={field.max}
      placeholder={field.placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={error}
      className="w-full transition-all group-hover:border-gold-400/40"
    />
  </motion.div>
);

export function PredictionForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState<WineFormData>(initialFormData);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const { showToast } = useToast();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (!value || isNaN(Number(value))) {
        newErrors[key] = "This field is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast("error", "Please fill in all fields correctly");
      return;
    }

    // Navigate to prediction page with form data
    navigate("/prediction", { state: { formData } });
  };

  const handleLoadSample = () => {
    setFormData(sampleData);
    showToast("success", "Sample data loaded!");
  };

  return (
    <section
      id="predict"
      className="py-16 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-wine-950 via-wine-900 to-wine-950"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-cream-50 mb-4"
          >
            Wine Quality Predictor
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-cream-200 text-lg"
          >
            Enter the wine properties below and let our AI predict its quality
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-wine-900/50 border-gold-400/20 shadow-2xl">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Form fields */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {formFields.map((field, index) => (
                    <AnimatedFormField
                      key={field.name}
                      field={field}
                      value={formData[field.name]}
                      onChange={(value) => {
                        setFormData({
                          ...formData,
                          [field.name]: value,
                        });
                        if (errors[field.name]) {
                          setErrors({
                            ...errors,
                            [field.name]: "",
                            });
                          }
                        }}
                        error={errors[field.name]}
                        index={index}
                        isInView={true}
                      />
                    ))}
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4 border-t border-gold-400/10">
                  <Button
                    type="submit"
                    className="flex-1 bg-linear-to-r from-gold-400 to-gold-300 text-wine-950 font-semibold"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Predict Quality
                  </Button>
                  <Button
                    type="button"
                    onClick={handleLoadSample}
                    className="flex-1 bg-wine-800/50 border border-gold-400/30 text-cream-200 hover:bg-wine-800 hover:border-gold-400/60"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Load Sample
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
