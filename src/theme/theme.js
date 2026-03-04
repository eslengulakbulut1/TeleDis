export const colors = {
    primary: '#E30613',
    primaryDark: '#C40010',
    success: '#28A745',
    warning: '#FFC107',
    error: '#DC3545',

    light: {
        background: '#F7F8FA',
        card: '#FFFFFF',
        text: '#1C1C1E',
        textSecondary: '#8E8E93',
        border: '#E5E5EA',
        inputBackground: '#F2F2F7',
    },
    dark: {
        background: '#121212',
        card: '#1E1E1E',
        text: '#FFFFFF',
        textSecondary: '#EBEBF599',
        border: '#38383A',
        inputBackground: '#2C2C2E',
    }
};

export const typography = {
    h1: { fontSize: 32, fontWeight: 'bold' },
    h2: { fontSize: 24, fontWeight: 'bold' },
    h3: { fontSize: 20, fontWeight: '600' },
    body1: { fontSize: 16, fontWeight: 'normal' },
    body2: { fontSize: 14, fontWeight: 'normal' },
    caption: { fontSize: 12, fontWeight: 'normal', color: colors.light.textSecondary },
};

export const spacing = {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
};

export const borderRadius = {
    s: 8,
    m: 12,
    l: 20,
    xl: 30,
};

export const shadows = {
    light: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    dark: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
};

export const getTheme = (isDark = false) => {
    return {
        colors: {
            primary: colors.primary,
            primaryDark: colors.primaryDark,
            success: colors.success,
            warning: colors.warning,
            error: colors.error,
            background: isDark ? colors.dark.background : colors.light.background,
            card: isDark ? colors.dark.card : colors.light.card,
            text: isDark ? colors.dark.text : colors.light.text,
            textSecondary: isDark ? colors.dark.textSecondary : colors.light.textSecondary,
            border: isDark ? colors.dark.border : colors.light.border,
            inputBackground: isDark ? colors.dark.inputBackground : colors.light.inputBackground,
        },
        typography,
        spacing,
        borderRadius,
        shadows: isDark ? shadows.dark : shadows.light,
        isDark,
    };
};
