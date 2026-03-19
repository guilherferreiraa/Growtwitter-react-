import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';


const theme = createTheme({
  palette: {
    mode: 'light', 
    primary: {
      main: '#1DA1F2', 
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      {}
      <CssBaseline />
      
      <div>
        <h1>Growtwitter - Em Construção 🚀</h1>
        <p>Próximo passo: Configurar as rotas!</p>
      </div>
    </ThemeProvider>
  );
}

export default App;