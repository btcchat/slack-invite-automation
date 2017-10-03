<?  
    require_once( "cryptobox.class.php" );

    /**** CONFIGURATION VARIABLES ****/ 
    
    $userID         = "";               // leave empty for unregistered visitors on your website  
                                        // if userID is empty, it will autogenerate userID and save in cookies
                                        // or place your registered userID or md5(userID) here (user1, user7, ko43DC, etc).
    $userFormat     = "COOKIE";         // save userID in cookies (or you can use IPADDRESS, SESSION)
    $orderID        = "page1";          // Separate payments for separate your web page(s) - page1, page2, section1, etc. 
    $amountUSD      = 0.6;              // price per page(s) - 0.6 USD
    $period         = "24 HOUR";        // user will get access to page(s) for 24 hours; after need to pay again
    $def_language   = "en";             // default Payment Box Language
    $def_payment    = "bitcoincash";        // default Coin in Payment Box

    // List of coins that you accept for payments
    // For example, for accept payments in bitcoins, bitcoincashs use - $available_payments = array('bitcoin', 'bitcoincash'); 
    $available_payments = array('bitcoin', 'bitcoincash', 'litecoin', 'dash', 'dogecoin', 'speedcoin', 'reddcoin', 'potcoin', 
                        'feathercoin', 'vertcoin', 'peercoin', 'monetaryunit');
    
    
    // Goto  https://gourl.io/info/memberarea/My_Account.html
    // You need to create record for each your coin and get private/public keys
    // Place Public/Private keys for all your available coins from $available_payments
    
    $all_keys = array(  
        "bitcoin"  => array("public_key" => "-your public key for Bitcoin box-",  "private_key" => "-private key for Bitcoin box-"),
        "bitcoincash" => array("public_key" => "-your public key for Bitcoin Cash box-", "private_key" => "-private key for Bitcoin Cash box-")
        // etc.
    ); 
            
    /********************************/

    
    // Re-test - that all keys for $available_payments added in $all_keys 
    if (!in_array($def_payment, $available_payments)) $available_payments[] = $def_payment;  
    foreach($available_payments as $v)
    {
        if (!isset($all_keys[$v]["public_key"]) || !isset($all_keys[$v]["private_key"])) 
            die("Please add your public/private keys for '$v' in \$all_keys variable");
        elseif (!strpos($all_keys[$v]["public_key"], "PUB"))  die("Invalid public key for '$v' in \$all_keys variable");
        elseif (!strpos($all_keys[$v]["private_key"], "PRV")) die("Invalid private key for '$v' in \$all_keys variable");
        elseif (strpos(CRYPTOBOX_PRIVATE_KEYS, $all_keys[$v]["private_key"]) === false) 
            die("Please add your private key for '$v' in variable \$cryptobox_private_keys, file cryptobox.config.php.");
    }
    
    // Optional - Language selection list for payment box (html code)
    $languages_list = display_language_box($def_language);
    
    // Optional - Coin selection list (html code)
    $coins_list = display_currency_box($available_payments, $def_payment, $def_language, 70, "margin: 5px 0 0 20px");
    $coinName = CRYPTOBOX_SELCOIN; // current selected coin by user
    
    // Current Coin public/private keys
    $public_key  = $all_keys[$coinName]["public_key"];
    $private_key = $all_keys[$coinName]["private_key"];
    
    /** PAYMENT BOX **/
    $options = array(
            "public_key"  => $public_key,   // your public key from gourl.io
            "private_key" => $private_key,  // your private key from gourl.io
            "webdev_key"  => "",            // optional, gourl affiliate key
            "orderID"     => $orderID,      // order id
            "userID"      => $userID,       // unique identifier for every user
            "userFormat"  => $userFormat,   // save userID in COOKIE, IPADDRESS or SESSION
            "amount"      => 0,             // price in coins OR in USD below
            "amountUSD"   => $amountUSD,    // we use price in USD
            "period"      => $period,       // payment valid period
            "language"    => $def_language  // text on EN - english, FR - french, etc
    );

    // Initialise Payment Class
    $box = new Cryptobox ($options);
    
    // coin name
    $coinName = $box->coin_name();

    
    // ...
    // Also you can use IPN function cryptobox_new_payment($paymentID = 0, $payment_details = array(), $box_status = "") 
    // for send confirmation email, update database, update user membership, etc.
    // You need to modify file - cryptobox.newpayment.php, read more - https://gourl.io/api-php.html#ipn
    // ...

    
?>

<!DOCTYPE html>
<html><head>
<title>Pay-Per-Page Access Cryptocoin (payments in multiple cryptocurrencies) Payment Example</title>
<meta http-equiv='cache-control' content='no-cache'>
<meta http-equiv='Expires' content='-1'>
<script src='cryptobox.min.js' type='text/javascript'></script>
</head>
<body style='font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#666;margin:0'>
<div align='center'>
<br><h2>Example - Visitors Access to Your Premium Webpage (Pay-Per-Page)</h2>
Price: ~<?= $amountUSD ?> US$ for <?= $period ?> access.  <br><br>

<?php if ($box->is_paid()): ?>

    <!-- Successful Cryptocoin Payment received -->
    <!-- You can use the same payment gateway code for few your pages (page1, page2, section1) -->   
    <!-- Your Premium Page(s) Code  -->
     
    <h2 style='color:#339e2e;'>Cryptocoin Payment received<br>Successful Access to Premium Page (during <?= $period ?>)</h2>
    <img alt='Cryptocoin Pay Per Page Access' border='0' src='https://gourl.io/images/example9_2.jpg'>
    
<? else: ?>

     <!-- Awaiting Payment -->
    <img alt='Awaiting Payment - Cryptocoin Pay Per Page Access' border='0' src='https://gourl.io/images/example9.jpg'>
    <br><br><br><br>
    
    <? if (!$box->is_paid()) echo $coins_list;  ?>
    <div style='font-size:12px;margin:30px 0 5px 370px'>Language: &#160; <?= $languages_list ?></div>
    <?= $box->display_cryptobox(true, 530, 230, "padding:3px 6px;margin:10px") ?>
    
<? endif; ?>    

</div><br><br><br><br><br><br>
</body>
</html>

var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    config = require('./config'),
    i18n = require("i18n");

var routes = require('./routes/index');

var app = express();

i18n.configure({
    defaultLocale: "en",
    directory: __dirname + '/locales',
    autoReload: true
});

i18n.setLocale(config.locale);

// default: using 'accept-language' header to guess language settings
app.use(i18n.init);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
