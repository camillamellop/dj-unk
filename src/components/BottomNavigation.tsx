

import { 
  Home, 
  Calendar, 
  DollarSign, 
  CheckSquare, 
  Palette, 
  Heart, 
  User, 
  Music,
  Play 
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const navigationItems = [
  { 
    id: 'unk',
    icon: Music, 
    label: "UNK", 
    path: "/unk",
    color: 'from-purple-500 to-purple-600',
    activeColor: 'text-purple-400',
    bgActive: 'bg-purple-500/20'
  },
  { 
    id: 'branding',
    icon: Palette, 
    label: "Branding", 
    path: "/branding",
    color: 'from-blue-500 to-blue-600',
    activeColor: 'text-blue-400', 
    bgActive: 'bg-blue-500/20'
  },
  { 
    id: 'unkash',
    icon: DollarSign, 
    label: "Unkash", 
    path: "/unkash",
    color: 'from-green-500 to-green-600',
    activeColor: 'text-green-400',
    bgActive: 'bg-green-500/20'
  },
  { 
    id: 'home',
    icon: Play, 
    label: "Home", 
    path: "/",
    color: 'from-cyan-500 to-purple-500',
    activeColor: 'text-cyan-400',
    bgActive: 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20',
    isCenter: true
  },
  { 
    id: 'selfcare',
    icon: Heart, 
    label: "SelfCare", 
    path: "/selfcare",
    color: 'from-pink-500 to-red-500',
    activeColor: 'text-pink-400',
    bgActive: 'bg-pink-500/20'
  },
  { 
    id: 'agenda',
    icon: Calendar, 
    label: "Agenda", 
    path: "/agenda",
    color: 'from-orange-500 to-yellow-500',
    activeColor: 'text-orange-400',
    bgActive: 'bg-orange-500/20'
  },
  { 
    id: 'projetos',
    icon: CheckSquare, 
    label: "Projetos", 
    path: "/projetos",
    color: 'from-emerald-500 to-teal-500',
    activeColor: 'text-emerald-400',
    bgActive: 'bg-emerald-500/20'
  }
];

export default function BottomNavigation() {
  const location = useLocation();

  const handleTabPress = (path: string) => {
    // Haptic feedback simulation
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/30 backdrop-blur-lg border-t border-white/10 z-50">
      <div className="px-2 py-3">
        {/* Navigation Items Container */}
        <div className="flex items-center justify-center space-x-1 overflow-x-auto scrollbar-hide">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const isCenter = item.isCenter;
            
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => handleTabPress(item.path)}
                className={cn(
                  "relative flex flex-col items-center justify-center rounded-2xl transition-all duration-300 active:scale-95 touch-manipulation",
                  isCenter ? "w-16 h-16 mx-2" : "w-14 h-14",
                  isActive ? 
                    `${item.bgActive} border border-white/20 shadow-lg` : 
                    "bg-white/5 hover:bg-white/10 border border-white/5"
                )}
                style={{
                  minWidth: isCenter ? '64px' : '56px',
                  WebkitTapHighlightColor: 'transparent'
                }}
              >
                {/* Background Glow Effect for Active */}
                {isActive && (
                  <div className={cn(
                    "absolute inset-0 rounded-2xl opacity-20 blur-sm",
                    `bg-gradient-to-r ${item.color}`
                  )}></div>
                )}
                
                {/* Icon */}
                <div className="relative z-10 flex flex-col items-center">
                  <Icon 
                    className={cn(
                      "transition-all duration-300",
                      isCenter ? "w-7 h-7" : "w-5 h-5",
                      isActive ? item.activeColor : "text-gray-400"
                    )} 
                  />
                  
                  {/* Label */}
                  <span className={cn(
                    "text-xs font-medium mt-0.5 transition-all duration-300",
                    isCenter ? "text-[10px]" : "text-[9px]",
                    isActive ? item.activeColor : "text-gray-500"
                  )}>
                    {item.label}
                  </span>
                </div>

                {/* Active Indicator Dot */}
                {isActive && !isCenter && (
                  <div className={cn(
                    "absolute -top-1 -right-1 w-2 h-2 rounded-full animate-pulse",
                    item.color.replace('from-', 'bg-').split(' ')[0]
                  )}>
                    <div className="w-full h-full rounded-full"></div>
                  </div>
                )}

                {/* Center Home Special Effect */}
                {isCenter && isActive && (
                  <>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse"></div>
                    <div className="absolute -inset-1 rounded-2xl border border-gradient-to-r from-cyan-500/30 to-purple-500/30"></div>
                  </>
                )}
              </Link>
            );
          })}
        </div>
        
        {/* Safe Area Bottom Padding */}
        <div className="h-safe-area-inset-bottom"></div>
      </div>
      
    </div>
  );
}
