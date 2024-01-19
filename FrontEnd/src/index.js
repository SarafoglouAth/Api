import React from 'react';
import ReactDOM from 'react-dom/client';
import {PrimeReactProvider} from "primereact/api";
import Nav from "../src/Nav/Nav"
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.css";                  //core css
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <PrimeReactProvider>
        <App />
    </PrimeReactProvider>
);