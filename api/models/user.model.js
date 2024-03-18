import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
    },
    profilePicture: {
        type: String,
        default: ""
    }
}, { timestamps: true },
);

const User = mongoose.model('user', userSchema);

export default User;

