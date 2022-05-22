const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
  const { items, email } = req.body;

  //restructure items to be passed to Stripe
  const transformedItems = items.map((item) => ({
    description: item.description,
    quantity: 1,
    price_data: {
      unit_amount: item.price * 100,
      currency: "usd",
      product_data: {
        name: item.title,
        images: [item.image],
      },
    },
  }));

  //Creating a Checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    shipping_rates: ["shr_1L0mfpHxSBPC8DEJPWWXsjv8"],
    shipping_address_collection: {
      allowed_countries: ["GB", "US", "CA"],
    },
    line_items: transformedItems,
    mode: "payment",
    success_url: `${process.env.HOST}/success`,
    cancel_url: `${process.env.HOST}/checkout`,
    metadata: {
      email,
      images: JSON.stringify(items.map((item) => item.image)),
    },
  });

  //Response
  res.status(200).json({ id: session.id });
};
