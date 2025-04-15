import { motion } from "framer-motion";
import { cn } from "../lib/utils"

interface MessageCardProps {
  name: string;
  content: string;
  email?: string;
  colorVariant?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'pink';
  isCompact?: boolean;
}

export function MessageCard({ name, content, email, colorVariant = 'blue', isCompact = false }: MessageCardProps) {
  const bgColors = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    yellow: 'bg-yellow-50',
    red: 'bg-red-50',
    purple: 'bg-purple-50',
    pink: 'bg-pink-50',
  };

  const avatarColors = {
    blue: 'bg-gradient-to-br from-blue-400 to-blue-600',
    green: 'bg-gradient-to-br from-green-400 to-green-600',
    yellow: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
    red: 'bg-gradient-to-br from-red-400 to-red-600',
    purple: 'bg-gradient-to-br from-purple-400 to-purple-600',
    pink: 'bg-gradient-to-br from-pink-400 to-pink-600',
  };

  return (
    <div 
      className={cn(
        "rounded-xl border border-gray-200 p-4 shadow-sm mx-2 min-w-[280px] max-w-[340px] overflow-hidden bg-white",
        isCompact ? "my-1" : "my-2"
      )}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base",
            avatarColors[colorVariant]
          )}>
            {name ? name[0].toUpperCase() : "?"}
          </div>
          <div>
            <h3 className="font-medium text-gray-800">
              {name}
            </h3>
            {email && (
              <p className="text-xs text-gray-500 flex items-center gap-1 truncate max-w-[200px]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                {email}
              </p>
            )}
          </div>
        </div>
        <p className={cn(
          "text-gray-700 line-clamp-2 min-h-[48px]"
        )}>
          {content}
        </p>
      </div>
    </div>
  );
} 