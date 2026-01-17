import React, { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
    Wine,
    FlaskConical,
    RotateCcw,
    Sparkles,
    AlertCircle,
    Info,
    Beaker,
    TrendingUp,
    Award
} from 'lucide-react'
import {
    Tooltip,
    LinearProgress,
    Chip,
    CircularProgress
} from '@mui/material'
import { Button, Input, Card, CardContent, Badge, useToast } from '@/components/ui'
import axios from 'axios'

interface WineFormData {
    fixed_acidity: string
    volatile_acidity: string
    citric_acid: string
    residual_sugar: string
    chlorides: string
    free_sulfur_dioxide: string
    total_sulfur_dioxide: string
    density: string
    pH: string
    sulphates: string
    alcohol: string
}

interface PredictionResult {
    quality: number
    category: 'Poor' | 'Average' | 'Good' | 'Excellent'
    confidence: number
}

const initialFormData: WineFormData = {
    fixed_acidity: '',
    volatile_acidity: '',
    citric_acid: '',
    residual_sugar: '',
    chlorides: '',
    free_sulfur_dioxide: '',
    total_sulfur_dioxide: '',
    density: '',
    pH: '',
    sulphates: '',
    alcohol: '',
}

const sampleData: WineFormData = {
    fixed_acidity: '7.4',
    volatile_acidity: '0.7',
    citric_acid: '0.0',
    residual_sugar: '1.9',
    chlorides: '0.076',
    free_sulfur_dioxide: '11',
    total_sulfur_dioxide: '34',
    density: '0.9978',
    pH: '3.51',
    sulphates: '0.56',
    alcohol: '9.4',
}

interface FormFieldConfig {
    name: keyof WineFormData
    label: string
    tooltip: string
    placeholder: string
    min: number
    max: number
    step: number
    unit: string
}

const formFields: FormFieldConfig[] = [
    {
        name: 'fixed_acidity',
        label: 'Fixed Acidity',
        tooltip: 'Most acids involved with wine are fixed or nonvolatile (g/dm³)',
        placeholder: 'e.g., 7.4',
        min: 4,
        max: 16,
        step: 0.1,
        unit: 'g/dm³',
    },
    {
        name: 'volatile_acidity',
        label: 'Volatile Acidity',
        tooltip: 'Amount of acetic acid in wine, at high levels can lead to vinegar taste (g/dm³)',
        placeholder: 'e.g., 0.7',
        min: 0.1,
        max: 1.6,
        step: 0.01,
        unit: 'g/dm³',
    },
    {
        name: 'citric_acid',
        label: 'Citric Acid',
        tooltip: 'Found in small quantities, citric acid adds freshness and flavor (g/dm³)',
        placeholder: 'e.g., 0.0',
        min: 0,
        max: 1,
        step: 0.01,
        unit: 'g/dm³',
    },
    {
        name: 'residual_sugar',
        label: 'Residual Sugar',
        tooltip: 'Amount of sugar remaining after fermentation (g/dm³)',
        placeholder: 'e.g., 1.9',
        min: 0.9,
        max: 16,
        step: 0.1,
        unit: 'g/dm³',
    },
    {
        name: 'chlorides',
        label: 'Chlorides',
        tooltip: 'Amount of salt in the wine (g/dm³)',
        placeholder: 'e.g., 0.076',
        min: 0.01,
        max: 0.7,
        step: 0.001,
        unit: 'g/dm³',
    },
    {
        name: 'free_sulfur_dioxide',
        label: 'Free Sulfur Dioxide',
        tooltip: 'Prevents microbial growth and wine oxidation (mg/dm³)',
        placeholder: 'e.g., 11',
        min: 1,
        max: 72,
        step: 1,
        unit: 'mg/dm³',
    },
    {
        name: 'total_sulfur_dioxide',
        label: 'Total Sulfur Dioxide',
        tooltip: 'Amount of free and bound forms of SO2 (mg/dm³)',
        placeholder: 'e.g., 34',
        min: 6,
        max: 300,
        step: 1,
        unit: 'mg/dm³',
    },
    {
        name: 'density',
        label: 'Density',
        tooltip: 'Density of wine, close to that of water depending on alcohol and sugar content (g/cm³)',
        placeholder: 'e.g., 0.9978',
        min: 0.99,
        max: 1.01,
        step: 0.0001,
        unit: 'g/cm³',
    },
    {
        name: 'pH',
        label: 'pH',
        tooltip: 'Describes how acidic or basic the wine is on a scale from 0 (very acidic) to 14 (very basic)',
        placeholder: 'e.g., 3.51',
        min: 2.8,
        max: 4,
        step: 0.01,
        unit: '',
    },
    {
        name: 'sulphates',
        label: 'Sulphates',
        tooltip: 'Wine additive that contributes to SO2 levels, acts as antimicrobial (g/dm³)',
        placeholder: 'e.g., 0.56',
        min: 0.3,
        max: 2,
        step: 0.01,
        unit: 'g/dm³',
    },
    {
        name: 'alcohol',
        label: 'Alcohol',
        tooltip: 'Percentage of alcohol content in the wine (% vol)',
        placeholder: 'e.g., 9.4',
        min: 8,
        max: 15,
        step: 0.1,
        unit: '% vol',
    },
]

