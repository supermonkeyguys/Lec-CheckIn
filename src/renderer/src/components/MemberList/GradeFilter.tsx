// components/GradeFilter.tsx
import { Grade } from '@renderer/hooks/User/useTeamMembers';
import { getGrade } from '@renderer/utils/getGrade';
import { Button, Row } from 'antd';

interface GradeFilterProps {
    activeIndex: number;
    onGradeChange: (index: number) => void;
    gradeList: readonly Grade[];
}

const GradeFilter: React.FC<GradeFilterProps> = ({ activeIndex, onGradeChange, gradeList }) => {
    return (
        <Row align="middle" justify="start" style={{ gap: 15, marginBottom: 16 }}>
            {gradeList.map((g, i) => (
                <Button
                    key={g + i}
                    type={activeIndex === i ? "primary" : "default"}
                    onClick={() => onGradeChange(i)}
                >
                    {getGrade(g)}
                </Button>
            ))}
        </Row>
    )
}

export default GradeFilter