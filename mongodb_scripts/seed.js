use("movieRental");

// ----- Clean existing data (optional, comment out if you want to keep) -----
db.promoCodes.deleteMany({});
db.membershipTypes.deleteMany({});
db.feeTypes.deleteMany({});
db.movies.deleteMany({});
db.locations.deleteMany({});
db.customers.deleteMany({});
db.rentals.deleteMany({});

// ----- Lookups -----

// membershipTypes (enum: GOLD/SILVER/BRONZE)
db.membershipTypes.insertMany([
  { code: "GOLD",   displayName: "Gold",   defaultMonthlyCostDkk: NumberDecimal("149.00"), benefits: ["2 free rentals/mo","Priority holds"], isActive: true },
  { code: "SILVER", displayName: "Silver", defaultMonthlyCostDkk: NumberDecimal("99.00"),  benefits: ["1 free rental/mo"], isActive: true },
  { code: "BRONZE", displayName: "Bronze", defaultMonthlyCostDkk: NumberDecimal("59.00"),  benefits: [], isActive: true }
]);

// feeTypes (enum: LATE/DAMAGED/OTHER)
db.feeTypes.insertMany([
  { code: "LATE",    displayName: "Late fee",      calculation: "per_day",   defaultAmountDkk: NumberDecimal("10.00"), taxable: true,  isActive: true },
  { code: "DAMAGED", displayName: "Damaged item",  calculation: "flat",      defaultAmountDkk: NumberDecimal("200.00"),taxable: false, isActive: true },
  { code: "OTHER",   displayName: "Other fee",     calculation: "other",     defaultAmountDkk: null,                    taxable: null,  isActive: true }
]);

// promoCodes
db.promoCodes.insertMany([
  { code: "WELCOME10", description: "First rental 10 DKK off", amountOffDkk: NumberDecimal("10.00"), percentOff: null, startsAt: new Date(), endsAt: null, isActive: true },
  { code: "NOV25",     description: "November 25% off",        percentOff: NumberDecimal("25.00"),  amountOffDkk: null, startsAt: new Date(), endsAt: null, isActive: true },
  { code: "WEEKEND50", description: "Weekend 50% off",         percentOff: NumberDecimal("50.00"),  amountOffDkk: null, startsAt: new Date(), endsAt: null, isActive: true },
  { code: "SUMMER15",  description: "Summer 15% off",          percentOff: NumberDecimal("15.00"),  amountOffDkk: null, startsAt: new Date(), endsAt: null, isActive: true },
  { code: "B2G1",      description: "Buy 2 get 1 free",        percentOff: null,                     amountOffDkk: null, startsAt: new Date(), endsAt: null, isActive: true }
]);

// ----- Movies (5) -----
const movieIds = [ObjectId(), ObjectId(), ObjectId(), ObjectId(), ObjectId()];
db.movies.insertMany([
  { _id: movieIds[0], title: "Inception",       releaseYear: 2010, runtimeMin: 148, rating: 9,  genres: ["Sci-Fi","Thriller"], summary: "Dream heist.", reviews: [] },
  { _id: movieIds[1], title: "The Matrix",      releaseYear: 1999, runtimeMin: 136, rating: 9,  genres: ["Sci-Fi","Action"],   summary: "Simulation reality.", reviews: [] },
  { _id: movieIds[2], title: "Spirited Away",   releaseYear: 2001, runtimeMin: 125, rating: 10, genres: ["Animation","Fantasy"],summary: "Spirit world adventure.", reviews: [] },
  { _id: movieIds[3], title: "Parasite",        releaseYear: 2019, runtimeMin: 132, rating: 9,  genres: ["Thriller","Drama"],  summary: "Class tensions mount.", reviews: [] },
  { _id: movieIds[4], title: "The Dark Knight", releaseYear: 2008, runtimeMin: 152, rating: 9,  genres: ["Action","Crime"],    summary: "Batman vs Joker.", reviews: [] }
]);

// ----- Locations (3) with embedded employees (2 each) and inventory (5 each) -----
const locIds = [ObjectId(), ObjectId(), ObjectId()];
const empIds = [ObjectId(), ObjectId(), ObjectId(), ObjectId(), ObjectId(), ObjectId()];
const inv = Array.from({length: 15}, () => ObjectId()); // 15 copies in total

