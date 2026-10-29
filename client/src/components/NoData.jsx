import React from 'react'
import noDataImage from '../assets/noData.png'

const NoData = ({ title = "Nothing here yet", message = "Once there's something to show, it'll appear here." }) => {
    return (
        <div className="flex flex-col items-center justify-center gap-3 p-10 text-center">
            <img
                src={noDataImage}
                alt=""
                className="h-32 w-32 object-contain opacity-80"
            />
            <div>
                <p className="font-display text-lg font-semibold text-fg">{title}</p>
                <p className="mt-1 max-w-xs text-sm text-fg-muted">{message}</p>
            </div>
        </div>
    )
}

export default NoData
