import {BSON} from 'realm';

export class Receipt {
  constructor({
    _id = new BSON.ObjectId(),
    owner_id,
  }) {
    this._id = _id;
    this.owner_id = owner_id;
  }

  static schema = {
    name: 'Receipt',
    properties: {
      _id: 'objectId',
      owner_id: 'string',
      title: 'string',
      price: { type: 'float' },
      date: { type: 'string' },
      itemList: { type: 'string' },
    },
    primaryKey: '_id',
  };
}
