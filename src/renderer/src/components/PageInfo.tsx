import { Col, Typography } from "antd"
import { FC } from "react"

const { Title, Text } = Typography

type PropsType = {
    title: string
    desc: string
}

const PageInfo: FC<PropsType> = ({ title, desc }) => {
    return (
        <div>
            <Col>
                <Title level={3} style={{ margin: 0 }} >{title}</Title>
                <Text type='secondary'>{desc}</Text>
            </Col>
        </div>
    )
}

export default PageInfo 