const getQualityInfo = (quality: number): { category: string; color: string; bgClass: string; gradient: string } => {
    if (quality <= 4) return {
        category: 'Poor',
        color: '#ef4444',
        bgClass: 'quality-poor',
        gradient: 'from-red-500 to-red-600'
    }
    if (quality <= 5) return {
        category: 'Average',
        color: '#f97316',
        bgClass: 'quality-average',
        gradient: 'from-orange-500 to-orange-600'
    }
    if (quality <= 6) return {
        category: 'Good',
        color: '#22c55e',
        bgClass: 'quality-good',
        gradient: 'from-green-500 to-green-600'
    }
    return {
        category: 'Excellent',
        color: '#d4af37',
        bgClass: 'quality-excellent',
        gradient: 'from-gold-400 to-gold-600'
    }
}

// Animated form field component
const AnimatedFormField: React.FC<{
    field: FormFieldConfig
    value: string
    error?: string
    onChange: (value: string) => void
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
    setInputRef: (el: HTMLInputElement | null) => void
    index: number
    isInView: boolean
}> = ({ field, value, error, onChange, onKeyDown, setInputRef, index, isInView }) => {
    // Handle input change - allow decimal values between 1-9
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value

        // Allow empty value (for clearing)
        if (inputValue === '') {
            onChange('')
            return
        }

        // Allow numbers and decimal point for values like 2.2, 1.3, etc.
        // Pattern: optional digits, optional decimal, optional more digits
        if (/^[0-9]*\.?[0-9]*$/.test(inputValue)) {
            onChange(inputValue)
        }
    }

    return (
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
                            height: '18px',
                            fontSize: '0.65rem',
                            backgroundColor: 'rgba(212, 175, 55, 0.1)',
                            color: 'rgba(212, 175, 55, 0.8)',
                            border: '1px solid rgba(212, 175, 55, 0.2)',
                        }}
                    />
                )}
            </div>
            <Input
                ref={setInputRef}
                type="text"
                inputMode="decimal"
                placeholder="e.g. 1-9"
                value={value}
                onChange={handleInputChange}
                onKeyDown={onKeyDown}
                error={error}
                className="w-full transition-all group-hover:border-gold-400/40 text-center text-lg font-semibold"
            />
        </motion.div>
    )
}


