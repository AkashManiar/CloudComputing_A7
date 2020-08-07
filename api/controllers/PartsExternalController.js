/* eslint-disable indent */
/**
 * PartsExternalController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const axios = require('axios')

module.exports = {
  getParts: function (req, res) {
    const part_id = +req.param("partId")
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
            if (JSON.stringify(partInfo.data) === '{}') {
              res.send({
                success: false,
                isError: false,
                message: "There are no parts available with given ID",
                parts: [],
              })
            } else {
              res.send({
                success: true,
                isError: false,
                message: "Successfully fetched parts",
                parts: [partInfo.data.Item]
              });
            }
          } else {
            res.send({
              success: false,
              isError: true,
              message: "Error in fetching response",
              error: err,
            });
          }
        }).catch(err => {
          res.send({
            success: false,
            isError: true,
            message: "Error in fetching response",
            error: err,
          });
        })
  },
  addPart: function (req, res) {
    sails.models.parts
      .find({
        id: req.body.partId,
      })
      .exec((err, part) => {
        if (err) {
          res.send({
            success: false,
            isError: true,
            message: "Error in finding part with given Id",
            error: err,
          });
        }
        if (part.length !== 0) {
          res.send({
            success: false,
            isError: false,
            message: "Part with given part Id already exist",
          });
        } else {
          const part = {
            id: req.body.partId,
            partName: req.body.partName,
            qoh: req.body.qoh,
          };
          sails.models.parts.create(part).exec((err) => {
            if (err) {
              res.send({
                success: false,
                isError: true,
                message: "Error in adding part with.",
                error: err,
              });
            } else {
              res.send({
                success: true,
                isError: false,
                message: "Successfully added part to the system.",
              });
            }
          });
        }
      });
  },
  updatePart: function (req, res) {
    const part = {
      // partName: req.body.partName,
      qoh: req.body.qoh,
    };
    sails.models.parts
      .update({ id: req.param("partId"), partName: req.body.partName }, part)
      .exec((err) => {
        if (err) {
          res.send({
            success: false,
            isError: true,
            message: "Error in updating part details.",
            error: err,
          });
        } else {
          res.send({
            success: true,
            isError: false,
            message: "Successfully updated part details.",
          });
        }
      });
  },
  deletePart: function (req, res) {
    const prt = {
      id: 4,
    };
    sails.models.parts.find(prt).exec((findErr, part) => {
      if (findErr) {
        res.send({
          success: false,
          isError: true,
          message: "Error in deleting part.",
          error: findErr,
        });
      } else if (part.length === 0) {
        res.send({
          success: false,
          isError: false,
          message: "No Part with provided partId exist",
        });
      } else {
        sails.models.parts.destroy(part).exec((destroyErr) => {
          if (destroyErr) {
            res.send({
              success: false,
              isError: true,
              message: "Error in deleting part.",
              error: destroyErr,
            });
          } else {
            res.send({
              success: true,
              isError: false,
              message: "Successfully deleted part from system.",
            });
          }
        });
      }
    });
  },
  isPartExist: function (req, res) {
    const partId = req.body.partId;
    if (partId) {
      sails.models.parts.find({ id: partId }).exec((err, part) => {
        if (err) {
          res.send({
            success: false,
            isError: true,
            message: "Error occurred in fetching partId.",
            err,
          });
        } else if (part.length === 0) {
          res.send({
            success: false,
            isError: false,
            message: "Part you are looking for does not exist",
            err,
          });
        } else {
          res.send({
            success: true,
            isError: false,
            message: "Found part in our system",
            parts: part,
          });
        }
      });
    } else {
      res.send({
        success: false,
        isError: false,
        message: 'Cannot find part without "partId".',
      });
    }
  },
};
