import { getSession, useSession } from "next-auth/react";
import React from "react";
import db from "../../firebase";
import Header from "../components/Header";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import moment from "moment";
import Order from "../components/Order";

function Orders({ orders }) {
  const { data: session } = useSession();

  return (
    <div>
      <Header />
      <main className="max-w-screen-lg mx-auto p-10">
        <h1 className="text-3xl border-b mb-2 pb-1 border-yellow-400">
          Your Orders
        </h1>

        {session ? (
          <h2>{orders.length} Orders</h2>
        ) : (
          <h2> Please Sign to view your orders</h2>
        )}

        <div className="mt-5 space-y-4">
          {orders?.map(
            ({ id, amount, amountShipping, items, timestamp, images }) => (
              <Order
                key={id}
                id={id}
                amount={amount}
                amountShipping={amountShipping}
                items={items}
                timestamp={timestamp}
                images={images}
              />
            )
          )}
        </div>
      </main>
    </div>
  );
}

export default Orders;

export async function getServerSideProps(context) {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

  const session = await getSession(context);

  if (!session) {
    return {
      props: {},
    };
  }

  //query from firestore
  // console.log(firestore);
  const colRef = collection(db, `users/${session.user.email}/orders`);
  const q = query(colRef, orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);

  //map the snapshot and get stripe data
  const orders = await Promise.all(
    snapshot.docs.map(async (sdoc) => {
      return {
        id: sdoc.id,
        amount: sdoc.data().amount,
        amountShipping: sdoc.data().amount_shipping,
        images: sdoc.data().images,
        timestamp: moment(sdoc.data().timestamp.toDate()).unix(),
        items: await stripe.checkout.sessions.listLineItems(sdoc.id, {
          limit: 100,
        }),
      };
    })
  );

  return {
    props: {
      orders,
    },
  };
}
