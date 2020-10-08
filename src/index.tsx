import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { sp } from '@pnp/sp';
import { runWithAdal } from 'react-adal';
import adalContext from './services/adalConfig';
const DO_NOT_LOGIN = false;

runWithAdal(adalContext.AuthContext, () => {
  adalContext.GetToken()
    .then(token => {
      sp.setup({
        sp: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      });
      
      const rootDiv = document.getElementById('root') as HTMLElement;
      ReactDOM.render(<App />, rootDiv);      
    });
}, DO_NOT_LOGIN);
