'use strict';

let latency = 200;
let id = 0;

function getId(){
  return ++id;
}

let holdings = [
  {
    _id: getId(),
    symbol: 'YHOO',
    price: 123
  }
];

let transactions = [
  {
    _id: getId(),
    symbol: 'YHOO',
    type: 'buy',
    shares: 1000,
    price: 40.00,
    commission: 50.00,
    date: new Date(2016, 11, 7).toDateString()
  },
  {
    _id: getId(),
    symbol: 'YHOO',
    type: 'buy',
    shares: 1000,
    price: 40.10,
    commission: 30.00,
    date: new Date(2016, 11, 8).toDateString()
  },
  {
    _id: getId(),
    symbol: 'YHOO',
    type: 'sell',
    shares: 1500,
    price: 41.20,
    commission: 0.00,
    date: new Date(2016, 11, 15).toDateString()
  }
];

class WebAPI {

  getTransactionList() {
    return this._sendArray(transactions);
  }

  getHoldingList(){
    return this._sendArray(holdings);
  }

  _sendArray(data) {
    this.isRequesting = true;
    return new Promise(resolve => {
      setTimeout(() => {
        // return a clone of data
        resolve(data.slice(0));
        this.isRequesting = false;
      }, latency);
    });
  }

  getHoldingDetails(id){
    this.isRequesting = true;
    return new Promise(resolve => {
      setTimeout(() => {
        let found = holdings.filter(x => x.id == id)[0];
        resolve(JSON.parse(JSON.stringify(found)));
        this.isRequesting = false;
      }, latency);
    });
  }

  saveTransaction(transaction) {
    this.isRequesting = true;
    return new Promise(resolve => {
      setTimeout(() => {
        let instance = JSON.parse(JSON.stringify(transaction));
        let found = transactions.filter(x => x.id == transaction.id)[0];

        if(found){
          let index = transactions.indexOf(found);
          transactions[index] = instance;
        }else{
          instance.id = getId();
          transactions.push(instance);
        }
        this.isRequesting = false;
        resolve(instance);
      }, latency);
    });
  }

  deleteTransaction(transaction) {
    this.isRequesting = true;
    return new Promise(resolve => {
      setTimeout(() => {
        transactions.splice(transactions.findIndex(x=> x.id === transaction.id), 1);
        this.isRequesting = false;
        resolve();
      }, latency);
    });
  }
}

export default WebAPI;