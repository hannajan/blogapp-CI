import React from 'react'

const Notification = ({ text }) => {
  if (text === null) {
    return null
  }

  return (
    <div className="notification">
      {text}
    </div>
  )
}

export default Notification