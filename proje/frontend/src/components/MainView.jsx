import CourseView from './CourseView';
import { useMetaMask } from 'metamask-react';
import { useEffect } from 'react';

function MainView() {
  const { status, connect, account, chainId, addChain } = useMetaMask();

  const mumbaiChainNetworkParams = {
    chainId: '0x13881',
    chainName: 'Mumbai Testnet',
    rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
  };

  // Switch to mumbai network
  useEffect(() => {
    if (status === 'connected' && chainId !== 80001) {
      addChain(mumbaiChainNetworkParams);
    }
  }, [account, chainId]);

  const accountRender = () => {
    if (status === 'initializing')
      return <div>Synchronisation with MetaMask ongoing...</div>;

    if (status === 'unavailable') return <div>MetaMask not available :(</div>;

    if (status === 'notConnected')
      return (
        <button className="btn btn-primary" onClick={connect}>
          Connect to MetaMask
        </button>
      );

    if (status === 'connecting') return <div>Connecting...</div>;

    if (status === 'connected')
      return (
        <div>
          {/* Connected account {account} on chain ID {chainId} */}
          <CourseView />
        </div>
      );

    return null;
  };

  return (
    <div className="container" style={{ paddingTop: '50px' }}>
      <center>{accountRender()}</center>
    </div>
  );
}

export default MainView;
