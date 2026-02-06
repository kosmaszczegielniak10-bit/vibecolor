/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy:', err);
        return false;
    }
};

/**
 * Convert RGB object to CSS string
 */
export const rgbToCss = (rgb: { r: number; g: number; b: number }): string => {
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
};

/**
 * Get contrasting text color (black or white) for a background
 */
export const getContrastingTextColor = (hexColor: string): string => {
    // Remove # if present
    const hex = hexColor.replace('#', '');

    // Convert to RGB
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

/**
 * Export palette as CSS variables
 */
export const exportAsCSS = (colors: Array<{ hex: string; name?: string }>): string => {
    const cssVars = colors
        .map((color, index) => {
            const name = color.name?.toLowerCase().replace(/\s+/g, '-') || `color-${index + 1}`;
            return `  --${name}: ${color.hex};`;
        })
        .join('\n');

    return `:root {\n${cssVars}\n}`;
};

/**
 * Export palette as JSON
 */
export const exportAsJSON = (colors: Array<{ hex: string; rgb: any; name?: string }>): string => {
    return JSON.stringify(colors, null, 2);
};

/**
 * Download text as file
 */
export const downloadFile = (content: string, filename: string, mimeType: string = 'text/plain') => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
