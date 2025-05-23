import React, { useEffect, useState } from "react"

type PropTypes = React.HTMLAttributes<HTMLDivElement> & {
  visible?: boolean;
  forceRender?: boolean;
  destroyOnClose?: boolean;
}

export default function VisibilityContainer({ visible = false, forceRender = false, destroyOnClose, ...props }: PropTypes) {
  const [mounted, setMounted] = useState(visible || forceRender)

  useEffect(() => {
    if (destroyOnClose || visible)
      setMounted(visible)
  }, [destroyOnClose, visible])

  return mounted && (
    <div
      {...props}
      style={{
        ...props.style,
        ...(!visible && { display: 'none' })
      }}
    />
  )
}