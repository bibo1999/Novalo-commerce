import { useEffect } from 'react';

/**
 * @param {string} bgColor 
 * @param {string} title 
 */
export function useTheme(bgColor = "#ffffff", title = "Novalo") {
    useEffect(() => {
        
        const previousColor = document.body.style.backgroundColor;
        
        
        document.body.style.backgroundColor = bgColor;
        document.title = title;

        
        return () => {
            document.body.style.backgroundColor = previousColor;
        };
    }, [bgColor, title]); 
}