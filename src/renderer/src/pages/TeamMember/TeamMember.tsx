import ContentComponent from '@renderer/components/ContentComponent/Component';
import GradeFilter from '@renderer/components/MemberList/GradeFilter';
import GradeGroup from '@renderer/components/MemberList/GradeGroup';
import PageInfo from '@renderer/components/PageInfo';
import { useTeamMembers } from '@renderer/hooks/User/useTeamMembers';
import { Spin } from 'antd';
import { FC } from 'react';


const TeamMember: FC = () => {
  const { 
    currentGrade, 
    setGrade, 
    allMembers, 
    filteredMembers, 
    loading,
    gradeList 
  } = useTeamMembers();

  const handleGradeChange = (index: number) => {
    setGrade(gradeList[index]);
  };

  return (
    <ContentComponent>
      <PageInfo title="团队成员" desc="查看当前团队成员信息" />
      <GradeFilter
        activeIndex={gradeList.indexOf(currentGrade)}
        onGradeChange={handleGradeChange}
        gradeList={gradeList}
      />
      <Spin spinning={loading}>
        <div style={{ marginTop: 16 }}>
          {currentGrade === 'all' ? (
            gradeList.slice(1).map(grade => (
              <GradeGroup
                key={grade}
                grade={grade}
                members={allMembers.filter(m => m.grade === grade)}
              />
            ))
          ) : (
            <GradeGroup grade={currentGrade} members={filteredMembers} />
          )}
        </div>
      </Spin>
    </ContentComponent>
  )
}

export default TeamMember