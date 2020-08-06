/**
 * PartOrders.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
module.exports = {
  tablename: "partorders",
  attributes: {
    id: {
      type: "number",
      columnName: 'partId',
      required: true,
    },
    jobName: {
      type: "string",
      columnName: "jobName",
      required: true,
    },
    userId: {
      type: "number",
      columnName: "userId",
      required: true,
    },
    qnt: {
      type: "number",
      defaultsTo: 0,
    }
  }
};
