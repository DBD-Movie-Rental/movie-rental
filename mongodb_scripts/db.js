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
// rentals - embedded items, payments, fees, promo snapshot
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
              feeType: { bsonType: "string" }, // ref feeTypes.code
              amountDkk: { bsonType: "decimal" },
              snapshot: {
                bsonType: ["object","null"],
                properties: {
                  calculation: { enum: ["flat","per_day","percentage","other"] },
                  defaultAmountDkk: { bsonType: ["decimal","null"] },
                  taxable: { bsonType: ["bool","null"] }
                }
              }
            }
          }
        },

        promo: {
          bsonType: ["object","null"],
          properties: {
            code: { bsonType: "string" }, // ref promoCodes.code
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

// -----------------------------------------------------------------------------
// Minimal seed
// -----------------------------------------------------------------------------

// Seeds: membership types and fee types
db.membershipTypes.insertMany([
  { code: "GOLD", displayName: "Gold", defaultMonthlyCostDkk: NumberDecimal("149.00"), benefits: ["2 free rentals/mo","Priority holds"], isActive: true },
  { code: "SILVER", displayName: "Silver", defaultMonthlyCostDkk: NumberDecimal("99.00"), benefits: ["1 free rental/mo"], isActive: true }
]);

db.feeTypes.insertMany([
  { code: "LATE", displayName: "Late fee", calculation: "per_day", defaultAmountDkk: NumberDecimal("10.00"), taxable: true, isActive: true },
  { code: "DAMAGED", displayName: "Damaged item fee", calculation: "flat", defaultAmountDkk: NumberDecimal("200.00"), taxable: false, isActive: true }
]);

db.promoCodes.insertOne({
  code: "NOV25",
  description: "November 25% off",
  percentOff: NumberDecimal("25.00"),
  amountOffDkk: null,
  startsAt: new Date(),
  endsAt: null,
  isActive: true
});

// Movie with embedded review
const movieId = ObjectId();
db.movies.insertOne({
  _id: movieId,
  title: "Inception",
  releaseYear: 2010,
  runtimeMin: 148,
  rating: 9,
  genres: ["Sci-Fi","Thriller"],
  summary: "A mind-bending heist within dreams.",
  reviews: [{
    _id: new ObjectId(),
    customerId: null,
    rating: 9,
    body: "Still holds up.",
    createdAt: new Date()
  }]
});

// Location with one employee and two copies
const locId = ObjectId();
const inv1 = ObjectId();
const inv2 = ObjectId();
const emp1 = ObjectId();

db.locations.insertOne({
  _id: locId,
  address: "Frederiksborggade 1",
  city: "København",
  employees: [
    { _id: emp1, firstName: "Sara", lastName: "Holm", email: "sara@store.dk", isActive: true }
  ],
  inventory: [
    { _id: inv1, movieId: movieId, format: "BLU-RAY", status: 1 },
    { _id: inv2, movieId: movieId, format: "DVD",     status: 1 }
  ]
});

// Customer with embedded membership and single address
const custId = ObjectId();
db.customers.insertOne({
  _id: custId,
  firstName: "Ava",
  lastName: "Nguyen",
  email: "ava@example.com",
  phoneNumber: "+45 12 34 56 78",
  createdAt: new Date(),
  address: { address: "Vesterbrogade 10", city: "København", postCode: "1620" },
  membership: {
    membershipCode: "GOLD",
    startsOn: new Date(),
    endsOn: null,
    snapshot: { monthlyCostDkk: NumberDecimal("149.00"), benefits: ["2 free rentals/mo","Priority holds"] }
  },
  recentRentals: []
});

// Rental with fee (lookup + snapshot) and promo snapshot
const rentId = ObjectId();
db.rentals.insertOne({
  _id: rentId,
  customerId: custId,
  employeeId: emp1,
  status: "OPEN",
  rentedAtDatetime: new Date(),
  dueAtDatetime: new Date(Date.now() + 7*24*3600*1000),
  items: [{ inventoryItemId: inv1, movieId: movieId }],
  payments: [{ _id: new ObjectId(), amountDkk: NumberDecimal("49.00"), createdAt: new Date(), method: "card" }],
  fees: [{
    _id: new ObjectId(),
    feeType: "LATE",
    amountDkk: NumberDecimal("20.00"),
    snapshot: { calculation: "per_day", defaultAmountDkk: NumberDecimal("10.00"), taxable: true }
  }],
  promo: { code: "NOV25", percentOff: NumberDecimal("25.00"), amountOffDkk: null }
});

db.customers.updateOne(
  { _id: custId },
  { $push: { recentRentals: { $each: [{ rentalId: rentId, status: "OPEN", rentedAtDatetime: new Date() }], $slice: -5 } } }
);