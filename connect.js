const pg = require('C:/Users/a1/AppData/Roaming/npm/node_modules/pg');


const connectDB = () => {
    return new pg.Client(process.env.POSTGRESQL_URI)
}
connectDB()
module.exports = connectDB
