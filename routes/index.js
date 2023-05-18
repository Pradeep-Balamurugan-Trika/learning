var express = require('express');
const alert = require('alert');
var router = express.Router();

/* GET home page. */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Index Route
 *     tags:
 *       - Index
 *     description:  test in index route
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username
 *         description: search text
 *         in: query
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Successfully received all the skill.
 */
router.get('/', function(req, res) {
    res.send(req.query.username);
});

module.exports = router;
