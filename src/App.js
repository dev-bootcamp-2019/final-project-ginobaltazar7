import React, { Component } from 'react'
import MarketplaceContract from '../build/contracts/Marketplace.json'
import getWeb3 from './utils/getWeb3'
import AdminComponent from './AdminComponent';
import StoreOwnerComponent from './StoreOwnerComponent.js';
import ShopperComponent from './ShopperComponent';

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'


class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      accountType: '',
      web3: null,
      marketplaceInstance: null,
      currentAccount: ''
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3.then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    const contract = require('truffle-contract')
    const marketplace = contract(MarketplaceContract)
    marketplace.setProvider(this.state.web3.currentProvider)

    this.state.web3.eth.getAccounts((error, accounts) => {
      marketplace.deployed()
        .then((instance) => this.setState({marketplaceInstance: instance, currentAccount: accounts[0]}))
        .then(() => this.state.marketplaceInstance.MEWfetchUserType.call({from: accounts[0]}))
        .then((accountType) => this.setState({ accountType: accountType }))
    })
  }

  render() {
    const accountType = this.state.accountType;
    return (
      <div className="App">
        <main style={{marginTop: '25px'}} className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              {accountType === '' && <p>Loading...</p>}
              {accountType === 'MEW admin' && <AdminComponent
                  web3={this.state.web3}
                  currentAccount={this.state.currentAccount}
                  marketplace={this.state.marketplaceInstance}></AdminComponent>}
              {accountType === 'MEW storeOwner' && <StoreOwnerComponent
                  web3={this.state.web3}
                  currentAccount={this.state.currentAccount}
                  marketplace={this.state.marketplaceInstance}></StoreOwnerComponent>}
              {accountType === 'MEW adopter' && <ShopperComponent
                  web3={this.state.web3}
                  currentAccount={this.state.currentAccount}
                  marketplace={this.state.marketplaceInstance}></ShopperComponent>}
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
