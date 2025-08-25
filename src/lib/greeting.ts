import { Sun, Sunset, Moon } from 'lucide-react';

export const getGreeting = () => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return {
      greeting: 'Bom dia',
      icon: Sun,
      color: 'text-yellow-400'
    };
  } else if (hour >= 12 && hour < 18) {
    return {
      greeting: 'Boa tarde',
      icon: Sun,
      color: 'text-orange-400'
    };
  } else {
    return {
      greeting: 'Boa noite',
      icon: Moon,
      color: 'text-purple-400'
    };
  }
};

export const getAnimatedColors = () => {
  const colors = [
    'from-purple-400 to-pink-400',
    'from-cyan-400 to-blue-400', 
    'from-green-400 to-teal-400',
    'from-orange-400 to-red-400',
    'from-indigo-400 to-purple-400'
  ];
  
  return colors[Math.floor(Date.now() / 5000) % colors.length];
};