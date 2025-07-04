// Theme toggle functionality
(function() {
    'use strict';
    
    // Get theme preference from localStorage or default to 'light'
    function getThemePreference() {
        if (typeof(Storage) !== "undefined") {
            return localStorage.getItem('theme') || 'light';
        }
        return 'light';
    }
    
    // Set theme preference in localStorage
    function setThemePreference(theme) {
        if (typeof(Storage) !== "undefined") {
            localStorage.setItem('theme', theme);
        }
    }
    
    // Apply theme to document
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        updateThemeToggleIcon(theme);
    }
    
    // Update the theme toggle button icon
    function updateThemeToggleIcon(theme) {
        const toggleIcon = document.querySelector('.theme-toggle-icon');
        if (toggleIcon) {
            toggleIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }
    
    // Toggle between light and dark themes
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        applyTheme(newTheme);
        setThemePreference(newTheme);
    }
    
    // Initialize theme on page load
    function initTheme() {
        const savedTheme = getThemePreference();
        
        // // Check if user prefers dark mode (if no saved preference)
        // if (savedTheme === 'light' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        //     applyTheme('dark');
        //     setThemePreference('dark');
        // } else {
        //     applyTheme(savedTheme);
        // }

        if (savedTheme) {
            applyTheme(savedTheme);
        }
         
        // Listen for system theme changes
        // if (window.matchMedia) {
        //     window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        //         // Only auto-switch if user hasn't manually set a preference
        //         const currentTheme = getThemePreference();
        //         if (currentTheme === 'light' || currentTheme === 'dark') {
        //             // User has a preference, don't auto-switch
        //             return;
        //         }
                
        //         const newTheme = e.matches ? 'dark' : 'light';
        //         applyTheme(newTheme);
        //     });
        // }
    }

    initTheme();

    document.addEventListener('DOMContentLoaded', function() {
        // Add event listener to theme toggle button
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
    });
    
    // // Initialize when DOM is ready
    // if (document.readyState === 'loading') {
    //     document.addEventListener('DOMContentLoaded', initTheme);
    // } else {
    //     initTheme();
    // }
})();