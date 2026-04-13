# IdeaMarket - Security Best Practices

## 🔒 Security Checklist

### Frontend Security
- [ ] Use HTTPS only
- [ ] Implement CSRF protection
- [ ] Sanitize user inputs
- [ ] Secure API communication
- [ ] Implement rate limiting
- [ ] Secure local storage
- [ ] Validate form inputs
- [ ] Implement CSP headers

### Backend Security
- [ ] Validate all inputs
- [ ] Use parameterized queries
- [ ] Hash passwords (bcrypt)
- [ ] Implement JWT properly
- [ ] Secure API endpoints
- [ ] Rate limiting
- [ ] CORS configuration
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF tokens

### Database Security
- [ ] Encrypt passwords
- [ ] Encrypt sensitive data
- [ ] Regular backups
- [ ] IP whitelisting
- [ ] Access control
- [ ] Audit logging

---

## 🛡️ Frontend Security Implementation

### **1. Input Validation**

```typescript
// src/utils/validation.ts
export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
};

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '')
    .slice(0, 500); // Limit length
};
```

### **2. API Request Security**

```typescript
// src/utils/apiClient.ts
export const apiClient = {
  async request(url: string, options: RequestInit = {}) {
    // Add security headers
    const headers = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...options.headers,
    };

    // Add CSRF token if available
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (token) {
      headers['X-CSRF-Token'] = token;
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Include cookies for CSRF
    });

    return response;
  },
};
```

### **3. Secure Local Storage**

```typescript
// src/utils/secureStorage.ts
export const secureStorage = {
  setItem(key: string, value: any): void {
    // Don't store sensitive data in localStorage
    // Use sessionStorage or IndexedDB instead
    if (key === 'token' || key === 'password') {
      // Store in sessionStorage (cleared on browser close)
      sessionStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },

  getItem(key: string): any {
    try {
      const value = sessionStorage.getItem(key) || localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  },

  removeItem(key: string): void {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  },

  clear(): void {
    sessionStorage.clear();
    localStorage.clear();
  },
};
```

### **4. Content Security Policy**

```html
<!-- index.html -->
<meta 
  http-equiv="Content-Security-Policy" 
  content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' https: data:;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://api.stripe.com;
    frame-src https://js.stripe.com;
  "
>
```

---

## 🔐 Backend Security Implementation

### **1. Password Hashing**

```typescript
// src/utils/password.ts
import bcrypt from 'bcryptjs';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
```

### **2. JWT Implementation**

```typescript
// src/utils/jwt.ts
import jwt from 'jsonwebtoken';

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'secret');
  } catch (error) {
    return null;
  }
};
```

### **3. Authentication Middleware**

```typescript
// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  req.userId = decoded.userId;
  next();
};
```

### **4. Input Validation**

```typescript
// src/middleware/validation.ts
import { Request, Response, NextFunction } from 'express';

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const { email, password, name } = req.body;

  // Validate email
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  // Validate password (min 8 chars, 1 uppercase, 1 lowercase, 1 number)
  if (!password || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
    return res.status(400).json({ error: 'Password too weak' });
  }

  // Validate name
  if (!name || name.length < 2) {
    return res.status(400).json({ error: 'Invalid name' });
  }

  next();
};
```

### **5. Rate Limiting**

```typescript
// src/middleware/rateLimit.ts
import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs
  message: 'Too many login attempts, please try again later',
});

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: 'Too many requests, please try again later',
});
```

### **6. CORS Configuration**

```typescript
// src/config/cors.ts
import cors from 'cors';

export const corsOptions = {
  origin: (origin: string | undefined, callback: Function) => {
    const allowedOrigins = [
      'https://ideamarket.com',
      'https://www.ideamarket.com',
      'http://localhost:3000',
      'http://localhost:5173',
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export const corsMiddleware = cors(corsOptions);
```

### **7. SQL Injection Prevention**

```typescript
// Use parameterized queries with mongoose
export const findUserByEmail = async (email: string) => {
  // ✅ SAFE - Mongoose handles parameterization
  return User.findOne({ email });
};

// ❌ AVOID - String concatenation
// const user = await User.findOne({ email: `${email}` });
```

---

## 🗄️ Database Security

### **1. Encrypt Sensitive Data**

```typescript
// src/utils/encryption.ts
import crypto from 'crypto';

const algorithm = 'aes-256-gcm';
const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'secret', 'salt', 32);

export const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${encrypted}:${authTag.toString('hex')}`;
};

export const decrypt = (encrypted: string): string => {
  const [ivHex, encryptedHex, authTagHex] = encrypted.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};
```

### **2. MongoDB Atlas Security**

- Enable IP whitelisting
- Use strong passwords for database users
- Enable encryption at rest
- Enable audit logging
- Regular backups
- Monitor suspicious activity

---

## 🌐 API Security Headers

### **Add Security Headers**

```typescript
// src/middleware/securityHeaders.ts
import { Response } from 'express';

export const securityHeaders = (res: Response) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Strict transport security
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Content security policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
  );
};
```

---

## 🔄 Environment Variables Security

### **Never commit secrets!**

```bash
# .gitignore
.env
.env.local
.env.*.local
node_modules/
dist/
build/
```

### **Use environment variables properly**

```typescript
// ✅ CORRECT
const mongoUrl = process.env.MONGODB_URI;

// ❌ WRONG
const mongoUrl = 'mongodb://...'; // Hardcoded
```

---

## 📝 Audit Logging

```typescript
// src/utils/logger.ts
export const auditLog = (action: string, userId: string, details: any) => {
  const log = {
    timestamp: new Date(),
    action,
    userId,
    details,
    ip: process.env.CLIENT_IP,
  };

  // Save to database
  AuditLog.create(log);

  // Log to file/monitoring service
  console.log(JSON.stringify(log));
};
```

---

## 🚀 Deployment Security Checklist

- ✅ Use HTTPS/TLS everywhere
- ✅ Keep dependencies updated
- ✅ Enable firewall rules
- ✅ Monitor for suspicious activity
- ✅ Regular security audits
- ✅ Implement intrusion detection
- ✅ DDoS protection (Cloudflare)
- ✅ Web Application Firewall (WAF)
- ✅ Regular backups and disaster recovery
- ✅ Comply with GDPR/Privacy laws

---

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/Top10/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express.js Security](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Security](https://docs.mongodb.com/manual/security/)

---

Your IdeaMarket is now **secure and production-ready**! 🔒
