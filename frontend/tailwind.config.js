/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,jsx, js}'],
    theme: {
        extend: {
            colors: {
                primary: '#0D6EFD',
                secondary: '#E5F1FF',
                green: '#00B517',
                baseGreen: '#C3FFCB',
                orange: '#FF9017',
                baseOrange: '#FFE5BF',
                red: '#FF1654',
                baseRed: '#FFE3E3',
                dark: '#1C1C1C',
                dust: '#FFF0DF',
                grey: {
                    800: '#606060',
                    600: '#505050',
                    500: '#8B96A5',
                    400: '#BDC4CD',
                    300: '#DEE2E7',
                    200: '#EFF2F4',
                    100: '#F7FAFC',
                },
                white: '#FFFFFF',
                colorText: '#2d2d2d',
            },
            fontFamily: {
                body: ['futura-pt, sans-serif'],
                price: [
                    'Helvetica Neue',
                    'Helvetica',
                    'Arial',
                    'Nimbus Sans L',
                    'Nimbus Sans D OT',
                    'Liberation Sans',
                    'sans-serif',
                ],
            },
            borderColor: {
                custom: 'rgba(22, 24, 35, 0.12)',
            },
        },
    },
    plugins: [],
};
