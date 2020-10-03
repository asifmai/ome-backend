const plaid = require("plaid");
const moment = require('moment');
const CheckingAccount = require('../models/CheckingAccount');
const Transaction = require('../models/Transaction');
const LinkedAccount = require('../models/LinkedAccount');
const client = new plaid.Client({
  clientID: process.env.PLAID_CLIENT_ID,
  secret: process.env.PLAID_SECRET,
  env: plaid.environments["sandbox"],
  options: {
    version: "2019-05-29",
  },
});

module.exports.create_link_token_get = (req, res) => {
  try {
    const configs = {
      user: {
        // This should correspond to a unique id for the current user.
        client_user_id: req.user._id,
      },
      client_name: "OME",
      products: ['transactions', 'auth'],
      country_codes: ["US"],
      language: "en",
    };
    client.createLinkToken(configs, function (error, createTokenResponse) {
      if (error != null) {
        return res.status(500).json({
          error: error,
        });
      }
      console.log(createTokenResponse);
      res.json(createTokenResponse);
    });
  } catch (error) {
    console.log(`Create Link Token Error: ${error}`);
    res.status(500).json({error});
  }
}

module.exports.add_checking_account_post = async (req, res) => {
  try {
    const { bank, bankId, token, account_id, subtype, type, name } = req.body;
    console.log(req.body);

    const foundAccount = await CheckingAccount.findOne({userId: req.user._id});

    if (foundAccount) {
      return res.status(500).json({error: 'The account is already created...'});
    }

    const account = new CheckingAccount({
      userId: req.user._id,
      bank,
      bankId,
      token,
      account_id,
      subtype,
      type,
      name,
    });

    client.exchangePublicToken(token, async function (error, tokenResponse) {
      if (error) {
        console.log(error);
        return res.status(500).json({
          error: error,
        });
      }

      console.log(tokenResponse);

      ACCESS_TOKEN = tokenResponse.access_token;
      ITEM_ID = tokenResponse.item_id;

      account.access_token = ACCESS_TOKEN;
      account.item_id = ITEM_ID;

      // Save User to DB
      await account.save();

      // Pull transactions for the Item for the last 30 days
      var startDate = moment().subtract(30, "days").format("YYYY-MM-DD");
      var endDate = moment().format("YYYY-MM-DD");

      client.getTransactions(
        account.access_token,
        startDate,
        endDate,
        {
          count: 250,
          offset: 0,
        },
        async function (error, transactionsResponse) {
          if (error) {
            return res.status(500).json({
              error: error,
            });
          } else {
            // Save the transaction in Transaction table with account id
            console.log(transactionsResponse);
            const linkedAccounts = transactionsResponse.accounts;

            for (let i = 0; i < linkedAccounts.length; i++) {
              const linkedAccount = new LinkedAccount({
                accountId: account._id,
                mask: linkedAccounts[i].mask,
                name: linkedAccounts[i].name,
                official_name: linkedAccounts[i].official_name,
                subtype: linkedAccounts[i].subtype,
                type: linkedAccounts[i].type,
                balance: linkedAccounts[i].balances.available,
                notification: 'phone'
              });

              await linkedAccount.save();
            }

            const trs = transactionsResponse.transactions;
            for (let i = 0; i < trs.length; i++) {
              const transaction = new Transaction({
                amount: trs[i].amount,
                category: trs[i].category,
                category_id: trs[i].category_id,
                date: trs[i].date,
                iso_currency_code: trs[i].iso_currency_code,
                merchant_name: trs[i].merchant_name,
                name: trs[i].name,
                payment_channel: trs[i].payment_channel,
                pending: trs[i].pending,
                transaction_id: trs[i].transaction_id,
                transaction_type: trs[i].transaction_type,
                account_id: account._id,
              });

              await transaction.save();
            }

            res.status(200).json({status: 'success', msg: 'Checking Account, Linked Accouns and Transactions Added...'});
          }
        }
      );
    })
    
  } catch (error) {
    console.log(`Add Checking Account Error: ${error}`);
    res.status(500).json({error});
  }
}