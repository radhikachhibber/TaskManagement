export default {
  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async up(db, client) {
    await db.createCollection("users", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["name", "email","password"],
          properties: {
            name: {
              bsonType: "string",
              description: "User's full name"
            },
            email: {
              bsonType: "string",
              pattern: "^.+@.+$",
              description: "User's email address"
            },
            password: {
              bsonType: "string",
              description: "User's password"
            },
            createdAt: {
              bsonType: "date",
              description: "Timestamp when user was created"
            }
          }
        }}
    }); 
    
  },

  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async down(db, client) {
    await db.collection("users").drop();
  }
};
