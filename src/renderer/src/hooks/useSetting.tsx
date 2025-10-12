import { StateType } from "@renderer/store";
import { useDispatch, useSelector } from "react-redux";

export function useSetting() {
    const settings = useSelector((state:StateType) => state.setting)
    
    return {
        ...settings
    }
} 