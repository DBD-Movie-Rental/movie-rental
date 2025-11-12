use("movieRental");

// -----------------------------------------------------------------------------
// customers - addresses and recentRentals embedded
// -----------------------------------------------------------------------------
db.createCollection("customers", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["firstName", "lastName", "email", "createdAt"],
      properties: {
        firstName: { bsonType: "string" },
        lastName: { bsonType: "string" },
        email: { bsonType: "string" },
        phoneNumber: { bsonType: ["string","null"] },
        createdAt: { bsonType: "date" },
        addresses: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["address", "city", "postCode"],
            properties: {
              _id: { bsonType: "objectId" },
              address: { bsonType: "string" },
              city: { bsonType: "string" },
              postCode: { bsonType: "string" }
            }
          }
        },
        recentRentals: {
          bsonType: "array",
          maxItems: 5,
          items: {
            bsonType: "object",
            required: ["rentalId", "status", "rentedAtDatetime"],
            properties: {
              rentalId: { bsonType: "objectId" },
              status: { enum: ["RESERVED","OPEN","RETURNED","LATE","CANCELLED"] },
              rentedAtDatetime: { bsonType: "date" }
            }
          }
        }
      }
    }
  }
});

// Case-insensitive unique email index
db.customers.createIndex({ email: 1 }, { unique: true, collation: { locale: "en", strength: 2 } });

// -----------------------------------------------------------------------------
// promoCodes
// -----------------------------------------------------------------------------
db.createCollection("promoCodes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["code"],
      properties: {
        code: { bsonType: "string" },
        description: { bsonType: ["string","null"] },
        percentOff: { bsonType: ["decimal","null"], minimum: NumberDecimal("0"), maximum: NumberDecimal("100") },
        amountOffDkk: { bsonType: ["decimal","null"] },
        startsAt: { bsonType: ["date","null"] },
        endsAt: { bsonType: ["date","null"] },
        isActive: { bsonType: ["bool","null"] }
      }
    }
  }
});

db.promoCodes.createIndex({ code: 1 }, { unique: true });

// -----------------------------------------------------------------------------
// movies - reviews embedded
// -----------------------------------------------------------------------------
db.createCollection("movies", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title"],
      properties: {
        title: { bsonType: "string" },
        releaseYear: { bsonType: ["int","null"] },
        runtimeMin: { bsonType: ["int","null"] },
        rating: { bsonType: ["int","null"], minimum: 1, maximum: 10 },
        summary: { bsonType: ["string","null"] },
        genres: { bsonType: "array", items: { bsonType: "string" } },
        reviews: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["rating", "createdAt"],
            properties: {
              _id: { bsonType: "objectId" },
              customerId: { bsonType: ["objectId","null"] },
              rating: { bsonType: "int", minimum: 1, maximum: 10 },
              body: { bsonType: ["string","null"] },
              createdAt: { bsonType: "date" }
            }
          }
        }
      }
    }
  }
});

db.movies.createIndex({ title: 1 });
db.movies.createIndex({ genres: 1, releaseYear: -1 });

// -----------------------------------------------------------------------------
// locations - employees and inventory embedded
// -----------------------------------------------------------------------------
db.createCollection("locations", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["address","city"],
      properties: {
        address: { bsonType: "string" },
        city: { bsonType: "string" },
        employees: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["_id","firstName","lastName","email","isActive"],
            properties: {
              _id: { bsonType: "objectId" },
              firstName: { bsonType: "string" },
              lastName: { bsonType: "string" },
              phoneNumber: { bsonType: ["string","null"] },
              email: { bsonType: "string" },
              isActive: { bsonType: "bool" }
            }
          }
        },
        inventory: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["_id","movieId","format","status"],
            properties: {
              _id: { bsonType: "objectId" },
              movieId: { bsonType: "objectId" },
              format: { enum: ["DVD","BLU-RAY","VHS","DIGITAL"] },
              status: { enum: [1,2,3,4] }
            }
          }
        }
      }
    }
  }
});

db.locations.createIndex({ "inventory.movieId": 1, "inventory.status": 1 });
db.locations.createIndex({ "employees.email": 1 });

// -----------------------------------------------------------------------------
// rentals - items, payments, fees, promo embedded
// ??embed customer info??
// -----------------------------------------------------------------------------
db.createCollection("rentals", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["customerId","status","items","rentedAtDatetime"],
      properties: {
        customerId: { bsonType: "objectId" },
        employeeId: { bsonType: ["objectId","null"] },
        status: { enum: ["RESERVED","OPEN","RETURNED","LATE","CANCELLED"] },
        rentedAtDatetime: { bsonType: "date" },
        returnedAtDatetime: { bsonType: ["date","null"] },
        dueAtDatetime: { bsonType: ["date","null"] },
        reservedAtDatetime: { bsonType: ["date","null"] },
        items: {
          bsonType: "array",
          minItems: 1,
          items: {
            bsonType: "object",
            required: ["inventoryItemId","movieId"],
            properties: {
              inventoryItemId: { bsonType: "objectId" },
              movieId: { bsonType: "objectId" }
            }
          }
        },
        payments: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["_id","amountDkk","createdAt"],
            properties: {
              _id: { bsonType: "objectId" },
              amountDkk: { bsonType: "decimal" },
              createdAt: { bsonType: "date" },
              method: { bsonType: ["string","null"] }
            }
          }
        },
        fees: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["_id","feeType","amountDkk"],
            properties: {
              _id: { bsonType: "objectId" },
              feeType: { enum: ["LATE","DAMAGED","OTHER"] },
              amountDkk: { bsonType: "decimal" }
            }
          }
        },
        promo: {
          bsonType: ["object","null"],
          properties: {
            code: { bsonType: "string" },
            percentOff: { bsonType: ["decimal","null"] },
            amountOffDkk: { bsonType: ["decimal","null"] },
            startsAt: { bsonType: ["date","null"] },
            endsAt: { bsonType: ["date","null"] }
          }
        }
      }
    }
  }
});

db.rentals.createIndex({ customerId: 1, status: 1, rentedAtDatetime: -1 });
db.rentals.createIndex({ status: 1 });
db.rentals.createIndex({ "items.inventoryItemId": 1 });
