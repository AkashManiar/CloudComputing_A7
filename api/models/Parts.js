/* eslint-disable linebreak-style */
module.exports = {
  tableName: 'parts',
  attributes: {
    id : {
      type : 'number',
      columnName: 'partId',
      required: true
    },
    partName :{
      type : 'string',
      required: true
    },
    qoh :{
      type : 'number',
      defaultsTo: 0
    }
  }
};
