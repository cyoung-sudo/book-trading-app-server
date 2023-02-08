module.exports = {
  testTrade: {
    _id: "a12345678901234567890123",
    initiatorUsername: "User1",
    initiatorId: "a12345678901234567890123",
    offer: [
      {
        bookId: "a12345678901234567890123",
        bookTitle: "Book1"
      }
    ],
    recipientUsername: "User2",
    recipientId: "b12345678901234567890123",
    request: [
      {
        bookId: "b12345678901234567890123",
        bookTitle: "Book2"
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  testTrades: [
    {
      _id: "a12345678901234567890123",
      initiatorUsername: "User1",
      initiatorId: "a12345678901234567890123",
      offer: [
        {
          bookId: "a12345678901234567890123",
          bookTitle: "Book1"
        }
      ],
      recipientUsername: "User2",
      recipientId: "b12345678901234567890123",
      request: [
        {
          bookId: "b12345678901234567890123",
          bookTitle: "Book2"
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: "b12345678901234567890123",
      initiatorUsername: "User3",
      initiatorId: "c12345678901234567890123",
      offer: [
        {
          bookId: "c12345678901234567890123",
          bookTitle: "Book3"
        }
      ],
      recipientUsername: "User4",
      recipientId: "d12345678901234567890123",
      request: [
        {
          bookId: "d12345678901234567890123",
          bookTitle: "Book4"
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]
};