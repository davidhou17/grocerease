import {createRealmContext} from '@realm/react';
import {Item} from './ItemSchema';
import {Receipt} from './ReceiptSchema';

export default createRealmContext({
  schema: [Item.schema, Receipt.schema],
});
