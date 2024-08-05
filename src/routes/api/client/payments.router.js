import { Router } from "express";
import { logger } from "../../../utils/logger.js";
// import { MP_ACCESS_TOKEN } from "../../../config/env.js";
import { MercadoPagoConfig, Preference } from "mercadopago";

// Utiliza el access_token del archivo de configuración
// const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });

const clientPaymentsRouter = Router();

clientPaymentsRouter.post("/generate_payment", async (req, res) => {
  try {
    let body = {
      items: [
        {
          title: req.body.description,
          unit_price: Number(req.body.price),
          quantity: Number(req.body.quantity),
        },
      ],
      back_urls: {
        success: "http://localhost:3000/api/client/feedback",
        failure: "http://localhost:3000/api/client/feedback",
        pending: "http://localhost:3000/api/client/feedback",
      },
      auto_return: "approved",
    };

    logger.info("body" + JSON.stringify(body));

    // const preference = new Preference(client);

    // logger.info("preference" + JSON.stringify(preference));

    // const result = await preference.create({ body });

    logger.info("result" + JSON.stringify(result));
    logger.info("result" + result);

    res.json({
      id: result.id,
    });
  } catch (err) {
    logger.error("Error creating preference:", err);
    res.status(500).json({ error: `Internal Server Error: ${JSON.stringify(err)}` });
  }
});

clientPaymentsRouter.get("/feedback", function (req, res) {
  res.json({
    Payment: req.query.payment_id,
    Status: req.query.status,
    MerchantOrder: req.query.merchant_order_id,
  });
});

export default clientPaymentsRouter;
