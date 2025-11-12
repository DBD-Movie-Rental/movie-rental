use("movieRental");

// -----------------------------------------------------------------------------
// customers - embedded address, recentRentals, membership
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
        address: {
          bsonType: "object",
          required: ["address", "city", "postCode"],
          properties: {
            address: { bsonType: "string" },
            city: { bsonType: "string" },
            postCode: { bsonType: "string" }
          }
        },
        membership: {
          bsonType: ["object","null"],
          properties: {
            membershipCode: { bsonType: "string" }, // ref membershipTypes.code
            startsOn: { bsonType: ["date","null"] },
            endsOn: { bsonType: ["date","null"] },
            snapshot: {
              bsonType: ["object","null"],
              properties: {
                monthlyCostDkk: { bsonType: ["decimal","null"] },
                benefits: { bsonType: "array", items: { bsonType: "string" } }
              }
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
/* promoCodes (lookup) */
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
/* membershipTypes (lookup) */
// -----------------------------------------------------------------------------
db.createCollection("membershipTypes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["code","defaultMonthlyCostDkk","isActive"],
      properties: {
        code: { enum: ["GOLD","SILVER","BRONZE"] }, // same in sql
        displayName: { bsonType: ["string","null"] },
        defaultMonthlyCostDkk: { bsonType: "decimal" },
        benefits: { bsonType: "array", items: { bsonType: "string" } },
        isActive: { bsonType: "bool" }
      }
    }
  }
});

db.membershipTypes.createIndex({ code: 1 }, { unique: true });

// -----------------------------------------------------------------------------
/* feeTypes (lookup) */
// -----------------------------------------------------------------------------
db.createCollection("feeTypes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["code","isActive"],
      properties: {
        code: { enum: ["LATE","DAMAGED","OTHER"] }, // same in sql
        displayName: { bsonType: ["string","null"] },
        calculation: { enum: ["flat","per_day","percentage","other"] },
        defaultAmountDkk: { bsonType: ["decimal","null"] },
        taxable: { bsonType: ["bool","null"] },
        isActive: { bsonType: "bool" }
      }
    }
  }
});

db.feeTypes.createIndex({ code: 1 }, { unique: true });

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
// rentals - embedded items, payments, fees, promo snapshot, locationId
// -----------------------------------------------------------------------------
db.createCollection("rentals", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["customerId","locationId","status","items","rentedAtDatetime"], // <- added locationId
      properties: {
        customerId:   { bsonType: "objectId" },
        locationId:   { bsonType: "objectId" },   // ref locations._id
        employeeId:   { bsonType: ["objectId","null"] },
        status:       { enum: ["RESERVED","OPEN","RETURNED","LATE","CANCELLED"] },
        rentedAtDatetime:   { bsonType: "date" },
        returnedAtDatetime: { bsonType: ["date","null"] },
        dueAtDatetime:      { bsonType: ["date","null"] },
        reservedAtDatetime: { bsonType: ["date","null"] },

        items: {
          bsonType: "array",
          minItems: 1,
          items: {
            bsonType: "object",
            required: ["inventoryItemId","movieId"],
            properties: {
              inventoryItemId: { bsonType: "objectId" }, // points into locations.inventory._id
              movieId:         { bsonType: "objectId" }
            }
          }
        },

        payments: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["_id","amountDkk","createdAt"],
            properties: {
              _id:        { bsonType: "objectId" },
              amountDkk:  { bsonType: "decimal" },
              createdAt:  { bsonType: "date" },
              method:     { bsonType: ["string","null"] }
            }
          }
        },

        fees: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["_id","feeType","amountDkk"],
            properties: {
              _id:        { bsonType: "objectId" },
              feeType:    { bsonType: "string" },  // ref feeTypes.code
              amountDkk:  { bsonType: "decimal" },
              snapshot: {
                bsonType: ["object","null"],
                properties: {
                  calculation:       { enum: ["flat","per_day","percentage","other"] },
                  defaultAmountDkk:  { bsonType: ["decimal","null"] },
                  taxable:           { bsonType: ["bool","null"] }
                }
              }
            }
          }
        },

        promo: {
          bsonType: ["object","null"],
          properties: {
            code:         { bsonType: "string" }, // ref promoCodes.code
            percentOff:   { bsonType: ["decimal","null"] },
            amountOffDkk: { bsonType: ["decimal","null"] },
            startsAt:     { bsonType: ["date","null"] },
            endsAt:       { bsonType: ["date","null"] }
          }
        }
      }
    }
  }
});

// indexes (add a store-scoped one)
db.rentals.createIndex({ customerId: 1, status: 1, rentedAtDatetime: -1 });
db.rentals.createIndex({ status: 1 });
db.rentals.createIndex({ "items.inventoryItemId": 1 });
db.rentals.createIndex({ locationId: 1, status: 1, rentedAtDatetime: -1 });
