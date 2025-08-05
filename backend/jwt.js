// In your Node.js environment
import crypto from 'crypto'; // For ES module

// Generate a base64 encoded string
const jwtSecret = crypto.randomBytes(256).toString('base64');
console.log(jwtSecret);

//   qL/rNqazL6XEX+PBIlECgBrbEOR4T0LEdHcE5ASGP0tuh5RBJKzIQSgFuFewg9/DP3vy5l2B0MCfA6u1xVa6k+9+cZVzCBNq/RqZkzWghfzr9F1MAHTo1jXPCb0KH3zi2/q106NualE4Sful1TCC6394QhJ4dC+i1LqUEw8KJ63jHicg6uKmIV5h9ZCiPsJK34UEIlqKWexHjOHI/DiJx/H6Nhl5ghUcUzBY/iawRMSkQ5ntN6Rk3Hrkk1i8g0ZGGnw467Pqsrq7fKbO5DVuaZyZS654t66i9mWU1FmPw0Xd42nYmOK66jVmn7QQeTCUCv/6n6SzZJf36xTpT8zuOQ==