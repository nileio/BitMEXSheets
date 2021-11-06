/**
 * Calculate Bitmex liquidationPrice for a new position given the price, leverage and quantity.
 *
 * @param {5399.5}  entryPrice the entry price in USD.
 * @param {9500}  quantity the position size in USD. A negative value for a Short position.
 * @param {15}  leverage the leverage to use..Cross leverage is not supported. e.g. 10 
 * @param {5400}  markPrice the current fair mark price.
 * @param {0.00100}  fundingRate the funding rate of XBTUSD. e.g. -0.00143
 * @return liquidation price for a new position.
 * @customfunction
 */

function calcLiquidationPrice(entryPrice,quantity,leverage,markPrice,fundingRate){


const multiplier = -100000000;
const    initCommissionRate = 0.00075;
maintMarginReq = 0.005,
tickSize = 0.5,
initMarginReq= 1/leverage;
var realisedPnl=0;

var markValue = getValue(quantity, markPrice);
var entryValue = getValue(quantity,entryPrice);

var initMargin = Math.abs(entryValue) * initMarginReq;
var commission = Math.round((Math.abs(entryValue) + initMargin) * initCommissionRate);

var unrealisedPnl = markValue - entryValue;  
var realisedPnl = realisedPnl - Math.round(Math.abs(entryValue) * initCommissionRate);

 //N
var maintMargin = initMargin+commission+unrealisedPnl;
//var Margin = initMargin+commission*2; 
 var P = commission + Math.abs(entryValue) * Math.min(initMarginReq, maintMarginReq + Math.max(0,fundingRate*q(quantity)) );
 maintMargin -= P;
 var v = q(markValue), D = G(multiplier,quantity,v* Math.max(0,v* (markValue-maintMargin)) );
 return Number(quantity > 0 ? w(D, tickSize,3) : w(D, tickSize,0)); 
}



/**
 * Calculate Bitmex initial margin for a new position given the price, leverage and quantity.
 *
 * @param {5399.5}  entryPrice the entry price in USD.
 * @param {9500}  quantity the position size in USD. A negative value for a Short position.
 * @param {15}  leverage the leverage to use..Cross leverage is not supported. e.g. 10 
 * @return Initial Margin for a new position.
 * @customfunction
 */

function calcInitMargin(entryPrice,quantity,leverage){

var initMarginReq= 1/leverage;
var entryValue = getValue(quantity,entryPrice);
var initMargin = Math.abs(entryValue) * initMarginReq;

  return initMargin ;
 
 
}



function getValue(quantity,price){
  const multiplier = -100000000;
  const a = Math.round(multiplier / price);
  return Math.round(quantity * a);
}

function q(quantity) {
  return quantity > 0 ? 1 : quantity < 0 ? -1 : 0;
}
function G(e, t, n) {
  var r = e,
    i = t,
    o = n,
    a = q(i),
    s = a * Math.ceil((a * o) / i);
  if (r >= 0) return s / r;
  var l = 0 === s ? q(i / o) : s;
  return Number(w(r / l, 0.0001,1));
}
function w(t, n, r) {
  var i = k(Math.abs(t), n),
    o = q(t),
    a = o * i,
    s = t;
  if (0 === r) s = t - a;
  else if (3 === r || (1 === r && Math.abs(i - n / 2) < n / 10000)) {
    s = t - a + (0 === a ? 0 : o * n);
  } else if (1 === r) {
    s = t - a + (i > n / 2 ? 1 : 0) * n;
  }
  return s.toFixed(b(n));
}
function k(e, t) {
  var n = e % t,
    r = t / 10000;
  return (n < r || n + r > t) && (n = 0), n;
}
function b(e) {
  "string" != typeof e && (e = String(e));
  for (var t = e.length - 2; t > 0; t--) {
    var n = e[t];
    if ("." === n || "," === n) return e.length - t - 1;
  }

  return 0;
}

/**
 * Calculate Bitmex Margin Requirement for a new position given the price, leverage and quantity.
 *
 * @param {5399.5}  entryPrice the entry price in USD.
 * @param {9500}  quantity the position size in USD. A negative value for a Short position.
 * @param {15}  leverage the leverage to use..Cross leverage is not supported. e.g. 10
 * @param {0.00100}  fundingRate the funding rate of XBTUSD. e.g. -0.00143 
 * @param {5200}  bidPrice the current bid price.
 * @param {5250}  askPrice the current ask price.
 * @param {5150}  markPrice the current fair mark price.
 * @return Margin Cost for a new position.
 *
 * @customfunction
 */

