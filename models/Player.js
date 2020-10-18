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