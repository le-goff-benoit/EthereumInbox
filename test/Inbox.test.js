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

beforeEach('Get Eth accounts', async() => {
    fetchedAccounts = await web3.eth.getAccounts();
    inboxContract = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode, arguments: [__INITIAL__MESSAGE]} )
        .send({from: fetchedAccounts[0], gas: '1000000'});
});

describe('Inbox Contract', () => {
    it('Test initial value',async () => {
        let message = await inboxContract.methods.message().call();
        assert.equal(message, __INITIAL__MESSAGE);
    });
    it('Set message value', async () => {
        let response = await inboxContract.methods.setMessage(__UPDATED__MESSAGE).send({from: fetchedAccounts[0], gas: '1000000'});
        assert.ok(response.transactionHash);
    });
    it('Get updated message value', async () => {
        await inboxContract.methods.setMessage(__UPDATED__MESSAGE).send({from: fetchedAccounts[0], gas: '1000000'});
        let message = await inboxContract.methods.message().call();
        assert.equal(message, __UPDATED__MESSAGE);
    });
});