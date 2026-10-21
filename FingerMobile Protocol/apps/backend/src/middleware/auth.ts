import { Request, Response, NextFunction } from 'express';


// Assuming we have a type definition for our member
interface Member {
  id: string;
  email: string;
  // Add other properties as needed
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      member?: Member;
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; email: string };
    // Query the database to get the user
    const result = await pool.query('SELECT id, email FROM members WHERE id = $1', [decoded.id]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.member = result.rows[0]; // Assign the user to the request object
    next();
  } catch (error) {
    logError(error, ErrorType.AUTH_ERROR);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  if (!req.member) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const result = await pool.query('SELECT role FROM members WHERE id = $1', [
      req.member.id // Fixed: using id instead of memberId
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const memberRole = result.rows[0].role;
    if (memberRole !== 'admin' && memberRole !== 'superadmin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    next();
  } catch (error) {
    logError(error, ErrorType.AUTH_ERROR);
    return res.status(500).json({ error: 'Authorization error' });
  }
};

export const requireOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  if (!req.member) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const resourceUserId = req.params.userId || req.body.userId || req.query.userId;

  if (!resourceUserId) {
    return res.status(400).json({ error: 'Resource owner ID required' });
  }

  if (req.member.id !== resourceUserId) { // Fixed: using id instead of memberId
    // Check if member is admin
    try {
      const result = await pool.query(
        'SELECT role FROM members WHERE id = $1',
        [req.member.id], // Fixed: using id instead of memberId
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Member not found' });
      }

      const memberRole = result.rows[0].role;
      if (memberRole !== 'admin' && memberRole !== 'superadmin') {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
    } catch (error) {
      logError(error, ErrorType.AUTH_ERROR);
      return res.status(500).json({ error: 'Permission check failed' });
    }
  }

  next();
};
