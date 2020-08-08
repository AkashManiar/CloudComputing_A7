/* eslint-disable quotes */
/* eslint-disable indent */
/* eslint-disable linebreak-style */
const axios = require('axios');
const { v4 } = require('uuid');
const PartsController = require('./PartsController')

module.exports = {
    makeOrder: function(req, res, partOrder) {
        console.log('__Make order Called __');
        axios.post(
            'https://0nmy4bwphh.execute-api.us-east-1.amazonaws.com/dev/',
            {
                "partId": partOrder.partId
            },
            {headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS',
                'Access-Control-Allow-Headers': '*'
            }}).then(partInfo => {
                if (partInfo.statusText === 'OK' && JSON.stringify(partInfo.data) !== '{}')  {
                    const Item = partInfo.data.Item;
                    const qoh = Item.qoh - partOrder.qnt;
                    if (qoh < 0) {
                        res.send({
                            success: false,
                            isError: false,
                            message: 'Qoh cannot be less than zero. Please order quantity less than or equal to ' + Item.qoh
                        });
                    } else {
                        axios.post(
                            'https://f5wwgg7y65.execute-api.us-east-1.amazonaws.com/Dev/',
                            {
                                "qnt": partOrder.qnt,
                                "uId": v4()+'',
                                "jobName": partOrder.jobName,
                                "partId": partOrder.partId,
                                "userId": partOrder.userId
                            },
                            {headers: {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS',
                                'Access-Control-Allow-Headers': '*'
                            }}).then(partOrderRes => {
                            if (partOrderRes.statusText === 'OK' && JSON.stringify(partOrderRes.data) === '{}')  {
                                const part = {
                                    partId: Item.partId,
                                    qoh,
                                    partName: Item.partName
                                };
                                PartsController.editPart(req, res, part);
                            }
                        }).catch(err3 => {
                            res.send({
                                success: false,
                                isError: false,
                                error: err3,
                                message: 'Error while updating part details.'
                            })
                        })
                    }
                } else {
                    res.send({
                        success: false,
                        isError: false,
                        message: 'Cannot find part with given Id.'
                    })
                }
            }).catch(err1 => {
                res.send({
                    success: false,
                    isError: false,
                    err: err1,
                    message: 'Error occurred while finding details of part with given Id.'
                });
            });
    }
}