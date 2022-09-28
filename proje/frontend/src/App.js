import NavBar from './components/NavBar';
import CourseView from './components/CourseView';
import { ethers } from 'ethers';
import MainView from './components/MainView';
import { useEffect } from 'react';

const nodeURL = 'https://rpc-mumbai.maticvigil.com/';
const HTTPSProvider = new ethers.providers.JsonRpcProvider(nodeURL);

function App() {
  // const [walletAddress, setWalletAddress] = useState('');
  // const [userBalance, setUserBalance] = useState(null);
  // const [provider, setProvider] = useState(null);
  // const [signer, setSigner] = useState(null);
  // const [contract, setContract] = useState(null);
  // const { status, connect, account, chainId, ethereum } = useMetaMask();

  // useEffect(() => {
  //   const contract = new ethers.Contract(
  //     HEROES_TOKEN_ADDRESS,
  //     HeroesTokenAbi,
  //     HTTPSProvider
  //   );
  //   setContract(contract);
  // }, []);

  // const chainChangedHandler = () => {
  //   // reload the page to avoid any errors with chain change mid use of application
  //   window.location.reload();
  // };
  // // When the metamask account changed we need to update the wallet address
  // const accountChangedHandler = (newAccount) => {
  //   setWalletAddress(newAccount);
  //   getAccountBalance(newAccount.toString(), setUserBalance);
  // };

  // // listen for account changes
  // window.ethereum.on('accountsChanged', accountChangedHandler);
  // window.ethereum.on('chainChanged', chainChangedHandler);

  useEffect(() => {}, []);

  return (
    <div className="App">
      <NavBar />
      <MainView />
    </div>
  );
}

export default App;
