import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

const API_URL = 'http://localhost:8000';

const RiskCalculator = () => {
    // Health metrics state - ALL 8 features
    const [metrics, setMetrics] = useState({
        age: 45,
        gender: 1,
        bmi: 24.5,
        smoking: 0,
        genetic_risk: 1,
        physical_activity: 7.0,
        alcohol_intake: 2.0,
        cancer_history: 0
    });

    // Prediction results
    const [currentRisk, setCurrentRisk] = useState(null);
    const [optimalRisk, setOptimalRisk] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Debounce timer
    const [debounceTimer, setDebounceTimer] = useState(null);

    // Fetch prediction from API
    const fetchPrediction = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${API_URL}/predict-optimal`, metrics);
            setCurrentRisk({
                probability: response.data.current_risk_probability,
                percentage: response.data.current_risk_percentage
            });
            setOptimalRisk({
                probability: response.data.optimal_risk_probability,
                percentage: response.data.optimal_risk_percentage
            });
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to fetch prediction. Ensure backend is running.');
            console.error('Prediction error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Effect to trigger API call when metrics change
    useEffect(() => {
        // Clear existing timer
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        // Set new timer (debounce for 500ms)
        const timer = setTimeout(() => {
            fetchPrediction();
        }, 500);

        setDebounceTimer(timer);

        // Cleanup
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [metrics]);

    // Handle slider changes
    const handleChange = (field, value) => {
        setMetrics(prev => ({
            ...prev,
            [field]: parseFloat(value)
        }));
    };

    // Get risk level and color
    const getRiskLevel = (probability) => {
        if (probability < 0.25) return { level: 'Low', color: '#10b981' };
        if (probability < 0.50) return { level: 'Moderate', color: '#f59e0b' };
        if (probability < 0.75) return { level: 'High', color: '#ef4444' };
        return { level: 'Very High', color: '#dc2626' };
    };

    // Prepare chart data
    const chartData = currentRisk && optimalRisk ? [
        {
            name: 'Current Risk',
            risk: currentRisk.percentage,
            color: getRiskLevel(currentRisk.probability).color
        },
        {
            name: 'Optimal Risk',
            risk: optimalRisk.percentage,
            color: '#10b981'
        }
    ] : [];

    const currentRiskInfo = currentRisk ? getRiskLevel(currentRisk.probability) : null;

    return (
        <div className="min-h-screen w-full py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4 gradient-text">
                        Cancer Risk Simulator
                    </h1>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        Comprehensive health assessment using 8 key factors. Real-time ML predictions with 93.7% accuracy.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Panel: Input Controls */}
                    <div className="glass-strong rounded-3xl p-8 shadow-2xl transition-smooth hover:shadow-blue-500/20">
                        <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                            <span className="text-3xl">⚙️</span>
                            Health Metrics
                        </h2>

                        <div className="space-y-6">
                            {/* Age Slider */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium text-gray-200">👤 Age</label>
                                    <span className="text-xl font-bold text-blue-400">{metrics.age}</span>
                                </div>
                                <input
                                    type="range"
                                    min="18"
                                    max="90"
                                    step="1"
                                    value={metrics.age}
                                    onChange={(e) => handleChange('age', e.target.value)}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                            </div>

                            {/* Gender Toggle */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium text-gray-200">⚥ Gender</label>
                                    <span className="text-xl font-bold text-purple-400">
                                        {metrics.gender === 0 ? '♀ Female' : '♂ Male'}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="1"
                                    value={metrics.gender}
                                    onChange={(e) => handleChange('gender', e.target.value)}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                />
                            </div>

                            {/* BMI Slider */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium text-gray-200">⚖️ BMI</label>
                                    <span className="text-xl font-bold text-green-400">{metrics.bmi.toFixed(1)}</span>
                                </div>
                                <input
                                    type="range"
                                    min="15"
                                    max="45"
                                    step="0.1"
                                    value={metrics.bmi}
                                    onChange={(e) => handleChange('bmi', e.target.value)}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                                />
                            </div>

                            {/* Smoking Status Toggle */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium text-gray-200">🚬 Smoking</label>
                                    <span className="text-xl font-bold text-pink-400">
                                        {metrics.smoking === 0 ? '🚭 No' : '🚬 Yes'}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="1"
                                    value={metrics.smoking}
                                    onChange={(e) => handleChange('smoking', e.target.value)}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                                />
                            </div>

                            {/* Genetic Risk */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium text-gray-200">🧬 Genetic Risk</label>
                                    <span className="text-xl font-bold text-yellow-400">
                                        {metrics.genetic_risk === 0 ? 'Low' : metrics.genetic_risk === 1 ? 'Medium' : 'High'}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="2"
                                    step="1"
                                    value={metrics.genetic_risk}
                                    onChange={(e) => handleChange('genetic_risk', e.target.value)}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                                />
                            </div>

                            {/* Physical Activity */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium text-gray-200">🏃 Activity (hrs/wk)</label>
                                    <span className="text-xl font-bold text-cyan-400">{metrics.physical_activity.toFixed(1)}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="20"
                                    step="0.5"
                                    value={metrics.physical_activity}
                                    onChange={(e) => handleChange('physical_activity', e.target.value)}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                />
                            </div>

                            {/* Alcohol Intake */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium text-gray-200">🍷 Alcohol (drinks/wk)</label>
                                    <span className="text-xl font-bold text-orange-400">{metrics.alcohol_intake.toFixed(1)}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="10"
                                    step="0.5"
                                    value={metrics.alcohol_intake}
                                    onChange={(e) => handleChange('alcohol_intake', e.target.value)}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                />
                            </div>

                            {/* Cancer History */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium text-gray-200">📋 Cancer History</label>
                                    <span className="text-xl font-bold text-red-400">
                                        {metrics.cancer_history === 0 ? '✅ No' : '⚠️ Yes'}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="1"
                                    value={metrics.cancer_history}
                                    onChange={(e) => handleChange('cancer_history', e.target.value)}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                                />
                            </div>
                        </div>

                        {/* Loading/Error States */}
                        {loading && (
                            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                                <p className="text-blue-300 text-center flex items-center justify-center gap-2">
                                    <span className="animate-spin">⚙️</span>
                                    Calculating risk...
                                </p>
                            </div>
                        )}

                        {error && (
                            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                                <p className="text-red-300 text-center">⚠️ {error}</p>
                            </div>
                        )}
                    </div>

                    {/* Right Panel: Results Visualization */}
                    <div className="glass-strong rounded-3xl p-8 shadow-2xl transition-smooth hover:shadow-purple-500/20">
                        <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                            <span className="text-3xl">📊</span>
                            Risk Analysis
                        </h2>

                        {currentRisk && optimalRisk ? (
                            <div className="space-y-6">
                                {/* Current Risk Display */}
                                <div className="glass rounded-2xl p-6 border-l-4"
                                    style={{ borderLeftColor: currentRiskInfo.color }}>
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-lg font-semibold text-gray-200">Current Risk</h3>
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold`}
                                            style={{ backgroundColor: `${currentRiskInfo.color}20`, color: currentRiskInfo.color }}>
                                            {currentRiskInfo.level}
                                        </span>
                                    </div>
                                    <p className="text-5xl font-bold mb-1" style={{ color: currentRiskInfo.color }}>
                                        {currentRisk.percentage.toFixed(1)}%
                                    </p>
                                    <p className="text-gray-400 text-sm">Based on your 8 health factors</p>
                                </div>

                                {/* Optimal Risk Display */}
                                <div className="glass rounded-2xl p-6 border-l-4 border-green-500">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-lg font-semibold text-gray-200">Optimal Risk</h3>
                                        <span className="px-3 py-1 rounded-full text-sm font-bold bg-green-500/20 text-green-400">
                                            Best Possible
                                        </span>
                                    </div>
                                    <p className="text-5xl font-bold text-green-400 mb-1">
                                        {optimalRisk.percentage.toFixed(1)}%
                                    </p>
                                    <p className="text-gray-400 text-sm">
                                        With ideal lifestyle choices
                                    </p>
                                </div>

                                {/* Potential Improvement */}
                                {currentRisk.percentage > optimalRisk.percentage && (
                                    <div className="glass rounded-2xl p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                                        <h3 className="text-lg font-semibold text-gray-200 mb-2">💡 Potential Improvement</h3>
                                        <p className="text-3xl font-bold text-blue-400 mb-1">
                                            -{(currentRisk.percentage - optimalRisk.percentage).toFixed(1)}%
                                        </p>
                                        <p className="text-gray-400 text-sm">
                                            Possible risk reduction with lifestyle changes
                                        </p>
                                    </div>
                                )}

                                {/* Bar Chart Comparison */}
                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold text-gray-200 mb-4">Risk Comparison</h3>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                            <XAxis
                                                dataKey="name"
                                                stroke="#9ca3af"
                                                tick={{ fill: '#9ca3af' }}
                                            />
                                            <YAxis
                                                stroke="#9ca3af"
                                                tick={{ fill: '#9ca3af' }}
                                                label={{ value: 'Risk %', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                                    border: '1px solid rgba(255,255,255,0.2)',
                                                    borderRadius: '8px'
                                                }}
                                                labelStyle={{ color: '#fff' }}
                                            />
                                            <Bar dataKey="risk" radius={[8, 8, 0, 0]}>
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-64">
                                <div className="text-center">
                                    <div className="text-6xl mb-4 animate-pulse-slow">📈</div>
                                    <p className="text-gray-400">Adjust the inputs to see your risk prediction</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info Footer */}
                <div className="mt-12 glass rounded-2xl p-6 text-center">
                    <p className="text-gray-400 text-sm">
                        ⚠️ <strong>Disclaimer:</strong> This tool uses real data with 93.7% accuracy but should not be used for actual medical diagnosis.
                        Always consult healthcare professionals for real health assessments.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RiskCalculator;
