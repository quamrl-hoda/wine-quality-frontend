import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

import { Navbar, Footer } from '@/components/layout'
import {
  Hero,
  About,
  HowItWorks,
  PredictionForm,
  Contact,
  FAQ
} from '@/components/sections'
import { PredictionPage } from '@/pages/PredictionPage'
import { ToastProvider } from '@/components/ui'

// Professional MUI theme - Matte Black + Wine Red + Gold
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#D4AF37', // Gold accent
      light: '#E5C45C',
      dark: '#B08F2A',
    },
    secondary: {
      main: '#7A1020', // Wine red
      light: '#A8213E',
      dark: '#5C0C18',
    },
    background: {
      default: '#0F0F0F', // Matte black
      paper: '#1C1C1C',   // Dark gray
    },
    text: {
      primary: '#EDEDED',   // Soft white
      secondary: '#A3A3A3', // Muted gray
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
    h1: {
      fontFamily: '"Playfair Display", Georgia, serif',
    },
    h2: {
      fontFamily: '"Playfair Display", Georgia, serif',
    },
    h3: {
      fontFamily: '"Playfair Display", Georgia, serif',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#1C1C1C',
          color: '#EDEDED',
          border: '1px solid rgba(212, 175, 55, 0.15)',
          borderRadius: '10px',
          fontSize: '0.8125rem',
          padding: '10px 14px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
        },
        arrow: {
          color: '#1C1C1C',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0F0F0F',
          borderLeft: '1px solid rgba(212, 175, 55, 0.1)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          backgroundColor: '#1C1C1C',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '10px',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(212, 175, 55, 0.1)',
          color: '#D4AF37',
          borderRadius: '6px',
        },
      },
    },
  },
})

const App: React.FC = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <ToastProvider>
        <BrowserRouter>
          <div className="min-h-screen" style={{ backgroundColor: '#0F0F0F' }}>
            {/* Navigation */}
            <Navbar />

            {/* Routes */}
            <Routes>
              {/* Home Page */}
              <Route path="/" element={
                <main>
                  <Hero />
                  <About />
                  <HowItWorks />
                  <PredictionForm />
                  <FAQ />
                  <Contact />
                </main>
              } />

              {/* Prediction Results Page */}
              <Route path="/prediction" element={<PredictionPage />} />
            </Routes>

            {/* Footer */}
            <Footer />
          </div>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
