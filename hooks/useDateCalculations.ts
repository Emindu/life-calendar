
import { useMemo } from 'react';

const getWeekOfYear = (date: Date): number => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

const useDateCalculations = (birthDateStr: string, lifespan: number) => {
  return useMemo(() => {
    const birthDate = new Date(birthDateStr);
    const currentDate = new Date();

    if (isNaN(birthDate.getTime()) || birthDate > currentDate) {
      const currentYear = currentDate.getFullYear();
      const isLeapYear = (year: number) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

      return {
        weeksLived: 0,
        weekOfYear: 0,
        totalWeeks: 0,
        ageInYears: 0,
        weeksRemaining: 0,
        dayOfYear: 0,
        daysInYear: isLeapYear(currentYear) ? 366 : 365,
        isValid: false,
      };
    }

    const diffMilliseconds = currentDate.getTime() - birthDate.getTime();
    const diffDays = diffMilliseconds / (1000 * 60 * 60 * 24);
    
    const weeksLived = Math.floor(diffDays / 7);
    const ageInYears = Math.floor(diffDays / 365.25);
    const weekOfYear = getWeekOfYear(currentDate);

    const totalWeeks = lifespan * 52;
    const weeksRemaining = totalWeeks > weeksLived ? totalWeeks - weeksLived : 0;

    const currentYear = currentDate.getFullYear();
    const isLeapYear = (year: number) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const daysInYear = isLeapYear(currentYear) ? 366 : 365;
    const startOfYear = new Date(currentYear, 0, 1);
    const dayOfYear = Math.floor((currentDate.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    return {
      weeksLived,
      weekOfYear,
      totalWeeks,
      ageInYears,
      weeksRemaining,
      dayOfYear,
      daysInYear,
      isValid: true,
    };
  }, [birthDateStr, lifespan]);
};

export default useDateCalculations;
