import { FC } from "react";
import ContentComponent from "@renderer/components/ContentComponent/Component";
import PageInfo from "@renderer/components/PageInfo";
import RemindSetting from "./components/ReminderSetting";
import BackgroundSetting from "./components/BackgroundSetting";

const Setting: FC = () => {

    return (
        <ContentComponent
            componentList={[
                () => <PageInfo title='设置' desc="调整你的App" />,
                () => <RemindSetting />,
                () => <BackgroundSetting />,
            ]}
        />
    )
}

export default Setting