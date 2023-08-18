@echo off

SET CONTRACT_DIRECTORY=..\\contract
SET DEV_ACCOUNT_FILE=%CONTRACT_DIRECTORY%\\neardev\\dev-account.env

IF EXIST %DEV_ACCOUNT_FILE% (
  echo The app is starting!
  env-cmd -f %DEV_ACCOUNT_FILE% parcel index.html --open
) ELSE (
  echo ======================================================
  echo It looks like you didn't deploy your contract
  echo >> Run 'npm run deploy' from the your project's root directory
  echo This frontend template works with contracts deployed to NEAR TestNet
  echo ======================================================
)
