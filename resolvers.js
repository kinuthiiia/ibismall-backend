import { Customer } from "./models/customer.js";
import { LowLevel } from "./models/lowLevel.js";
import { MidLevel } from "./models/midLevel.js";
import { Order } from "./models/order.js";
import { Post } from "./models/post.js";
import { Product } from "./models/product.js";
import { Seller } from "./models/seller.js";
import { TopLevel } from "./models/topLevel.js";
import { Transaction } from "./models/transaction.js";

import dotenv from "dotenv";
import cloudinary from "cloudinary";

dotenv.config();

function omit(obj, ...props) {
  const result = { ...obj };
  props.forEach(function (prop) {
    delete result[prop];
  });
  return result;
}

function getUnique(value, index, array) {
  return self.indexOf(value) === index;
}

cloudinary.v2.config({
  cloud_name: "dxjhcfinq",
  api_key: "292858742431259",
  api_secret: "os1QzAVfEfifsaRgMvsXEfXlPws",
});

const resolvers = {
  MidLevel: {
    topLevel: async (parent, args, context, info) => {
      const topLevel = await TopLevel.findById(args?.topLevel);
      return topLevel;
    },
  },

  Query: {
    getSellers: async (_, args) => {
      const sellers = await Seller.find({});
      return sellers;
    },
    getCategories: async (_, args) => {
      let categories = [];

      const lowLevels = await LowLevel.find({}).populate("midLevel");

      let x = lowLevels.filter((lowLevel) => getUnique(lowLevel.midLevel.id));

      console.log(x);

      return categories;
    },
  },

  Mutation: {
    createSeller: async (_, args) => {
      const {
        name,
        image,
        description,
        email,
        password,
        phoneNumber,
        carousels,
      } = args;

      cloudinary.v2.uploader
        .upload(image, {
          public_id: "",
          folder: "sellers",
        })
        .then((res) => {
          console.log(res.url);
          let newSeller = new Seller({
            name,
            image: res.url,
            description,
            email,
            password,
            phoneNumber,
            carousels,
          });

          let seller = newSeller.save();
          return seller;
        })
        .catch((err) => null);
    },

    createProduct: async (_, args) => {
      const {
        name,
        price,
        priceBefore,
        tags,
        seller,
        category,
        description,
        single,
        fromAbroad,
        variant,
        sizes,
        images,
      } = args;

      let imageURLs = [];

      for (const image of images) {
        let res = await cloudinary.v2.uploader.upload(image, {
          public_id: "",
          folder: "products",
        });

        console.log(res?.url);

        imageURLs.push(res?.url);
      }

      let newProduct = new Product({
        name,
        images: imageURLs,
        ratings: [],
        reviews: [],
        soldQuantity: 0,
        price,
        priceBefore,
        flashEnd: null,
        tags,
        seller,
        category,
        description,
        single,
        variant: JSON.parse(variant),
        sizes,
        fromAbroad,
        soldOut: false,
        removed: false,
      });

      let product = newProduct.save();
      return product;
    },

    createCustomer: async (_, args) => {
      const { name, photo, email, password, phoneNumber } = args;

      cloudinary.v2.uploader
        .upload(photo, {
          public_id: "",
          folder: "customers",
        })
        .then((res) => {
          let newCustomer = new Customer({
            name,
            photo: res.url,
            email,
            password,
            phoneNumber,
          });

          let customer = newCustomer.save();
          return customer;
        })
        .catch((err) => null);
    },

    createCategory: async (_, args) => {
      const { topLevel, midLevel, lowLevel } = args;

      if (topLevel && !midLevel && !lowLevel) {
        let newTopLevel = new TopLevel({
          label: topLevel,
        });

        newTopLevel.save();
      }

      if (topLevel && midLevel && !lowLevel) {
        let newMidLevel = new MidLevel({
          label: midLevel,
          topLevel,
        });

        newMidLevel.save();
      }

      if (midLevel && lowLevel) {
        let newLowLevel = new LowLevel({
          label: lowLevel,
          midLevel,
        });

        newLowLevel.save();
      }
    },

    addToCart: async (_, args) => {
      const { product, quantity, variantIndex, price, customer } = args;

      const newOrder = new Order({
        product,
        quantity,
        variantIndex,
        price,
      });

      newOrder.save().then(async (_order) => {
        await Customer.updateOne(
          { id: customer },
          {
            $addToSet: { cart: _order?.id },
          }
        );
      });

      return true;
    },

    removeFromCart: async (_, args) => {
      const { customer, order } = args;

      await Customer.updateOne(
        { id: customer },
        { $pull: { cart: order } }
      ).then(async () => {
        await Order.findByIdAndDelete(order);
      });

      return true;
    },

    changeQuantity: async (_, args) => {
      const { order, quantity } = args;

      await Order.updateOne(
        { id: order },
        {
          quantity,
        }
      );

      let _order = Order.findById(order).populate("product");
      return _order;
    },

    checkout: async (_, args) => {
      const {
        orders,
        transactionCode,
        paymentMode,
        amount,
        timestamp,
        customer,
      } = args;

      for (const order of orders) {
        await Order.updateOne(
          { _id: order },
          { $set: { placementDate: Date.now().toString() } }
        );
      }

      let newTransaction = new Transaction({
        customer,
        payment: {
          transactionCode,
          paymentMode,
          amount,
          timestamp,
        },
        orders,
      });

      let transaction = newTransaction.save();
      return transaction;
    },

    writeReview: async (_, args) => {
      const { text, rating, customer, product, image } = args;

      if (image) {
        cloudinary.v2.uploader
          .upload(image, {
            public_id: "",
            folder: "reviews",
          })
          .then(async (res) => {
            console.log(res.url);

            await Product.updateOne(
              { _id: product },
              {
                $addToSet: {
                  reviews: {
                    customer,
                    text,
                    image: res.url,
                    timestamp: Date.now().toString(),
                  },
                  ratings: rating,
                },
              }
            );

            let _product = await Product.findById(product);
            return _product;
          })
          .catch((err) => null);
      } else {
        await Product.updateOne(
          { _id: product },
          {
            $addToSet: {
              reviews: {
                customer,
                text,
                timestamp: Date.now().toString(),
              },
              ratings: rating,
            },
          }
        );

        let _product = await Product.findById(product);
        return _product;
      }
    },

    changeOrderStatus: async (_, args) => {
      const { status, id } = args;

      let order;
      switch (status) {
        case "PACKAGED":
          await Order.updateOne(
            { _id: id },
            { packagedDate: Date.now().toString() }
          );

          order = await Order.findById(id);

          break;
        case "SHIPPED":
          await Order.updateOne(
            { _id: id },
            { shippedDate: Date.now().toString() }
          );

          order = await Order.findById(id);
          break;
        case "DISBURSED":
          await Order.updateOne(
            { _id: id },
            { disbursementDate: Date.now().toString() }
          );

          order = await Order.findById(id);
          break;
        default:
          null;
          break;
      }

      return order;
    },
  },
};

export default resolvers;
