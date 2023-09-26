import { ViewerType } from './viewer.dto';

export type OrderSendType = {
  viewerInEntity: ViewerType[];
  viewerForPaste: ViewerType[];
  newViewersForPaste: ViewerType[];
};
