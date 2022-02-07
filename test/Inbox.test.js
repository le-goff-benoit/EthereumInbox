const assert = require('assert');
const ganache = require('ganache-cli');
const { beforeEach } = require('mocha');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const {interface, bytecode } = require('../compile');

let fetchedAccounts;
let inboxContract;
let __INITIAL__MESSAGE = 'Ping!';
let __UPDATED__MESSAGE = 'Pong!';
let __TEST__GAS__VALUE = 1000000;

beforeEach('Get Ethereum accounts from ganache and deploy contract', async () => {
    fetchedAccounts = await web3.eth.getAccounts();
    inboxContract = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode, arguments: [__INITIAL__MESSAGE]} )
        .send({from: fetchedAccounts[0], gas: __TEST__GAS__VALUE});
});

describe('Inbox Contract', () => {
    it('Test initial value',async () => {
        let message = await inboxContract.methods.message().call();
        assert.equal(message, __INITIAL__MESSAGE);
    });
    it('Set message value', async () => {
        let response = await inboxContract.methods.setMessage(__UPDATED__MESSAGE).send({from: fetchedAccounts[0], gas: __TEST__GAS__VALUE});
        // Contrôle de présence du hash de transaction
        assert.ok(response.transactionHash);
    });
    it('Get updated message value', async () => {
        // Ici c'est un transaction avec consommation de gas car update d'une valeur.
        await inboxContract.methods.setMessage(__UPDATED__MESSAGE).send({from: fetchedAccounts[0], gas: __TEST__GAS__VALUE});
        let message = await inboxContract.methods.message().call();
        assert.equal(message, __UPDATED__MESSAGE);
    });
});