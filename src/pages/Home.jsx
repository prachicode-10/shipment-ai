import React from 'react'
import { motion } from 'framer-motion'
import Hero from '../components/Hero.jsx'
import Features from '../components/Features.jsx'
import DashboardPreview from '../components/DashboardPreview.jsx'
import Pricing from '../components/Pricing.jsx'
import CTA from '../components/CTA.jsx'
import TrustSection from '../components/TrustSection.jsx'
import HowItWorks from '../components/HowItWorks.jsx'
import AIInsights from '../components/AIInsights.jsx'

const Home = () => {
    return (
        <div className="overflow-hidden">
            <Hero />
            <TrustSection />
            <Features />
            <DashboardPreview />
            <HowItWorks />
            <AIInsights />
            <Pricing />
            <CTA />
        </div>
    )
}

export default Home
