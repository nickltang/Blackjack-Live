
exports.getTest = async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.status(200).json({
        message: 'Test API is working',
    })
}