db.locations.insertMany([
  { _id: locIds[0], address: "Frederiksborggade 1", city: "København",
    employees: [
      { _id: empIds[0], firstName: "Sara",  lastName: "Holm",      email: "sara@store.dk",  isActive: true },
      { _id: empIds[1], firstName: "Jonas", lastName: "Andersen",  email: "jonas@store.dk", isActive: true }
    ],
    // format enum per schema: ["DVD","BLU-RAY","VHS","DIGITAL"]
    inventory: [
      { _id: inv[0],  movieId: movieIds[0], format: "BLU-RAY", status: 1 },
      { _id: inv[1],  movieId: movieIds[0], format: "DVD",     status: 1 },
      { _id: inv[2],  movieId: movieIds[1], format: "BLU-RAY", status: 1 },
      { _id: inv[3],  movieId: movieIds[2], format: "DVD",     status: 1 },
      { _id: inv[4],  movieId: movieIds[4], format: "DVD",     status: 1 }
    ]
  },
  { _id: locIds[1], address: "Søndergade 50", city: "Aarhus",
    employees: [
      { _id: empIds[2], firstName: "Mette", lastName: "Østergaard", email: "mette@store.dk", isActive: true },
      { _id: empIds[3], firstName: "Ali",   lastName: "Khan",       email: "ali@store.dk",   isActive: true }
    ],
    inventory: [
      { _id: inv[5],  movieId: movieIds[1], format: "DVD",     status: 1 },
      { _id: inv[6],  movieId: movieIds[2], format: "BLU-RAY", status: 1 },
      { _id: inv[7],  movieId: movieIds[3], format: "DVD",     status: 1 },
      { _id: inv[8],  movieId: movieIds[3], format: "VHS",     status: 1 },
      { _id: inv[9],  movieId: movieIds[4], format: "BLU-RAY", status: 1 }
    ]
  },
  { _id: locIds[2], address: "Algade 5", city: "Roskilde",
    employees: [
      { _id: empIds[4], firstName: "Pia",    lastName: "Lind",    email: "pia@store.dk",    isActive: true },
      { _id: empIds[5], firstName: "Henrik", lastName: "Poulsen", email: "henrik@store.dk", isActive: true }
    ],
    inventory: [
      { _id: inv[10], movieId: movieIds[3], format: "DVD",     status: 1 },
      { _id: inv[11], movieId: movieIds[3], format: "BLU-RAY", status: 1 },
      { _id: inv[12], movieId: movieIds[4], format: "DVD",     status: 1 },
      { _id: inv[13], movieId: movieIds[4], format: "BLU-RAY", status: 1 },
      { _id: inv[14], movieId: movieIds[0], format: "VHS",     status: 1 }
    ]
  }
]);

// ----- Customers (5) with single address + (optional) membership -----
const custIds = [ObjectId(), ObjectId(), ObjectId(), ObjectId(), ObjectId()];
db.customers.insertMany([
  { _id: custIds[0], firstName: "Ava",   lastName: "Nguyen",  email: "ava@example.com",   phoneNumber: "+45 12 34 56 78", createdAt: new Date(),
    address: { address: "Vesterbrogade 10", city: "København", postCode: "1620" },
    membership: { membershipCode: "GOLD", startsOn: new Date(), endsOn: null,
      snapshot: { monthlyCostDkk: NumberDecimal("149.00"), benefits: ["2 free rentals/mo","Priority holds"] } },
    recentRentals: [] },
  { _id: custIds[1], firstName: "Lukas", lastName: "Madsen",  email: "lukas@example.com", phoneNumber: "+45 98 76 54 32", createdAt: new Date(),
    address: { address: "Søndergade 22", city: "Aarhus", postCode: "8000" },
    membership: { membershipCode: "SILVER", startsOn: new Date(), endsOn: null,
      snapshot: { monthlyCostDkk: NumberDecimal("99.00"), benefits: ["1 free rental/mo"] } },
    recentRentals: [] },
  { _id: custIds[2], firstName: "Maja",  lastName: "Hansen",  email: "maja@example.com",  phoneNumber: "+45 55 55 55 55", createdAt: new Date(),
    address: { address: "Nørregade 7", city: "Aarhus", postCode: "8000" }, membership: null, recentRentals: [] },
  { _id: custIds[3], firstName: "Noah",  lastName: "Larsen",  email: "noah@example.com",  phoneNumber: "+45 44 44 44 44", createdAt: new Date(),
    address: { address: "Østerbrogade 80", city: "København", postCode: "2100" },
    membership: { membershipCode: "BRONZE", startsOn: new Date(), endsOn: null,
      snapshot: { monthlyCostDkk: NumberDecimal("59.00"), benefits: [] } },
    recentRentals: [] },
  { _id: custIds[4], firstName: "Emma",  lastName: "Nielsen", email: "emma@example.com",  phoneNumber: "+45 22 33 44 55", createdAt: new Date(),
    address: { address: "Algade 12", city: "Roskilde", postCode: "4000" }, membership: null, recentRentals: [] }
]);

