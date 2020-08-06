/**
 * PartOrdersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  addOrder: function (req, res) {
    const order = {
      id: req.body.partId,
      jobName: req.body.jobName,
      userId: req.body.userId,
      qnt: req.body.qnt,
    };
    //console.log("user id not found and should be added to table");
    //res.send({message: "user id not found and should be added to table"});
    sails.models.partorders.create(order).exec((err) => {
      if (err) {
        res.send({
          success: false,
          isError: true,
          message: "error in adding order",
          reeor: err,
        });
      } else {
        //find qnt
        var qnt = 0;

        sails.models.parts
          .findOne({
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
            if (part.length == 0) {
              res.send({
                success: false,
                isError: false,
                message: "Part with given part Id does not exist",
              });
            } else {
              //res.send({ part });
              qnt = part.qoh;
              console.log("Found part and qnt is " + qnt);
              console.log("found qnt:" + qnt);
              console.log("order qnt:" + order.qnt);
              var updatedqnt = qnt - order.qnt;
              console.log("updated qnt:" + updatedqnt);

              //updation part

              const updatepart = {
                //partName: req.body.partName,
                qoh: updatedqnt,
              };
              sails.models.parts
                .update({ id: req.body.partId }, updatepart)
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
            }
          });
        }
      });
  },
  makeOrder: function(req, res) {
    const order = {
      id: req.body.partId,
      jobName: req.body.jobName,
      qnt: req.body.qnt,
      userId: req.body.userId 
    }
    let availQnt;

    sails.models.parts.find({ id: order.id }).exec((partErr, part) => {
      if (partErr) {
        res.send({
          success: false,
          isError: true,
          message: "Error occurred in fetching partId.",
          partErr,
        });
      } else if (part.length === 0) {
        res.send({
          success: false,
          isError: false,
          message: "Part you are looking for does not exist in the system.",
        });
      } else {
        sails.models.partorders.find({id: order.id, jobName: order.jobName, userId: order.userId }).exec((err, partOrder) => {
          if (err) {
            res.send({
              success:false,
              isError: true,
              message: "Error in fetching data related to part order.",
              err
            });
          } else if (partOrder.length !== 0) {
            res.send({
              success:false,
              isError: false,
              message: "Entry with provided partId, jobName, and userId already exist in the system.",
            });
          } else {
            availQnt = part[0].qoh - order.qnt;
            if (availQnt < 0) {
              res.send({
                success: false,
                isError: false,
                message: "Invalid quantity provided, quantity cannot go below 0 with company Y."
              })
            } else {
              sails.models.partorders.create(order).exec(err1 => {
                if (err1) {
                  res.send({
                    success:false,
                    isError: true,
                    message: "Error in creating part order.",
                    err: err1
                  })
                } else {
                  sails.models.parts.update({id: req.body.partId}, { qoh: availQnt }).exec(updatingErr => {
                    if (updatingErr) {
                      res.send({
                        success: false,
                        isError: true,
                        message: "Created partOrder, but error in updating part details.",
                        error: err,
                      });
                    } else {
                      res.send({
                        success: true,
                        isError: false,
                        message: "Congratulations!! Successfully created order and updated part details.",
                      });
                    }
                  });
                }
              })
            }
          }
        })
      }
    })
    
  }
};
