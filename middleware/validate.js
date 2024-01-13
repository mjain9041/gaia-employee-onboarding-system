module.exports = {
    validateSchema: (schema) => (req, res, next) => {
        const { error } = schema.validate(req.body);
      
        if (error) {
          return res.status(400).json({ errors: error.details.map((err) => err.message) });
        }
      
        next(); // Move to the next middleware or route handler
      }
}