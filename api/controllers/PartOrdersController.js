/* eslint-disable camelcase */
/* eslint-disable indent */
/* eslint-disable linebreak-style */
/**
 * PartOrdersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const MakeOrdersController = require('./MadeOrdersController')
const axios = require('axios');

module.exports = {
    addOrder: function (req, res) {
      axios.get(
        'https://0xgm5eowfj.execute-api.us-east-1.amazonaws.com/Dev/',
    ).then(poRes => {
        const part_order = {
          qnt : +req.body.qnt, 
          jobName :  req.body.jobName + "",
          userId : +req.body.userId,
          partId : +req.body.partId
        };
        const poList = poRes.data;
        if (poList.length === 0) {
            // Allowing directly to make new entry
            MakeOrders.makeOrder(res, part_order);
        } else {
            poList.map(partOrder => {
              if (
                  partOrder.partId === part_order.partId &&
                  partOrder.userId === part_order.userId &&
                  partOrder.jobName === part_order.jobName
                ) {
                  res.send({
                    success: false,
                    isError: false,
                    message: 'There cannot be more than one entry with same Part Id, User Id and Job Name.'
                  });
                }
            });
            MakeOrdersController.makeOrder(req, res, part_order);
        }
    }).catch(err1 => {
        res.send({
            error: true,
            err: err1,
            message: 'Some error occurred in adding part'
        })
    })
  }
};
