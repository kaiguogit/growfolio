let latency = 200;
let id = 0;

function getId(){
  return ++id;
}

let holdings = [
  {
    id: getId(),
    symbol: 'YHOO',
    price: 123
  }
];

let transactions = [
  {
    id: getId(),
    symbol: 'YHOO',
    type: 'buy',
    shares: 1000,
    price: 40.00,
    commission: 50.00,
    date: new Date(2016, 11, 7)
  },
  {
    id: getId(),
    symbol: 'YHOO',
    type: 'buy',
    shares: 1000,
    price: 40.10,
    commission: 30.00,
    date: new Date(2016, 11, 8)
  },
  {
    id: getId(),
    symbol: 'YHOO',
    type: 'sell',
    shares: 1500,
    price: 41.20,
    commission: 0.00,
    date: new Date(2016, 11, 15)
  }
]

export class WebAPI {
  isRequesting = false;

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

  saveHolding(holding){
    this.isRequesting = true;
    return new Promise(resolve => {
      setTimeout(() => {
        let instance = JSON.parse(JSON.stringify(holding));
        let found = holdings.filter(x => x.id == holding.id)[0];

        if(found){
          let index = holdings.indexOf(found);
          holdings[index] = instance;
        }else{
          instance.id = getId();
          holdings.push(instance);
        }

        this.isRequesting = false;
        resolve(instance);
      }, latency);
    });
  }
}
