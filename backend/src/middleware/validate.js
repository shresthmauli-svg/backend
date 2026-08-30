const { error } = require('../utils/apiResponse');

const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    
    // Replace with validated and potentially coerced values
    req.body = parsed.body;
    req.query = parsed.query;
    req.params = parsed.params;
    
    next();
  } catch (err) {
    if (err.name === 'ZodError') {
      const details = err.errors.map(e => ({
        path: e.path.join('.'),
        message: e.message
      }));
      return res.status(400).json(error('VALIDATION_ERROR', 'One or more fields are invalid.', details, req.id));
    }
    next(err);
  }
};

module.exports = validate;
