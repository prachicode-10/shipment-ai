import React, { useState, useEffect, useMemo } from 'react';
import Map, { Marker, Popup, Source, Layer, NavigationControl } from 'react-map-gl/mapbox';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Truck, 
    AlertTriangle, 
    ShieldCheck, 
    Search, 
    Clock, 
    RotateCcw,
    Filter,
    ChevronDown,
    X,
    MapPin,
    ArrowRight
} from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { calculateDelayRisk, getPredictionColor } from '../utils/predictiveEngine.js';

// SHIPMENT DATA
const initialShipments = [
    {
        id: "SH-4921",
        origin: "Los Angeles",
        destination: "New York",
        lat: 34.0522,
        lng: -118.2437,
        targetLat: 40.7128,
        targetLng: -74.0060,
        risk: "low",
        status: "In Transit",
        arrival: "Oct 27, 2023",
        delayProb: "12%",
        cause: "Optimal conditions",
        recommendation: "Stay on current path."
    },
    {
        id: "SH-4924",
        origin: "Berlin",
        destination: "Paris",
        lat: 52.5200,
        lng: 13.4050,
        targetLat: 48.8566,
        targetLng: 2.3522,
        risk: "high",
        status: "Delayed",
        arrival: "Oct 26, 2023",
        delayProb: "82%",
        cause: "Heavy traffic and rainfall.",
        recommendation: "Use alternate route via Expressway."
    },
    {
        id: "SH-4922",
        origin: "London",
        destination: "Madrid",
        lat: 51.5074,
        lng: -0.1278,
        targetLat: 40.4168,
        targetLng: -3.7038,
        risk: "medium",
        status: "Processing",
        arrival: "Oct 29, 2023",
        delayProb: "45%",
        cause: "Customs congestion.",
        recommendation: "Prepare additional documentation."
    }
];

// RISK ZONES
const riskZones = [
    { id: 'zone-1', lat: 41.8781, lng: -87.6298, radius: 100, risk: 'high', label: 'Traffic Congestion' },
    { id: 'zone-2', lat: 48.8566, lng: 2.3522, radius: 150, risk: 'medium', label: 'Storm Weather' }
];

