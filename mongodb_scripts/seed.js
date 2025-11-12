// -----------------------------------------------------------------------------
// Optional seed data
// -----------------------------------------------------------------------------

use ("movieRental");

const movieId = ObjectId();
db.movies.insertOne({
  _id: movieId,
  title: "Inception",
  releaseYear: 2010,
  runtimeMin: 148,
  rating: 9,
  genres: ["Sci-Fi","Thriller"],
  summary: "A mind-bending heist within dreams.",
  reviews: [
    {
      _id: new ObjectId(),
      customerId: null,
      rating: 9,
      body: "Still holds up.",
      createdAt: new Date()
    }
  ]
});

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
    { _id: inv2, movieId: movieId, format: "DVD", status: 1 }
  ]
});

db.promoCodes.insertOne({
  code: "NOV25",
  description: "November 25% off",
  percentOff: NumberDecimal("25.00"),
  amountOffDkk: null,
  startsAt: new Date(),
  endsAt: null,
  isActive: true
});

// First customer
const custId = ObjectId();
db.customers.insertOne({
  _id: custId,
  firstName: "Ava",
  lastName: "Nguyen",
  email: "ava@example.com",
  phoneNumber: "+45 12 34 56 78",
  createdAt: new Date(),
  addresses: [
    { _id: new ObjectId(), address: "Vesterbrogade 10", city: "København", postCode: "1620" }
  ],
  recentRentals: []
});

// Second customer (new seed)
const custId2 = ObjectId();
db.customers.insertOne({
  _id: custId2,
  firstName: "Lukas",
  lastName: "Madsen",
  email: "lukas@example.com",
  phoneNumber: "+45 98 76 54 32",
  createdAt: new Date(),
  addresses: [
    { _id: new ObjectId(), address: "Søndergade 22", city: "Aarhus", postCode: "8000" },
    { _id: new ObjectId(), address: "Nørregade 7", city: "Aarhus", postCode: "8000" }
  ],
  recentRentals: [
    {
      rentalId: new ObjectId(), // placeholder to simulate link
      status: "RETURNED",
      rentedAtDatetime: new Date(Date.now() - 14*24*3600*1000)
    }
  ]
});

// Rental (OPEN) for Ava
const rentId = ObjectId();
db.rentals.insertOne({
  _id: rentId,
  customerId: custId,
  employeeId: emp1,
  status: "OPEN",
  rentedAtDatetime: new Date(),
  dueAtDatetime: new Date(Date.now() + 7*24*3600*1000),
  items: [{ inventoryItemId: inv1, movieId: movieId }],
  payments: [
    { _id: new ObjectId(), amountDkk: NumberDecimal("49.00"), createdAt: new Date(), method: "card" }
  ],
  fees: [],
  promo: { code: "NOV25", percentOff: NumberDecimal("25.00"), amountOffDkk: null }
});

db.customers.updateOne(
  { _id: custId },
  {
    $push: {
      recentRentals: {
        $each: [{ rentalId: rentId, status: "OPEN", rentedAtDatetime: new Date() }],
        $slice: -5
      }
    }
  }
);