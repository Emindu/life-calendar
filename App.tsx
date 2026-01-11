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
  const [apiMode, setApiMode] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setApiMode(params.get('api'));
  }, []);

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

  if (apiMode === 'day-progress-eink') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <DayProgressWallpaperGenerator 
            dayOfYear={dayOfYear} 
            daysInYear={daysInYear} 
            initialTheme="eink" 
            hideUI={true} 
            autoDownload={true}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-2 md:p-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-3 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Memento Mori
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Life in Perspectives</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-4 gap-3 items-start">
          <div className="lg:col-span-1 space-y-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="bg-white border border-slate-200 p-3 sm:p-4 rounded-lg shadow-sm">
              <h2 className="text-sm font-bold mb-2 text-slate-900 uppercase tracking-wider">Config</h2>
              <div className="space-y-2">
                <div>
                  <label htmlFor="birthdate" className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">
                    Birth Date
                  </label>
                  <input
                    id="birthdate"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs text-slate-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
                <div>
                  <label htmlFor="lifespan" className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">
                    Target Age
                  </label>
                  <input
                    id="lifespan"
                    type="number"
                    value={lifespan}
                    onChange={(e) => setLifespan(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs text-slate-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                    min="1"
                    max="120"
                  />
                </div>
              </div>

              {isValid && (
                <div className="mt-2 pt-2 border-t border-slate-100">
                  <div className="space-y-0.5">
                    <StatCard label="Age" value={`${ageInYears}y`} />
                    <StatCard label="Lived" value={weeksLived.toLocaleString()} />
                    <StatCard label="Left" value={weeksRemaining.toLocaleString()} />
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-white border border-slate-200 p-3 sm:p-4 rounded-lg shadow-sm">
              <h2 className="text-sm font-bold mb-2 text-slate-900 uppercase tracking-wider">Year Progress</h2>
              {isValid ? (
                  <>
                    <YearProgress weekOfYear={weekOfYear} />
                     <button
                        onClick={() => setYearProgressModalOpen(true)}
                        className="mt-2 bg-slate-800 hover:bg-black text-white font-bold py-1.5 px-3 rounded text-[10px] w-full transition-colors uppercase"
                    >
                        Wallpaper
                    </button>
                  </>
              ) : (
                <p className="text-slate-400 text-xs italic">Enter birth date.</p>
              )}
            </div>

            <div className="bg-white border border-slate-200 p-3 sm:p-4 rounded-lg shadow-sm">
              <h2 className="text-sm font-bold mb-2 text-slate-900 uppercase tracking-wider">Day View</h2>
              {isValid ? (
                <>
                  <DayProgress dayOfYear={dayOfYear} daysInYear={daysInYear} />
                  <div className="mt-2">
                      <button
                          onClick={() => setDayProgressModalOpen(true)}
                          className="bg-slate-800 hover:bg-black text-white font-bold py-1.5 px-3 rounded text-[10px] w-full transition-colors uppercase"
                      >
                          iPhone Wallpaper
                      </button>
                  </div>
                </>
              ) : (
                <p className="text-slate-400 text-xs italic">Enter birth date.</p>
              )}
            </div>
          </div>

          <div className="lg:col-span-3 bg-white border border-slate-200 p-3 sm:p-4 rounded-lg shadow-sm animate-fade-in flex flex-col" style={{ animationDelay: '0.4s' }}>
             <h2 className="text-base font-bold mb-3 text-slate-900 text-center uppercase tracking-widest">Life Calendar</h2>
            {isValid ? (
              <div className="overflow-visible flex-grow flex justify-center py-1">
                <LifeCalendar weeksLived={weeksLived} lifespan={lifespan} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[200px] flex-grow">
                <p className="text-slate-500 text-sm">Enter your birth date to see your life grid.</p>
              </div>
            )}
             {isValid && (
                <div className="mt-4 text-center">
                    <button
                        onClick={() => setWallpaperModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full shadow-lg shadow-blue-100 transition-all hover:scale-105 active:scale-95 text-xs uppercase"
                    >
                        Save Life Wallpaper
                    </button>
                </div>
            )}
          </div>
        </main>

        <footer className="text-center mt-6 text-slate-400 text-[10px] uppercase tracking-tighter">
            <p>Each box is one week. Use your time wisely.</p>
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