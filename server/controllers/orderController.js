const sequelize = require("../database");
const ApiError = require("../error/apiError");

const {
  Product,
  Order,
  OrderItem,
  OrderStatus,
  OrderDeliveryCityPayment,
  ProductColorDetails,
} = require("../models/model");

class OrderController {
  async create(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const {
        userId,
        deliveryDate,
        paymentMethod,
        orderStatusId,
        shippingAddress,
        items,
        notes,
        deliveryType,
        customerName,
        customerSurname,
        customerPhoneNumber,
        orderRegion,
        orderDeliveryCityPaymentId,
      } = req.body;

      if (!userId || !items || !Array.isArray(items) || items.length === 0) {
        await transaction.rollback();

        return next(ApiError.badRequest("Invalid order data"));
      }
      const existOrderStatus = await OrderStatus.findByPk(orderStatusId);
      if (!existOrderStatus) {
        await transaction.rollback();

        res.status(400).json({ message: `Order Status not found` });
        return;
      }
      let totalAmount = 0;
      const orderItems = [];

      for (const item of items) {
        const product = await ProductColorDetails.findByPk(item.productId);
        if (!product) {
          await transaction.rollback();

          return res
            .status(400)
            .json({ message: `Product with ID ${item.productId} not found` });
        }

        if (item.quantity > product.productQuantity) {
          await transaction.rollback();

          return res.status(400).json({
            message: `Haryt ${product.nameTm} sany az mukdarda`,
          });
        }

        totalAmount += item.quantity * product.sellPrice;

        orderItems.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.sellPrice,
        });

