export const commonMessages = {
  errorMessage: 'Uh-oh, something went wrong.',
  AREA_RESTRICTION:
    'You can now deliver to more areas. Radius increased from 10 to 15 KM.',
  CHANGE_BRANCH_NEW_ORDER:
    'Are you sure you want to change the branch? Please confirm.',
  CLEAR_FILTER: 'This will clear all your enterd data. Please confirm.',
  GROUPING_ORDERS_LIMIT:
    'Sorry, You have reached the limit for grouping orders.',
  GROUPING_ORDERS:
    'Note that the orders will be assigned to one driver which will increase the delivery time. <br> If you do not prefer to group orders, please place them one by one.',
  DELETE_DROPOFF: 'Are you sure you want to delete the dropoff? Please confirm',
  DELETED_DROPOFF: 'Dropoff deleted successfully.',
  SUCCESS_PLACE_ORDER:
    'Your order has been placed successfully, a driver will be at your pick up location shortly.',
  FRESHCHAT_CSAT_QUESTION:
    'Did you find our agent helpful ? <br/> هل قام موظف خدمة العملاء بخدمتك كما توقعت ؟',
  REORDER_CONFIRM: 'Do you want to re-order? Please confirm.',
};

export const ErrorMessages: Array<{ key: string; value: string }> = [
  { key: 'DATA_NOT_FOUND', value: 'Data not found for the specific record' },
  { key: 'INVALID_REQUEST', value: 'Invalid request' },
  { key: 'UPDATED_SUCCESSFULLY', value: 'Record updated successfully' },
  {
    key: 'ACTIVE_INACTIVE_NOT_FOUND',
    value: 'There is no record found for the operation(active/inactive)',
  },
  { key: 'BRANCH_NOT_FOUND', value: 'Branch for the Vendor is not found' },
  { key: 'VENDOR_CREATED', value: 'Vendor created successfully' },
  { key: 'VENDOR_NAME_ALREADY_EXIST', value: 'Vendor Name already exists' },
  { key: 'ORDER_CREATED', value: 'Order placed successfully' },
  { key: 'ORDER_CANNOT_BE_MODIFIED', value: 'Order cannot be modified' },
  { key: 'ORDER_NOT_FOUND', value: 'Order not found' },

  { key: 'LOWER_STATUS_THAN_EXISTING', value: 'Lower status than existing' },
  {
    key: 'UPDATED_DELIEVERY_STATUS',
    value: 'Updated delivery status successfully',
  },

  { key: 'VENDOR_USER_CREATED', value: 'Vendor user created successfully' },
  {
    key: 'VENDOR_USER_CREATION_INVALID_USER_REQUEST',
    value: 'Please check the provided details',
  },
  {
    key: 'VENDOR_USER_CREATION_INVALID_VENDOR_REQUEST',
    value: 'Please check the provided details',
  },
  { key: 'PASSOWRDS_DO_NOT_MATCH', value: 'Password do not match' },
  {
    key: 'VENDOR_USER_PASSWORD_RESET_SUCCESS',
    value: 'Password reset successfully',
  },
  { key: 'VENDOR_USER_NOT_FOUND', value: 'Vendor user not found' },
  {
    key: 'VENDOR_USER_PASSWORD_ALREADY_RESET',
    value: 'Vendor user password already reset',
  },
  {
    key: 'USER_EMAIL_PHONE_ALREADY_EXIST',
    value: 'User with the same e-mail or phone already exists.',
  },
  {
    key: 'WE_ARE_NOT_OPERATIONAL_AT_THE_MOMENT',
    value: 'Sorry, We are not operational at the moment',
  },
  {
    key: 'SERVER_ERROR',
    value: 'Connection failed! Please check your internet',
  },
  {
    key: 'NO_MIN_VENDOR_WALLET_BALANCE',
    value: 'You dont have enough balance to place order.',
  },
  {
    key: 'ORDER_PAYMENT_IS_SETTLED',
    value: 'Order COD amount is settled. It cannot be updated further.',
  },
  {
    key: 'PAYMENT_UPDATION_IS_LOCKED',
    value:
      'Payment cannot be updated at this time as it is locked by Finance manager. Please try again later',
  },
  {
    key: 'PAYMENT_LOCK_IS_DISABLED',
    value: 'Payment is unlock so you canot do the settlment',
  },
  {
    key: 'AMOUNT_MISSMACTH',
    value: 'Amount got changed. Please refresh and try again',
  },
  { key: 'CURRENT_PASSWORD_MISSMATCH', value: 'Current password is wrong' },
  { key: 'INVALID_IMPROVMENT_TYPE', value: 'You have enterd some wrong data' },
  { key: 'ALREADY_RATED', value: 'You are already rated for the order' },
  { key: 'RATING_TIME_EXCEEDED', value: 'Your rating is exceeded' },
  { key: 'INVALID_ORDER_GROUP', value: 'Invalid order group' },
  { key: 'INVALID_ORDER_RATING', value: 'You cannot rate this order' },
  { key: 'ZONE_NAME_ALREADY_EXISTS', value: 'Zone name is already exists' },
  { key: 'BUSY_MODE_ACTIVATED', value: 'Sorry, Busy mode is activated' },
  {
    key: 'ZONE_BUSY_MODE_ACTIVATED',
    value: 'Sorry, Busy mode is activated in the selected pickup',
  },
  { key: 'API_ALREADY_ACTIVATED', value: 'This is already activated' },
  {
    key: 'ORDER_DELIVERED_OR_CANCELLED',
    value: 'Sorry, You cannot edit this order as this order is already closed.',
  },
  { key: 'PHONE_ALREADY_EXIST', value: 'Phone already exists.' },
  {
    key: 'BRANCH_NAME_ALREADY_EXIST',
    value: 'Branch name already exists. Please contact FleetX support team',
  },
  {
    key: 'ADDRESS_ALREADY_VERIFIED',
    value: 'Customer already varified the address',
  },
  {
    key: 'ORDER_STATUS_BEYOND_ADDR_UPDATE_BY_CUSTOMER',
    value: 'Delivery already started or canceled',
  },
  {
    key: 'VENDOR_BRANCH_INVOICE_NOT_GENERATED',
    value: 'Invoice is not generated',
  },
  {
    key: 'AREA_BASED_RESTRICTION_ACTIVATED',
    value: 'Order creation failed. Area restriction activated.',
  },
  {
    key: 'AREA_BASED_RESTRICTION_ACTIVATED',
    value: 'Order creation failed. Area restriction activated.',
  },
  {
    key: 'PHONE_ALREADY_USED',
    value: 'User with the same phone already exists.',
  },
  {
    key: 'EMAIL_ALREADY_USED',
    value: 'User with the same e-mail already exists.',
  },
];

export const ERROR = {
  OBJECT_DOES_NOT_EXIST: 'OBJECT_DOES_NOT_EXIST',
};
