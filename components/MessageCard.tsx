import { motion } from "framer-motion";
import { cn } from "../lib/utils"

interface MessageCardProps {
  name: string;
  content: string;
  email?: string;
  colorVariant?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'pink';
  isCompact?: boolean;
  id?: string;
  onClick?: () => void;
}

export function MessageCard({ name, content, email, colorVariant = 'blue', isCompact = false, id, onClick }: MessageCardProps) {
  const bgColors = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    yellow: 'bg-yellow-50',
    red: 'bg-red-50',
    purple: 'bg-purple-50',
    pink: 'bg-pink-50',
  };

  const avatarColors = {
    blue: 'bg-gradient-to-br from-blue-400 to-indigo-600',
    green: 'bg-gradient-to-br from-emerald-400 to-teal-600',
    yellow: 'bg-gradient-to-br from-amber-300 to-orange-500',
    red: 'bg-gradient-to-br from-rose-400 to-red-600',
    purple: 'bg-gradient-to-br from-violet-400 to-purple-600',
    pink: 'bg-gradient-to-br from-pink-400 to-fuchsia-600',
  };

  return (
    <div 
      className={cn(
        "rounded-2xl border border-gray-200 p-5 shadow-sm mx-2 min-w-[240px] max-w-[340px] w-[320px] overflow-hidden bg-white hover:border-gray-300",
        isCompact ? "my-1" : "my-2",
        onClick ? "cursor-pointer hover:bg-gray-50 hover:shadow-md transition-all duration-300" : ""
      )}
      onClick={onClick}
      id={id}
    >
      <div className="flex flex-col gap-4 w-full overflow-hidden">
        <div className="flex items-center gap-3 w-full">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base shadow-md ring-2 ring-white flex-shrink-0",
            avatarColors[colorVariant]
          )}>
            {name ? name[0].toUpperCase() : "?"}
          </div>
          <div className="flex-grow min-w-0 overflow-hidden">
            <h3 className="font-semibold text-gray-800 tracking-tight truncate">
              {name}
            </h3>
            {email && (
              <p className="text-xs text-gray-500 flex items-center gap-1 truncate max-w-[150px] mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <span className="truncate">{email}</span>
              </p>
            )}
          </div>
        </div>
        <p className={cn(
          "text-gray-700 line-clamp-3 min-h-[48px] break-all leading-relaxed w-full overflow-hidden text-justify"
        )}>
          {content}
        </p>
      </div>
    </div>
  );
} 