import MemberCard from "@renderer/components/MemberList/MemberCard"
import { useTeamMembers } from "@renderer/hooks/User/useTeamMembers"
import { Col, Input, Modal, Row, Spin } from "antd"
import { useEffect, useState } from "react";
import styles from './UserSelectorModal.module.scss'

interface UserSelectorModalProps {
    open: boolean;
    onClose: () => void;
    onSelect: (username: string) => void;
    excludeSelf?: boolean;
}

export const UserSelectorModal = ({
    open,
    onClose,
    onSelect,
}: UserSelectorModalProps) => {
    const { allMembers, loading, run } = useTeamMembers('all')
    const [search, setSearch] = useState('');

    const filtered = allMembers.filter(user => {
        if (!search) return true;
        return user.nickname.toLowerCase().includes(search.toLowerCase());
    });

    useEffect(() => {
        run('all')
    }, [])

    if (loading) {
        return (
            <Spin />
        )
    }

    return (
        <Modal
            title='选择目标用户'
            open={open}
            onCancel={onClose}
            footer={null}
            width={700}
            className={styles.transparentModal}
        >
            <Input
                placeholder="搜索用户名..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ marginBottom: 16 }}
            />
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                <Row gutter={[16, 16]}>
                    {filtered.map(user => (
                        <Col key={user.username} span={24}>
                            <div
                                onClick={() => onSelect(user.username)}
                                style={{ cursor: 'pointer', padding: '8px 0' }}
                            >
                                <MemberCard
                                    {...user}
                                />
                            </div>
                        </Col>
                    ))}
                </Row>
            </div>
        </Modal>
    )
}

export default UserSelectorModal