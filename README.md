Growfolio
======
Growfolio is a portfolio managing app.
It is intended to add some features that Yahoo Finance and Google Finance don't have.
* Transaction based calculation for performance.
* Rebalancing tool. Set diversification goal, tell me what to buy and sell.
* Automatically add dividend.
* Calculate realized gain, dividend, yield for tax purpose.

## Start backend server
`npm start`
or
`nodemon --debug app.js` that auto restart when code change.
## Start fontend webpack server
`cd client & npm start`

## How to build
`npm run build`
## How to deploy
### How to attach heroku
`heroku login`
`heroku git:remote -a <appname>`
### Push to heroku
`git push heroku <currentbranchname>:master --force`
### See heroku logs
`heroku logs --tail`
