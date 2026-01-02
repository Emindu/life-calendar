import React, { useState, useEffect } from 'react';
import LifeCalendar from './components/LifeCalendar';
import YearProgress from './components/YearProgress';
import StatCard from './components/StatCard';
import useDateCalculations from './hooks/useDateCalculations';
import Modal from './components/Modal';
import WallpaperGenerator from './components/WallpaperGenerator';
import YearProgressWallpaperGenerator from './components/YearProgressWallpaperGenerator';
import DayProgress from './components/DayProgress';
import DayProgressWallpaperGenerator from './components/DayProgressWallpaperGenerator';

const App: React.FC = () => {
  const [birthDate, setBirthDate] = useState('1996-01-01');
  const [lifespan, setLifespan] = useState(70);
  const [isWallpaperModalOpen, setWallpaperModalOpen] = useState(false);
  const [isYearProgressModalOpen, setYearProgressModalOpen] = useState(false);
  const [isDayProgressModalOpen, setDayProgressModalOpen] = useState(false);
  const [isApiMode, setIsApiMode] = useState(false);

  const {
    weeksLived,
    weekOfYear,
    totalWeeks,
    ageInYears,
    weeksRemaining,
    dayOfYear,
    daysInYear,
    isValid,
  } = useDateCalculations(birthDate, lifespan);

  // API Detection Logic
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('api') === 'day-progress-eink') {
      setIsApiMode(true);
    }
  }, []);

  // Render "API" Headless Mode
  if (isApiMode && isValid) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mb-6"></div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Generating E-ink Wallpaper...</h1>
        <p className="text-slate-500 mb-8">Your download should start automatically.</p>
        
        {/* Hidden generator that auto-triggers download */}
        <div className="hidden">
          <DayProgressWallpaperGenerator 
            dayOfYear={dayOfYear} 
            daysInYear={daysInYear} 
            initialTheme="eink" 
            autoDownload={true}
          />
        </div>

        <button 
          onClick={() => {
            const url = new URL(window.location.href);
            url.searchParams.delete('api');
            window.location.href = url.pathname;
          }}
          className="text-blue-600 hover:underline font-medium"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Memento Mori
          </h1>
          <p className="mt-2 text-lg text-slate-600">Your Life in Weeks</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 space-y-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-slate-900">Dashboard</h2>
              <div className="space-y-3">
                <div>
                  <label htmlFor="birthdate" className="block text-sm font-medium text-slate-600 mb-1">
                    Your Birth Date
                  </label>
                  <input
                    id="birthdate"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-md p-2 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
                <div>
                  <label htmlFor="lifespan" className="block text-sm font-medium text-slate-600 mb-1">
                    Expected Lifespan
                  </label>
                  <input
                    id="lifespan"
                    type="number"
                    value={lifespan}
                    onChange={(e) => setLifespan(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-white border border-slate-300 rounded-md p-2 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    min="1"
                    max="120"
                  />
                </div>
              </div>

              {isValid && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="space-y-2">
                    <StatCard label="Age" value={`${ageInYears} years`} />
                    <StatCard label="Weeks Lived" value={weeksLived.toLocaleString()} />
                    <StatCard label="Weeks Remaining" value={weeksRemaining.toLocaleString()} />
                    <StatCard label="Total Weeks" value={totalWeeks.toLocaleString()} />
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-900">This Year in Weeks</h2>
              </div>
              {isValid ? (
                  <>
                    <YearProgress weekOfYear={weekOfYear} />
                     <div className="mt-6 text-center">
                        <button
                            onClick={() => setYearProgressModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 text-sm w-full"
                        >
                            Generate Wallpaper
                        </button>
                    </div>
                  </>
              ) : (
                <p className="text-slate-500">Enter a valid birth date to see this year's progress.</p>
              )}
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-slate-900">This Year in Days</h2>
              {isValid ? (
                <>
                  <DayProgress dayOfYear={dayOfYear} daysInYear={daysInYear} />
                  <div className="mt-6 text-center flex flex-col gap-2">
                      <button
                          onClick={() => setDayProgressModalOpen(true)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 text-sm w-full"
                      >
                          Customize Wallpaper
                      </button>
                      <a
                          href="?api=day-progress-eink"
                          className="text-xs text-slate-400 hover:text-slate-600 underline transition-colors"
                      >
                          API Endpoint: Quick E-ink Download
                      </a>
                  </div>
                </>
              ) : (
                <p className="text-slate-500">Enter a valid birth date to see this year's progress.</p>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-slate-200 p-4 sm:p-6 rounded-lg shadow-sm animate-fade-in flex flex-col" style={{ animationDelay: '0.4s' }}>
             <h2 className="text-2xl font-bold mb-4 text-slate-900 text-center">Your Life Calendar</h2>
            {isValid ? (
              <div className="overflow-x-auto flex-grow flex justify-center pt-4">
                <LifeCalendar weeksLived={weeksLived} lifespan={lifespan} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[300px] flex-grow">
                <p className="text-slate-500 text-lg">Please enter a valid birth date to generate your calendar.</p>
              </div>
            )}
             {isValid && (
                <div className="mt-6 text-center">
                    <button
                        onClick={() => setWallpaperModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 w-full max-w-xs mx-auto"
                    >
                        Generate iPhone Wallpaper
                    </button>
                </div>
            )}
          </div>
        </main>

        <footer className="text-center mt-12 text-slate-500 text-sm">
            <p>Each circle represents one week of your life. Reflect on the past and plan for the future.</p>
        </footer>
      </div>

      <Modal isOpen={isWallpaperModalOpen} onClose={() => setWallpaperModalOpen(false)}>
        <WallpaperGenerator weeksLived={weeksLived} lifespan={lifespan} />
      </Modal>

      <Modal isOpen={isYearProgressModalOpen} onClose={() => setYearProgressModalOpen(false)}>
        <YearProgressWallpaperGenerator weekOfYear={weekOfYear} />
      </Modal>

      <Modal isOpen={isDayProgressModalOpen} onClose={() => setDayProgressModalOpen(false)}>
        <DayProgressWallpaperGenerator dayOfYear={dayOfYear} daysInYear={daysInYear} />
      </Modal>
    </div>
  );
};

export default App;