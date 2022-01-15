import { render } from 'solid-js/web';
import { createSignal } from 'solid-js';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

import './styles/globals.css';

const App = () => {
  const [account, setAccount] = createSignal('');
  const [loggedIn, setLoggedIn] = createSignal(false);

  async function getWeb3Modal() {
    let Torus = (await import('@toruslabs/torus-embed')).default;
    const web3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: false,
      disableInjectedProvider: false,
      providerOptions: {
        torus: {
          package: Torus,
        },
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: '37f70fbe416a47ceaa90a78abdfd5b72',
          },
        },
      },
    });
    return web3Modal;
  }

  async function connect() {
    const web3Modal = await getWeb3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const accounts = await provider.listAccounts();
    setAccount(accounts[0]);
    setLoggedIn(true);
  }

  return (
    <>
      <button onClick={connect}> Connect Wallet</button>
      {loggedIn && <h1>Welcome, {account}</h1>}
    </>
  );
};

render(App, document.getElementById('app'));
