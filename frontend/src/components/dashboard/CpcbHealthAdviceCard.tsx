import React, { useState } from 'react';
import { ShieldCheck, Footprints, Home, Stethoscope, Cigarette, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { ForecastData } from '../../types';

interface CpcbHealthAdviceCardProps {
  data: ForecastData;
}

export const CpcbHealthAdviceCard: React.FC<CpcbHealthAdviceCardProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'allergy' | 'breathing' | 'asthma'>('allergy');

  const city = data.city;
  const aqi = data.current_aqi;
  const category = data.predicted_category;

  const cigs = data.cigarette_equivalent || {
    today: roundVal(data.current_aqi / 30),
    days_7: roundVal((data.current_aqi * 7) / 30),
    days_30: roundVal((data.current_aqi * 30) / 30)
  };

  function roundVal(v: number) {
    return Math.round(v * 10) / 10;
  }

  const isHighRisk = aqi > 150 || category === 'Poor' || category === 'Very Poor' || category === 'Severe';

  const tabContents = {
    allergy: {
      title: "Allergy & Sinus Stress",
      description: "AQI spikes often layer on top of pollen or dust, making congestion and sinus pressure harder to shake.",
      symptoms: "Watch first for stuffy nose or facial pressure, postnasal drip or repeated sneezing.",
      helps: [
        "Change clothes after outdoor activity if dust or pollen is sticking.",
        "Use saline nasal spray or rinse to clear particulate matter.",
        "Keep windows shut during peak traffic hours."
      ],
      avoid: [
        "Do not keep bedroom windows open if air quality drops overnight.",
        "Avoid outdoor jogging near industrial zones or dusty roads.",
        "Avoid drying clothes outdoors when pollution peaks."
      ]
    },
    breathing: {
      title: "Breathing Load",
      description: "Inhaling elevated fine particulate matter increases airway resistance and respiratory strain.",
      symptoms: "Watch for rapid shallow breathing, throat tightness, or dry persistent coughing.",
      helps: [
        "Move demanding physical tasks indoors or into filtered spaces.",
        "Run HEPA air purifiers in living and sleeping rooms.",
        "Stay hydrated to help maintain mucosal barrier function."
      ],
      avoid: [
        "Avoid high-intensity outdoor cardio during morning temperature inversion.",
        "Do not use incense sticks or candles inside unventilated rooms.",
        "Avoid heavy vehicle exhaust corridors."
      ]
    },
    asthma: {
      title: "Asthma & Wheeze",
      description: "Pollutants like NO2 and PM2.5 cause bronchial hyper-responsiveness and trigger asthma flares.",
      symptoms: "Watch for wheezing, chest tightness, coughing fits, or difficulty catching breath.",
      helps: [
        "Keep quick-relief rescue inhalers easily accessible at all times.",
        "Wear a fitted N95/FFP2 respirator mask when stepping outdoors.",
        "Check daily AQI forecast before planning outdoor activities."
      ],
      avoid: [
        "Do not delay using prescribed preventer medications.",
        "Avoid exposure to secondhand smoke or wood burning fumes.",
        "Avoid intense outdoor exertion on high AQI days."
      ]
    }
  };

  const currentTab = tabContents[activeTab];

  return (
    <div className="space-y-6">
      
      {/* 1. Health Advice Section Header & Priority Card */}
      <div className="glass-card p-6 md:p-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm">
        
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Health Advice for {city}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalized action recommendations based on real-time ambient particulate exposure
            </p>
          </div>
        </div>

        {/* Priority Banner */}
        <div className={`p-4 rounded-xl border mb-6 ${
          isHighRisk 
            ? 'bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-300' 
            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-200'
        }`}>
          <span className="text-[11px] font-extrabold uppercase tracking-wider block mb-1">
            Today's Priority
          </span>
          <p className="text-sm font-semibold">
            {isHighRisk 
              ? "Move demanding tasks inside and cut down time spent in traffic-heavy corridors." 
              : "Air quality is favorable. Ideal conditions for outdoor activity while carrying standard hydration."}
          </p>
        </div>

        {/* 3 Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1 */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
              <Footprints className="w-4 h-4 shrink-0" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                When you go outside
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Keep outside exposure short, skip exercise in open air during peak traffic, and avoid stacking multiple trips together.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
              <Home className="w-4 h-4 shrink-0" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                At home
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Close windows during worse pollution periods, maintain indoor air filtration, and plan rest windows.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400">
              <Stethoscope className="w-4 h-4 shrink-0" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Symptoms to watch for
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Watch for breathlessness, concentration drop, chest discomfort, eye burn, or worsening chronic symptoms.
            </p>
          </div>

        </div>

      </div>

      {/* 2. Health Risks & Cigarette Exposure Section */}
      <div className="glass-card p-6 md:p-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm space-y-6">
        
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Health Risks in {city}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ambient air impacts across respiratory, allergic, and bronchial health
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Cigarette-equivalent Exposure Widget */}
          <div className="lg:col-span-4 p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex flex-col justify-between space-y-4">
            
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400">
                <Cigarette className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Cigarette-equivalent exposure</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Based on current PM2.5, using Berkeley Earth's estimate that 22 µg/m³ over a day is similar to smoking 1 cigarette.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-200 dark:border-slate-700 text-center">
              <div>
                <span className="text-xs text-slate-400 font-semibold block">Today</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">{cigs.today}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold block">7 days</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">{cigs.days_7}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold block">30 days</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">{cigs.days_30}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-[11px] text-slate-400">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Calculated from real-time fine particulate density</span>
            </div>

          </div>

          {/* Right Column: Health Tabs & Detailed Guidelines */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
              <button
                onClick={() => setActiveTab('allergy')}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'allergy'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Allergy & Sinus Stress
              </button>

              <button
                onClick={() => setActiveTab('breathing')}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'breathing'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Breathing Load
              </button>

              <button
                onClick={() => setActiveTab('asthma')}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'asthma'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Asthma & Wheeze
              </button>
            </div>

            {/* Content for active tab */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-4">
              
              <div>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mb-1">
                  {currentTab.description}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                  {currentTab.symptoms}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                
                {/* Helps Column */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Helps</span>
                  </span>
                  <ul className="space-y-1.5">
                    {currentTab.helps.map((item, idx) => (
                      <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start space-x-2">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Avoid Column */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center space-x-1">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Avoid</span>
                  </span>
                  <ul className="space-y-1.5">
                    {currentTab.avoid.map((item, idx) => (
                      <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start space-x-2">
                        <span className="text-rose-500 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
