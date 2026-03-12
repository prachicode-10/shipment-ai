import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Zap, Navigation } from 'lucide-react';

// Fix for default marker icons in Leaflet with React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom animated pulse marker icon
const createPulseIcon = (color = '#3B82F6') => L.divIcon({
    className: 'custom-pulse-icon',
    html: `<div class="relative flex items-center justify-center">
            <div class="absolute w-8 h-8 rounded-full bg-[${color}] animate-ping opacity-20"></div>
            <div class="w-4 h-4 rounded-full bg-[${color}] border-2 border-white shadow-lg"></div>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
});

const RecenterMap = ({ origin, destination }) => {
    const map = useMap();
    useEffect(() => {
        if (origin && destination) {
            const bounds = L.latLngBounds([origin, destination]);
            map.fitBounds(bounds, { padding: [100, 100], maxZoom: 8 });
        } else if (origin) {
            map.setView(origin, 6);
        } else if (destination) {
            map.setView(destination, 6);
        } else {
            map.setView([20.5937, 78.9629], 5); // India center
        }
    }, [origin, destination, map]);
    return null;
};

const ShipmentMap = ({ origin, destination, risk, path = [] }) => {
    const defaultCenter = [22.5, 78.9]; // Center of India
    
    const riskColor = risk > 0.6 ? '#EF4444' : risk > 0.3 ? '#F59E0B' : '#10B981';

    return (
        <div className="h-full w-full rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl relative group">
            <div className="absolute top-4 left-4 z-[1000] bg-[#111827]/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full animate-pulse`} style={{ backgroundColor: riskColor }}></div>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">
                    {risk > 0.6 ? 'High Risk Path' : 'Optimal Route'} Detected
                </span>
            </div>

            <MapContainer 
                center={defaultCenter} 
                zoom={5} 
                style={{ height: '100%', width: '100%', background: '#0B1220' }}
                zoomControl={false}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                
                {origin && (
                    <Marker position={origin} icon={createPulseIcon('#3B82F6')}>
                        <Popup className="custom-popup">
                            <div className="p-2 font-sans font-bold text-slate-900 uppercase text-[10px]">Origin Point</div>
                        </Popup>
                    </Marker>
                )}

                {destination && (
                    <Marker position={destination} icon={createPulseIcon(riskColor)}>
                        <Popup className="custom-popup">
                            <div className="p-2 font-sans font-bold text-slate-900 uppercase text-[10px]">Destination Point</div>
                        </Popup>
                    </Marker>
                )}

                {origin && destination && (
                    <Polyline 
                        positions={[origin, destination]} 
                        pathOptions={{ 
                            color: riskColor, 
                            weight: 4, 
                            dashArray: '10, 10',
                            lineCap: 'round',
                            opacity: 0.8
                        }} 
                    />
                )}

                <RecenterMap origin={origin} destination={destination} />
            </MapContainer>

            {/* Subtle Map Overlay */}
            <div className="absolute inset-0 pointer-events-none border-[12px] border-[#111827] rounded-[2rem] z-[999] opacity-50 shadow-inner"></div>
        </div>
    );
};

export default ShipmentMap;