function calcMarginRequirement(entryPrice,quantity,leverage,fundingRate,bidPrice,askPrice,markPrice){
//initCommistionRate is always the takerFee. confirmed
const multiplier=-100000000,initCommissionRate = 0.00075;
  const maintMarginReq = 0.005, initMargin = 0,
      initMarginReq= 1/leverage;
//
var n= quantity, r= entryPrice, a = initMarginReq,
s = initCommissionRate, l = initMargin || 0;

var e  = {
    multiplier: multiplier,
    capped: false,
    limitDownPrice: null,
    askPrice: askPrice,
    bidPrice: bidPrice,
    markPrice: markPrice,
    fundingRate: fundingRate,
    maintMarginWithFunding: (maintMarginReq - fundingRate),
    initMargin: 0.01
  },t = {
    commission: initCommissionRate,
    initMarginReq: initMarginReq,
    leverage: leverage,
    maintMarginReq: maintMarginReq,
    symbol: "XBTUSD",
    currentQty: 0,
    openOrderBuyQty: 0,
    openOrderBuyCost: 0,
    openOrderBuyPremium: 0,
    openOrderSellQty: 0,
    openOrderSellCost: 0,
    openOrderSellPremium: 0
  },
      
u = Math.max(0, ie(e, t, n, r)) || 0,
c = Math.max(0, le(e, t, n, r)) || 0,
d = Math.max(0, oe(e, t, n, r)) || 0,

f = Math.round(c + d * a + s * (u + u + d * a)),
x= Math.max(0, f - l) || 0;
  
return x / 100000000;


  
}

function ie(e, t, n, r) {
var i = t.currentQty, //0
o = re(t, n), //5700=quanitty
a = ne(e, t, n, r), //value max value from askValue and entryValue
s = te(t, n),  //openordersellquantity 0
l = ee(e, t, n, r); //max value from -bidValue and -entryValue 0
  return Math.max(Math.abs(a / o * W(i - s, o) || 0) + Math.abs(l / s * W( - i, s) || 0), 
    Math.abs(a / o * W(i, o) || 0) + Math.abs(l / s * W( - i - o, s) || 0))
}

function re(e, t) {
return e.openOrderBuyQty + Math.max(0, t)
}
function ne(e, t, n, r) {
var i = e.multiplier,
o = getValue(Math.max(0, n), r),
a = getValue(Math.max(0, n), Math.min(r, e.askPrice || 1 / 0));
return t.openOrderBuyCost + V(o, a)
}
function ee(e, t, n, r) {
var o = getValue(Math.max(0, - n), r),
a = getValue(Math.max(0, - n), Math.max(r, e.bidPrice || - 1 / 0));
return t.openOrderSellCost + V(o, a)
}
function se(e, t, n, r) {
var i = e.multiplier,
o = getValue(Math.min(0, n), r),
a = getValue(Math.min(0, n), e.markPrice || r),
s = o - Math.abs(o * Math.max(0, $(e, t) - e.maintMarginWithFunding));
return t.openOrderSellPremium + Math.max(0, s - a)
}
function V(e, t) {
return Math.abs(e || 0) >= Math.abs(t || 0) ? e : t
}
function te(e, t) {
return e.openOrderSellQty + Math.max(0, - t)
}

function W(e, t) {
var n = e,
r = t;
return Math.min(0, Math.max(0, n) + Math.min(0, r)) + Math.max(0, Math.min(0, n) + Math.max(0, r))
}
function le(e, t, n, r) {
 // if ('LastPrice' === e.markMethod) return t.grossOpenPremium;
var i = t.currentQty,
o = re(t, n),
a = ae(e, t, n, r),
s = te(t, n),
l = se(e, t, n, r);
return Math.abs(a * W(i, o) / o || 0) + Math.abs(l * W( - i, s) / s || 0)
}
function ae(e, t, n, r) {
var i = e.multiplier,
o = getValue(Math.max(0, n), r),
a = getValue(Math.max(0, n), e.markPrice || r),
s = o - Math.abs(o * Math.max(0, $(e, t) - e.maintMarginWithFunding));
return t.openOrderBuyPremium + Math.max(0, s - a)
}
function $(e, t) {

return t && t.initMarginReq ? t.initMarginReq : e.initMargin
}
function oe(e, t, n, r) {
var i = e.multiplier,
o = t.currentQty,
a = re(t, n),
s = ne(e, t, n, r),
l = te(t, n),
u = ee(e, t, n, r),
c = W(o - l, a),
d = W( - o, l);
return e.capped ? Math.abs(s / a * c - z(i, c, e.limitDownPrice) || 0) + Math.abs(V(z(i, d, e.limitUpPrice) - u / l * d, s / a * d - z(i, d, e.limitDownPrice)) || 0)  : ie(e, t, n, r)
}
