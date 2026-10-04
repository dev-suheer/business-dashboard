import { sub, sum } from './money'

/* Vendor orders with no portal row still sit in the client totals. Their food amount
   and fees are the vendor's own, and the customer delivery is what is left of the
   original fee once both shares are taken off. */
function customerDelivery(order) {
  if (order.portal) return order.portal.sg_delivery ?? '0'
  const vendor = order.vendor
  if (!vendor) return '0'
  return sub(
    sub(vendor.original_delivery_fee ?? '0', vendor.sg_delivery_charge ?? '0'),
    vendor.chef_delivery_charge ?? '0',
  )
}

/* The horizontal block at the bottom of the client recon sheet. Money stays in
   decimal strings; every figure is already at two decimal places. */
export function clientRecon(orders) {
  const paired = orders.filter(
    (order) => order.portal && order.vendor && order.checks?.ids_match,
  )
  const vendorOnly = orders.filter((order) => order.verdict === 'vendor_only')

  const sgFood = sum([
    ...paired.map((order) => order.portal.sub_total),
    ...vendorOnly.map((order) => order.vendor.order_chef_total),
  ])
  const vendorFood = sum([
    ...paired.map((order) => order.vendor.order_chef_total),
    ...vendorOnly.map((order) => order.vendor.order_chef_total),
  ])
  const difference = sub(vendorFood, sgFood)
  const delivery = sum([
    ...paired.map((order) => order.portal.sg_delivery),
    ...vendorOnly.map(customerDelivery),
  ])
  const addDc = sum([
    ...paired.map((order) => order.checks.sg_delivery_share ?? '0'),
    ...vendorOnly.map((order) => order.vendor.sg_delivery_charge ?? '0'),
  ])
  const commission = sum([
    ...paired.map((order) => order.portal.commission_charged),
    ...vendorOnly.map((order) => order.vendor.shoppinggate_fees),
  ])
  const fees = sum([
    ...paired.map((order) => order.vendor.shoppinggate_fees),
    ...vendorOnly.map((order) => order.vendor.shoppinggate_fees),
  ])
  const roundOff = sub(fees, commission)
  const com = sub('0', commission)
  const wallet = sum(paired.map((order) => order.portal.wallet_amount))
  const card = sum(paired.map((order) => order.portal.card_amount))
  const collection = sum([wallet, card])
  const portalTotal = sum(paired.map((order) => order.portal.total_amount))
  const collectionGap = sub(collection, portalTotal)
  const promo = sum(paired.map((order) => order.portal.discount))
  const remaining = sum([promo, collectionGap])
  const total = sum([sgFood, delivery, addDc, com, difference, sub('0', roundOff)])

  return {
    sgFood,
    vendorFood,
    difference,
    food: sgFood,
    delivery,
    addDc,
    roundOff,
    com,
    total,
    wallet,
    card,
    collection,
    portalTotal,
    collectionGap,
    promo,
    remaining,
  }
}