        // Update product quantity
        await product.update(
          {
            productQuantity: product.productQuantity - item.quantity,
            totalSelling: product.totalSelling + item.quantity,
          },
          { transaction }
        );
      }

      // Get the next available order number
      const maxOrderNumber = await Order.max("orderNumber", { transaction });
      const newOrderNumber = (maxOrderNumber || 0) + 1;
      // Create the order with the new order number
      const order = await Order.create(
        {
          userId,
          totalAmount,
          orderStatusId,
          deliveryDate,
          shippingAddress,
          paymentMethod,
          notes,
          deliveryType,
          customerName,
          customerSurname,
          customerPhoneNumber,
          orderRegion,
          orderDeliveryCityPaymentId,
          orderNumber: newOrderNumber,
        },
        { transaction }
      );

      // Create order items
      for (const orderItem of orderItems) {
        await OrderItem.create(
          {
            ...orderItem,
            orderId: order.id,
          },
          { transaction }
        );
      }

      await transaction.commit();
      return res
        .status(201)
        .json({ message: "Order created successfully", order });
    } catch (error) {
      await transaction.rollback();
      console.error("Error creating order:", error);
      return ApiError.badRequest({ message: error.message });
    }
  }

  // async getAll(req, res, next) {
  //   try {
  //     const {
  //       orderStatus,
  //       minTotalAmount,
  //       maxTotalAmount,
  //       deliveryDate,
  //       sortBy = "createdAt", // Default sorting by creation date
  //       sortOrder = "DESC", // Default descending order
  //       page = 1,
  //       limit = 10,
  //     } = req.query;

  //     const offset = (page - 1) * limit;
  //     const whereConditions = {};

  //     // Filter by order status
  //     if (orderStatus) {
  //       whereConditions["$orderStatus.name$"] = orderStatus; // Using the alias for OrderStatus
  //     }

  //     // Filter by total amount range
  //     if (minTotalAmount || maxTotalAmount) {
  //       const totalAmountCondition = [];
  //       if (minTotalAmount) {
  //         totalAmountCondition.push({ [Op.gte]: minTotalAmount });
  //       }
  //       if (maxTotalAmount) {
  //         totalAmountCondition.push({ [Op.lte]: maxTotalAmount });
  //       }
  //       whereConditions.totalAmount = { [Op.and]: totalAmountCondition };
  //     }

  //     // Filter by delivery date
  //     if (deliveryDate) {
  //       whereConditions.deliveryDate = deliveryDate;
  //     }

  //     // Determine sorting options
  //     let order = [];
  //     if (sortBy === "totalAmount") {
  //       order = [["totalAmount", sortOrder]]; // Sorting by total amount
  //     } else if (sortBy === "createdAt") {
  //       order = [["createdAt", sortOrder]]; // Sorting by creation date
  //     }

  //     // Count the total number of orders matching the filters
  //     const countResult = await Order.count({
  //       where: whereConditions,
  //       distinct: true,
  //     });

  //     // Query the orders with pagination and ordering
  //     const orders = await Order.findAll({
  //       where: whereConditions,
  //       include: [
  //         {
  //           model: OrderItem,
  //           include: [
  //             {
  //               model: Product,
  //               attributes: ["nameTm", "sellPrice", "imageOne"],
  //             },
  //           ],
  //         },
  //         {
  //           model: OrderStatus,
  //           as: "orderStatusDetails", // Use the alias from your association
  //         },
  //       ],
  //       order,
  //       limit: parseInt(limit),
  //       offset,
  //     });

  //     // Return paginated results
  //     return res.status(200).json({
  //       totalItems: countResult,
  //       totalPages: Math.ceil(countResult / limit),
  //       currentPage: parseInt(page),
  //       orders: orders,
  //     });
  //   } catch (e) {
  //     console.error(e);
  //     return next(ApiError.badRequest(e.message));
  //   }
  // }
  // async create(req, res, next) {
  //   const transaction = await sequelize.transaction();
  //   try {
  //     const {
  //       userId,
  //       deliveryDate,
  //       paymentMethod,
  //       orderStatusId,
  //       shippingAddress,
  //       items,
  //       notes,
  //       deliveryType,
  //       customerName,
  //       customerSurname,
  //       customerPhoneNumber,
  //       orderRegion,
  //       orderCity,
  //     } = req.body;

  //     // Базовая проверка на обязательные поля
  //     if (!userId || !items || !Array.isArray(items) || items.length === 0) {
  //       return res.status(400).json({ message: "Invalid order data" });
  //     }

  //     // Проверка существования статуса заказа
  //     const existOrderStatus = await OrderStatus.findByPk(orderStatusId);
  //     if (!existOrderStatus) {
  //       return res.status(400).json({ message: `Status not found` });
  //     }

  //     let totalAmount = 0;
  //     const orderItems = [];
  //     const productsToUpdate = [];

  //     // Проходим по товарам и готовим элементы заказа и обновления товаров
  //     for (const item of items) {
  //       const product = await Product.findByPk(item.productId);
  //       if (!product) {
  //         return res.status(400).json({
  //           message: `Product with ID ${item.productId} not found`,
  //         });
  //       }

  //       if (item.quantity > product.productQuantity) {
  //         return res.status(400).json({
  //           message: `Product ${product.nameTm} is out of stock`,
  //         });
  //       }

  //       totalAmount += item.quantity * product.sellPrice;

  //       orderItems.push({
  //         productId: product.id,
  //         quantity: item.quantity,
  //         price: product.sellPrice,
  //       });

  //       productsToUpdate.push({
  //         id: product.id,
  //         quantity: product.productQuantity - item.quantity,
  //       });
  //     }

  //     // Используем bulkUpdate для обновления количества товаров в одном запросе
  //     if (productsToUpdate.length > 0) {
  //       await Product.bulkCreate(productsToUpdate, {
  //         updateOnDuplicate: ["productQuantity"],
  //         transaction,
  //       });
  //     }

  //     // Получаем следующий доступный номер заказа
  //     const maxOrderNumber = await Order.max("orderNumber", { transaction });
  //     const newOrderNumber = (maxOrderNumber || 0) + 1;

  //     // Создаем заказ
  //     const order = await Order.create(
  //       {
  //         userId,
  //         totalAmount,
  //         orderStatusId,
  //         deliveryDate,
  //         shippingAddress,
  //         paymentMethod,
  //         notes,
  //         deliveryType,
  //         customerName,
  //         customerSurname,
  //         customerPhoneNumber,
  //         orderRegion,
  //         orderCity,
  //         orderNumber: newOrderNumber,
  //       },
  //       { transaction }
  //     );

  //     // Создаем элементы заказа в пакете
  //     if (orderItems.length > 0) {
  //       await OrderItem.bulkCreate(
  //         orderItems.map((orderItem) => ({
  //           ...orderItem,
  //           orderId: order.id,
  //         })),
  //         { transaction }
  //       );
  //     }

  //     // Подтверждаем транзакцию
  //     await transaction.commit();
  //     return res
  //       .status(201)
  //       .json({ message: "Order created successfully", order });
  //   } catch (error) {
  //     await transaction.rollback();
  //     console.error("Error creating order:", error);
  //     return res.status(500).json({ message: error.message });
  //   }
  // }
  // async create(req, res, next) {
  //   const transaction = await sequelize.transaction();
  //   try {
  //     const {
  //       userId,
  //       deliveryDate,
  //       paymentMethod,
  //       orderStatusId,
  //       shippingAddress,
  //       items,
  //       notes,
  //       deliveryType,
  //       customerName,
  //       customerSurname,
  //       customerPhoneNumber,
  //       orderRegion,
  //       orderCity,
  //     } = req.body;

  //     if (!userId || !items || !Array.isArray(items) || items.length === 0) {
  //       await transaction.rollback();
  //       return next(ApiError.badRequest("Invalid order data"));
  //     }

  //     const existOrderStatus = await OrderStatus.findByPk(orderStatusId);
  //     if (!existOrderStatus) {
  //       await transaction.rollback();
  //       return res.status(400).json({ message: `Status not found` });
  //     }

  //     const productIds = items.map((item) => item.productId);
  //     const products = await Product.findAll({
  //       where: { id: productIds },
  //       transaction,
  //     });

  //     if (products.length !== productIds.length) {
  //       await transaction.rollback();
  //       return res
  //         .status(400)
  //         .json({ message: "One or more products not found" });
  //     }

  //     let totalAmount = 0;
  //     const orderItems = [];

  //     for (const [index, product] of products.entries()) {
  //       const item = items[index];

  //       if (item.quantity > product.productQuantity) {
  //         await transaction.rollback();
  //         return res
  //           .status(400)
  //           .json({ message: `Haryt ${product.nameTm} sany az mukdarda` });
  //       }

  //       totalAmount += item.quantity * product.sellPrice;

  //       orderItems.push({
  //         productId: product.id,
  //         quantity: item.quantity,
  //         price: product.sellPrice,
  //       });

  //       product.productQuantity -= item.quantity;
  //     }

  //     // Update products in bulk
  //     await Promise.all(
  //       products.map((product) => product.save({ transaction }))
  //     );

  //     const maxOrderNumber = await Order.max("orderNumber", { transaction });
  //     const newOrderNumber = (maxOrderNumber || 0) + 1;

  //     const order = await Order.create(
  //       {
  //         userId,
  //         totalAmount,
  //         orderStatusId,
  //         deliveryDate,
  //         shippingAddress,
  //         paymentMethod,
  //         notes,
  //         deliveryType,
  //         customerName,
  //         customerSurname,
  //         customerPhoneNumber,
  //         orderRegion,
  //         orderCity,
  //         orderNumber: newOrderNumber,
  //       },
  //       { transaction }
  //     );

  //     await OrderItem.bulkCreate(
  //       orderItems.map((item) => ({ ...item, orderId: order.id })),
  //       { transaction }
  //     );

  //     await transaction.commit();
  //     return res
  //       .status(201)
  //       .json({ message: "Order created successfully", order });
  //   } catch (error) {
  //     await transaction.rollback();
  //     console.error("Error creating order:", error);
  //     return res.status(500).json({ message: error.message });
  //   }
  // }

  async getAll(req, res, next) {
    try {
      const {
        orderNumber, // Filter by order number
        page = 1, // Pagination page (default 1)
        limit = 10, // Pagination limit (default 10)
      } = req.query;

      const offset = (page - 1) * limit;
      const whereConditions = {};

      // Filter by order number
      if (orderNumber) {
        whereConditions.orderNumber = orderNumber;
      }

      // Count the total number of orders matching the filter
      const countResult = await Order.count({
        where: whereConditions,
        distinct: true,
      });

      // Query the orders with pagination
      const orders = await Order.findAll({
        where: whereConditions,
        include: [
          {
            model: OrderItem,
            include: [
              {
                model: Product,
                attributes: ["nameTm", "sellPrice", "imageOne", "totalSelling"],
              },
            ],
          },
          {
            model: OrderStatus,
            as: "orderStatusDetails",
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          {
            model: OrderDeliveryCityPayment,
            as: "orderDeliveryCityPayment",
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
        limit: parseInt(limit),
        offset,
      });

      // Return paginated results
      return res.status(200).json({
        totalItems: countResult,
        totalPages: Math.ceil(countResult / limit),
        currentPage: parseInt(page),
        orders: orders,
      });
    } catch (e) {
      console.error(e);
      return next(ApiError.badRequest(e.message));
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.query;

      const order = await Order.findByPk(id, {
        include: [
          {
            model: OrderItem,
            include: [{ model: Product }],
          },
          {
            model: OrderStatus,
            as: "orderStatusDetails", // Use the alias from your association
          },
          {
            model: OrderDeliveryCityPayment,
            as: "orderDeliveryCityPayment",
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      return res.status(200).json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      return res.status(500).json({ message: error.message });
    }
  }
  // async cancelOrder(req, res, next) {
  //   const transaction = await sequelize.transaction();
  //   try {
  //     const { orderId } = req.query;

  //     // Find the order
  //     const order = await Order.findByPk(orderId);
  //     if (!order) {
  //       return res.status(404).json({ message: "Order not found" });
  //     }

  //     // Check if the order is already canceled or processed
  //     if (
  //       order.orderStatusDetails?.nameEn === "Cancelled" ||
  //       order.orderStatusDetails?.nameEn === "Delivered"
  //     ) {
  //       return res.status(400).json({ message: "Order cannot be canceled" });
  //     }

  //     // Find all order items related to this order
  //     const orderItems = await OrderItem.findAll({
  //       where: { orderId: order.id },
  //     });

  //     // Loop through order items and restore product quantities
  //     for (const orderItem of orderItems) {
  //       const product = await Product.findByPk(orderItem.productId);
  //       if (!product) {
  //         throw new Error(`Product with ID ${orderItem.productId} not found`);
  //       }

  //       // Increase product quantity
  //       await product.update(
  //         { productQuantity: product.productQuantity + orderItem.quantity },
  //         { transaction }
  //       );
  //     }

  //     // Update the order status to 'canceled'
  //     await order.update({ orderStatusId: "canceled" }, { transaction });

  //     await transaction.commit();

  //     return res.status(200).json({ message: "Order canceled successfully" });
  //   } catch (error) {
  //     await transaction.rollback();
  //     console.error("Error canceling order:", error);
  //     return res.status(500).json({ message: error.message });
  //   }
  // }
  async cancelOrder(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { orderId } = req.query;
      // Find the order
      const order = await Order.findByPk(orderId);
      if (!order) {
        await transaction.rollback();
        return res.status(404).json({ message: "Order not found" });
      }

      // Fetch the canceled status ID from OrderStatus table
      const canceledStatus = await OrderStatus.findOne({
        where: { nameEn: "Cancelled" },
      });

      if (!canceledStatus) {
        await transaction.rollback();
        return res.status(400).json({ message: "Canceled status not found" });
      }

      // Check if the order is already canceled or processed
      if (
        order.orderStatusId === canceledStatus.id ||
        order.orderStatusDetails?.nameEn === "Delivered"
      ) {
        await transaction.rollback();
        return res.status(400).json({ message: "Order cannot be canceled" });
      }

      // Find all order items related to this order
      const orderItems = await OrderItem.findAll({
        where: { orderId: order.id },
      });

      // Loop through order items and restore product quantities
      for (const orderItem of orderItems) {
        const product = await Product.findByPk(orderItem.productId);
        if (!product) {
          await transaction.rollback();
          throw new Error(`Product with ID ${orderItem.productId} not found`);
        }

        // Increase product quantity
        await product.update(
          { productQuantity: product.productQuantity + orderItem.quantity },
          { transaction }
        );
      }

      // Update the order status to 'canceled' using the status UUID or ID
      await order.update({ orderStatusId: canceledStatus.id }, { transaction });

      await transaction.commit();

      return res.status(200).json({ message: "Order canceled successfully" });
    } catch (error) {
      await transaction.rollback();
      console.error("Error canceling order:", error);
      return res.status(500).json({ message: error.message });
    }
  }
  // async updateOrderStatus(req, res, next) {
  //   const transaction = await sequelize.transaction();

  //   try {
  //     const { orderId, newStatusId } = req.query;

  //     if (!orderId || !newStatusId) {
  //       await transaction.rollback();
  //       return res
  //         .status(400)
  //         .json({ message: "Order ID and Status are required" });
  //     }

  //     // Find the order
  //     const order = await Order.findByPk(orderId);
  //     if (!order) {
  //       await transaction.rollback();
  //       return res.status(404).json({ message: "Order not found" });
  //     }

  //     // Fetch the provided status from the OrderStatus table
  //     const orderStatus = await OrderStatus.findByPk(newStatusId);

  //     if (!orderStatus) {
  //       await transaction.rollback();
  //       return res.status(400).json({ message: "Invalid order status ID" });
  //     }

  //     // Check if the order is already in the target status
  //     if (order.orderStatusId === newStatusId) {
  //       await transaction.rollback();

  //       return res
  //         .status(400)
  //         .json({ message: "Order already has this status" });
  //     }

  //     // If canceling, restore product quantities
  //     if (orderStatus.nameEn === "Cancelled") {
  //       const orderItems = await OrderItem.findAll({
  //         where: { orderId: order.id },
  //       });

  //       for (const orderItem of orderItems) {
  //         const product = await Product.findByPk(orderItem.productId);
  //         if (product) {
  //           await product.update(
  //             { productQuantity: product.productQuantity + orderItem.quantity },
  //             { transaction }
  //           );
  //         }
  //       }
  //     }

  //     // Update the order status
  //     await order.update({ orderStatusId: newStatusId }, { transaction });

  //     await transaction.commit();

  //     return res
  //       .status(200)
  //       .json({ message: "Order status updated successfully" });
  //   } catch (error) {
  //     await transaction.rollback();
  //     console.error("Error updating order status:", error);
  //     return res.status(500).json({ message: error.message });
  //   }
  // }
  async updateOrderStatus(req, res, next) {
    const transaction = await sequelize.transaction();

    try {
      const { orderId, newStatusId } = req.query;

      if (!orderId || !newStatusId) {
        await transaction.rollback();
        return res
          .status(400)
          .json({ message: "Order ID and Status are required" });
      }

      // Найти заказ
      const order = await Order.findByPk(orderId);
      if (!order) {
        await transaction.rollback();
        return res.status(404).json({ message: "Order not found" });
      }

      // Получить статус заказа
      const currentOrderStatus = await OrderStatus.findByPk(
        order.orderStatusId
      );
      const newOrderStatus = await OrderStatus.findByPk(newStatusId);

      if (!newOrderStatus) {
        await transaction.rollback();
        return res.status(400).json({ message: "Invalid order status ID" });
      }

      // Проверка: Запретить изменение статуса, если заказ отменен или доставлен
      const immutableStatuses = ["Cancelled", "Delivered"];
      if (
        currentOrderStatus &&
        immutableStatuses.includes(currentOrderStatus.nameEn)
      ) {
        await transaction.rollback();
        return res.status(400).json({
          message: "Cannot change status of a cancelled or delivered order",
        });
      }

      // Проверка: Заказ уже имеет этот статус
      if (order.orderStatusId === newStatusId) {
        await transaction.rollback();
        return res
          .status(400)
          .json({ message: "Order already has this status" });
      }

      // Если статус "Cancelled", восстановить количество товара
      if (newOrderStatus.nameEn === "Cancelled") {
        const orderItems = await OrderItem.findAll({
          where: { orderId: order.id },
        });

        for (const orderItem of orderItems) {
          const product = await Product.findByPk(orderItem.productId);
          if (product) {
            await product.update(
              {
                productQuantity: product.productQuantity + orderItem.quantity,
                totalSelling: product.totalSelling - orderItem.quantity,
              },
              { transaction }
            );
          }
        }
      }

      // Обновить статус заказа
      await order.update({ orderStatusId: newStatusId }, { transaction });

      await transaction.commit();

      return res
        .status(200)
        .json({ message: "Order status updated successfully" });
    } catch (error) {
      await transaction.rollback();
      console.error("Error updating order status:", error);
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new OrderController();
