import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 合并CSS类名，结合clsx和tailwind-merge的功能
 * @param inputs 一组CSS类名或条件类名
 * @returns 合并后的CSS类名字符串
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
