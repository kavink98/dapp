import 'regenerator-runtime/runtime';
import React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';


import { FormComponent, Home, ProjectList } from './ui-components';
import { BrowserRouter } from 'react-router-dom';


export default function App({ isSignedIn, contractId, wallet }) {

  const pages = [{
    name: 'View Projects',
    path: '/view-projects'
  },
  {
    name: 'Create Projects',
    path: '/create-project'
  },];

  const [valueFromBlockchain, setValueFromBlockchain] = React.useState();

  const [uiPleaseWait, setUiPleaseWait] = React.useState(true);

  // Get blockchian state once on component load
  React.useEffect(() => {
    getGreeting()
      .then(setValueFromBlockchain)
      .catch(alert)
      .finally(() => {
        setUiPleaseWait(false);
      });
  }
    , []);

  return (
    <>
    <BrowserRouter>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              InRoad
            </Typography>
            <Typography
              variant="h5"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              InRoad
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  component={Link}
                  key={page.name}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                  to={page.path}
                >
                  {page.name}
                </Button>
              ))}
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              {isSignedIn ? (
                <Button
                  sx={{ my: 2, color: 'white', display: 'block', p: 0 }}
                  onClick={() => wallet.signOut()}
                >
                  LOGOUT
                </Button>
              ) : (
                <Button
                  sx={{ my: 2, color: 'white', display: 'block', p: 0 }}
                  onClick={() => wallet.signIn()}
                >
                  LOGIN
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/view-projects' element={<ProjectList contractId={contractId} wallet={wallet}/>} />
        <Route path='/create-project' element={<FormComponent isSignedIn={isSignedIn} contractId={contractId} wallet={wallet} />}/>
      </Routes>
      </BrowserRouter>
    </>
  )

  function changeGreeting(e) {
    e.preventDefault();
    setUiPleaseWait(true);
    const { greetingInput } = e.target.elements;

    // use the wallet to send the greeting to the contract
    wallet.callMethod({ method: 'set_greeting', args: { message: greetingInput.value }, contractId })
      .then(async () => { return getGreeting(); })
      .then(setValueFromBlockchain)
      .finally(() => {
        setUiPleaseWait(false);
      });
  }

  function getGreeting() {
    // use the wallet to query the contract's greeting
    return wallet.viewMethod({ method: 'view_contracts', contractId })
  }


  // return (
  //   <>
  //     <SignOutButton accountId={wallet.accountId} onClick={() => wallet.signOut()} />
  //     <main className={uiPleaseWait ? 'please-wait' : ''}>
  //       <h1>
  //         The contract says: <span className="greeting">{valueFromBlockchain}</span>
  //       </h1>
  //       <form onSubmit={changeGreeting} className="change">
  //         <label>Change greeting:</label>
  //         <div>
  //           <input
  //             autoComplete="off"
  //             defaultValue={valueFromBlockchain}
  //             id="greetingInput"
  //           />
  //           <button>
  //             <span>Save</span>
  //             <div className="loader"></div>
  //           </button>
  //         </div>
  //       </form>
  //       <EducationalText />
  //     </main>
  //   </>
  // );
}