import React from 'react'
import { useSelector } from 'react-redux'
import NoData from '../components/NoData'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'

const MyOrders = () => {
  const orders = useSelector(state => state.orders.order)

  return (
    <div className="grid gap-4">
      <div className="panel-head rounded-card border border-line bg-surface">
        <div>
          <p className="eyebrow">Account</p>
          <h1 className="mt-1 font-display text-lg font-semibold">My orders</h1>
        </div>
        <span className="chip">{orders.length} order{orders.length === 1 ? '' : 's'}</span>
      </div>

      {
        !orders[0] && (
          <div className="panel">
            <NoData title="No orders yet" message="When you place an order, it'll show up here." />
          </div>
        )
      }

      <div className="grid gap-3">
        {
          orders.map((order, index) => {
            return (
              <article key={order._id + index + "order"} className="card flex items-center gap-4 p-4">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-line bg-sunken p-1.5">
                  <img
                    src={order.product_details.image[0]}
                    alt={order.product_details.name}
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="eyebrow">Order {order?.orderId}</p>
                  <p className="mt-1 line-clamp-1 text-sm font-medium text-fg">{order.product_details.name}</p>
                  <p className="mt-0.5 text-xs text-fg-faint">
                    {order?.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : null}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="price text-sm">{DisplayPriceInRupees(order?.totalAmt)}</p>
                  {
                    order?.payment_status && (
                      <span className="chip mt-1.5 text-[10px] uppercase tracking-wider">{order.payment_status}</span>
                    )
                  }
                </div>
              </article>
            )
          })
        }
      </div>
    </div>
  )
}

export default MyOrders