// Add embedded reviews (must reference valid customerIds)
db.movies.updateOne({ _id: movieIds[0] }, { $push: { reviews: {
  $each: [
    { _id: new ObjectId(), customerId: custIds[0], rating: 9,  body: "Still holds up.", createdAt: new Date() },
    { _id: new ObjectId(), customerId: custIds[1], rating: 8,  body: "Great visuals.", createdAt: new Date() }
  ]
}}});
db.movies.updateOne({ _id: movieIds[2] }, { $push: { reviews: {
  $each: [
    { _id: new ObjectId(), customerId: custIds[3], rating: 10, body: "Masterpiece.", createdAt: new Date() }
  ]
}}});

// ----- Rentals (10) — include required locationId and valid enums -----
const rentalIds = Array.from({length: 10}, () => ObjectId());

// 1) Ava @ CPH — Inception BLU-RAY — NOV25
db.rentals.insertOne({
  _id: rentalIds[0],
  customerId: custIds[0],
  locationId: locIds[0],
  employeeId: empIds[0],
  status: "OPEN",
  rentedAtDatetime: new Date(),
  dueAtDatetime: new Date(Date.now() + 5*24*3600*1000),
  items: [{ inventoryItemId: inv[0], movieId: movieIds[0] }],
  payments: [{ _id: new ObjectId(), amountDkk: NumberDecimal("49.00"), createdAt: new Date(), method: "card" }],
  fees: [],
  promo: { code: "NOV25", percentOff: NumberDecimal("25.00"), amountOffDkk: null, startsAt: new Date(), endsAt: null }
});
db.customers.updateOne({ _id: custIds[0] }, { $push: { recentRentals: { $each: [{ rentalId: rentalIds[0], status: "OPEN", rentedAtDatetime: new Date() }], $slice: -5 } } });

// 2) Lukas @ Aarhus — Matrix DVD + Spirited Away BLU-RAY — LATE + fee LATE
db.rentals.insertOne({
  _id: rentalIds[1],
  customerId: custIds[1],
  locationId: locIds[1],
  employeeId: empIds[2],
  status: "LATE",
  rentedAtDatetime: new Date(Date.now() - 10*24*3600*1000),
  dueAtDatetime: new Date(Date.now() - 3*24*3600*1000),
  items: [
    { inventoryItemId: inv[5], movieId: movieIds[1] },
    { inventoryItemId: inv[6], movieId: movieIds[2] }
  ],
  payments: [{ _id: new ObjectId(), amountDkk: NumberDecimal("89.00"), createdAt: new Date(Date.now() - 10*24*3600*1000), method: "cash" }],
  fees: [{
    _id: new ObjectId(),
    feeType: "LATE",
    amountDkk: NumberDecimal("30.00"),
    snapshot: { calculation: "per_day", defaultAmountDkk: NumberDecimal("10.00"), taxable: true }
  }],
  promo: null
});
db.customers.updateOne({ _id: custIds[1] }, { $push: { recentRentals: { $each: [{ rentalId: rentalIds[1], status: "LATE", rentedAtDatetime: new Date(Date.now() - 10*24*3600*1000) }], $slice: -5 } } });

