import { createTheme } from '@mui/material/styles';

export const customColors = {
  primary: {
    main: '#0086E0',
    accentBlue: '#3B82F6',
    mainHover: '#3b83f61a',
    backgroundLight: '#FAFBFC',
    white: '#FFFFFF',
    text: '#323b47ff',
  },
  cards: {
    salesPink: '#FCA5A5',
    ordersYellow: '#FCD34D',
    productsGreen: '#6EE7B7',
    customersPurple: '#C4B5FD',
  },
  charts: {
    loyalCustomers: '#10B981',
    newCustomers: '#EF4444',
    uniqueCustomers: '#8B5CF6',
    warningCustomers: '#FACC15', // ← жёлтый (мягкий, яркий, но не кислотный)
  },
  mapRegions: {
    usa: '#F87171',
    india: '#22D3EE',
    china: '#A78BFA',
    europe: '#34D399',
  },
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08), 0px 2px 4px rgba(0, 0, 0, 0.06)',
};

const theme = createTheme({
  typography: {
    fontFamily: `'Montserrat', sans-serif`,
    color: customColors.primary.text,
  },
  palette: {
    primary: {
      main: customColors.primary.main,
      contrastText: '#fff',
    },
    secondary: {
      main: customColors.primary.accentBlue,
    },
    success: {
      main: customColors.charts.loyalCustomers,
    },
    error: {
      main: customColors.charts.newCustomers,
    },
    info: {
      main: customColors.charts.uniqueCustomers,
    },
    text: {
      primary: customColors.primary.text,
    },
    custom: {
      card: {
        sales: customColors.cards.salesPink,
        orders: customColors.cards.ordersYellow,
        products: customColors.cards.productsGreen,
        customers: customColors.cards.customersmain,
      },
      map: customColors.mapRegions,
    },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          color: customColors.primary.text,
          fontWeight: '500',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
        },
      },
    },
  },
});

export default theme;
