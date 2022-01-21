import React, {useState, useEffect} from 'react';
import "./App.css";


const App = () => {
    
    const [metamaskAdr, setMetamaskAdr] = useState(null);
    const [connectionError, setConnectionError] = useState(null);
    useEffect(() => {
    if(window.ethereum){
        window.ethereum.on('accountsChanged', (accounts) => {
            if (!accounts.length) {
                setMetamaskAdr(null);
            }
           
        });
        window.ethereum.on('chainChanged', (chainId) => {
            if(chainId !== '0x3'){
                window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{chainId: '0x3'}]
                });
            }
        });
    }
    },[])

    const handleConnection = async() =>{
        try{
            if(!window.ethereum) throw Error("Metamask not found");
            const [account] = await window.ethereum.request({method:"eth_requestAccounts"});
            await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x3' }],
            });
            setMetamaskAdr(account);
            setConnectionError(null);
        }catch(e){
            setMetamaskAdr(null);
            setConnectionError(e.message);
        }
    }
    
    return (
        <div className = 'container'>
            <h1> Get/Set Contract Interaction</h1>
            {!metamaskAdr ? <button onClick = {() => handleConnection()}>
               Connect Wallet
            </button>
            : 
            <>
            <h3> Address: {metamaskAdr}</h3>
            </>}
            {connectionError && <h3 className = 'container__error'> {connectionError}</h3>}
        </div>
    )
};

export default App;
