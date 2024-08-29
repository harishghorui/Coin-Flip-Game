import React, { useState } from 'react';
import Web3 from 'web3';
import CoinFlipABI from './CoinFlip.json';
import CoinAnimation from './CoinAnimation';
import Spinner from './Spinner';

const CoinFlip = () => {
  const [web3, setWeb3] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [contract, setContract] = useState(null);
  const [choice, setChoice] = useState(true); // true for heads, false for tails
  const [amount, setAmount] = useState('');
  const [minBetAmount, setMinBetAmount] = useState(null);
  const [flipResult, setFlipResult] = useState('none');
  const [isFlipping, setIsFlipping] = useState(false);
  const [lastProcessedBlock, setLastProcessedBlock] = useState(0);


  // Connect to the Ethereum wallet
  const handleConnect = async () => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWeb3(web3Instance);
      const accounts = await web3Instance.eth.getAccounts();
      setWalletAddress(accounts[0]);

      const contractABI = CoinFlipABI.abi;
      const contractAddress = '0x845a6dBD84f397d2DFe1E0FF04b925FDEfd3B3c9';
      const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
      setContract(contractInstance);

      // Initialize the minimum bet amount after web3 is set
      setMinBetAmount(web3Instance.utils.toWei('0.001', 'ether'));

    } else {
      alert('Please install MetaMask!');
    }
  };

  const handleFlip = async () => {
    if (contract && web3) {
        try {
            const accounts = await web3.eth.getAccounts();
            const weiAmount = web3.utils.toWei(amount, 'ether');

            if (minBetAmount === null) {
                alert('Minimum bet amount is not set.');
                return;
            }

            if (Number(weiAmount) < Number(minBetAmount)) {
                alert(`Bet amount must be at least ${web3.utils.fromWei(minBetAmount, 'ether')} ETH`);
                return;
            }

            setIsFlipping(true);
            setFlipResult('none');

            const tx = await contract.methods.flipCoin(choice).send({
                from: accounts[0],
                value: weiAmount,
                gas: 50000, 
            });

            console.log("Transaction successful:", tx);

            const resultEvent = tx.events?.Result;
            console.log('Result Event:', resultEvent);

            const win = resultEvent?.returnValues.win;
            console.log('Contract Win:', win);
            console.log('User Choice:', choice);

            const won = win === choice; // Correct logic, but add sanity checks
            if (win !== null && typeof win !== 'undefined') {
                setFlipResult(won ? 'win' : 'lose'); // Update based on logic
            } else {
                setFlipResult('error'); // Handle unexpected case
            }


            // Log remaining balance for more clarity
            const balanceAfter = await web3.eth.getBalance(accounts[0]);
            console.log('User balance after transaction:', web3.utils.fromWei(balanceAfter, 'ether'));

        } catch (error) {
            console.error("Error flipping coin:", error);
            setFlipResult('error');
        } finally {
            setIsFlipping(false);
        }
    } else {
        alert('Please connect your wallet first.');
    }
  };
  

  return (
    <div className='mx-auto w-full max-w-md p-5 border border-gray-300 rounded-lg shadow-lg'>
    
      <h1 className='text-7xl font-semibold text-center mb-5'>Flip Coin</h1>

      <div className='flex justify-center mb-5'>
        
        {
          !web3 ? 

          <button 
            onClick={handleConnect} 
            className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors'
          >
            Connect Wallet
          </button> :

          <div className='flex justify-center items-center gap-2 flex-wrap'>
            <button
              onClick={() => setWeb3(null)}
              className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors'
            >
              Disconnect
            </button>
            <span className='text-white'>{walletAddress}</span>
          </div>
        }

      </div>
      
      <CoinAnimation isFlipping={isFlipping} flipResult={flipResult} userChoice={choice} />

      <div className='flex justify-center space-x-4 mb-5'>
        <button 
          onClick={() => setChoice(true)} 
          className={`py-2 px-4 rounded ${choice ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} transition-colors`}
        >
          Heads
        </button>
        <button 
          onClick={() => setChoice(false)} 
          className={`py-2 px-4 rounded ${!choice ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} transition-colors`}
        >
          Tails
        </button>
      </div>

      <div className='flex justify-center mb-5'>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount in ETH"
          className='border border-gray-300 rounded py-2 px-4 w-full text-center'
        />
      </div>

      <div className='flex justify-center mb-5'>
        {
          !isFlipping ? 
          <button 
            onClick={handleFlip} 
            className='bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors'
          >
            Flip Coin
          </button> :
          <Spinner/>
        }
      </div>

      {/* Display result */}
      <div className='text-center text-2xl mt-5'>
        {flipResult === 'win' && <p className='text-green-500 font-bold'>Congratulations! You won the bet.</p>}
        {flipResult === 'lose' && <p className='text-red-500 font-bold'>Sorry, you lost the bet. Better luck next time!</p>}
        {flipResult === 'none' && <p className='text-white'>Flip the coin to see if you win!</p>}
        {flipResult === 'error' && <p className='text-red-500 font-bold'>There was an error processing the transaction.</p>}
      </div>

    </div>
  );
};

export default CoinFlip;
