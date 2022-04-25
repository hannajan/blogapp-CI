const common = require('@root/config/common.cjs')

const PORT = process.env.PORT || 8000

module.exports = {
  ...common,
  PORT,
}