// 3) Maja @ Aarhus — Parasite DVD — RESERVED — WELCOME10
db.rentals.insertOne({
  _id: rentalIds[2],
  customerId: custIds[2],
  locationId: locIds[1],
  employeeId: empIds[3],
  status: "RESERVED",
  rentedAtDatetime: new Date(),
  reservedAtDatetime: new Date(),
  items: [{ inventoryItemId: inv[7], movieId: movieIds[3] }],
  payments: [],
  fees: [],
  promo: { code: "WELCOME10", amountOffDkk: NumberDecimal("10.00"), percentOff: null, startsAt: new Date(), endsAt: null }
});
db.customers.updateOne({ _id: custIds[2] }, { $push: { recentRentals: { $each: [{ rentalId: rentalIds[2], status: "RESERVED", rentedAtDatetime: new Date() }], $slice: -5 } } });

// 4) Noah @ Roskilde — Parasite BLU-RAY — RETURNED — fee OTHER
db.rentals.insertOne({
  _id: rentalIds[3],
  customerId: custIds[3],
  locationId: locIds[2],
  employeeId: empIds[4],
  status: "RETURNED",
  rentedAtDatetime: new Date(Date.now() - 5*24*3600*1000),
  returnedAtDatetime: new Date(Date.now() - 1*24*3600*1000),
  dueAtDatetime: new Date(Date.now() - 2*24*3600*1000),
  items: [{ inventoryItemId: inv[11], movieId: movieIds[3] }],
  payments: [{ _id: new ObjectId(), amountDkk: NumberDecimal("49.00"), createdAt: new Date(Date.now() - 5*24*3600*1000), method: "card" }],
  fees: [{ _id: new ObjectId(), feeType: "OTHER", amountDkk: NumberDecimal("25.00"), snapshot: { calculation: "other", defaultAmountDkk: null, taxable: null } }],
  promo: null
});
db.customers.updateOne({ _id: custIds[3] }, { $push: { recentRentals: { $each: [{ rentalId: rentalIds[3], status: "RETURNED", rentedAtDatetime: new Date(Date.now() - 5*24*3600*1000) }], $slice: -5 } } });

// 5) Emma @ Roskilde — Dark Knight DVD — OPEN — WEEKEND50
db.rentals.insertOne({
  _id: rentalIds[4],
  customerId: custIds[4],
  locationId: locIds[2],
  employeeId: empIds[5],
  status: "OPEN",
  rentedAtDatetime: new Date(),
  dueAtDatetime: new Date(Date.now() + 3*24*3600*1000),
  items: [{ inventoryItemId: inv[12], movieId: movieIds[4] }],
  payments: [{ _id: new ObjectId(), amountDkk: NumberDecimal("39.00"), createdAt: new Date(), method: "mobilepay" }],
  fees: [],
  promo: { code: "WEEKEND50", percentOff: NumberDecimal("50.00"), amountOffDkk: null, startsAt: new Date(), endsAt: null }
});
db.customers.updateOne({ _id: custIds[4] }, { $push: { recentRentals: { $each: [{ rentalId: rentalIds[4], status: "OPEN", rentedAtDatetime: new Date() }], $slice: -5 } } });

// 6) Ava @ CPH — Matrix BLU-RAY — RETURNED
db.rentals.insertOne({
  _id: rentalIds[5],
  customerId: custIds[0],
  locationId: locIds[0],
  employeeId: empIds[1],
  status: "RETURNED",
  rentedAtDatetime: new Date(Date.now() - 3*24*3600*1000),
  returnedAtDatetime: new Date(),
  dueAtDatetime: new Date(Date.now() - 1*24*3600*1000),
  items: [{ inventoryItemId: inv[2], movieId: movieIds[1] }],
  payments: [{ _id: new ObjectId(), amountDkk: NumberDecimal("45.00"), createdAt: new Date(Date.now() - 3*24*3600*1000), method: "card" }],
  fees: [],
  promo: null
});
db.customers.updateOne({ _id: custIds[0] }, { $push: { recentRentals: { $each: [{ rentalId: rentalIds[5], status: "RETURNED", rentedAtDatetime: new Date(Date.now() - 3*24*3600*1000) }], $slice: -5 } } });

