import { format, parseISO } from 'date-fns';

// Format a date string with the specified format
export const formatDate = (dateString: string, formatString: string = 'MMM d, yyyy'): string => {
  try {
    return format(parseISO(dateString), formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

// Format a date and time string
export const formatDateTime = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'MMM d, yyyy, h:mm a');
  } catch (error) {
    console.error('Error formatting date time:', error);
    return 'Invalid date';
  }
};

// Truncate text to a specified length
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

// Convert employer revenue to a formatted string
export const formatRevenue = (revenue: number | null): string => {
  if (!revenue) return 'N/A';
  
  if (revenue >= 1_000_000_000) {
    return `$${(revenue / 1_000_000_000).toFixed(1)}B`;
  } else if (revenue >= 1_000_000) {
    return `$${(revenue / 1_000_000).toFixed(1)}M`;
  } else if (revenue >= 1_000) {
    return `$${(revenue / 1_000).toFixed(1)}K`;
  } else {
    return `$${revenue}`;
  }
};

// Generate initials from a name
export const getInitials = (name: string): string => {
  if (!name) return '';
  
  const parts = name.split(' ').filter(part => part.length > 0);
  
  if (parts.length === 0) return '';
  
  if (parts.length === 1) {
    // For single names, take the first two letters of the name
    return parts[0].substring(0, 2).toUpperCase();
  }
  
  // For multiple names, take first letter of first and first letter of last
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Get random color based on string (for avatar backgrounds, etc.)
export const getRandomColor = (str: string): string => {
  const colors = [
    'bg-blue-500',
    'bg-emerald-500',
    'bg-indigo-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-orange-500',
    'bg-teal-500',
    'bg-amber-500',
  ];
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Take absolute value and mod with colors length
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};