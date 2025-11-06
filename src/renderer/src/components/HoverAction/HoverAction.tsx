import { Button, Space } from "antd"
import { useState } from "react"

const HoverActions = ({ children, hoverText, handleOnClick }) => {
    const [hovered, setHovered] = useState(false)

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                padding: '16px',
                border: '1px solid #eee',
                borderRadius: 8,
                position: 'relative',
            }}
        >
            <div>
                {children}
            </div>

            {
                hovered && (
                    <Space
                        size={8}
                        style={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                        }}
                    >
                        <Button
                            onClick={handleOnClick}
                        >
                            {hoverText}
                        </Button>
                    </Space>
                )
            }
        </div>
    )
}

export default HoverActions