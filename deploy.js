const WalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode} = require('./compile');
const mnemonic = 'pencil toddler later cave private smart quit shaft sausage version bridge cram';

const provider = new WalletProvider(
    mnemonic,
    'https://rinkeby.infura.io/v3/310cd0ca81f4464596a915db6f771761'
);

const web3 = new Web3(provider);

const main = async () => {
    const accounts = await web3.eth.getAccounts();
    const deployAccount = accounts[0];

    console.log("The contract will be deploy using account : ", deployAccount);

    let contractDeployTransaction = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode, arguments: ['Ping!']})
        .send({from: deployAccount, gas: 1000000});

    console.log("Contract deployed to: https://rinkeby.etherscan.io/address/" + contractDeployTransaction.options.address);

    provider.engine.stop();
};

main();