/**
 * Predictive Engine for Shipment Delay Risk Analysis
 * Ported and enhanced from XGBoost logic in model.ipynb
 */

export const calculateDelayRisk = ({
    distance,
    weather_condition,
    traffic_speed,
    carrier_score = 0.95,
    eta_hours
}) => {
    let baseScore = 0.1; // Baseline risk

    // 1. Distance Factor (Normalization)
    // In model.ipynb, distance is a key feature.
    // Higher distance generally adds risk variance.
    const distanceFactor = Math.min(distance / 5000, 1) * 0.2;
    baseScore += distanceFactor;

    // 2. Weather Factor
    // model.ipynb mapping: Rain/Thunderstorm = 2, Clouds = 1, Clear = 0
    let weatherImpact = 0;
    const condition = weather_condition.toLowerCase();
    if (condition.includes('storm') || condition.includes('rain') || condition.includes('snow')) {
        weatherImpact = 0.35;
    } else if (condition.includes('cloud')) {
        weatherImpact = 0.15;
    }
    baseScore += weatherImpact;

    // 3. Traffic Factor (TomTom Logic)
    // model.ipynb checks if speed < 20 km/h
    let trafficImpact = 0;
    if (traffic_speed < 30) {
        trafficImpact = 0.3; // High congestion
    } else if (traffic_speed < 60) {
        trafficImpact = 0.1; // Moderate
    }
    baseScore += trafficImpact;

    // 4. ETA Variance
    // If ETA is significantly higher than distance/avg_speed
    const expectedHours = distance / 80; // 80km/h avg
    if (eta_hours > expectedHours * 1.5) {
        baseScore += 0.15;
    }

    // 5. Carrier Reliability
    baseScore += (1 - carrier_score) * 0.2;

    // Clamp between 0 and 1
    const riskProbability = Math.min(Math.max(baseScore, 0.01), 0.99);

    let level = 'LOW';
    if (riskProbability > 0.7) level = 'CRITICAL';
    else if (riskProbability > 0.4) level = 'MEDIUM';

    return {
        probability: riskProbability,
        level,
        factors: {
            weather: weatherImpact > 0,
            traffic: trafficImpact > 0,
            distance: distanceFactor > 0.1
        }
    };
};

export const getPredictionColor = (level) => {
    switch (level) {
        case 'CRITICAL': return '#ef4444'; // red-500
        case 'MEDIUM': return '#f59e0b'; // amber-500
        default: return '#10b981'; // emerald-500
    }
};
