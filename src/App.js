import './App.css';
import NumberChanger from "./artifacts/contracts/NumberChanger.sol/NumberChanger.json"
import {useState} from 'react'
import {ethers} from "ethers";



function App() {
  const contractAddress = '0xaF68b857d01f8dfC66451efC23b7DC1792f07485'

  const [number, setNumberLocalState] = useState('')

  // request account from metamask wallet
  async function requestAccount() {
    await window.ethereum.request({method: 'eth_requestAccounts'})
  }

  async function getNumber2() {
    if (window.ethereum !== undefined) { // check for metamask (if metamask is installed in browser, window.ethereum is populated)
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(contractAddress, NumberChanger.abi, provider)
      try {
        const data = await contract.getNumber()
        console.log('getnum', data.toString())
        setNumberLocalState(data.toString())
      } catch (err) {
        console.log("err: ", err)
      }
    } else {
      console.log('metamask not installed')
    }

  }

  async function setNumberBlockchain(e) {
    if (window.ethereum !== undefined) {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, NumberChanger.abi, signer)
      const transaction = await contract.setNumber(number)
      const receipt = await transaction.wait() // waiting for transaction to confirm in blockchain
      console.log('receipt:', receipt)
      setNumberLocalState('')

    }

  }

  return (
    <div className="App">
      <button onClick={requestAccount}>Connect Wallet</button> <br /><br />
      {/* <input type="text" onChange={e => setNumberBlockchain(e.target.value)} value={number} /> */}
      <button onClick={getNumber2}>Get Number</button> <span>number is: {number}</span> <br /><br />
      <button onClick={setNumberBlockchain}>Set Number</button> <input type="text" onChange={e => setNumberLocalState(e.target.value)} value={number} />
    </div>
  );
}

export default App;