// 7) Lukas @ CPH — Inception DVD — OPEN — fee DAMAGED
db.rentals.insertOne({
  _id: rentalIds[6],
  customerId: custIds[1],
  locationId: locIds[0],
  employeeId: empIds[0],
  status: "OPEN",
  rentedAtDatetime: new Date(),
  dueAtDatetime: new Date(Date.now() + 7*24*3600*1000),
  items: [{ inventoryItemId: inv[1], movieId: movieIds[0] }],
  payments: [{ _id: new ObjectId(), amountDkk: NumberDecimal("49.00"), createdAt: new Date(), method: "cash" }],
  fees: [{ _id: new ObjectId(), feeType: "DAMAGED", amountDkk: NumberDecimal("200.00"), snapshot: { calculation: "flat", defaultAmountDkk: NumberDecimal("200.00"), taxable: false } }],
  promo: null
});
db.customers.updateOne({ _id: custIds[1] }, { $push: { recentRentals: { $each: [{ rentalId: rentalIds[6], status: "OPEN", rentedAtDatetime: new Date() }], $slice: -5 } } });

// 8) Emma @ Roskilde — Inception VHS — RESERVED — WELCOME10
db.rentals.insertOne({
  _id: rentalIds[7],
  customerId: custIds[4],
  locationId: locIds[2],
  employeeId: empIds[4],
  status: "RESERVED",
  rentedAtDatetime: new Date(),
  reservedAtDatetime: new Date(),
  items: [{ inventoryItemId: inv[14], movieId: movieIds[0] }],
  payments: [],
  fees: [],
  promo: { code: "WELCOME10", amountOffDkk: NumberDecimal("10.00"), percentOff: null, startsAt: new Date(), endsAt: null }
});
db.customers.updateOne({ _id: custIds[4] }, { $push: { recentRentals: { $each: [{ rentalId: rentalIds[7], status: "RESERVED", rentedAtDatetime: new Date() }], $slice: -5 } } });

// 9) Maja @ Aarhus — Dark Knight BLU-RAY — LATE (+ LATE fee)
db.rentals.insertOne({
  _id: rentalIds[8],
  customerId: custIds[2],
  locationId: locIds[1],
  employeeId: empIds[3],
  status: "LATE",
  rentedAtDatetime: new Date(Date.now() - 8*24*3600*1000),
  dueAtDatetime: new Date(Date.now() - 1*24*3600*1000),
  items: [{ inventoryItemId: inv[9], movieId: movieIds[4] }],
  payments: [{ _id: new ObjectId(), amountDkk: NumberDecimal("39.00"), createdAt: new Date(Date.now() - 8*24*3600*1000), method: "mobilepay" }],
  fees: [{ _id: new ObjectId(), feeType: "LATE", amountDkk: NumberDecimal("20.00"), snapshot: { calculation: "per_day", defaultAmountDkk: NumberDecimal("10.00"), taxable: true } }],
  promo: null
});
db.customers.updateOne({ _id: custIds[2] }, { $push: { recentRentals: { $each: [{ rentalId: rentalIds[8], status: "LATE", rentedAtDatetime: new Date(Date.now() - 8*24*3600*1000) }], $slice: -5 } } });

// 10) Ava @ CPH — Spirited Away DVD — OPEN
db.rentals.insertOne({
  _id: rentalIds[9],
  customerId: custIds[0],
  locationId: locIds[0],
  employeeId: empIds[1],
  status: "OPEN",
  rentedAtDatetime: new Date(),
  dueAtDatetime: new Date(Date.now() + 6*24*3600*1000),
  items: [{ inventoryItemId: inv[3], movieId: movieIds[2] }],
  payments: [{ _id: new ObjectId(), amountDkk: NumberDecimal("39.00"), createdAt: new Date(), method: "card" }],
  fees: [],
  promo: null
});
db.customers.updateOne({ _id: custIds[0] }, { $push: { recentRentals: { $each: [{ rentalId: rentalIds[9], status: "OPEN", rentedAtDatetime: new Date() }], $slice: -5 } } });
