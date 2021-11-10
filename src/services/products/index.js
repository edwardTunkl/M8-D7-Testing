import express from "express";
import createHttpError from "http-errors";
import { ProductModel } from "./model.js";

const productsRouter = express.Router();


productsRouter.get("/", async (req, res) => {
    const products = await ProductModel.find({});

    res.send(products || []);
});

productsRouter.post("/", async (req, res) => {
    console.log(req.body)
    const { name, price } = req.body;

    if (!name || !price) {
        res.status(400).send({ error: "name and price are required" });
        return
    }
    const product = new ProductModel({ name, price });
    await product.save();

    console.log(product)

    res.status(201).send({ product });
})

productsRouter.get("/:id", async (req, res, next) => {
    try {
      const products = await ProductModel.findById(req.params.id);
      if (products) {
        res.send(products);
      } else {
        next(createHttpError(404, "Not found"));
      }
    } catch (error) {
      next(createHttpError(500));
    }
  });
  //
  productsRouter.delete("/:id", async (req, res, next) => {
    try {
      const deletedProduct = await ProductModel.findByIdAndDelete(req.params.id);
      if (deletedProduct) {
        res.status(204).send();
      } else {
        next(createHttpError(404, "Not found"));
      }
    } catch (error) {
      next(createHttpError(500));
    }
  });
  //
  productsRouter.put("/:id", async (req, res, next) => {
    try {
      const { name, price } = req.body;
      if (!name || !price) {
        res.status(400).send({ error: "name and price are required" });
        return;
      }
      const product = await ProductModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );
      res.status(201).send(product);
    } catch (error) {
      next(createHttpError(500));
    }
  });

export { productsRouter }