<?php
//PRODUCT TYPE DEFINITIONS(PRODUCT): P_ prefix
define('P_BOOK', 1);
define('P_MAGAZINE', 2);

//UNIT TYPE OF PRODUCT(UNIT):UNIT_prefix
define('UNIT_NOS', 1);
define('UNIT_WEIGHT', 2);

//LANGUAGE OF PRODUCT():LAN_prefix
define('LAN_EN', 1);
define('LAN_HINDI', 2);

//CATEGORY OF BOOK():CAT_BOOK_prefix
define('CAT_BOOK_VERIFIED', 1);
define('CAT_BOOK_UNVERIFIED', 2);

//CATEGORY OF MAGAZINE():CAT_MAGAZINE_prefix
define('CAT_MAGAZINE_VERIFIED', 1);
define('CAT_MAGAZINE_UNVERIFIED', 2);


//REQUEST TYPE:REQUEST_prefix
define('REQUEST_ADD_PRODUCT', 1);
define('REQUEST_UPDATE_PRODUCT', 2);

//STATUS OF PRODUCT():P_STATUS_prefix
define('P_STATUS_BOOKED', 1);
define('P_STATUS_SOLD', 2);
define('P_STATUS_DELETED', 3);
define('P_STATUS_AVAILABLE', 4);
define('P_STATUS_ONHOLD', 5);

// google recaptcha secret key
define('recaptcha_secret','6Lfh_xsTAAAAAAEKsTeP0fX1yoGc5h7cEElXn8kl');
