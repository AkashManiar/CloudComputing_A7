const axios = require('axios')
const fetch = require("node-fetch");
/* eslint-disable indent */
/**
 * PartsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

 
const headerObj = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS',
    'Access-Control-Allow-Headers': '*'
}
module.exports = {
    getParts: function(req, res) {
        axios.get(
            'https://t0e46turp1.execute-api.us-east-1.amazonaws.com/Dev/',
        ).then(partsRes => {
            const parts = partsRes.data
            if (parts.length === 0) {
                res.view('pages/viewParts', { message: 'Parts table does not have any records. Please click "Add Part", to add new part.'})
            } else {
                res.view('pages/viewParts', { parts });
            }
        }).catch(err => {
            res.send({
                error: true,
                err,
                message: 'Some error occurred in adding part'
            })
        })
    },
    addPart: function(req, res) {
        // First it gets part by part ID
        const part_id = +req.body.partId
        // console.log('--PartId', req.body.partId, part_id);
        axios.post(
            'https://0nmy4bwphh.execute-api.us-east-1.amazonaws.com/dev/',
            {
                "partId": part_id
            },
            {headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS',
                'Access-Control-Allow-Headers': '*'
            }}).then(partInfo => {
            if (partInfo.statusText === 'OK')  {
                // console.log('_partInfo.data', partInfo.data);
                // console.log('__partInfo.data.length', partInfo.data.length);
                // console.log('___JSON.stringify(partInfo.data)', JSON.stringify(partInfo.data)));
                if (JSON.stringify(partInfo.data) === '{}') {
                    axios.post(
                        'https://bqzticqzqc.execute-api.us-east-1.amazonaws.com/dev/',
                        {
                            "partId": +req.body.partId,
                            "partName": req.body.partName + "",
                            "qoh": +req.body.qoh
                        },
                        { headers: headerObj }
                    ).then(addPartRes => {
                        console.log('__ADDParts__');
                        if (addPartRes.statusText === 'OK')  {
                            res.redirect('/getParts');
                        } else {
                            res.view('pages/addPart', { message: 'Some error occurred in adding part with given Id' });
                        }
                    }).catch(err1 => {
                        res.send({
                            error: true,
                            err: err1,
                            message: 'Some error occurred while calling api to add part.'
                        })
                    })
                } else if (partInfo.data.Item.partId === +req.body.partId) {
                    res.view('pages/addPart', { message: 'Part id your are trying to add already exists. Please add unique partId'});
                } else {
                    res.send({
                        message: 'Some unknown error occurred.'
                    })
                }
            } else {
                res.view('pages/addPart', { message: 'Some error occurred in fetching part with given Id' });
            }
        }).catch(err => {
            res.send({
                error: true,
                err,
                message: 'Some error occurred while fetching part details.'
            })
        })
    },
    editPartDetail: function(req, res) {
        res.view('pages/editPart', {part: req.body });
    },
    editPart: function(req, res) {
        axios.post(
            'https://ony8i3a05j.execute-api.us-east-1.amazonaws.com/dev',
            {
                "partId": +req.param('partId'),
                "partName": req.body.partName + "",
                "qoh": +req.body.qoh
            },
            {headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS',
                'Access-Control-Allow-Headers': '*'
            }}
        ).then(updateResponse => {
            if (updateResponse.statusText === 'OK')  {
                res.redirect('/getParts');
            } else {
                res.send({ error: true, message: 'Part that your are trying to edit does not exist' });
            }
        }).catch(err => {
            res.send({
                error: true,
                err,
                message: 'Some error occurred in editing part details.'
            })
        })
    },
    deletePart: function(req, res) {
        const part_id = +req.param('partId')
        axios.delete(
            'https://xarwe8xbja.execute-api.us-east-1.amazonaws.com/Dev/',
            {
                partId: 1,
            },
            {headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS',
                'Access-Control-Allow-Headers': '*'
            }}
        ).then(deletedREs => {
            console.log('___deletedREs__', deletedREs.data);
            if (deletedREs.statusText === 'OK')  {
                res.redirect('/getParts');
            } else {
                res.send({ error: true, message: 'Part that your are trying to edit does not exist' });
            }
        }).catch(err => {
            console.log('__DELETE_ERR_', err);
            res.send({
                error: true,
                err,
                message: 'Some error occurred in editing part details.'
            })
        })
    }
};

