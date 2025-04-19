import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import redis from "../redisClient.js";
import { v4 as uuidv4 } from 'uuid';
import { publishEvent } from "../kafka.js";

const register = async (req, res) => {
    try{
    const { name, password, email } = req.body;
    // Validate input
    if (!name || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }
    // Hash password
    const hashPassword = bcrypt.hashSync(password, 10)
    
    // Create new user
    await User.create({ name, password: hashPassword, email });

    await publishEvent('user.created', { name, email });
    res.status(201).json({ message: 'User registered successfully', user: { name } });
}
    catch(err){
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const login = async (req, res) => {
    const {email, password} = req.body
    if(!email || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    try{
        // Find user
        let user = null;
        const cachedUser = await redis.get(email);
        if(cachedUser) {
            user = JSON.parse(cachedUser);
        }
        else{
            user = await User.findOne({ email });
            
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }
        } 
        // Check password
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d', jwtid: uuidv4() });
        await redis.set(email, JSON.stringify(user), 'EX', 3600); // Cache user for 1 hour
        res.status(200).json({ message: 'Login successful', token });
    } catch(err){
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const logout = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const jti = decoded.jti;
        await redis.set(`blacklist:${jti}`, true, "EX", 3600); // EX = 1 hour
        console.error('blacklisted token:', jti);
        res.status(200).json({ message: 'Logout successful' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export { register, login, logout }