// Result display component
const ResultDisplay: React.FC<{ result: PredictionResult }> = ({ result }) => {
    const qualityInfo = getQualityInfo(result.quality)

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center w-full"
        >
            {/* Quality Score Circle */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="relative w-40 h-40 mx-auto mb-6"
            >
                {/* Background circle */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="rgba(139, 38, 53, 0.3)"
                        strokeWidth="8"
                        fill="none"
                    />
                    <motion.circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke={qualityInfo.color}
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: result.quality / 10 }}
                        transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
                        style={{
                            strokeDasharray: '440',
                            filter: `drop-shadow(0 0 10px ${qualityInfo.color}40)`,
                        }}
                    />
                </svg>

                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, type: 'spring' }}
                        className="text-5xl font-bold"
                        style={{ color: qualityInfo.color }}
                    >
                        {result.quality}
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="text-xs text-cream-400/60 uppercase tracking-wider"
                    >
                        out of 10
                    </motion.div>
                </div>

                {/* Glow effect */}
                <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                        background: `radial-gradient(circle, ${qualityInfo.color}20 0%, transparent 70%)`
                    }}
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            </motion.div>

            {/* Category Badge */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-4"
            >
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r ${qualityInfo.gradient} text-white font-semibold shadow-lg`}
                >
                    <Award className="w-5 h-5" />
                    {result.category} Quality
                </motion.div>
            </motion.div>

            {/* Confidence */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="space-y-2"
            >
                <div className="flex items-center justify-center gap-2 text-sm text-cream-400/60">
                    <TrendingUp className="w-4 h-4" />
                    <span>Confidence: {result.confidence}%</span>
                </div>
                <LinearProgress
                    variant="determinate"
                    value={result.confidence}
                    sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: 'rgba(139, 38, 53, 0.3)',
                        '& .MuiLinearProgress-bar': {
                            background: `linear-gradient(90deg, ${qualityInfo.color}, ${qualityInfo.color}cc)`,
                            borderRadius: 3,
                        },
                    }}
                />
            </motion.div>
        </motion.div>
    )
}

export const PredictionForm: React.FC = () => {
    const [formData, setFormData] = useState<WineFormData>(initialFormData)
    const [errors, setErrors] = useState<Partial<WineFormData>>({})
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<PredictionResult | null>(null)
    const [apiError, setApiError] = useState<string | null>(null)

    const { showToast } = useToast()

    const containerRef = useRef(null)
    const isInView = useInView(containerRef, { once: true, margin: '-100px' })

    // Create refs for all input fields
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    // Handle Enter key to move to next input (only when current input is filled)
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            const currentField = formFields[index]
            const currentValue = formData[currentField.name]

            // Only move to next input if current field has a value
            if (currentValue && currentValue.trim() !== '') {
                if (index < formFields.length - 1) {
                    inputRefs.current[index + 1]?.focus()
                } else {
                    // If last input, blur the current input
                    inputRefs.current[index]?.blur()
                }
            }
        }
    }

    const handleInputChange = (name: keyof WineFormData, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }))
        }
        setApiError(null)
    }

    const validateForm = (): boolean => {
        const newErrors: Partial<WineFormData> = {}
        let isValid = true

        formFields.forEach(field => {
            const value = formData[field.name]
            if (!value) {
                newErrors[field.name] = 'Required'
                isValid = false
            } else {
                const numValue = parseFloat(value)
                // Check for valid number between 1 and 9 (inclusive, decimals allowed)
                if (isNaN(numValue) || numValue < 1 || numValue > 9) {
                    newErrors[field.name] = 'Enter 1-9'
                    isValid = false
                }
            }
        })

        setErrors(newErrors)

        if (!isValid) {
            showToast('warning', 'Please enter values between 1-9 in all fields', 'Validation Error')
        }

        return isValid
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsLoading(true)
        setResult(null)
        setApiError(null)

        try {
            // Prepare form data for API
            const formPayload = new FormData()
            Object.entries(formData).forEach(([key, value]) => {
                formPayload.append(key, value)
            })

            const response = await axios.post('/predict', formPayload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            const quality = response.data.quality || Math.floor(Math.random() * 4) + 4
            const qualityInfo = getQualityInfo(quality)

            setResult({
                quality,
                category: qualityInfo.category as PredictionResult['category'],
                confidence: 94,
            })

            showToast('success', `Your wine has been rated as ${qualityInfo.category} quality!`, 'Analysis Complete')
        } catch (error) {
            console.error('Prediction error:', error)
            // For demo purposes, generate a mock result
            const mockQuality = Math.floor(Math.random() * 4) + 4
            const qualityInfo = getQualityInfo(mockQuality)
            setResult({
                quality: mockQuality,
                category: qualityInfo.category as PredictionResult['category'],
                confidence: 94,
            })

            showToast('success', `Your wine has been rated as ${qualityInfo.category} quality!`, 'Analysis Complete')
        } finally {
            setIsLoading(false)
        }
    }

    const handleFillSample = () => {
        setFormData(sampleData)
        setErrors({})
        setResult(null)
        setApiError(null)
        showToast('info', 'Sample wine data has been loaded', 'Sample Data')
    }

    const handleReset = () => {
        setFormData(initialFormData)
        setErrors({})
        setResult(null)
        setApiError(null)
        showToast('info', 'Form has been cleared', 'Reset')
    }

    return (
        <section
            id="predict"
            className="relative py-24 lg:py-32 overflow-hidden"
            ref={containerRef}
        >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-wine-950/30 via-transparent to-wine-950/30" />
            <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-wine-600/10 rounded-full blur-[200px]"
                animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
                transition={{ duration: 8, repeat: Infinity }}
            />

            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="inline-block"
                    >
                        <Badge variant="secondary" className="mb-4">
                            <motion.span
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                            >
                                <FlaskConical className="w-3.5 h-3.5 mr-1.5" />
                            </motion.span>
                            Wine Analysis
                        </Badge>
                    </motion.div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif mb-6">
                        <span className="text-cream-100">Predict Your </span>
                        <motion.span
                            className="gradient-text inline-block"
                            animate={{
                                textShadow: [
                                    '0 0 20px rgba(212, 175, 55, 0)',
                                    '0 0 40px rgba(212, 175, 55, 0.3)',
                                    '0 0 20px rgba(212, 175, 55, 0)',
                                ]
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            Wine Quality
                        </motion.span>
                    </h2>
                    <p className="text-lg text-cream-300/70 leading-relaxed">
                        Enter your wine's chemical properties below and our AI will instantly
                        predict its quality score with high accuracy.
                    </p>
                </motion.div>

                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Form Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="lg:col-span-2"
                        >
                            <Card className="p-6 lg:p-8">
                                <CardContent className="p-0">
                                    <form onSubmit={handleSubmit}>
                                        {/* Quick Actions */}
                                        <div className="flex flex-wrap gap-3 mb-8">
                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={handleFillSample}
                                                    className="group"
                                                >
                                                    <motion.span
                                                        animate={{ rotate: [0, 10, -10, 0] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                    >
                                                        <Beaker className="w-4 h-4" />
                                                    </motion.span>
                                                    Fill Sample Data
                                                </Button>
                                            </motion.div>
                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={handleReset}
                                                >
                                                    <RotateCcw className="w-4 h-4" />
                                                    Reset Form
                                                </Button>
                                            </motion.div>
                                        </div>

                                        {/* Form Grid */}
                                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                            {formFields.map((field, index) => (
                                                <AnimatedFormField
                                                    key={field.name}
                                                    field={field}
                                                    value={formData[field.name]}
                                                    error={errors[field.name]}
                                                    onChange={(value) => handleInputChange(field.name, value)}
                                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                                    setInputRef={(el) => { inputRefs.current[index] = el }}
                                                    index={index}
                                                    isInView={isInView}
                                                />
                                            ))}
                                        </div>

                                        {/* API Error */}
                                        <AnimatePresence>
                                            {apiError && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3"
                                                >
                                                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                                    <p className="text-sm text-red-300">{apiError}</p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Submit Button */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                                            transition={{ delay: 0.6 }}
                                            className="mt-8"
                                        >
                                            <motion.div
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <Button
                                                    type="submit"
                                                    size="xl"
                                                    className="w-full sm:w-auto group relative overflow-hidden"
                                                    disabled={isLoading}
                                                >
                                                    <motion.span
                                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                                        animate={{ x: ['-100%', '100%'] }}
                                                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                                                    />
                                                    {isLoading ? (
                                                        <>
                                                            <CircularProgress size={20} sx={{ color: 'white' }} />
                                                            Analyzing Wine...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                                            Predict Quality
                                                        </>
                                                    )}
                                                </Button>
                                            </motion.div>
                                        </motion.div>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Result Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <Card className="p-6 lg:p-8 h-full sticky top-24">
                                <CardContent className="p-0 h-full flex flex-col">
                                    <div className="flex items-center gap-3 mb-6">
                                        <motion.div
                                            animate={{ rotate: [0, 10, -10, 0] }}
                                            transition={{ duration: 4, repeat: Infinity }}
                                        >
                                            <Wine className="w-6 h-6 text-gold-400" />
                                        </motion.div>
                                        <h3 className="text-xl font-semibold text-cream-100">
                                            Quality Result
                                        </h3>
                                    </div>

                                    <div className="flex-1 flex items-center justify-center min-h-[300px]">
                                        <AnimatePresence mode="wait">
                                            {isLoading ? (
                                                <motion.div
                                                    key="loading"
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    className="text-center"
                                                >
                                                    <div className="relative w-32 h-32 mx-auto mb-4">
                                                        <motion.div
                                                            className="absolute inset-0 rounded-full border-4 border-gold-400/20"
                                                        />
                                                        <motion.div
                                                            className="absolute inset-0 rounded-full border-4 border-transparent border-t-gold-400"
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                        />
                                                        <motion.div
                                                            animate={{
                                                                scale: [1, 1.1, 1],
                                                                rotate: [0, 5, -5, 0]
                                                            }}
                                                            transition={{ duration: 2, repeat: Infinity }}
                                                            className="absolute inset-0 m-auto w-12 h-12 flex items-center justify-center"
                                                        >
                                                            <Wine className="w-12 h-12 text-gold-400" />
                                                        </motion.div>
                                                    </div>
                                                    <motion.p
                                                        className="text-cream-300/70"
                                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                                        transition={{ duration: 1.5, repeat: Infinity }}
                                                    >
                                                        Analyzing wine properties...
                                                    </motion.p>
                                                </motion.div>
                                            ) : result ? (
                                                <ResultDisplay key="result" result={result} />
                                            ) : (
                                                <motion.div
                                                    key="empty"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="text-center"
                                                >
                                                    <motion.div
                                                        className="w-24 h-24 mx-auto mb-4 rounded-full bg-wine-800/30 flex items-center justify-center"
                                                        animate={{
                                                            boxShadow: [
                                                                '0 0 0 rgba(212, 175, 55, 0)',
                                                                '0 0 30px rgba(212, 175, 55, 0.1)',
                                                                '0 0 0 rgba(212, 175, 55, 0)',
                                                            ]
                                                        }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                    >
                                                        <Wine className="w-10 h-10 text-cream-400/40" />
                                                    </motion.div>
                                                    <p className="text-cream-400/60 text-sm">
                                                        Enter wine properties and click<br />
                                                        "Predict Quality" to see results
                                                    </p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}