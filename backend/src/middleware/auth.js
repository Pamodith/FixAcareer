import jwt from 'jsonwebtoken'
import Admin from '../modules/admin/api/v1/models/admin.model.js'
import User from '../modules/user/api/v1/models/user.model.js'

// Protect Admin routes
const adminProtect = async (req, res, next) => {
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
      if (decoded.role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized to access this route' })
      } else {
        req.admin = await Admin.findById(decoded._id).select('-password')
        next()
      }
    } catch (error) {
      res.status(401).json({ message: 'Not authorized to access this route' })
    }
  }
  if (!token) {
    res.status(401).json({ message: 'Not authorized to access this route' })
  }
}

// Protect User routes
const userProtect = async (req, res, next) => {
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
      if (decoded.role !== 'user') {
        return res.status(401).json({ message: 'Not authorized to access this route' })
      } else {
        req.student = await User.findById(decoded._id).select('-password')
        next()
      }
    } catch (error) {
      res.status(401).json({ message: 'Not authorized to access this route' })
    }
  }
  if (!token) {
    res.status(401).json({ message: 'Not authorized to access this route' })
  }
}

// protect routes
const protect = async (req, res, next) => {
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
      if (decoded.role !== 'user' && decoded.role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized to access this route' })
      } else {
        if (decoded.role === 'user') {
          req.student = await User.findById(decoded._id).select('-password')
        } else {
          req.admin = await Admin.findById(decoded._id).select('-password')
        }
        next()
      }
    } catch (error) {
      res.status(401)
      req.handleResponse.unauthorizedRespond(res)('Not authorized to access this route')
    }
  }
  if (!token) {
    res.status(401)
    req.handleResponse.unauthorizedRespond(res)('Not authorized to access this route')
  }
}

const auth = {
  adminProtect,
  userProtect,
  protect,
}

export default auth
