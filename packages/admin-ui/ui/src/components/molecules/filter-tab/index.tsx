import clsx from "clsx"
import React from "react"

import CrossIcon from "../../fundamentals/icons/cross-icon"

type FilterTabProps = {
  label?: string
  isActive?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  removable?: boolean
  onRemove?: () => void
}

export const FilterTab: React.FC<FilterTabProps> = ({
  label,
  isActive,
  onClick,
  removable,
  onRemove,
}) => {
  const handleClick = (e) => {
    if (typeof onClick !== "undefined") {
      onClick(e)
    }
  }

  const handleRemove = () => {
    if (typeof onRemove !== "undefined") {
      onRemove()
    }
  }

  const handleKeyPress = (e) => {
    if (removable && onRemove) {
      if (e.key === "Backspace") {
        onRemove()
      }
    }
  }

  return (
    <button
      onKeyUp={handleKeyPress}
      onClick={handleClick}
      className={clsx(
        "bg-grey-5 border-grey-20 inter-small-regular text-grey-50 rounded-rounded focus-visible:shadow-input focus-visible:border-orange-60 flex flex h-6 items-center items-center space-x-1 border px-2 focus-visible:outline-none",
        {
          ["bg-orange-5 border-orange-60 text-orange-60 "]: isActive,
        }
      )}
    >
      {label}
      {removable && (
        <div onClick={handleRemove} className={"ml-1 cursor-pointer"}>
          <CrossIcon size={16} />
        </div>
      )}
    </button>
  )
}

export default FilterTab
