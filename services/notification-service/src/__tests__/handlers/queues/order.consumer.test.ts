import { consumerOrderEmail } from "../../../handlers/queues/order.consumer";
import { sendMail } from "@notifications/utils/sendMail.util";
import {
  getOrderPlacedTemplate,
  getOrderReceiptTemplate,
  getGenericTemplate
} from "@notifications/utils/emailTemplates.util";
import { CLIENT_URL } from "@notifications/constants/env.constants";
import { AmqpChannel } from "@notifications/configs/rabbitmq.config";

// Mock dependencies
jest.mock("@notifications/utils/sendMail.util");
jest.mock("@notifications/utils/emailTemplates.util");
jest.mock("@notifications/utils/logger.util", () => ({
  log: {
    error: jest.fn(),
    info: jest.fn(),
    log: jest.fn(),
  },
}));
jest.mock("@notifications/configs/rabbitmq.config", () => ({
  createConnection: jest.fn(),
}));

describe("Order Consumer", () => {
  // Create a mock channel
  const mockChannel = {
    assertExchange: jest.fn().mockResolvedValue({}),
    assertQueue: jest.fn().mockResolvedValue({ queue: "test-queue" }),
    bindQueue: jest.fn().mockResolvedValue({}),
    consume: jest.fn(),
    ack: jest.fn(),
  };

  // Mock template functions
  const mockOrderPlacedTemplate = { subject: "Order Placed", text: "Order placed text", html: "<p>Order placed</p>" };
  const mockOrderReceiptTemplate = { subject: "Order Receipt", text: "Order receipt text", html: "<p>Order receipt</p>" };
  const mockGenericTemplate = { subject: "Generic", text: "Generic text", html: "<p>Generic</p>" };

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mocks for template functions
    (getOrderPlacedTemplate as jest.Mock).mockReturnValue(mockOrderPlacedTemplate);
    (getOrderReceiptTemplate as jest.Mock).mockReturnValue(mockOrderReceiptTemplate);
    (getGenericTemplate as jest.Mock).mockReturnValue(mockGenericTemplate);

    // Setup mock for sendMail
    (sendMail as jest.Mock).mockResolvedValue({});
  });

  it("should process order-placed template messages correctly", async () => {
    // Arrange
    const orderPlacedMessage = {
      receiverEmail: "seller@example.com",
      template: "order-placed",
      amount: 100,
      customerUsername: "buyer",
      contractorUsername: "seller",
      title: "Test Service",
      description: "Test service description",
      orderId: "order123",
      orderDue: "2023-12-31",
      requirements: "<p>Test requirements</p>",
      orderUrl: "https://example.com/orders/123",
      serviceFee: 10,
      total: 110
    };

    // Setup the consume method to call the callback with our test message
    mockChannel.consume = jest.fn().mockImplementation((_queue, callback) => {
      const msg = {
        content: Buffer.from(JSON.stringify(orderPlacedMessage)),
      };
      callback(msg);
      return Promise.resolve({});
    });

    // Act
    await consumerOrderEmail(mockChannel as unknown as AmqpChannel);

    // Assert
    expect(mockChannel.assertExchange).toHaveBeenCalledWith("service-hub-order-notification", "direct");
    expect(mockChannel.assertQueue).toHaveBeenCalledWith("order-email-queue", {
      durable: true,
      autoDelete: false,
    });
    expect(mockChannel.bindQueue).toHaveBeenCalledWith("test-queue", "service-hub-order-notification", "order-email");
    expect(mockChannel.consume).toHaveBeenCalledWith("test-queue", expect.any(Function));

    // Verify that sendMail was called twice (once for order-placed and once for order-receipt)
    expect(sendMail).toHaveBeenCalledTimes(2);

    // Verify order-placed email
    expect(getOrderPlacedTemplate).toHaveBeenCalledWith(expect.objectContaining({
      appLink: CLIENT_URL,
      appIcon: expect.any(String),
      customerUsername: "buyer",
      contractorUsername: "seller",
      orderId: "order123",
      orderDue: "2023-12-31",
      title: "Test Service",
      description: "Test service description",
      amount: 100,
      requirements: "<p>Test requirements</p>",
      orderUrl: "https://example.com/orders/123"
    }));

    // Verify order-receipt email
    expect(getOrderReceiptTemplate).toHaveBeenCalledWith(expect.objectContaining({
      appLink: CLIENT_URL,
      appIcon: expect.any(String),
      customerUsername: "buyer",
      title: "Test Service",
      description: "Test service description",
      amount: 100,
      serviceFee: 10,
      total: 110,
      orderUrl: "https://example.com/orders/123",
      orderId: "order123"
    }));

    // Verify sendMail calls
    expect(sendMail).toHaveBeenNthCalledWith(1, {
      to: "seller@example.com",
      ...mockOrderPlacedTemplate
    });

    expect(sendMail).toHaveBeenNthCalledWith(2, {
      to: "seller@example.com",
      ...mockOrderReceiptTemplate
    });
  });

  it("should process generic template messages correctly", async () => {
    // Arrange
    const genericMessage = {
      receiverEmail: "user@example.com",
      template: "generic",
      header: "Test Notification",
      message: "This is a test notification",
      subject: "Test Subject",
      orderUrl: "https://example.com/orders/123"
    };

    // Setup the consume method to call the callback with our test message
    mockChannel.consume = jest.fn().mockImplementation((_queue, callback) => {
      const msg = {
        content: Buffer.from(JSON.stringify(genericMessage)),
      };
      callback(msg);
      return Promise.resolve({});
    });

    // Act
    await consumerOrderEmail(mockChannel as unknown as AmqpChannel);

    // Assert
    // Verify that sendMail was called once for the generic template
    expect(sendMail).toHaveBeenCalledTimes(1);

    // Verify generic email
    expect(getGenericTemplate).toHaveBeenCalledWith(expect.objectContaining({
      appLink: CLIENT_URL,
      appIcon: expect.any(String),
      header: "Test Notification",
      message: "This is a test notification",
      subject: "Test Subject",
      orderUrl: "https://example.com/orders/123"
    }));

    // Verify sendMail call
    expect(sendMail).toHaveBeenCalledWith({
      to: "user@example.com",
      ...mockGenericTemplate
    });
  });

  it("should handle errors gracefully", async () => {
    // Arrange
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    // Setup the consume method to throw an error
    mockChannel.consume = jest.fn().mockImplementation((_queue, _callback) => {
      throw new Error("Test error");
    });

    // Act
    await consumerOrderEmail(mockChannel as unknown as AmqpChannel);

    // Assert
    // Verify that the error was handled gracefully
    expect(consoleSpy).not.toHaveBeenCalled();
  });
});
