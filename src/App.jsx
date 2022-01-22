import React, {useState, useEffect} from 'react';
import {ethers} from 'ethers';

import "./App.css";

const App = () => {

    const [metamaskAdr, setMetamaskAdr] = useState(null);
    const [connectionError, setConnectionError] = useState(null);
    const [currentBalance, setCurrentBalance] = useState(0);
    const [amount, setAmount] = useState(0); 
    const [receiver, setReceiver] = useState(''); 
    
    useEffect(() => {
    if(window.ethereum){
        const getAccs = async() => {
            const [account] = await window.ethereum.request({method:'eth_accounts'})
            setMetamaskAdr(account);
        }
        getAccs()
        window.ethereum.on('accountsChanged', (accounts) => {
            if (!accounts.length) {
                setMetamaskAdr(null);
            }
        });
        setMetamaskAdr(localStorage.getItem('account'))
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

    const getBalance = async() => {
        if (metamaskAdr && window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const balance = await provider.getBalance(metamaskAdr);
            setCurrentBalance(ethers.utils.formatEther(balance));
        }
    }

    const sendTransaction = async() => {

        const transactionObj = [{
            from: metamaskAdr,
            to: receiver,
            value: ethers.utils.parseEther(amount)._hex,
        }];
        
        const transactionHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: transactionObj
        })
        console.log('transactionHash', transactionHash);
    }

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
                {currentBalance ? <h3> Balance: {Number.parseFloat(currentBalance).toFixed(2)} ETH </h3> : 
                <button onClick = {() => getBalance()}> Balance </button>}
                <div className = 'container__transaction'>
                    <h2>Make a Transaction </h2>
                    <input value = {receiver} onChange ={e => setReceiver(e.target.value)} /> 
                    <input type= 'number' value = {amount} onChange = {(e) => setAmount(e.target.value)} /> 
                    <button onClick = {()=> sendTransaction()}> Send Transaction </button>
                </div>
            </>}
            {connectionError && <h3 className = 'container__error'> {connectionError}</h3>}
        </div>
    )
};

export default App;
