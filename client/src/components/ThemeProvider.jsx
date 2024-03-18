import React from 'react'
import { useSelector } from 'react-redux';

const ThemeProvider = ({ children }) => {
    const { theme } = useSelector((state) => state.theme)
    return (
        <div className={theme}>
            <main className="bg-white dark:text-gray-200 text-gray-700 dark:bg-[rgb(16,23,42)] min-h-screen">
                {children}
            </main>
        </div>
    )
}

export default ThemeProvider;