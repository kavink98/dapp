import 'regenerator-runtime/runtime';
import React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';


import { EducationalText, SignInPrompt, SignOutButton } from './ui-components';


export default function App({ isSignedIn, contractId, wallet }) {

  const pages = [{
    name: 'View Projects',
    path: '/projects'
  },
  {
    name: 'Pricing',
    path: '/pricing'
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

  /// If user not signed-in with wallet - show prompt
  // if (!isSignedIn) {
  //   // Sign-in flow will reload the page later
  //   return <SignInPrompt greeting={valueFromBlockchain} onClick={() => wallet.signIn()}/>;
  // }
  // 
  return (
    <>
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
              component="a"
              href="/"
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
                  key={page.name}
                  sx={{ my: 2, color: 'white', display: 'block' }}
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
      <SignInPrompt greeting={valueFromBlockchain} onClick={() => wallet.signIn()} />
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