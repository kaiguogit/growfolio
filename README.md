Growfolio
======
Growfolio is a portfolio managing app.
It is intended to add some features that Yahoo Finance and Google Finance don't have.
* Transaction based calculation for performance.
* Rebalancing tool. Set diversification goal, tell me what to buy and sell.
* Automatically add dividend.
* Calculate realized gain, dividend, yield for tax purpose.

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