const LiveTrackingMap = ({ activePrediction }) => {
    const [viewState, setViewState] = useState({
        latitude: 20.5937,
        longitude: 78.9629,
        zoom: 3
    });
    const [selectedShipment, setSelectedShipment] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all');
    const [shipments, setShipments] = useState(initialShipments);
    const [showAlert, setShowAlert] = useState(false);

    // Prediction States (Restored)
    const [predictionData, setPredictionData] = useState(null);
    const [routeGeoJSON, setRouteGeoJSON] = useState(null);
    const [congestionPoints, setCongestionPoints] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [predictionError, setPredictionError] = useState(null);
    const [truckProgress, setTruckProgress] = useState(0);
    const [truckCoords, setTruckCoords] = useState(null);

    // Fallback coordinates for major cities (Reliability backup)
    const fallbackCoords = {
        'delhi': [28.6139, 77.2090],
        'new delhi': [28.6139, 77.2090],
        'mumbai': [19.0760, 72.8777],
        'bangalore': [12.9716, 77.5946],
        'bengaluru': [12.9716, 77.5946],
        'chennai': [13.0827, 80.2707],
        'kolkata': [22.5726, 88.3639],
        'hyderabad': [17.3850, 78.4867],
        'pune': [18.5204, 73.8567],
        'london': [51.5074, -0.1278],
        'new york': [40.7128, -74.0060],
        'dubai': [25.2048, 55.2708],
        'singapore': [1.3521, 103.8198]
    };

    // Dynamic Geocoding using Nominatim (OpenStreetMap)
    const geocodeCity = async (city) => {
        if (!city || city.trim() === "") return null;
        const normalized = city.toLowerCase().trim();
        
        // 1. Check local cache/fallback first for speed & reliability
        if (fallbackCoords[normalized]) {
            console.log(`Using fallback coords for ${city}`);
            return fallbackCoords[normalized];
        }

        try {
            console.log(`Geocoding city: ${city}`);
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`, {
                headers: { 'User-Agent': 'ShipmentGuardAI-Logistics-Tracker' }
            });
            const data = await res.json();
            if (data && data.length > 0) {
                console.log(`Geocoding success for ${city}:`, data[0].lat, data[0].lon);
                return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
            }
            return null;
        } catch (err) {
            console.error("Geocoding API failed, no fallback available:", err);
            return null;
        }
    };

    // Weather Simulation/Fetch (from model.ipynb)
    const fetchPredictionData = async (origin, destination) => {
        setIsLoading(true);
        setPredictionError(null);
        setRouteGeoJSON(null);
        setPredictionData(null);
        
        try {
            console.log(`Starting prediction: ${origin} to ${destination}`);
            
            // Artificial delay to show AI processing state
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // 1. Dynamic Geocoding
            const start = await geocodeCity(origin);
            const end = await geocodeCity(destination);

            if (!start || !end) {
                throw new Error(`Location not recognized: ${!start ? origin : destination}. Please try a major city.`);
            }

            // 2. Routing (OSRM/Mapbox Directions)
            let routeGeometry = null;
            let distanceKm = 0;
            let durationHrs = 0;

            try {
                const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
                const routeRes = await fetch(osrmUrl);
                const routeData = await routeRes.json();
                
                if (routeData.routes && routeData.routes[0]) {
                    const route = routeData.routes[0];
                    routeGeometry = route.geometry;
                    distanceKm = route.distance / 1000;
                    durationHrs = route.duration / 3600;
                    console.log("OSRM Success:", { distanceKm });
                }
            } catch (rErr) {
                console.warn("OSRM Routing failed, using direct line fallback:", rErr);
            }

            // Fallback Routing (Direct line if OSRM fails)
            if (!routeGeometry) {
                routeGeometry = {
                    type: 'LineString',
                    coordinates: [[start[1], start[0]], [end[1], end[0]]]
                };
                // Calculate rough haversine distance or just mock it
                distanceKm = Math.sqrt(Math.pow(end[0]-start[0], 2) + Math.pow(end[1]-start[1], 2)) * 111;
                durationHrs = distanceKm / 60; // 60 km/h average
            }

            setRouteGeoJSON(routeGeometry);

            // 3. Weather (OpenWeatherMap logic from repo)
            let weatherCondition = 'Clear';
            try {
                const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${start[0]}&lon=${start[1]}&appid=0da5eacb76b0b47d481ea4d3e0d20ce3`);
                if (weatherRes.ok) {
                    const weatherData = await weatherRes.json();
                    weatherCondition = weatherData.weather?.[0]?.main || 'Clear';
                }
            } catch (wErr) {
                console.warn("Weather fetch failed, falling back to Clear:", wErr);
            }

            // 4. ML Prediction (predictiveEngine.js)
            const risk = calculateDelayRisk({
                distance: distanceKm,
                weather_condition: weatherCondition,
                traffic_speed: Math.random() * (70 - 20) + 20, 
                carrier_score: 0.92,
                eta_hours: durationHrs
            });

            setPredictionData({
                origin,
                destination,
                distance: distanceKm.toFixed(1),
                weather: weatherCondition,
                risk
            });

            // Update View
            setViewState({
                latitude: (start[0] + end[0]) / 2,
                longitude: (start[1] + end[1]) / 2,
                zoom: distanceKm > 1000 ? 3 : distanceKm > 500 ? 5 : 7,
                transitionDuration: 2000
            });

            // Simulation Congestion Points (TomTom style)
            const coords = routeGeometry.coordinates;
            if (coords.length >= 2) {
                setCongestionPoints([
                   coords[Math.floor(coords.length * 0.3)],
                   coords[Math.floor(coords.length * 0.7)]
                ]);
            }
        } catch (err) {
            console.error("Prediction Error:", err);
            setPredictionError(err.message || "Failed to calculate prediction. Please try again.");
        } finally {
            setIsLoading(false);
            setTruckProgress(0);
        }
    };

    useEffect(() => {
        if (activePrediction) {
            console.log("activePrediction changed, triggering fetch:", activePrediction);
            fetchPredictionData(activePrediction.origin, activePrediction.destination);
        } else {
            // Default India view
            setViewState({
                latitude: 20.5937,
                longitude: 78.9629,
                zoom: 4,
                transitionDuration: 1000
            });
        }
    }, [activePrediction]);

    // Animation loop for the truck
    useEffect(() => {
        if (!routeGeoJSON) {
            setTruckCoords(null);
            return;
        }

        let animationFrame;
        const speed = 0.002; // Adjust for faster/slower movement

        const animate = () => {
            setTruckProgress(prev => {
                const next = prev + speed;
                if (next >= 1) return 0; // Loop animation
                return next;
            });
            animationFrame = requestAnimationFrame(animate);
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [routeGeoJSON]);

    // Interpolate truck position along the route
    useEffect(() => {
        if (!routeGeoJSON || !routeGeoJSON.coordinates || routeGeoJSON.coordinates.length < 2) return;

        const coords = routeGeoJSON.coordinates;
        const totalPoints = coords.length;
        const index = Math.floor(truckProgress * (totalPoints - 1));
        const nextIndex = Math.min(index + 1, totalPoints - 1);
        const remainder = (truckProgress * (totalPoints - 1)) - index;

        const currentPoint = coords[index];
        const nextPoint = coords[nextIndex];

        const interpolatedLng = currentPoint[0] + (nextPoint[0] - currentPoint[0]) * remainder;
        const interpolatedLat = currentPoint[1] + (nextPoint[1] - currentPoint[1]) * remainder;

        setTruckCoords([interpolatedLng, interpolatedLat]);
    }, [truckProgress, routeGeoJSON]);

    // MAPBOX TOKEN - Placeholder for user to replace
    const MAPBOX_TOKEN = 'pk.eyJ1IjoicHJhY2hpc2hhcm1hIiwiYSI6ImNsdTM2YjJ6bzEzb2gybm8yZzJ6bzJ6bzIifQ.X9z4-X8z4-X8z4-X8z4'; // Publicly available for demo or placeholder

    // Simulate real-time movement
    useEffect(() => {
        const interval = setInterval(() => {
            setShipments(prev => prev.map(s => {
                const moveStep = 0.005;
                const dLat = s.targetLat - s.lat;
                const dLng = s.targetLng - s.lng;
                const dist = Math.sqrt(dLat * dLat + dLng * dLng);
                
                if (dist < 0.1) return s; // Near destination

                return {
                    ...s,
                    lat: s.lat + (dLat / dist) * moveStep,
                    lng: s.lng + (dLng / dist) * moveStep
                };
            }));
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    // Alert simulation
    useEffect(() => {
        const highRisk = shipments.some(s => s.risk === 'high');
        if (highRisk) setShowAlert(true);
    }, [shipments]);

    const filteredShipments = useMemo(() => {
        return shipments.filter(s => {
            const matchesSearch = s.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 s.destination.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = filter === 'all' || s.risk === filter;
            return matchesSearch && matchesFilter;
        });
    }, [shipments, searchQuery, filter]);

    const getRouteColor = (risk) => {
        if (risk === 'high') return '#ef4444'; // red
        if (risk === 'medium') return '#f59e0b'; // orange
        return '#10b981'; // green
    };

    return (
        <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-slate-900 border border-white/5">
            {/* Header Controls */}
            <div className="absolute top-4 left-4 right-4 z-10 flex gap-4">
                <div className="flex-grow relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search shipment ID or City..." 
                        className="w-full bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-2xl py-2.5 pl-12 pr-4 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="relative group">
                    <button className="h-full px-4 bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-slate-900 transition-all">
                        <Filter size={14} />
                        <span>Filter</span>
                        <ChevronDown size={14} />
                    </button>
                    <div className="absolute top-full right-0 mt-2 w-48 bg-slate-950/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all shadow-2xl">
                        {['all', 'high', 'medium', 'low'].map((f) => (
                            <button 
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`w-full text-left px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all ${filter === f ? 'text-primary' : 'text-slate-400'}`}
                            >
                                {f} Risk
                            </button>
                        ))}
                    </div>
                </div>
                <button 
                    onClick={() => setViewState({ latitude: 40, longitude: -20, zoom: 2 })}
                    className="p-3 bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all shadow-xl"
                >
                    <RotateCcw size={16} />
                </button>
            </div>



            {/* Loading Overlay (External Repo Feature) */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[60] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center"
                    >
                        <div className="bg-slate-900/80 border border-white/10 p-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 text-center">
                            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                            <div>
                                <h3 className="text-sm font-black text-white italic tracking-widest uppercase">AI Analyzing</h3>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight mt-1 animate-pulse">Scanning Global Logistics...</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Prediction Result Overlay (External Repo Feature) */}
            <AnimatePresence>
                {(predictionData || predictionError) && !isLoading && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-6 left-6 z-50 w-[320px]"
                    >
                        <div className="bg-slate-950/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                            
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                                        {predictionError ? 'Prediction Failed' : 'Prediction Result'}
                                    </h4>
                                    {predictionData && (
                                        <p className="text-sm font-black text-white italic">{predictionData.origin} → {predictionData.destination}</p>
                                    )}
                                </div>
                                <button 
                                    onClick={() => { setPredictionData(null); setPredictionError(null); }}
                                    className="p-1.5 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </div>

                            {predictionError ? (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl mb-2">
                                    <p className="text-xs font-bold text-red-400 flex items-center gap-2">
                                        <AlertTriangle size={14} />
                                        {predictionError}
                                    </p>
                                    <p className="text-[10px] text-slate-500 mt-2 italic">Try a different city or check your connection.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Distance</p>
                                            <p className="text-xs font-bold text-white uppercase">{predictionData.distance} km</p>
                                        </div>
                                        <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Weather</p>
                                            <p className="text-xs font-bold text-white uppercase">{predictionData.weather}</p>
                                        </div>
                                    </div>

                                    <div className="p-5 bg-slate-900/50 rounded-3xl border border-white/5 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: getPredictionColor(predictionData.risk.level) }} />
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Risk Analysis</span>
                                            </div>
                                            <span className="text-xs font-black" style={{ color: getPredictionColor(predictionData.risk.level) }}>
                                                {predictionData.risk.level}
                                            </span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${predictionData.risk.probability * 100}%` }}
                                                className="h-full shadow-glow"
                                                style={{ backgroundColor: getPredictionColor(predictionData.risk.level) }}
                                            />
                                        </div>
                                        <p className="text-[10px] text-slate-500 font-medium italic">
                                            AI expects {Math.round(predictionData.risk.probability * 100)}% chance of disruption.
                                        </p>
                                    </div>

                                    <button className="w-full py-3 bg-white text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all mt-6 shadow-xl">
                                        Request Optimization
                                    </button>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Status Badge */}
            <div className="absolute top-20 right-4 z-10">
                <div className="bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2 shadow-xl">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Active</span>
                </div>
            </div>

            {/* Alert Notification */}
            <AnimatePresence>
                {showAlert && (
                    <motion.div 
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="absolute bottom-6 right-6 z-20"
                    >
                        <div className="bg-red-500/90 backdrop-blur-xl p-4 rounded-3xl border border-white/20 shadow-2xl flex items-center gap-4 max-w-[280px]">
                            <div className="p-2 bg-white/20 rounded-xl animate-bounce">
                                <AlertTriangle className="text-white w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-white/70 uppercase tracking-tighter">System Alert</p>
                                <p className="text-xs font-bold text-white leading-tight">Shipment SH-4924 at high delay risk.</p>
                            </div>
                            <button onClick={() => setShowAlert(false)} className="text-white/50 hover:text-white">
                                <X size={16} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Map
                {...viewState}
                onMove={evt => setViewState(evt.viewState)}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/dark-v11"
                mapboxAccessToken={MAPBOX_TOKEN}
            >
                <NavigationControl position="bottom-left" />

                {/* Dynamic Predicted Route (External Repo Feature) */}
                {routeGeoJSON && (
                    <Source id="predicted-route-source" type="geojson" data={{
                        type: 'Feature',
                        geometry: routeGeoJSON
                    }}>
                        <Layer
                            id="predicted-route"
                            type="line"
                            paint={{
                                'line-color': predictionData ? getPredictionColor(predictionData.risk.level) : '#3b82f6',
                                'line-width': 4,
                                'line-opacity': 0.8,
                                'line-blur': 2
                            }}
                        />
                        <Layer
                            id="predicted-route-glow"
                            type="line"
                            paint={{
                                'line-color': predictionData ? getPredictionColor(predictionData.risk.level) : '#3b82f6',
                                'line-width': 8,
                                'line-opacity': 0.2,
                                'line-blur': 10
                            }}
                        />
                    </Source>
                )}

                {/* Origin and Destination Markers */}
                {routeGeoJSON && routeGeoJSON.coordinates && routeGeoJSON.coordinates.length >= 2 && (
                    <>
                        <Marker 
                            longitude={routeGeoJSON.coordinates[0][0]} 
                            latitude={routeGeoJSON.coordinates[0][1]}
                            anchor="bottom"
                        >
                            <div className="flex flex-col items-center">
                                <div className="px-2 py-1 bg-slate-900 border border-white/10 rounded-md mb-1 shadow-2xl">
                                    <p className="text-[8px] font-black text-primary uppercase">{predictionData?.origin || 'Origin'}</p>
                                </div>
                                <div className="w-3 h-3 bg-primary rounded-full border-2 border-white shadow-glow" />
                            </div>
                        </Marker>
                        <Marker 
                            longitude={routeGeoJSON.coordinates[routeGeoJSON.coordinates.length - 1][0]} 
                            latitude={routeGeoJSON.coordinates[routeGeoJSON.coordinates.length - 1][1]}
                            anchor="bottom"
                        >
                            <div className="flex flex-col items-center">
                                <div className="px-2 py-1 bg-slate-900 border border-white/10 rounded-md mb-1 shadow-2xl">
                                    <p className="text-[8px] font-black text-indigo-400 uppercase">{predictionData?.destination || 'Destination'}</p>
                                </div>
                                <MapPin size={24} className="text-indigo-500 filter drop-shadow-glow" />
                            </div>
                        </Marker>
                    </>
                )}

                {/* Animated Truck */}
                {truckCoords && (
                    <Marker longitude={truckCoords[0]} latitude={truckCoords[1]} anchor="center">
                        <motion.div 
                            className="p-2 bg-white rounded-xl shadow-2xl border-2 border-primary"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                        >
                            <Truck className="text-primary w-5 h-5" />
                        </motion.div>
                    </Marker>
                )}

                {/* Congestion Points (TomTom style) */}
                {congestionPoints.map((point, i) => (
                    <Marker key={`cong-${i}`} longitude={point[0]} latitude={point[1]}>
                        <div className="relative group">
                            <motion.div 
                                animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.7, 0.4] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-6 h-6 bg-red-500 rounded-full blur-md"
                            />
                            <div className="absolute top-0 left-0 w-2 h-2 bg-red-600 rounded-full -translate-x-1/2 -translate-y-1/2 border border-white/20" />
                        </div>
                    </Marker>
                ))}

                {/* Risk Zones */}
                {riskZones.map(zone => (
                    <Marker key={zone.id} latitude={zone.lat} longitude={zone.lng}>
                        <div className="relative">
                            <motion.div 
                                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className={`rounded-full blur-xl ${zone.risk === 'high' ? 'bg-red-500' : 'bg-orange-500'}`}
                                style={{ width: zone.radius, height: zone.radius, marginLeft: -zone.radius/2, marginTop: -zone.radius/2 }}
                            />
                            <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-slate-900/80 px-2 py-1 rounded-md text-[8px] font-black text-white uppercase tracking-widest border border-white/10">
                                {zone.label}
                            </div>
                        </div>
                    </Marker>
                ))}

                {/* Shipment Markers */}
                {filteredShipments.map(s => (
                    <React.Fragment key={s.id}>
                        {/* Route Line (Simulated with SVG or Layer if needed, using simple Source/Layer) */}
                        <Source id={`source-${s.id}`} type="geojson" data={{
                            type: 'Feature',
                            geometry: {
                                type: 'LineString',
                                coordinates: [[s.lng, s.lat], [s.targetLng, s.targetLat]]
                            }
                        }}>
                            <Layer
                                id={`route-${s.id}`}
                                type="line"
                                paint={{
                                    'line-color': getRouteColor(s.risk),
                                    'line-width': 2,
                                    'line-opacity': 0.4,
                                    'line-dasharray': [2, 2]
                                }}
                            />
                        </Source>

                        <Marker latitude={s.lat} longitude={s.lng} anchor="center">
                            <motion.div 
                                whileHover={{ scale: 1.2 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedShipment(s);
                                    setViewState({ latitude: s.lat, longitude: s.lng, zoom: 6, transitionDuration: 1000 });
                                }}
                                className="cursor-pointer group"
                            >
                                <div className="relative">
                                    <div className={`p-2.5 rounded-2xl shadow-glow transition-all ${
                                        s.risk === 'high' ? 'bg-red-500 animate-pulse' : 
                                        s.risk === 'medium' ? 'bg-orange-500' : 
                                        'bg-primary'
                                    }`}>
                                        <Truck className="text-white w-4 h-4" />
                                    </div>
                                    <div className="absolute top-0 left-full ml-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-900/90 px-2 py-1 rounded-lg border border-white/10">
                                        <p className="text-[10px] font-black text-white">{s.id}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </Marker>
                    </React.Fragment>
                ))}

                {/* Detail Popup */}
                {selectedShipment && (
                    <Popup
                        latitude={selectedShipment.lat}
                        longitude={selectedShipment.lng}
                        anchor="bottom"
                        onClose={() => setSelectedShipment(null)}
                        closeButton={false}
                        className="custom-popup"
                        maxWidth="320px"
                    >
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-slate-950 p-6 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <ShieldCheck size={80} className="text-primary" />
                            </div>

                            <button 
                                onClick={() => setSelectedShipment(null)}
                                className="absolute top-4 right-4 text-slate-500 hover:text-white p-1"
                            >
                                <X size={20} />
                            </button>

                            <div className="relative z-10 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                        selectedShipment.risk === 'high' ? 'bg-red-500/20 text-red-500' : 'bg-primary/20 text-primary'
                                    }`}>
                                        <Truck size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-white uppercase tracking-tighter">Shipment {selectedShipment.id}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[9px] font-black uppercase tracking-widest ${
                                                selectedShipment.risk === 'high' ? 'text-red-500' : 'text-green-500'
                                            }`}>{selectedShipment.status}</span>
                                            <span className="w-1 h-1 bg-slate-700 rounded-full" />
                                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{selectedShipment.arrival}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Origin</p>
                                        <p className="text-xs font-bold text-white flex items-center gap-1">
                                            <MapPin size={10} className="text-primary" />
                                            {selectedShipment.origin}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Destination</p>
                                        <p className="text-xs font-bold text-white flex items-center gap-1">
                                            <ArrowRight size={10} className="text-primary" />
                                            {selectedShipment.destination}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-4 bg-white/5 rounded-2xl space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Delay Risk</span>
                                        <span className={`text-xs font-black ${
                                            selectedShipment.risk === 'high' ? 'text-red-500' : 'text-green-500'
                                        }`}>{selectedShipment.delayProb}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: selectedShipment.delayProb }}
                                            className={`h-full ${selectedShipment.risk === 'high' ? 'bg-red-500' : 'bg-primary'}`}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Possible Cause</p>
                                    <p className="text-xs font-medium text-slate-300 leading-relaxed">{selectedShipment.cause}</p>
                                </div>

                                <button className="w-full py-3 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-xl hover:shadow-glow transition-all flex items-center justify-center gap-2">
                                    Take Recommended Action
                                </button>
                            </div>
                        </motion.div>
                    </Popup>
                )}
            </Map>

            {/* Custom Styling for Mapbox Popups to make them transparent/glassmorphism */}
            <style>{`
                .mapboxgl-popup-content {
                    background: transparent !important;
                    padding: 0 !important;
                    border-radius: 2rem !important;
                    box-shadow: none !important;
                }
                .mapboxgl-popup-tip {
                    display: none !important;
                }
                .custom-popup {
                    z-index: 100 !important;
                }
            `}</style>
        </div>
    );
};

export default LiveTrackingMap;
