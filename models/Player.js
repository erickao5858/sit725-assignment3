/**
 * @author Eric Kao <eric.kao5858@gmail.com>
 */
import mongoose from 'mongoose'

const Schema = mongoose.Schema

const playerSchema = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    isInRoom: { type: Boolean, default: false },
    isBot: { type: Boolean, default: false }
})

const Player = mongoose.model('Player', playerSchema)

export default Player

const mongoose = require('mongoose')

// connect to database
const uri = "mongodb+srv://user:pass@sit725.facdb.mongodb.net/<dbname>?retryWrites=true&w=majority";
const options = {
    user: 'sit725',
    pass: 'sit725',
    useNewUrlParser: true,
    useUnifiedTopology: true
}
mongoose.connect(uri, options, () => {
    console.log('Connected to MongoDB')
})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))