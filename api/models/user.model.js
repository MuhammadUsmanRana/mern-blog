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
        default: "https://img.freepik.com/premium-vector/account-icon-user-icon-vector-graphics_292645-552.jpg?w=740"
    },
    isAdmin: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true },
);

const User = mongoose.model('user', userSchema);

export default User;

